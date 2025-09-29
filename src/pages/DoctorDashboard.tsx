import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/layout/Header"
import { MessagingModal } from "@/components/messaging/MessagingModal"
import { FullCalendarModal } from "@/components/doctor/FullCalendarModal"
import { DietChartModal } from "@/components/doctor/DietChartModal"
import { TreatmentPlansModal } from "@/components/doctor/TreatmentPlansModal"
import { PatientMessagesModal } from "@/components/doctor/PatientMessagesModal"
import { useNavigate } from "react-router-dom"
import { AuthModal } from "@/components/auth/AuthModal"
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'




import {
  Users,
  Calendar,
  MessageCircle,
  FileText,
  Search,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Stethoscope,
  UserPlus,
  BookOpen,
  Activity,
  LogOut
} from "lucide-react"
import { useUsers, useConsultations } from "@/hooks/useSupabaseData"
import { useToast } from "@/hooks/use-toast"

export const DoctorDashboard = () => {
  const [userRole] = useState<'doctor'>('doctor')
  const [searchQuery, setSearchQuery] = useState('')
  const [messagingOpen, setMessagingOpen] = useState(false)
  const [selectedPatientId, setSelectedPatientId] = useState<string>('')
  const [selectedPatientName, setSelectedPatientName] = useState<string>('')
  const [currentDoctor, setCurrentDoctor] = useState<any>(null)
  const [fullCalendarOpen, setFullCalendarOpen] = useState(false)
  const [dietChartOpen, setDietChartOpen] = useState(false)
  const [treatmentPlansOpen, setTreatmentPlansOpen] = useState(false)
  const [patientMessagesOpen, setPatientMessagesOpen] = useState(false)
  const navigate = useNavigate()
 const [authModalOpen, setAuthModalOpen] = useState(false)
const [authDefaultTab, setAuthDefaultTab] = useState<'login' | 'register'>('register')


  // Real data from Supabase
  const { users, loading: usersLoading } = useUsers()
  const { consultations, loading: consultationsLoading } = useConsultations()
  const { toast } = useToast()

  // Get current doctor data (for demo, use first doctor)


const { user } = useAuth()

useEffect(() => {
  const fetchDoctor = async () => {
    if (!user) return
    try {
      const { data: doctorData, error } = await supabase
        .from('users')
        .select('*')
        .eq('Email', user.email)
        .single()
      if (error) throw error
      setCurrentDoctor(doctorData)
    } catch (err) {
      console.error('Error fetching doctor info:', err)
    }
  }

  fetchDoctor()
}, [user])


  // Get patients
  const patients = users.filter(u => u.User_type === 'patient')

  // Active patients = those who have any consultation (requested or completed)
const activePatientEmails = consultations
  .filter(c => c.status === 'requested' || c.status === 'completed')
  .map(c => c.patient_id);

const activePatients = patients.filter(p => activePatientEmails.includes(p.Email));

  
  // Get today's consultations (mock schedule based on real data)
  const todaysSchedule = consultations.slice(0, 4).map((consultation, index) => {
    const times = ["09:00 AM", "10:30 AM", "02:00 PM", "03:30 PM"]
    const types = ["Follow-up", "Initial Consultation", "Diet Review", "Progress Check"]
    const patientData = users.find(u => u.Email === consultation.patient_id)
    
    return {
      time: times[index] || "TBD",
      patient: patientData?.FullName || "Unknown Patient",
      type: types[index % types.length],
      status: consultation.status === 'requested' ? 'upcoming' : 'completed'
    }
  })

  // Recent patients (last 4 patients)
  const recentPatients = patients.slice(0, 4).map((patient, index) => ({
    name: patient.FullName,
    age: Math.floor(Math.random() * 40) + 20, // Mock age
    prakriti: ["Vata", "Pitta", "Kapha", "Vata-Pitta"][index % 4],
    lastVisit: ["2 days ago", "1 week ago", "3 days ago", "5 days ago"][index],
    status: ["improving", "stable", "needs_attention", "improving"][index % 4]
  }))

  // Mock pending actions based on real patients
  const pendingActions = patients.slice(0, 3).map((patient, index) => ({
    type: ["diet_plan", "consultation", "approval"][index],
    patient: patient.FullName,
    description: [
      "Update diet plan based on progress",
      "Review recent symptoms", 
      "Approve new recipe additions"
    ][index],
    action: [
      () => {
        setSelectedPatientName(patient.FullName)
        setDietChartOpen(true)
      },
      () => {
        setSelectedPatientId(patient.Email)
        setSelectedPatientName(patient.FullName)
        setMessagingOpen(true)
      },
      () => {
        setSelectedPatientName(patient.FullName)
        setTreatmentPlansOpen(true)
      }
    ][index]
  }))

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'improving': return 'text-success'
      case 'stable': return 'text-primary'
      case 'needs_attention': return 'text-warning'
      default: return 'text-muted-foreground'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'improving': return <TrendingUp className="h-4 w-4" />
      case 'stable': return <CheckCircle className="h-4 w-4" />
      case 'needs_attention': return <AlertCircle className="h-4 w-4" />
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
                Good morning, {currentDoctor?.FullName || 'Doctor'}
              </h1>
              <p className="text-muted-foreground">
                Ayurvedic Medicine Specialist
              </p>
            </div>
            <div className="flex gap-2">
              {/* <Button variant="outline" onClick={() => alert('Add Patient feature coming soon!')}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add New Patient
              </Button> */}
              <Button
  variant="outline"
  onClick={() => {
    setAuthDefaultTab('register')
    setAuthModalOpen(true)
  }}
>
  <UserPlus className="h-4 w-4 mr-2" />
  Add New Patient
</Button>

              <Button variant="hero" onClick={() => setDietChartOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Diet Plan
              </Button>
              <Button variant="ghost" onClick={() => {
                toast({
                  title: "Logged Out",
                  description: "You have been logged out successfully"
                });
                window.location.href = '/';
              }}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patients.length}</div>
              <p className="text-xs text-muted-foreground">
                {patients.length} total patients
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todaysSchedule.length}</div>
              <p className="text-xs text-success">
                2 completed, 2 upcoming
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Patients</CardTitle>
              <UserPlus className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.min(patients.length, 12)}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingActions.length}</div>
              <p className="text-xs text-warning">Require attention</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Today's Schedule
                </CardTitle>
                <CardDescription>
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todaysSchedule.map((appointment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          appointment.status === 'completed' ? 'bg-success' : 'bg-primary'
                        }`} />
                        <div>
                          <p className="font-medium">{appointment.time}</p>
                          <p className="text-sm text-muted-foreground">
                            {appointment.patient} • {appointment.type}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={appointment.status === 'completed' ? 'default' : 'secondary'}>
                          {appointment.status === 'completed' ? 'Completed' : 'Upcoming'}
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => {
                            setSelectedPatientId('patient-default-id')
                            setSelectedPatientName(appointment.patient)
                            setMessagingOpen(true)
                          }}
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline" onClick={() => setFullCalendarOpen(true)}>
                  <Calendar className="h-4 w-4 mr-2" />
                  View Full Calendar
                </Button>
              </CardContent>
            </Card>

            {/* Patient Management */}
            <Card>
              <CardHeader>
                <CardTitle>Patient Management</CardTitle>
                <CardDescription>Search and manage your patients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search patients..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>

                <Tabs defaultValue="recent" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="recent">Recent</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="all">All Patients</TabsTrigger>
                  </TabsList>
                  <TabsContent value="recent" className="space-y-4">
                    {recentPatients.map((patient, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Stethoscope className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{patient.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Age {patient.age} • {patient.prakriti} • Last visit: {patient.lastVisit}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`flex items-center gap-1 text-sm ${getStatusColor(patient.status)}`}>
                            {getStatusIcon(patient.status)}
                            {patient.status.replace('_', ' ')}
                          </span>
                          <Button size="sm" variant="ghost">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button className="w-full" variant="outline" onClick={() => alert('All patients view coming soon!')}>
                      View All Patients
                    </Button>
                  </TabsContent>
                  {/* <TabsContent value="active">
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Active patients view</p>
                    </div>
                  </TabsContent> */}
                  <TabsContent value="active" className="space-y-4">
  {activePatients.length === 0 ? (
    <p className="text-center text-muted-foreground">No active patients found</p>
  ) : (
    activePatients.map((patient, index) => (
      <div
        key={index}
        className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Stethoscope className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-medium">{patient.FullName}</p>
            <p className="text-sm text-muted-foreground">
              Age: {Math.floor(Math.random() * 40) + 20} • {patient.Email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => {
            setSelectedPatientName(patient.FullName)
            setMessagingOpen(true)
          }}>
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>
    ))
  )}
</TabsContent>

                  {/* <TabsContent value="all">
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>All patients view</p>
                    </div>
                  </TabsContent> */}
                  <TabsContent value="all" className="space-y-4">
  {patients.length === 0 ? (
    <p className="text-center text-muted-foreground">No patients found</p>
  ) : (
    patients.map((patient, index) => (
      <div
        key={index}
        className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Stethoscope className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-medium">{patient.FullName}</p>
            <p className="text-sm text-muted-foreground">
              Age: {Math.floor(Math.random() * 40) + 20} • {patient.Email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => {
            setSelectedPatientName(patient.FullName)
            setMessagingOpen(true)
          }}>
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>
    ))
  )}
</TabsContent>


                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pending Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Pending Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingActions.map((action, index) => (
                    <div key={index} className="p-3 rounded-lg border">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium text-sm">{action.patient}</p>
                        <Badge variant="outline" className="text-xs">
                          {action.type.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {action.description}
                      </p>
                      <Button size="sm" className="w-full" onClick={action.action}>
                        Take Action
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Tools */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => setDietChartOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Diet Chart
                </Button>
                {/* <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/recipes'}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Recipe Builder
                </Button> */}
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/recipes')}>
  <BookOpen className="h-4 w-4 mr-2" />
  Recipe Builder
</Button>

                <Button variant="outline" className="w-full justify-start" onClick={() => setTreatmentPlansOpen(true)}>
                  <FileText className="h-4 w-4 mr-2" />
                  Treatment Plans
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => setPatientMessagesOpen(true)}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Patient Messages
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-success mt-2" />
                    <div className="flex-1">
                      <p className="text-sm">
                        Diet plan approved for {patients[0]?.FullName || 'Patient'}
                      </p>
                      <p className="text-xs text-muted-foreground">30 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1">
                      <p className="text-sm">
                        Consultation completed with {patients[1]?.FullName || 'Patient'}
                      </p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent mt-2" />
                    <div className="flex-1">
                      <p className="text-sm">
                        New patient {patients[2]?.FullName || 'Patient'} registered
                      </p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <MessagingModal 
        open={messagingOpen} 
        onOpenChange={setMessagingOpen}
        recipientId={selectedPatientId}
        recipientName={selectedPatientName}
        userRole={userRole}
      />
      
      <FullCalendarModal 
        open={fullCalendarOpen}
        onOpenChange={setFullCalendarOpen}
      />
      
      <DietChartModal 
        open={dietChartOpen}
        onOpenChange={setDietChartOpen}
        patientName={selectedPatientName}
      />
      
      <TreatmentPlansModal 
        open={treatmentPlansOpen}
        onOpenChange={setTreatmentPlansOpen}
        patientName={selectedPatientName}
      />
      
      <PatientMessagesModal 
        open={patientMessagesOpen}
        onOpenChange={setPatientMessagesOpen}
        currentDoctorId={currentDoctor?.Email}
      />
      <AuthModal
  open={authModalOpen}
  onOpenChange={setAuthModalOpen}
  defaultTab={authDefaultTab}
/>
    </div>
  )
}

export default DoctorDashboard