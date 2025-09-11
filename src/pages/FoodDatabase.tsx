import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/layout/Header"
import {
  Search,
  Filter,
  Apple,
  Wheat,
  Fish,
  Carrot,
  Wind,
  Flame,
  Droplets,
  Star,
  TrendingUp,
  Info
} from "lucide-react"

export const FoodDatabase = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Mock food data with Ayurvedic properties
  const foods = [
    {
      id: 1,
      name: "Basmati Rice",
      category: "grains",
      calories: 205,
      protein: 4.4,
      carbs: 44.5,
      fat: 0.6,
      ayurvedic: {
        rasa: ["Sweet"],
        virya: "Cooling",
        vipaka: "Sweet",
        guna: ["Light", "Soft"],
        doshaEffect: { vata: "Neutral", pitta: "Pacifying", kapha: "Increasing" }
      },
      benefits: ["Easy to digest", "Cooling effect", "Good for Pitta constitution"]
    },
    {
      id: 2,
      name: "Turmeric",
      category: "spices",
      calories: 312,
      protein: 9.7,
      carbs: 67.1,
      fat: 3.2,
      ayurvedic: {
        rasa: ["Bitter", "Pungent"],
        virya: "Heating",
        vipaka: "Pungent",
        guna: ["Light", "Dry"],
        doshaEffect: { vata: "Pacifying", pitta: "Neutral", kapha: "Pacifying" }
      },
      benefits: ["Anti-inflammatory", "Improves circulation", "Supports digestion"]
    },
    {
      id: 3,
      name: "Almonds",
      category: "nuts",
      calories: 576,
      protein: 21.2,
      carbs: 21.7,
      fat: 49.4,
      ayurvedic: {
        rasa: ["Sweet"],
        virya: "Heating",
        vipaka: "Sweet",
        guna: ["Heavy", "Oily"],
        doshaEffect: { vata: "Pacifying", pitta: "Increasing", kapha: "Increasing" }
      },
      benefits: ["Brain tonic", "Strengthening", "Good for Vata constitution"]
    },
    {
      id: 4,
      name: "Spinach",
      category: "vegetables",
      calories: 23,
      protein: 2.9,
      carbs: 3.6,
      fat: 0.4,
      ayurvedic: {
        rasa: ["Sweet", "Astringent"],
        virya: "Cooling",
        vipaka: "Pungent",
        guna: ["Light", "Dry"],
        doshaEffect: { vata: "Increasing", pitta: "Pacifying", kapha: "Neutral" }
      },
      benefits: ["Blood purifier", "Rich in iron", "Cooling effect"]
    }
  ]

  const categories = [
    { id: 'all', name: 'All Foods', icon: <Apple className="h-4 w-4" />, count: foods.length },
    { id: 'grains', name: 'Grains', icon: <Wheat className="h-4 w-4" />, count: 1 },
    { id: 'vegetables', name: 'Vegetables', icon: <Carrot className="h-4 w-4" />, count: 1 },
    { id: 'spices', name: 'Spices', icon: <Star className="h-4 w-4" />, count: 1 },
    { id: 'nuts', name: 'Nuts & Seeds', icon: <Apple className="h-4 w-4" />, count: 1 }
  ]

  const filteredFoods = foods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || food.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getDoshaIcon = (dosha: string) => {
    switch (dosha.toLowerCase()) {
      case 'vata': return <Wind className="h-4 w-4 text-blue-600" />
      case 'pitta': return <Flame className="h-4 w-4 text-orange-600" />
      case 'kapha': return <Droplets className="h-4 w-4 text-green-600" />
      default: return null
    }
  }

  const getDoshaEffectColor = (effect: string) => {
    switch (effect.toLowerCase()) {
      case 'pacifying': return 'text-success'
      case 'increasing': return 'text-warning'
      case 'neutral': return 'text-muted-foreground'
      default: return 'text-muted-foreground'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Ayurvedic Food Database</h1>
          <p className="text-muted-foreground max-w-2xl">
            Explore over 8,000 foods with complete nutritional information and traditional Ayurvedic properties. 
            Understand how different foods affect your dosha and overall well-being.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-smooth ${
                      selectedCategory === category.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {category.icon}
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {category.count}
                    </Badge>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search foods (e.g., turmeric, rice, almonds)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {filteredFoods.length} Foods Found
                </h2>
                <Button variant="outline" size="sm">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Sort by Relevance
                </Button>
              </div>

              {filteredFoods.map((food) => (
                <Card key={food.id} className="hover:shadow-soft transition-smooth">
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Basic Info */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{food.name}</h3>
                          <Badge variant="secondary" className="capitalize">
                            {food.category}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="text-center p-3 bg-muted/30 rounded-lg">
                            <div className="text-lg font-bold">{food.calories}</div>
                            <div className="text-xs text-muted-foreground">Calories/100g</div>
                          </div>
                          <div className="text-center p-3 bg-muted/30 rounded-lg">
                            <div className="text-lg font-bold">{food.protein}g</div>
                            <div className="text-xs text-muted-foreground">Protein</div>
                          </div>
                        </div>

                        <Tabs defaultValue="nutrition" className="w-full">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
                            <TabsTrigger value="benefits">Benefits</TabsTrigger>
                          </TabsList>
                          <TabsContent value="nutrition" className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">Carbohydrates</span>
                              <span className="text-sm font-medium">{food.carbs}g</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Fat</span>
                              <span className="text-sm font-medium">{food.fat}g</span>
                            </div>
                          </TabsContent>
                          <TabsContent value="benefits">
                            <ul className="space-y-1">
                              {food.benefits.map((benefit, index) => (
                                <li key={index} className="text-sm flex items-center gap-2">
                                  <div className="w-1 h-1 bg-primary rounded-full" />
                                  {benefit}
                                </li>
                              ))}
                            </ul>
                          </TabsContent>
                        </Tabs>
                      </div>

                      {/* Ayurvedic Properties */}
                      <div className="space-y-4">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Info className="h-4 w-4" />
                          Ayurvedic Properties
                        </h4>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="text-sm font-medium mb-1">Rasa (Taste)</div>
                            <div className="flex gap-1">
                              {food.ayurvedic.rasa.map((taste, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {taste}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <div className="text-sm font-medium mb-1">Virya (Energy)</div>
                            <Badge variant="secondary">{food.ayurvedic.virya}</Badge>
                          </div>

                          <div>
                            <div className="text-sm font-medium mb-1">Effect on Doshas</div>
                            <div className="space-y-1">
                              {Object.entries(food.ayurvedic.doshaEffect).map(([dosha, effect]) => (
                                <div key={dosha} className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    {getDoshaIcon(dosha)}
                                    <span className="text-sm capitalize">{dosha}</span>
                                  </div>
                                  <span className={`text-sm font-medium ${getDoshaEffectColor(effect)}`}>
                                    {effect}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <Button className="w-full" variant="outline">
                          Add to Recipe
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredFoods.length === 0 && (
                <Card className="p-12 text-center">
                  <div className="text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No foods found</h3>
                    <p>Try adjusting your search or category filter</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FoodDatabase