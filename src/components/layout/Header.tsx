import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  UserRound, 
  Stethoscope, 
  Shield, 
  Menu, 
  X,
  Leaf,
  LogOut
} from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import { AuthModal } from "@/components/auth/AuthModal"

interface HeaderProps {
  // Remove userRole and onAuthOpen as they will come from context
}

export const Header = ({}: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authType, setAuthType] = useState<'login' | 'register'>('login')
  const { toast } = useToast()
  const { user, logout } = useAuth()

  const handleAuthOpen = (type: 'login' | 'register') => {
    setAuthType(type)
    setAuthModalOpen(true)
  }

  const handleLogout = () => {
    logout()
    toast({
      title: "Success",
      description: "Logged out successfully",
    })
  }

  const handleAuthSuccess = (role: 'patient' | 'doctor' | 'admin') => {
    setAuthModalOpen(false)
    // The auth context will handle the user state
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'patient': return <UserRound className="h-4 w-4" />
      case 'doctor': return <Stethoscope className="h-4 w-4" />
      case 'admin': return <Shield className="h-4 w-4" />
      default: return <User className="h-4 w-4" />
    }
  }

  const getRoleName = (role: string) => {
    switch (role) {
      case 'patient': return 'Patient'
      case 'doctor': return 'Doctor'
      case 'admin': return 'Admin'
      default: return 'User'
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Leaf className="h-5 w-5" />
          </div>
          <span className="hidden font-bold sm:inline-block text-gradient">
            NutriVeda
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              to="/foods"
              className="transition-colors hover:text-primary"
            >
              Food Database
            </Link>
            <Link
              to="/recipes"
              className="transition-colors hover:text-primary"
            >
              Recipes
            </Link>
            {user && (
              <Link
                to={`/${user.role}`}
                className="transition-colors hover:text-primary"
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-2">
            {user ? (
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="gap-1">
                  {getRoleIcon(user.role)}
                  {getRoleName(user.role)}
                </Badge>
                <Link to="/profile">
                  <Button variant="ghost" size="sm">
                    Profile
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout} title="Logout">
                  <LogOut className="h-4 w-4" />
                  <span className="ml-1 hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleAuthOpen('login')}
                >
                  Login
                </Button>
                <Button 
                  variant="hero" 
                  size="sm"
                  onClick={() => handleAuthOpen('register')}
                >
                  Sign Up
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="container py-4 space-y-2">
            <Link
              to="/foods"
              className="block px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Food Database
            </Link>
            <Link
              to="/recipes"
              className="block px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Recipes
            </Link>
             {user && (
               <>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                   to={`/${user.role}`}
                   className="block px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md"
                   onClick={() => setMobileMenuOpen(false)}
                 >
                   Dashboard
                 </Link>
                 <button
                   onClick={() => {
                     handleLogout()
                     setMobileMenuOpen(false)
                   }}
                   className="block w-full text-left px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md"
                 >
                   <LogOut className="h-4 w-4 mr-2 inline" />
                   Logout
                 </button>
               </>
             )}
           </nav>
         </div>
       )}

       {/* Auth Modal */}
       <AuthModal
         open={authModalOpen}
         onOpenChange={setAuthModalOpen}
         defaultTab={authType}
         onAuthSuccess={handleAuthSuccess}
       />
     </header>
  )
}