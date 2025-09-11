import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { createAdminUser, useUsers } from '@/hooks/useSupabaseData'
import { CheckCircle, UserPlus } from 'lucide-react'

export const AdminSetup = () => {
  const [isCreating, setIsCreating] = useState(false)
  const [adminExists, setAdminExists] = useState(false)
  const { users, loading } = useUsers()
  const { toast } = useToast()

  useEffect(() => {
    // Check if admin user already exists
    const adminUser = users.find(u => u.Email === 'soumya30garg@gmail.com')
    setAdminExists(!!adminUser)
  }, [users])

  const handleCreateAdmin = async () => {
    setIsCreating(true)
    try {
      const { data, error } = await createAdminUser()
      
      if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Admin user created successfully!",
        })
        setAdminExists(true)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create admin user",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {adminExists ? <CheckCircle className="h-5 w-5 text-success" /> : <UserPlus className="h-5 w-5" />}
          Admin Setup
        </CardTitle>
        <CardDescription>
          {adminExists ? 
            'Admin user is ready!' : 
            'Create the admin user for system management'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {adminExists ? (
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Email: soumya30garg@gmail.com
            </p>
            <p className="text-sm text-success">✓ Admin user exists</p>
          </div>
        ) : (
          <Button 
            onClick={handleCreateAdmin} 
            disabled={isCreating}
            className="w-full"
            variant="hero"
          >
            {isCreating ? "Creating..." : "Create Admin User"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}