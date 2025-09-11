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
import { Plus, Utensils, Clock, User, Heart } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface DietChartModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patientId?: string
  patientName?: string
}

export const DietChartModal = ({ open, onOpenChange, patientId, patientName }: DietChartModalProps) => {
  const [selectedPatient, setSelectedPatient] = useState(patientName || '')
  const [patientPrakriti, setPatientPrakriti] = useState('')
  const [dietGoal, setDietGoal] = useState('')
  const [mealPlan, setMealPlan] = useState({
    breakfast: '',
    midMorning: '',
    lunch: '',
    afternoon: '',
    dinner: '',
    beforeBed: ''
  })
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const prakritis = ['Vata', 'Pitta', 'Kapha', 'Vata-Pitta', 'Pitta-Kapha', 'Vata-Kapha']
  const dietGoals = ['Weight Loss', 'Weight Gain', 'Digestion Improvement', 'Energy Enhancement', 'Detoxification', 'General Wellness']

  const mealTimes = [
    { key: 'breakfast', label: 'Breakfast', time: '7:00 - 8:00 AM', icon: <Utensils className="h-4 w-4" /> },
    { key: 'midMorning', label: 'Mid-Morning', time: '10:00 - 11:00 AM', icon: <Heart className="h-4 w-4" /> },
    { key: 'lunch', label: 'Lunch', time: '12:00 - 1:00 PM', icon: <Utensils className="h-4 w-4" /> },
    { key: 'afternoon', label: 'Afternoon Snack', time: '4:00 - 5:00 PM', icon: <Heart className="h-4 w-4" /> },
    { key: 'dinner', label: 'Dinner', time: '7:00 - 8:00 PM', icon: <Utensils className="h-4 w-4" /> },
    { key: 'beforeBed', label: 'Before Bed', time: '9:00 - 10:00 PM', icon: <Heart className="h-4 w-4" /> }
  ]

  const handleMealChange = (mealKey: string, value: string) => {
    setMealPlan(prev => ({ ...prev, [mealKey]: value }))
  }

  const generateDietChart = () => {
    // AI-powered diet chart generation based on Prakriti
    const suggestions = {
      Vata: {
        breakfast: 'Warm oatmeal with ghee, nuts, and fruits',
        midMorning: 'Herbal tea with dates',
        lunch: 'Rice, dal, cooked vegetables with ghee',
        afternoon: 'Warm milk with almonds',
        dinner: 'Light soup with bread, steamed vegetables',
        beforeBed: 'Golden milk with turmeric'
      },
      Pitta: {
        breakfast: 'Cool smoothie with coconut, sweet fruits',
        midMorning: 'Cucumber water',
        lunch: 'Basmati rice, mung dal, cooling vegetables',
        afternoon: 'Coconut water with mint',
        dinner: 'Light salad with cooling herbs',
        beforeBed: 'Rose milk (cool)'
      },
      Kapha: {
        breakfast: 'Light fruits, herbal tea',
        midMorning: 'Ginger tea',
        lunch: 'Quinoa, legumes, spiced vegetables',
        afternoon: 'Green tea with honey',
        dinner: 'Light soup with spices',
        beforeBed: 'Warm water with lemon'
      }
    }

    const selectedSuggestions = suggestions[patientPrakriti as keyof typeof suggestions] || suggestions.Vata
    setMealPlan(selectedSuggestions)
    
    toast({
      title: "Diet Chart Generated",
      description: `AI-generated diet plan for ${patientPrakriti} constitution`,
    })
  }

  const saveDietChart = () => {
    setLoading(true)
    // Simulate saving diet chart
    setTimeout(() => {
      toast({
        title: "Diet Chart Saved",
        description: `Diet chart created for ${selectedPatient}`,
      })
      setLoading(false)
      onOpenChange(false)
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl h-[700px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Utensils className="h-5 w-5" />
            Create Diet Chart
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="patient-info" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="patient-info">Patient Info</TabsTrigger>
            <TabsTrigger value="meal-plan">Meal Plan</TabsTrigger>
            <TabsTrigger value="review">Review & Save</TabsTrigger>
          </TabsList>

          <TabsContent value="patient-info" className="flex-1 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patient">Patient Name</Label>
                <Input
                  id="patient"
                  placeholder="Enter patient name"
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Patient Prakriti</Label>
                <Select value={patientPrakriti} onValueChange={setPatientPrakriti}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Prakriti type" />
                  </SelectTrigger>
                  <SelectContent>
                    {prakritis.map((prakriti) => (
                      <SelectItem key={prakriti} value={prakriti}>
                        {prakriti}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Diet Goal</Label>
              <Select value={dietGoal} onValueChange={setDietGoal}>
                <SelectTrigger>
                  <SelectValue placeholder="Select primary diet goal" />
                </SelectTrigger>
                <SelectContent>
                  {dietGoals.map((goal) => (
                    <SelectItem key={goal} value={goal}>
                      {goal}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={generateDietChart}
                disabled={!patientPrakriti}
                className="flex-1"
              >
                <Plus className="h-4 w-4 mr-2" />
                Generate AI Diet Plan
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="meal-plan" className="flex-1 space-y-4">
            <div className="grid grid-cols-1 gap-4 max-h-[500px] overflow-y-auto">
              {mealTimes.map((meal) => (
                <Card key={meal.key}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      {meal.icon}
                      {meal.label}
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {meal.time}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder={`Enter ${meal.label.toLowerCase()} recommendations...`}
                      value={mealPlan[meal.key as keyof typeof mealPlan]}
                      onChange={(e) => handleMealChange(meal.key, e.target.value)}
                      rows={2}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-2">
              <Label>Special Instructions</Label>
              <Textarea
                placeholder="Any special dietary restrictions, allergies, or additional notes..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                rows={3}
              />
            </div>
          </TabsContent>

          <TabsContent value="review" className="flex-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Diet Chart Summary
                </CardTitle>
                <CardDescription>
                  Review the diet chart before saving
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Patient</Label>
                    <p>{selectedPatient || 'Not specified'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Prakriti</Label>
                    <p>{patientPrakriti || 'Not specified'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Diet Goal</Label>
                    <p>{dietGoal || 'Not specified'}</p>
                  </div>
                </div>

                {specialInstructions && (
                  <div>
                    <Label className="text-sm font-medium">Special Instructions</Label>
                    <p className="text-sm text-muted-foreground">{specialInstructions}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Meal Plan Overview</Label>
                  <div className="text-sm space-y-1">
                    {mealTimes.map((meal) => {
                      const mealContent = mealPlan[meal.key as keyof typeof mealPlan]
                      return mealContent ? (
                        <div key={meal.key} className="flex gap-2">
                          <span className="font-medium min-w-[120px]">{meal.label}:</span>
                          <span className="text-muted-foreground">{mealContent.substring(0, 50)}...</span>
                        </div>
                      ) : null
                    })}
                  </div>
                </div>
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
            <Button onClick={saveDietChart} disabled={loading}>
              {loading ? "Saving..." : "Save Diet Chart"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}