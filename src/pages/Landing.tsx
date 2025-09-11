import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/layout/Header"
import { AuthModal } from "@/components/auth/AuthModal"

import { PharmacyRegistrationModal } from "@/components/pharmacy/PharmacyRegistrationModal"
import {
  UserRound,
  Stethoscope,
  Shield,
  Leaf,
  Brain,
  Heart,
  Apple,
  BookOpen,
  Users,
  ChefHat,
  Database,
  Calendar,
  Activity,
  Building2
} from "lucide-react"
import heroImage from "@/assets/hero-ayurveda.jpg"

export const Landing = () => {
  const [pharmacyRegOpen, setPharmacyRegOpen] = useState(false)

  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Prakriti Assessment",
      description: "Discover your unique body constitution through comprehensive Ayurvedic evaluation"
    },
    {
      icon: <ChefHat className="h-6 w-6" />,
      title: "Personalized Diet Plans",
      description: "AI-powered meal planning combining modern nutrition with ancient Ayurvedic wisdom"
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "Comprehensive Food Database",
      description: "8000+ foods with both nutritional data and Ayurvedic properties (Rasa, Virya, Guna)"
    },
    {
      icon: <Activity className="h-6 w-6" />,
      title: "Health Monitoring",
      description: "Track your progress and receive personalized recommendations"
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Doctor Consultations",
      description: "Connect with certified Ayurvedic practitioners for personalized care"
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Recipe Builder",
      description: "Create and share recipes with automatic nutritional and Ayurvedic analysis"
    }
  ]

  const roleCards = [
    {
      role: 'patient',
      icon: <UserRound className="h-8 w-8" />,
      title: "For Patients",
      description: "Discover your Prakriti, get personalized diet plans, and track your health journey",
      features: ["Prakriti Assessment", "Personalized Diet Plans", "Progress Tracking", "Doctor Connection"],
      color: "primary"
    },
    {
      role: 'doctor',
      icon: <Stethoscope className="h-8 w-8" />,
      title: "For Doctors",
      description: "Manage patients, create treatment plans, and leverage Ayurvedic insights",
      features: ["Patient Management", "Diet Chart Generator", "Consultation Tools", "Treatment Analytics"],
      color: "success"
    },
    {
      role: 'general',
      icon: <Leaf className="h-8 w-8" />,
      title: "For Everyone",
      description: "Explore Ayurvedic wisdom, discover recipes, and learn about healthy living",
      features: ["Food Database", "Recipe Library", "Educational Content", "Wellness Challenges"],
      color: "accent"
    },
    {
      role: 'pharmacy',
      icon: <Building2 className="h-8 w-8" />,
      title: "For Pharmacies",
      description: "Register your pharmacy to provide medicines directly to patients",
      features: ["Government Verification", "Direct Patient Sales", "Inventory Management", "Prescription Processing"],
      color: "success"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-10" />
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  <Leaf className="h-3 w-3 mr-1" />
                  Ancient Wisdom, Modern Science
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Ayurvedic
                  <span className="text-gradient block">
                    Diet Management
                  </span>
                  Made Simple
                </h1>
                <p className="text-lg text-muted-foreground max-w-md">
                  Discover your unique body constitution and get personalized nutrition guidance 
                  that blends traditional Ayurvedic principles with modern nutritional science.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="hero" 
                  size="xl" 
                  onClick={() => {}} // Header will handle auth modal
                  className="flex-1 sm:flex-none"
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Start Your Journey
                </Button>
                <Link to="/quiz">
                  <Button variant="medical" size="xl" className="w-full sm:w-auto">
                    Take Prakriti Quiz
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-strong">
                <img 
                  src={heroImage} 
                  alt="Ayurvedic herbs and wellness elements" 
                  className="w-full h-[400px] lg:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-accent rounded-full blur-xl opacity-60 animate-pulse" />
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/30 rounded-full blur-2xl opacity-40 float" />
            </div>
          </div>
        </div>
      </section>

      {/* Role Selection */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Choose Your Path to Wellness
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you're a patient seeking personalized care, a doctor managing treatments, 
              or someone exploring Ayurvedic wisdom, we have the right tools for you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roleCards.map((card, index) => (
              <Card key={index} className="group hover:shadow-medium transition-smooth cursor-pointer">
                <CardHeader className="text-center">
                  <div className={`mx-auto w-16 h-16 rounded-full bg-${card.color}/10 flex items-center justify-center text-${card.color} group-hover:scale-110 transition-smooth`}>
                    {card.icon}
                  </div>
                  <CardTitle className="text-xl">{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {card.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full mt-4" 
                    variant={card.role === 'general' ? 'outline' : 'default'}
                    onClick={() => {
                      if (card.role === 'general') {
                        document.getElementById('wellness-platform')?.scrollIntoView({ 
                          behavior: 'smooth',
                          block: 'start'
                        })
                      } else if (card.role === 'pharmacy') {
                        setPharmacyRegOpen(true)
                      } else {
                        // Header will handle auth modal
                      }
                    }}
                  >
                    {card.role === 'general' ? 'Explore Now' : 
                     card.role === 'pharmacy' ? 'Register Pharmacy' : 
                     `Get Started as ${card.title.split(' ')[1]}`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="wellness-platform" className="py-16">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Comprehensive Wellness Platform
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform integrates traditional Ayurvedic principles with modern technology 
              to provide personalized health and nutrition guidance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-soft transition-smooth">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-smooth">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="container text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Ready to Transform Your Health?
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of users who have discovered the power of personalized 
              Ayurvedic nutrition and holistic wellness.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="hero" 
                size="xl"
                onClick={() => {}} // Header will handle auth modal
              >
                <Users className="h-5 w-5 mr-2" />
                Join Our Community
              </Button>
              <Link to="/quiz">
                <Button variant="outline" size="xl">
                  <Brain className="h-5 w-5 mr-2" />
                  Take Free Assessment
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* Pharmacy Registration Modal */}
      <PharmacyRegistrationModal
        open={pharmacyRegOpen}
        onOpenChange={setPharmacyRegOpen}
      />
    </div>
  )
}

export default Landing