import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CalendarIcon, Clock, User, MapPin, Plus } from "lucide-react"
import { useConsultations } from "@/hooks/useSupabaseData"
import { cn } from "@/lib/utils"

interface FullCalendarModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const FullCalendarModal = ({ open, onOpenChange }: FullCalendarModalProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const { consultations, loading } = useConsultations()

  // Mock appointments based on real consultations data
  const appointments = consultations.map((consultation, index) => {
    const date = new Date(consultation.consultation_date)
    const times = ["09:00", "10:30", "14:00", "15:30", "11:00", "16:00"]
    const patients = ["John Doe", "Sarah Wilson", "Mike Johnson", "Emma Davis", "Alex Brown"]
    
    return {
      id: consultation.id,
      date: date,
      time: times[index % times.length],
      patient: patients[index % patients.length],
      type: consultation.consultation_type,
      status: consultation.status,
      notes: consultation.notes
    }
  })

  // Get appointments for selected date
  const selectedDateAppointments = appointments.filter(apt => 
    apt.date.toDateString() === selectedDate.toDateString()
  )

  // Get dates that have appointments
  const appointmentDates = appointments.map(apt => apt.date)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success'
      case 'confirmed': return 'bg-primary'
      case 'requested': return 'bg-warning'
      case 'cancelled': return 'bg-destructive'
      default: return 'bg-muted'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed'
      case 'confirmed': return 'Confirmed'
      case 'requested': return 'Pending'
      case 'cancelled': return 'Cancelled'
      default: return 'Unknown'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl h-[700px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Full Calendar View
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 grid lg:grid-cols-2 gap-6">
          {/* Calendar Section */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Calendar</CardTitle>
                <CardDescription>
                  Select a date to view appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  modifiers={{
                    hasAppointment: appointmentDates
                  }}
                  modifiersStyles={{
                    hasAppointment: { 
                      backgroundColor: 'hsl(var(--primary))', 
                      color: 'hsl(var(--primary-foreground))',
                      fontWeight: 'bold'
                    }
                  }}
                  className={cn("pointer-events-auto")}
                />
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                Add Appointment
              </Button>
              <Button variant="outline">
                Export Calendar
              </Button>
            </div>
          </div>

          {/* Appointments Section */}
          <div className="space-y-4">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  Appointments for {selectedDate.toLocaleDateString()}
                  <Badge variant="secondary">
                    {selectedDateAppointments.length} appointments
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-2 text-muted-foreground">Loading appointments...</p>
                    </div>
                  ) : selectedDateAppointments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No appointments scheduled for this date</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedDateAppointments.map((appointment) => (
                        <Card key={appointment.id} className="border-l-4 border-l-primary">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium">{appointment.time}</span>
                                  <Badge variant="outline" className={cn("text-xs", getStatusColor(appointment.status))}>
                                    {getStatusText(appointment.status)}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <span>{appointment.patient}</span>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {appointment.type.replace('_', ' ')}
                                </div>
                                {appointment.notes && (
                                  <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                                    {appointment.notes}
                                  </div>
                                )}
                              </div>
                              <div className="flex gap-1">
                                <Button size="sm" variant="ghost">
                                  Edit
                                </Button>
                                <Button size="sm" variant="ghost">
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <div className="flex gap-2">
            <Button variant="outline">
              Print Schedule
            </Button>
            <Button>
              Sync with External Calendar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}