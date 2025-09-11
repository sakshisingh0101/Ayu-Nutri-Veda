import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, FileText, Clock, Calendar, Pill, Heart, Activity } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface TreatmentPlansModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patientId?: string
  patientName?: string
}

export const TreatmentPlansModal = ({ open, onOpenChange, patientId, patientName }: TreatmentPlansModalProps) => {
  const [planDetails, setPlanDetails] = useState({
    patientName: patientName || '',
    condition: '',
    duration: '',
    priority: 'medium'
  })
  const [medications, setMedications] = useState([
    { name: '', dosage: '', frequency: '', duration: '', instructions: '' }
  ])
  const [therapies, setTherapies] = useState<string[]>([])
  const [lifestyle, setLifestyle] = useState({
    exercise: '',
    diet: '',
    sleep: '',
    stress: ''
  })
  const [followUp, setFollowUp] = useState({
    frequency: '',
    duration: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const availableTherapies = [
    'Panchakarma',
    'Abhyanga (Oil Massage)',
    'Shirodhara',
    'Swedana (Steam Therapy)',
    'Nasya',
    'Basti',
    'Raktamokshana',
    'Yoga Therapy',
    'Meditation',
    'Pranayama'
  ]

  const priorities = [
    { value: 'low', label: 'Low Priority', color: 'bg-blue-100 text-blue-800' },
    { value: 'medium', label: 'Medium Priority', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High Priority', color: 'bg-red-100 text-red-800' }
  ]

  const addMedication = () => {
    setMedications([...medications, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }])
  }

  const updateMedication = (index: number, field: string, value: string) => {
    const updated = medications.map((med, i) => 
      i === index ? { ...med, [field]: value } : med
    )
    setMedications(updated)
  }

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index))
  }

  const handleTherapyChange = (therapy: string, checked: boolean) => {
    if (checked) {
      setTherapies([...therapies, therapy])
    } else {
      setTherapies(therapies.filter(t => t !== therapy))
    }
  }

  const saveTreatmentPlan = () => {
    setLoading(true)
    // Simulate saving treatment plan
    setTimeout(() => {
      toast({
        title: "Treatment Plan Saved",
        description: `Comprehensive treatment plan created for ${planDetails.patientName}`,
      })
      setLoading(false)
      onOpenChange(false)
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl h-[700px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Create Treatment Plan
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic-info" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="therapies">Therapies</TabsTrigger>
            <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
            <TabsTrigger value="follow-up">Follow-up</TabsTrigger>
          </TabsList>

          <TabsContent value="basic-info" className="flex-1 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patient">Patient Name</Label>
                <Input
                  id="patient"
                  value={planDetails.patientName}
                  onChange={(e) => setPlanDetails(prev => ({ ...prev, patientName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Priority Level</Label>
                <Select 
                  value={planDetails.priority} 
                  onValueChange={(value) => setPlanDetails(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${priority.color}`} />
                          {priority.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="condition">Primary Condition</Label>
                <Input
                  id="condition"
                  placeholder="e.g., Digestive disorders, Stress, Arthritis"
                  value={planDetails.condition}
                  onChange={(e) => setPlanDetails(prev => ({ ...prev, condition: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Treatment Duration</Label>
                <Select 
                  value={planDetails.duration} 
                  onValueChange={(value) => setPlanDetails(prev => ({ ...prev, duration: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2-weeks">2 Weeks</SelectItem>
                    <SelectItem value="1-month">1 Month</SelectItem>
                    <SelectItem value="3-months">3 Months</SelectItem>
                    <SelectItem value="6-months">6 Months</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="medications" className="flex-1 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Ayurvedic Medications</h3>
              <Button onClick={addMedication} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Medication
              </Button>
            </div>

            <div className="max-h-[400px] overflow-y-auto space-y-4">
              {medications.map((medication, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Pill className="h-4 w-4" />
                        Medication {index + 1}
                      </div>
                      {medications.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMedication(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Medicine Name</Label>
                        <Input
                          placeholder="e.g., Triphala Churna"
                          value={medication.name}
                          onChange={(e) => updateMedication(index, 'name', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Dosage</Label>
                        <Input
                          placeholder="e.g., 1 teaspoon"
                          value={medication.dosage}
                          onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Frequency</Label>
                        <Select 
                          value={medication.frequency}
                          onValueChange={(value) => updateMedication(index, 'frequency', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="once-daily">Once Daily</SelectItem>
                            <SelectItem value="twice-daily">Twice Daily</SelectItem>
                            <SelectItem value="thrice-daily">Thrice Daily</SelectItem>
                            <SelectItem value="as-needed">As Needed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Duration</Label>
                        <Input
                          placeholder="e.g., 30 days"
                          value={medication.duration}
                          onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Instructions</Label>
                      <Textarea
                        placeholder="Special instructions for taking this medicine..."
                        value={medication.instructions}
                        onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="therapies" className="flex-1 space-y-4">
            <h3 className="text-lg font-medium">Recommended Therapies</h3>
            <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
              {availableTherapies.map((therapy) => (
                <div key={therapy} className="flex items-center space-x-2">
                  <Checkbox
                    id={therapy}
                    checked={therapies.includes(therapy)}
                    onCheckedChange={(checked) => handleTherapyChange(therapy, checked as boolean)}
                  />
                  <Label htmlFor={therapy} className="text-sm cursor-pointer">
                    {therapy}
                  </Label>
                </div>
              ))}
            </div>
            
            {therapies.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Selected Therapies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {therapies.map((therapy) => (
                      <Badge key={therapy} variant="secondary">
                        {therapy}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="lifestyle" className="flex-1 space-y-4">
            <h3 className="text-lg font-medium">Lifestyle Recommendations</h3>
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Exercise & Movement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Recommended exercises, yoga poses, physical activities..."
                    value={lifestyle.exercise}
                    onChange={(e) => setLifestyle(prev => ({ ...prev, exercise: e.target.value }))}
                    rows={3}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Diet & Nutrition
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Dietary guidelines, foods to include/avoid..."
                    value={lifestyle.diet}
                    onChange={(e) => setLifestyle(prev => ({ ...prev, diet: e.target.value }))}
                    rows={3}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Sleep & Rest
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Sleep schedule, rest recommendations..."
                    value={lifestyle.sleep}
                    onChange={(e) => setLifestyle(prev => ({ ...prev, sleep: e.target.value }))}
                    rows={3}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Stress Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Stress reduction techniques, meditation practices..."
                    value={lifestyle.stress}
                    onChange={(e) => setLifestyle(prev => ({ ...prev, stress: e.target.value }))}
                    rows={3}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="follow-up" className="flex-1 space-y-4">
            <h3 className="text-lg font-medium">Follow-up Schedule</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Follow-up Frequency</Label>
                <Select 
                  value={followUp.frequency}
                  onValueChange={(value) => setFollowUp(prev => ({ ...prev, frequency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Monitoring Duration</Label>
                <Select 
                  value={followUp.duration}
                  onValueChange={(value) => setFollowUp(prev => ({ ...prev, duration: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-month">1 Month</SelectItem>
                    <SelectItem value="3-months">3 Months</SelectItem>
                    <SelectItem value="6-months">6 Months</SelectItem>
                    <SelectItem value="1-year">1 Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Follow-up Notes</Label>
              <Textarea
                placeholder="What to monitor, specific checkpoints, progress indicators..."
                value={followUp.notes}
                onChange={(e) => setFollowUp(prev => ({ ...prev, notes: e.target.value }))}
                rows={4}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Next Appointment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Based on the selected frequency, the next follow-up appointment should be scheduled for{' '}
                  {followUp.frequency === 'weekly' && 'next week'}
                  {followUp.frequency === 'bi-weekly' && 'in 2 weeks'}
                  {followUp.frequency === 'monthly' && 'next month'}
                  {followUp.frequency === 'quarterly' && 'in 3 months'}
                  {!followUp.frequency && 'TBD (select frequency above)'}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button variant="outline">
              Save as Template
            </Button>
            <Button onClick={saveTreatmentPlan} disabled={loading}>
              {loading ? "Saving..." : "Save Treatment Plan"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}