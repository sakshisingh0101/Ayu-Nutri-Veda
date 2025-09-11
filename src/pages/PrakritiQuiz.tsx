import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Header } from "@/components/layout/Header"
import { AuthModal } from "@/components/auth/AuthModal"
import { 
  Wind, 
  Flame, 
  Droplets, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle,
  User,
  Moon,
  Utensils,
  Activity
} from "lucide-react"
import prakitiImage from "@/assets/prakriti-doshas.jpg"

interface QuizQuestion {
  id: string
  category: string
  question: string
  options: {
    text: string
    vata: number
    pitta: number
    kapha: number
  }[]
}

const quizQuestions: QuizQuestion[] = [
  {
    id: "1",
    category: "Physical Constitution",
    question: "What best describes your body frame?",
    options: [
      { text: "Thin, light, hard to gain weight", vata: 2, pitta: 0, kapha: 0 },
      { text: "Medium build, moderate weight", vata: 0, pitta: 2, kapha: 0 },
      { text: "Large frame, tendency to gain weight", vata: 0, pitta: 0, kapha: 2 }
    ]
  },
  {
    id: "2",
    category: "Physical Constitution",
    question: "How would you describe your skin?",
    options: [
      { text: "Dry, thin, cool to touch", vata: 2, pitta: 0, kapha: 0 },
      { text: "Warm, oily, prone to redness", vata: 0, pitta: 2, kapha: 0 },
      { text: "Thick, moist, cool, smooth", vata: 0, pitta: 0, kapha: 2 }
    ]
  },
  {
    id: "3",
    category: "Mental Characteristics",
    question: "How do you typically handle stress?",
    options: [
      { text: "Get anxious and worried easily", vata: 2, pitta: 0, kapha: 0 },
      { text: "Become irritable and aggressive", vata: 0, pitta: 2, kapha: 0 },
      { text: "Remain calm but may become withdrawn", vata: 0, pitta: 0, kapha: 2 }
    ]
  },
  {
    id: "4",
    category: "Sleep Patterns",
    question: "What's your typical sleep pattern?",
    options: [
      { text: "Light sleeper, often wake up", vata: 2, pitta: 0, kapha: 0 },
      { text: "Sound sleep but need less sleep", vata: 0, pitta: 2, kapha: 0 },
      { text: "Deep, long sleep", vata: 0, pitta: 0, kapha: 2 }
    ]
  },
  {
    id: "5",
    category: "Digestion",
    question: "How is your appetite and digestion?",
    options: [
      { text: "Irregular, sometimes forget to eat", vata: 2, pitta: 0, kapha: 0 },
      { text: "Strong appetite, get irritable when hungry", vata: 0, pitta: 2, kapha: 0 },
      { text: "Steady appetite, can skip meals easily", vata: 0, pitta: 0, kapha: 2 }
    ]
  },
  {
    id: "6",
    category: "Lifestyle",
    question: "What type of weather do you prefer?",
    options: [
      { text: "Warm, humid weather", vata: 2, pitta: 0, kapha: 0 },
      { text: "Cool, well-ventilated places", vata: 0, pitta: 2, kapha: 0 },
      { text: "Warm, dry weather", vata: 0, pitta: 0, kapha: 2 }
    ]
  }
]

export const PrakritiQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authType, setAuthType] = useState<'login' | 'register'>('register')

  const handleAnswer = (optionIndex: number) => {
    setSelectedOption(optionIndex)
  }

  const handleNext = () => {
    if (selectedOption !== null) {
      const question = quizQuestions[currentQuestion]
      const selectedAnswer = question.options[selectedOption]
      
      setAnswers(prev => ({
        ...prev,
        [question.id]: selectedOption
      }))

      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        // Reset selectedOption for next question
        setSelectedOption(null)
      } else {
        calculateResults()
      }
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      const prevQuestionId = quizQuestions[currentQuestion - 1].id
      setSelectedOption(answers[prevQuestionId] ?? null)
    }
  }

  const calculateResults = () => {
    let vataTotal = 0
    let pittaTotal = 0
    let kaphaTotal = 0

    Object.entries(answers).forEach(([questionId, optionIndex]) => {
      const question = quizQuestions.find(q => q.id === questionId)
      if (question) {
        const option = question.options[optionIndex]
        vataTotal += option.vata
        pittaTotal += option.pitta
        kaphaTotal += option.kapha
      }
    })

    // Include the current question's answer
    if (selectedOption !== null) {
      const currentAnswer = quizQuestions[currentQuestion].options[selectedOption]
      vataTotal += currentAnswer.vata
      pittaTotal += currentAnswer.pitta
      kaphaTotal += currentAnswer.kapha
    }

    setShowResults(true)
  }

  const getResults = () => {
    let vataTotal = 0
    let pittaTotal = 0
    let kaphaTotal = 0

    Object.entries(answers).forEach(([questionId, optionIndex]) => {
      const question = quizQuestions.find(q => q.id === questionId)
      if (question) {
        const option = question.options[optionIndex]
        vataTotal += option.vata
        pittaTotal += option.pitta
        kaphaTotal += option.kapha
      }
    })

    if (selectedOption !== null) {
      const currentAnswer = quizQuestions[currentQuestion].options[selectedOption]
      vataTotal += currentAnswer.vata
      pittaTotal += currentAnswer.pitta
      kaphaTotal += currentAnswer.kapha
    }

    const total = vataTotal + pittaTotal + kaphaTotal
    const vataPercentage = (vataTotal / total) * 100
    const pittaPercentage = (pittaTotal / total) * 100
    const kaphaPercentage = (kaphaTotal / total) * 100

    const dominant = vataTotal >= pittaTotal && vataTotal >= kaphaTotal ? 'vata' :
                    pittaTotal >= kaphaTotal ? 'pitta' : 'kapha'

    return {
      vata: Math.round(vataPercentage),
      pitta: Math.round(pittaPercentage),
      kapha: Math.round(kaphaPercentage),
      dominant
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    setSelectedOption(null)
  }

  const handleCreateAccount = () => {
    setAuthType('register')
    setAuthModalOpen(true)
  }

  const handleAuthSuccess = (role: 'patient' | 'doctor' | 'admin') => {
    setAuthModalOpen(false)
    // Here you could save the quiz results to the database
    // For now, just show a success message
  }

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100

  const doshaInfo = {
    vata: {
      icon: <Wind className="h-6 w-6" />,
      name: "Vata",
      element: "Air + Space",
      characteristics: "Creative, energetic, quick-thinking",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    pitta: {
      icon: <Flame className="h-6 w-6" />,
      name: "Pitta",
      element: "Fire + Water",
      characteristics: "Focused, ambitious, organized",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    kapha: {
      icon: <Droplets className="h-6 w-6" />,
      name: "Kapha",
      element: "Earth + Water",
      characteristics: "Calm, stable, nurturing",
      color: "text-green-600",
      bgColor: "bg-green-50"
    }
  }

  if (showResults) {
    const results = getResults()
    const dominantDosha = doshaInfo[results.dominant as keyof typeof doshaInfo]

    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
              <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                Your Prakriti Assessment Results
              </h1>
              <p className="text-lg text-muted-foreground">
                Based on your responses, here's your unique Ayurvedic constitution
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Your Dosha Distribution</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wind className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Vata</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${results.vata}%` }}
                        />
                      </div>
                      <span className="font-bold text-blue-600">{results.vata}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Flame className="h-5 w-5 text-orange-600" />
                      <span className="font-medium">Pitta</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div 
                          className="bg-orange-600 h-2 rounded-full" 
                          style={{ width: `${results.pitta}%` }}
                        />
                      </div>
                      <span className="font-bold text-orange-600">{results.pitta}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Droplets className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Kapha</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${results.kapha}%` }}
                        />
                      </div>
                      <span className="font-bold text-green-600">{results.kapha}%</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className={`p-6 ${dominantDosha.bgColor}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-full bg-white ${dominantDosha.color}`}>
                    {dominantDosha.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Dominant: {dominantDosha.name}</h2>
                    <p className="text-sm text-muted-foreground">{dominantDosha.element}</p>
                  </div>
                </div>
                <p className="text-lg mb-4">{dominantDosha.characteristics}</p>
                <Badge variant="secondary" className="mb-4">
                  Primary Constitution
                </Badge>
              </Card>
            </div>

            <Card className="p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Personalized Recommendations</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Utensils className="h-4 w-4" />
                    Dietary Guidelines
                  </h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Favor warm, cooked foods</li>
                    <li>• Include healthy fats and oils</li>
                    <li>• Eat at regular intervals</li>
                    <li>• Avoid cold, raw, and dry foods</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Lifestyle Tips
                  </h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Maintain regular routines</li>
                    <li>• Practice calming activities</li>
                    <li>• Get adequate rest</li>
                    <li>• Stay warm and moisturized</li>
                  </ul>
                </div>
              </div>
            </Card>

            <div className="text-center">
              <Button variant="hero" size="lg" className="mr-4" onClick={handleCreateAccount}>
                <User className="h-4 w-4 mr-2" />
                Create Account to Save Results
              </Button>
              <Button variant="outline" size="lg" onClick={resetQuiz}>
                Retake Quiz
              </Button>
            </div>
          </div>
        </div>

        {/* Auth Modal */}
        <AuthModal
          open={authModalOpen}
          onOpenChange={setAuthModalOpen}
          defaultTab={authType}
          onAuthSuccess={handleAuthSuccess}
        />
      </div>
    )
  }

  const question = quizQuestions[currentQuestion]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">
                {currentQuestion + 1} of {quizQuestions.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{question.category}</Badge>
              </div>
              <CardTitle className="text-xl">{question.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={selectedOption?.toString() || ""} 
                onValueChange={(value) => handleAnswer(parseInt(value))}
                className="space-y-3"
              >
                {question.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label 
                      htmlFor={`option-${index}`} 
                      className="flex-1 cursor-pointer p-3 rounded-lg border border-transparent hover:border-border hover:bg-muted/50 transition-smooth"
                    >
                      {option.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button 
              onClick={handleNext}
              disabled={selectedOption === null}
              variant={currentQuestion === quizQuestions.length - 1 ? "success" : "default"}
            >
              {currentQuestion === quizQuestions.length - 1 ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  View Results
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>

          {/* Doshas Info */}
          <div className="mt-12">
            <h3 className="text-lg font-semibold mb-4 text-center">Understanding the Doshas</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {Object.entries(doshaInfo).map(([key, dosha]) => (
                <Card key={key} className={`text-center p-4 ${dosha.bgColor}`}>
                  <div className={`mx-auto w-12 h-12 rounded-full bg-white flex items-center justify-center ${dosha.color} mb-3`}>
                    {dosha.icon}
                  </div>
                  <h4 className="font-semibold">{dosha.name}</h4>
                  <p className="text-xs text-muted-foreground mb-2">{dosha.element}</p>
                  <p className="text-sm">{dosha.characteristics}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        defaultTab={authType}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  )
}

export default PrakritiQuiz