import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { UserRound, Stethoscope, Shield, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/AuthContext"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultTab?: 'login' | 'register'
  onAuthSuccess?: (role: 'patient' | 'doctor' | 'admin') => void
}

export const AuthModal = ({ 
  open, 
  onOpenChange, 
  defaultTab = 'login',
  onAuthSuccess 
}: AuthModalProps) => {
  const [role, setRole] = useState<'patient' | 'doctor' | 'admin'>('patient')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    license: '', // For doctors
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Fetch user data from users table to verify password
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('Email, FullName, Password, User_type')
        .eq('Email', formData.email)
        .single()

      if (userError) {
        toast({
          title: "Login Error",
          description: "Invalid email or password",
          variant: "destructive",
        })
        return
      }

      // Check if password matches
      if (userData.Password !== formData.password) {
        toast({
          title: "Login Error",
          description: "Invalid email or password",
          variant: "destructive",
        })
        return
      }

      // Login successful - create user object and store in context
      const user = {
        id: userData.Email,
        email: userData.Email,
        name: userData.FullName || userData.Email,
        role: userData.User_type as 'patient' | 'doctor' | 'admin'
      }
      
      login(user)
      onAuthSuccess?.(userData.User_type as 'patient' | 'doctor' | 'admin')
      
      toast({
        title: "Success",
        description: "Logged in successfully!",
      })
      onOpenChange(false)
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (role === 'doctor' && !formData.license) {
      toast({
        title: "Missing License",
        description: "Medical license number is required for doctors",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    
    try {
      // Store user data directly in the users table with password
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          Email: formData.email,
          FullName: formData.name,
          PhoneNumber: formData.phone ? parseInt(formData.phone) : null,
          User_type: role,
          Password: formData.password,
        })

      if (insertError) {
        toast({
          title: "Registration Error",
          description: "Failed to create account. Email may already exist.",
          variant: "destructive",
        })
        console.error('Error inserting user data:', insertError)
      } else {
        toast({
          title: "Success",
          description: "Account created successfully!",
        })
        onOpenChange(false)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred during registration",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getRoleIcon = (roleType: string) => {
    switch (roleType) {
      case 'patient': return <UserRound className="h-5 w-5" />
      case 'doctor': return <Stethoscope className="h-5 w-5" />
      case 'admin': return <Shield className="h-5 w-5" />
      default: return <UserRound className="h-5 w-5" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-hidden">
        <div className="flex flex-col max-h-full">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-center text-gradient">
              Welcome to NutriVeda
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto pr-2 max-h-[calc(90vh-100px)]">
            <Tabs defaultValue={defaultTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Role</Label>
                    <RadioGroup 
                      value={role} 
                      onValueChange={(value: 'patient' | 'doctor' | 'admin') => setRole(value)}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="patient" id="patient" />
                        <Label htmlFor="patient" className="flex items-center gap-2 cursor-pointer">
                          {getRoleIcon('patient')}
                          Patient
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="doctor" id="doctor" />
                        <Label htmlFor="doctor" className="flex items-center gap-2 cursor-pointer">
                          {getRoleIcon('doctor')}
                          Doctor
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="admin" id="admin" />
                        <Label htmlFor="admin" className="flex items-center gap-2 cursor-pointer">
                          {getRoleIcon('admin')}
                          Admin
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button type="submit" className="w-full" variant="hero" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    {/* Quiz Option */}
                    <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => {
                      onOpenChange(false)
                      navigate('/quiz')
                    }}>
                      <CardHeader className="text-center pb-2">
                        <CardTitle className="text-lg flex items-center justify-center gap-2">
                          <FileText className="h-5 w-5" />
                          Take Prakriti Quiz
                        </CardTitle>
                        <CardDescription>
                          Discover your Ayurvedic constitution and get personalized recommendations
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <Button variant="outline" className="w-full">
                          Start Quiz
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Registration Form */}
                    <Card>
                      <CardHeader className="text-center pb-4">
                        <CardTitle>Create Account</CardTitle>
                        <CardDescription>Register as a patient or doctor</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleRegister} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                              id="name"
                              placeholder="Enter your full name"
                              value={formData.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="reg-email">Email</Label>
                            <Input
                              id="reg-email"
                              type="email"
                              placeholder="Enter your email"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="Enter your phone number"
                              value={formData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              required
                            />
                          </div>

                          <div className="space-y-3">
                            <Label>Role</Label>
                            <RadioGroup 
                              value={role} 
                              onValueChange={(value: 'patient' | 'doctor' | 'admin') => setRole(value)}
                              className="flex flex-col space-y-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="patient" id="reg-patient" />
                                <Label htmlFor="reg-patient" className="flex items-center gap-2 cursor-pointer">
                                  {getRoleIcon('patient')}
                                  Patient
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="doctor" id="reg-doctor" />
                                <Label htmlFor="reg-doctor" className="flex items-center gap-2 cursor-pointer">
                                  {getRoleIcon('doctor')}
                                  Doctor
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>

                          {role === 'doctor' && (
                            <div className="space-y-2">
                              <Label htmlFor="license">Medical License Number</Label>
                              <Input
                                id="license"
                                placeholder="Enter your medical license number"
                                value={formData.license}
                                onChange={(e) => handleInputChange('license', e.target.value)}
                                required
                              />
                            </div>
                          )}

                          <div className="space-y-2">
                            <Label htmlFor="reg-password">Password</Label>
                            <Input
                              id="reg-password"
                              type="password"
                              placeholder="Create a password"
                              value={formData.password}
                              onChange={(e) => handleInputChange('password', e.target.value)}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm Password</Label>
                            <Input
                              id="confirm-password"
                              type="password"
                              placeholder="Confirm your password"
                              value={formData.confirmPassword}
                              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                              required
                            />
                          </div>

                          <Button type="submit" className="w-full" variant="hero" disabled={loading}>
                            {loading ? "Creating Account..." : "Create Account"}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}