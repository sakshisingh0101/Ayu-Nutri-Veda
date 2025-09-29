import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/layout/Header"
import { MessagingModal } from "@/components/messaging/MessagingModal"
import { SchedulingModal } from "@/components/scheduling/SchedulingModal"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/integrations/supabase/client"
import { ScrollArea } from "@/components/ui/scroll-area"


import {
  Calendar,
  User,
  Heart,
  Apple,
  Activity,
  Clock,
  TrendingUp,
  MessageCircle,
  FileText,
  Utensils,
  Droplets,
  Wind,
  Flame,
  Bell
} from "lucide-react"
import dashboardImage from "@/assets/dashboard-medical.jpg"
import { useUsers, useConsultations } from "@/hooks/useSupabaseData"

export const PatientDashboard = () => {
  const [userRole] = useState<'patient'>('patient')
  const [messagingOpen, setMessagingOpen] = useState(false)
  const [schedulingOpen, setSchedulingOpen] = useState(false)
  const [currentPatient, setCurrentPatient] = useState<any>(null)

  // Real data from Supabase
  const { users, loading: usersLoading } = useUsers()
  const { consultations, loading: consultationsLoading } = useConsultations()

  // Get current patient data (for demo, use first patient)
  const { user } = useAuth()
useEffect(() => {
  const fetchPatient = async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('Email', user.email)
      .single()
    if (error) console.error(error)
    else setCurrentPatient(data)
  }
  fetchPatient()
}, [user])


  // Mock progress data (this would come from another table in real app)
  const progressData = {
    adherence: 85,
    weight: { current: 65, target: 62, change: -2 },
    energy: 8,
    sleep: 7,
    digestion: 9
  }

  const prakritiData = {
    dominant: "Vata",
    vata: 45,
    pitta: 30,
    kapha: 25
  }

  const todaysMeals = [
    { type: "Breakfast", meal: "Warm Oatmeal with Almonds", status: "completed" },
    { type: "Lunch", meal: "Quinoa Buddha Bowl", status: "upcoming" },
    { type: "Dinner", meal: "Lentil Soup with Rice", status: "upcoming" }
  ]

  // Get doctor info
  const doctors = users.filter(u => u.User_type === 'doctor')
  const currentDoctor = doctors.length > 0 ? doctors[0] : null

  // Get patient consultations
  const patientConsultations = consultations.filter(c => 
    currentPatient && c.patient_id === currentPatient.Email
  )

  if (usersLoading || consultationsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const getDoshaIcon = (dosha: string) => {
    switch (dosha.toLowerCase()) {
      case 'vata': return <Wind className="h-4 w-4 text-blue-600" />
      case 'pitta': return <Flame className="h-4 w-4 text-orange-600" />
      case 'kapha': return <Droplets className="h-4 w-4 text-green-600" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {currentPatient?.FullName || 'Patient'}!
              </h1>
              <p className="text-muted-foreground">
                Track your wellness journey and stay on top of your health goals.
              </p>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" className="w-full sm:w-auto justify-start" onClick={() => setSchedulingOpen(true)}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Consultation
                </Button>
                <Button variant="hero" onClick={() => setMessagingOpen(true)}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message Doctor
                </Button>
            </div></div>
        </div>

          <MessagingModal 
            open={messagingOpen} 
            onOpenChange={setMessagingOpen}
            recipientId={currentDoctor?.Email || "doctor-default-id"}
            recipientName={currentDoctor?.FullName || "Doctor"}
            userRole={userRole}
          />
          
          <SchedulingModal 
            open={schedulingOpen} 
            onOpenChange={setSchedulingOpen}
            doctorId={currentDoctor?.Email || "doctor-default-id"}
            doctorName={currentDoctor?.FullName || "Doctor"}
            currentUserEmail={currentPatient?.Email || "patient@example.com"} 
          />
          

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Plan Adherence</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{progressData.adherence}%</div>
              <p className="text-xs text-muted-foreground">+5% from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weight Progress</CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progressData.weight.current} kg</div>
              <p className="text-xs text-success">
                {progressData.weight.change} kg this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Energy Level</CardTitle>
              <Heart className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progressData.energy}/10</div>
              <p className="text-xs text-muted-foreground">Average this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Consultation</CardTitle>
              <Clock className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold">
                {patientConsultations.length > 0 ? 
                  new Date(patientConsultations[0].consultation_date).toLocaleDateString() : 
                  'No upcoming'
                }
              </div>
              <p className="text-xs text-muted-foreground">
                {patientConsultations.length > 0 ? 
                  `with ${currentDoctor?.FullName || 'Doctor'}` : 
                  'consultations'
                }
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Meals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="h-5 w-5" />
                  Today's Meal Plan
                </CardTitle>
                <CardDescription>
                  Follow your personalized Ayurvedic meal plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todaysMeals.map((meal, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          meal.status === 'completed' ? 'bg-success' : 'bg-muted'
                        }`} />
                        <div>
                          <p className="font-medium">{meal.type}</p>
                          <p className="text-sm text-muted-foreground">{meal.meal}</p>
                        </div>
                      </div>
                      <Badge variant={meal.status === 'completed' ? 'default' : 'secondary'}>
                        {meal.status === 'completed' ? 'Completed' : 'Upcoming'}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline" onClick={() => window.location.href = '/foods'}>
                  <Apple className="h-4 w-4 mr-2" />
                  View Full Meal Plan
                </Button>
              </CardContent>
            </Card>

            {/* Progress Tracking */}
            <Card>
              <CardHeader>
                <CardTitle>Health Metrics</CardTitle>
                <CardDescription>Your progress over the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="weight">Weight</TabsTrigger>
                    <TabsTrigger value="energy">Energy</TabsTrigger>
                    <TabsTrigger value="sleep">Sleep</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <div className="text-2xl font-bold text-success">85%</div>
                        <p className="text-sm text-muted-foreground">Diet Adherence</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <div className="text-2xl font-bold text-primary">8.2/10</div>
                        <p className="text-sm text-muted-foreground">Avg Energy</p>
                      </div>
                    </div>
                    <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
                      <p className="text-muted-foreground">Progress Chart Placeholder</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="weight">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Current Weight</span>
                        <span className="font-bold">{progressData.weight.current} kg</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Target Weight</span>
                        <span className="font-bold">{progressData.weight.target} kg</span>
                      </div>
                      <Progress value={75} className="h-2" />
                      <p className="text-sm text-muted-foreground">
                        75% progress towards your goal
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="energy">
                    <div className="text-center space-y-4">
                      <div className="text-4xl font-bold text-primary">{progressData.energy}/10</div>
                      <p className="text-muted-foreground">Average Energy Level</p>
                      <div className="h-32 bg-muted/30 rounded-lg flex items-center justify-center">
                        <p className="text-muted-foreground">Energy Trend Chart</p>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="sleep">
                    <div className="text-center space-y-4">
                      <div className="text-4xl font-bold text-primary">{progressData.sleep}h</div>
                      <p className="text-muted-foreground">Average Sleep Duration</p>
                      <div className="h-32 bg-muted/30 rounded-lg flex items-center justify-center">
                        <p className="text-muted-foreground">Sleep Pattern Chart</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Prakriti Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Your Prakriti Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <Badge variant="secondary" className="text-lg px-3 py-1 mb-2">
                    {getDoshaIcon(prakritiData.dominant)}
                    <span className="ml-2">{prakritiData.dominant} Dominant</span>
                  </Badge>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Wind className="h-4 w-4 text-blue-600" />
                      Vata
                    </span>
                    <span className="font-medium">{prakritiData.vata}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Flame className="h-4 w-4 text-orange-600" />
                      Pitta
                    </span>
                    <span className="font-medium">{prakritiData.pitta}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-green-600" />
                      Kapha
                    </span>
                    <span className="font-medium">{prakritiData.kapha}%</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4" onClick={() => window.location.href = '/quiz'}>
                  Retake Assessment
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-success mt-2" />
                    <div className="flex-1">
                      <p className="text-sm">Completed morning meal</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1">
                      <p className="text-sm">Updated energy level</p>
                      <p className="text-xs text-muted-foreground">4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent mt-2" />
                    <div className="flex-1">
                      <p className="text-sm">New message from doctor</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/foods'}>
                  <FileText className="h-4 w-4 mr-2" />
                  View Diet Plan
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => setMessagingOpen(true)}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Doctor
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => alert('Symptom logging feature coming soon!')}>
                  <Activity className="h-4 w-4 mr-2" />
                  Log Symptoms
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/recipes'}>
                  <Apple className="h-4 w-4 mr-2" />
                  Browse Recipes
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientDashboard