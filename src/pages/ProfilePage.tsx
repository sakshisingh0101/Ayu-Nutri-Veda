import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Header } from '@/components/layout/Header'
import { useToast } from '@/hooks/use-toast'

import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit3, 
  Save, 
  X,
  Stethoscope,
  GraduationCap,
  Clock,
  Users
} from 'lucide-react'

interface UserProfile {
  id: number
  Email: string
  FullName: string
  User_type: string
  PhoneNumber?: number
  // Additional fields that might be added to users table
  address?: string
  dateOfBirth?: string
  specialization?: string
  experience?: string
  qualifications?: string
  bio?: string
  consultationFee?: number
  availability?: string
}

export const ProfilePage = () => {
  const { user, login } = useAuth()
  const { toast } = useToast()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({})

  const fetchProfile = async () => {
    if (!user) return
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('Email', user.email)
        .single()

      if (error) throw error
      setProfile(data)
      setEditedProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!profile || !user) return
    
    setSaving(true)
    try {
      const { data, error } = await supabase
        .from('users')
        .update(editedProfile)
        .eq('id', profile.id)
        .select()
        .single()

      if (error) throw error
      
      setProfile(data)
      setIsEditing(false)
      
      // Update auth context if name changed
      if (editedProfile.FullName && editedProfile.FullName !== user.name) {
        login({
          ...user,
          name: editedProfile.FullName
        })
      }
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditedProfile(profile || {})
    setIsEditing(false)
  }

  const handleInputChange = (field: keyof UserProfile, value: string | number) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }

  useEffect(() => {
    fetchProfile()
  }, [user])

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">Please log in to view your profile.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">Loading profile...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">Profile not found.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const isDoctor = profile.User_type === 'doctor'
  const isPatient = profile.User_type === 'patient'

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Header Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-2xl">
                      {profile.FullName?.split(' ').map(n => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      {profile.FullName || 'No Name'}
                      {isDoctor && <Stethoscope className="h-5 w-5 text-success" />}
                    </CardTitle>
                    <CardDescription className="text-lg">
                      <Badge variant={isDoctor ? "default" : "secondary"}>
                        {profile.User_type?.charAt(0).toUpperCase() + profile.User_type?.slice(1)}
                      </Badge>
                    </CardDescription>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline">
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleSave} disabled={saving}>
                        <Save className="h-4 w-4 mr-2" />
                        {saving ? 'Saving...' : 'Save'}
                      </Button>
                      <Button onClick={handleCancel} variant="outline">
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="fullName"
                      value={editedProfile.FullName || ''}
                      onChange={(e) => handleInputChange('FullName', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">
                      {profile.FullName || 'Not provided'}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {profile.Email}
                    </p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      type="tel"
                      value={editedProfile.PhoneNumber || ''}
                      onChange={(e) => handleInputChange('PhoneNumber', parseInt(e.target.value) || '')}
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {profile.PhoneNumber || 'Not provided'}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="userType">User Type</Label>
                  <div className="flex items-center gap-2 mt-1">
                    {isDoctor ? <Stethoscope className="h-4 w-4 text-success" /> : <Users className="h-4 w-4 text-primary" />}
                    <p className="text-sm text-muted-foreground">
                      {profile.User_type?.charAt(0).toUpperCase() + profile.User_type?.slice(1)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Doctor-specific Information */}
          {isDoctor && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="specialization">Specialization</Label>
                    {isEditing ? (
                      <Input
                        id="specialization"
                        value={editedProfile.specialization || ''}
                        onChange={(e) => handleInputChange('specialization', e.target.value)}
                        placeholder="e.g., Ayurvedic Medicine, Panchakarma"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground mt-1">
                        {profile.specialization || 'Not provided'}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="experience">Years of Experience</Label>
                    {isEditing ? (
                      <Input
                        id="experience"
                        value={editedProfile.experience || ''}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                        placeholder="e.g., 10 years"
                      />
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {profile.experience || 'Not provided'}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="qualifications">Qualifications</Label>
                    {isEditing ? (
                      <Textarea
                        id="qualifications"
                        value={editedProfile.qualifications || ''}
                        onChange={(e) => handleInputChange('qualifications', e.target.value)}
                        placeholder="List your medical qualifications and certifications"
                        rows={3}
                      />
                    ) : (
                      <div className="flex items-start gap-2 mt-1">
                        <GraduationCap className="h-4 w-4 text-muted-foreground mt-1" />
                        <p className="text-sm text-muted-foreground">
                          {profile.qualifications || 'Not provided'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="bio">Bio</Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    value={editedProfile.bio || ''}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">
                    {profile.bio || 'No bio provided'}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                {isEditing ? (
                  <Textarea
                    id="address"
                    value={editedProfile.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter your address"
                    rows={2}
                  />
                ) : (
                  <div className="flex items-start gap-2 mt-1">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                    <p className="text-sm text-muted-foreground">
                      {profile.address || 'Not provided'}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage