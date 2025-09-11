import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar as CalendarIcon, Clock } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface SchedulingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  doctorId?: string
  doctorName?: string
  currentUserEmail?: string
}

export const SchedulingModal = ({ 
  open, 
  onOpenChange, 
  doctorId, 
  doctorName,
  currentUserEmail 
}: SchedulingModalProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState('')
  const [consultationType, setConsultationType] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
  ]

  const consultationTypes = [
    { value: "initial", label: "Initial Consultation" },
    { value: "followup", label: "Follow-up" },
    { value: "diet_review", label: "Diet Plan Review" },
    { value: "general", label: "General Consultation" }
  ]

  const requestConsultation = async () => {
    if (!selectedDate || !selectedTime || !consultationType) {
      toast({
        title: "Missing Information",
        description: "Please select date, time, and consultation type",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    
    try {
      if (!currentUserEmail) {
        toast({
          title: "Authentication Error",
          description: "Please login to request a consultation",
          variant: "destructive",
        })
        return
      }

      // Parse the selected time and create datetime
      const [time, period] = selectedTime.split(' ')
      const [hours, minutes] = time.split(':')
      let hour24 = parseInt(hours)
      if (period === 'PM' && hour24 !== 12) hour24 += 12
      if (period === 'AM' && hour24 === 12) hour24 = 0

      const consultationDateTime = new Date(selectedDate)
      consultationDateTime.setHours(hour24, parseInt(minutes), 0, 0)

      const { error } = await supabase
        .from('consultations')
        .insert({
          patient_id: currentUserEmail, // Using email as patient identifier
          doctor_id: doctorId || 'default-doctor-id', // You might want to implement doctor selection
          consultation_date: consultationDateTime.toISOString(),
          consultation_type: consultationType,
          notes: notes.trim() || null,
          status: 'requested'
        })

      if (error) {
        toast({
          title: "Request Failed",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Request Sent",
          description: "Your consultation request has been sent to the doctor for approval",
        })
        // Reset form
        setSelectedDate(undefined)
        setSelectedTime('')
        setConsultationType('')
        setNotes('')
        onOpenChange(false)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Schedule Consultation
            {doctorName && <span className="text-muted-foreground">with {doctorName}</span>}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Calendar */}
          <div className="space-y-2">
            <Label>Select Date</Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date() || date.getDay() === 0} // Disable past dates and Sundays
              className={cn("rounded-md border pointer-events-auto")}
            />
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label>Select Time</Label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger>
                <SelectValue placeholder="Choose available time slot">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {selectedTime || "Select time"}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Consultation Type */}
          <div className="space-y-2">
            <Label>Consultation Type</Label>
            <Select value={consultationType} onValueChange={setConsultationType}>
              <SelectTrigger>
                <SelectValue placeholder="Select consultation type" />
              </SelectTrigger>
              <SelectContent>
                {consultationTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Additional Notes (Optional)</Label>
            <Textarea
              placeholder="Any specific concerns or requests..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={requestConsultation} disabled={loading} className="flex-1">
              {loading ? "Requesting..." : "Request Consultation"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}