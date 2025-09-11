import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MessageCircle, Send, User, Clock, Mail } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { useUsers } from "@/hooks/useSupabaseData"

interface Message {
  id: string
  sender_id: string
  recipient_id: string
  message: string
  read: boolean
  created_at: string
}

interface PatientMessagesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentDoctorId?: string
}

export const PatientMessagesModal = ({ open, onOpenChange, currentDoctorId }: PatientMessagesModalProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { users } = useUsers()

  // Get patients who have sent messages
  const patients = users.filter(u => u.User_type === 'patient')
  
  // Mock messages data since we don't have real auth system
  const mockMessages: Message[] = [
    {
      id: '1',
      sender_id: 'patient1',
      recipient_id: 'doctor1',
      message: 'Hello Doctor, I have been feeling much better after following the diet plan you prescribed. My energy levels have improved significantly.',
      read: false,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
    },
    {
      id: '2',
      sender_id: 'patient2',
      recipient_id: 'doctor1',
      message: 'I wanted to ask about the Triphala dosage. Should I continue taking it twice daily or reduce it to once?',
      read: false,
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4 hours ago
    },
    {
      id: '3',
      sender_id: 'doctor1',
      recipient_id: 'patient1',
      message: 'That\'s wonderful to hear! Please continue with the current plan for another 2 weeks.',
      read: true,
      created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() // 6 hours ago
    },
    {
      id: '4',
      sender_id: 'patient3',
      recipient_id: 'doctor1',
      message: 'Doctor, I\'m experiencing some mild digestive issues. Could you please suggest some adjustments to my meal plan?',
      read: false,
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
    }
  ]

  useEffect(() => {
    if (open) {
      setMessages(mockMessages)
    }
  }, [open])

  // Get conversations grouped by patient
  const conversations = patients.map(patient => {
    const patientMessages = mockMessages.filter(msg => 
      msg.sender_id === `patient${patient.id}` || msg.recipient_id === `patient${patient.id}`
    )
    const lastMessage = patientMessages.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0]
    const unreadCount = patientMessages.filter(msg => 
      !msg.read && msg.sender_id === `patient${patient.id}`
    ).length

    return {
      patient,
      messages: patientMessages,
      lastMessage,
      unreadCount
    }
  }).filter(conv => conv.messages.length > 0)

  const selectedConversation = conversations.find(conv => 
    selectedPatient === `patient${conv.patient.id}`
  )

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedPatient) return

    setLoading(true)
    
    // Simulate sending message
    const newMsg: Message = {
      id: Date.now().toString(),
      sender_id: 'doctor1',
      recipient_id: selectedPatient,
      message: newMessage.trim(),
      read: false,
      created_at: new Date().toISOString()
    }

    setMessages(prev => [...prev, newMsg])
    setNewMessage('')
    
    toast({
      title: "Message Sent",
      description: "Your message has been sent to the patient",
    })
    
    setLoading(false)
  }

  const filteredConversations = conversations.filter(conv =>
    conv.patient.FullName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const markAsRead = (patientId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.sender_id === patientId ? { ...msg, read: true } : msg
    ))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl h-[700px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Patient Messages
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 grid lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <ScrollArea className="h-[500px]">
              <div className="space-y-2">
                {filteredConversations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No conversations found</p>
                  </div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <Card 
                      key={conversation.patient.id}
                      className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                        selectedPatient === `patient${conversation.patient.id}` ? 'bg-muted' : ''
                      }`}
                      onClick={() => {
                        setSelectedPatient(`patient${conversation.patient.id}`)
                        markAsRead(`patient${conversation.patient.id}`)
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{conversation.patient.FullName}</p>
                              {conversation.lastMessage && (
                                <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                                  {conversation.lastMessage.message}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            {conversation.unreadCount > 0 && (
                              <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                            {conversation.lastMessage && (
                              <span className="text-xs text-muted-foreground">
                                {new Date(conversation.lastMessage.created_at).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Message Thread */}
          <div className="lg:col-span-2 flex flex-col">
            {selectedConversation ? (
              <>
                <Card className="mb-4">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {selectedConversation.patient.FullName}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {selectedConversation.patient.Email}
                      </span>
                      <span>Patient ID: {selectedConversation.patient.id}</span>
                    </CardDescription>
                  </CardHeader>
                </Card>

                <ScrollArea className="flex-1 border rounded-lg p-4 mb-4">
                  <div className="space-y-4">
                    {selectedConversation.messages
                      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                      .map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender_id === 'doctor1' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-lg ${
                              message.sender_id === 'doctor1'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <p className="text-sm">{message.message}</p>
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-xs opacity-70">
                                {new Date(message.created_at).toLocaleTimeString()}
                              </p>
                              {message.sender_id === 'doctor1' && (
                                <span className="text-xs opacity-70">
                                  {message.read ? 'Read' : 'Sent'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </ScrollArea>

                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        sendMessage()
                      }
                    }}
                    disabled={loading}
                  />
                  <Button onClick={sendMessage} disabled={loading || !newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a patient to view messages</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <div className="flex gap-2">
            <Badge variant="secondary">
              {conversations.reduce((acc, conv) => acc + conv.unreadCount, 0)} unread messages
            </Badge>
            <Button variant="outline">
              Mark All as Read
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}