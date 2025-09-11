import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/layout/Header"
import { useToast } from "@/hooks/use-toast"
import { useReactToPrint } from 'react-to-print'
import {
  Plus,
  Minus,
  ChefHat,
  Clock,
  Users,
  Save,
  FileText,
  Wind,
  Flame,
  Droplets,
  Calculator,
  Trash2,
  Download
} from "lucide-react"

interface Ingredient {
  id: string
  name: string
  quantity: number
  unit: string
  calories: number
  ayurvedic: {
    rasa: string[]
    virya: string
    doshaEffect: { vata: string; pitta: string; kapha: string }
  }
}

export const RecipeBuilder = () => {
  const [recipeName, setRecipeName] = useState('')
  const [description, setDescription] = useState('')
  const [cookingTime, setCookingTime] = useState('')
  const [servings, setServings] = useState(4)
  const [instructions, setInstructions] = useState([''])
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [newIngredient, setNewIngredient] = useState({
    name: '',
    quantity: 0,
    unit: 'g'
  })
  
  const { toast } = useToast()
  const printRef = useRef<HTMLDivElement>(null)

  // Extended ingredient database
  const ingredientDatabase = [
    {
      name: "Basmati Rice",
      calories: 205,
      ayurvedic: {
        rasa: ["Sweet"],
        virya: "Cooling",
        doshaEffect: { vata: "Neutral", pitta: "Pacifying", kapha: "Increasing" }
      }
    },
    {
      name: "Turmeric",
      calories: 312,
      ayurvedic: {
        rasa: ["Bitter", "Pungent"],
        virya: "Heating",
        doshaEffect: { vata: "Pacifying", pitta: "Neutral", kapha: "Pacifying" }
      }
    },
    {
      name: "Ghee",
      calories: 900,
      ayurvedic: {
        rasa: ["Sweet"],
        virya: "Cooling",
        doshaEffect: { vata: "Pacifying", pitta: "Pacifying", kapha: "Increasing" }
      }
    },
    {
      name: "Ginger",
      calories: 80,
      ayurvedic: {
        rasa: ["Pungent"],
        virya: "Heating",
        doshaEffect: { vata: "Pacifying", pitta: "Increasing", kapha: "Pacifying" }
      }
    },
    {
      name: "Cumin",
      calories: 375,
      ayurvedic: {
        rasa: ["Pungent", "Bitter"],
        virya: "Heating",
        doshaEffect: { vata: "Pacifying", pitta: "Increasing", kapha: "Pacifying" }
      }
    },
    {
      name: "Coriander",
      calories: 298,
      ayurvedic: {
        rasa: ["Sweet", "Bitter", "Pungent"],
        virya: "Cooling",
        doshaEffect: { vata: "Pacifying", pitta: "Pacifying", kapha: "Neutral" }
      }
    },
    {
      name: "Coconut Oil",
      calories: 862,
      ayurvedic: {
        rasa: ["Sweet"],
        virya: "Cooling",
        doshaEffect: { vata: "Pacifying", pitta: "Pacifying", kapha: "Increasing" }
      }
    },
    {
      name: "Almonds",
      calories: 579,
      ayurvedic: {
        rasa: ["Sweet"],
        virya: "Heating",
        doshaEffect: { vata: "Pacifying", pitta: "Increasing", kapha: "Increasing" }
      }
    },
    {
      name: "Spinach",
      calories: 23,
      ayurvedic: {
        rasa: ["Sweet", "Bitter", "Astringent"],
        virya: "Cooling",
        doshaEffect: { vata: "Increasing", pitta: "Pacifying", kapha: "Pacifying" }
      }
    },
    {
      name: "Tomato",
      calories: 18,
      ayurvedic: {
        rasa: ["Sweet", "Sour"],
        virya: "Heating",
        doshaEffect: { vata: "Pacifying", pitta: "Increasing", kapha: "Pacifying" }
      }
    },
    {
      name: "Honey",
      calories: 304,
      ayurvedic: {
        rasa: ["Sweet", "Astringent"],
        virya: "Heating",
        doshaEffect: { vata: "Pacifying", pitta: "Increasing", kapha: "Pacifying" }
      }
    },
    {
      name: "Milk",
      calories: 42,
      ayurvedic: {
        rasa: ["Sweet"],
        virya: "Cooling",
        doshaEffect: { vata: "Pacifying", pitta: "Pacifying", kapha: "Increasing" }
      }
    },
    {
      name: "Cardamom",
      calories: 311,
      ayurvedic: {
        rasa: ["Sweet", "Pungent"],
        virya: "Cooling",
        doshaEffect: { vata: "Pacifying", pitta: "Pacifying", kapha: "Pacifying" }
      }
    },
    {
      name: "Cinnamon",
      calories: 247,
      ayurvedic: {
        rasa: ["Sweet", "Pungent", "Bitter"],
        virya: "Heating",
        doshaEffect: { vata: "Pacifying", pitta: "Increasing", kapha: "Pacifying" }
      }
    },
    {
      name: "Onion",
      calories: 40,
      ayurvedic: {
        rasa: ["Sweet", "Pungent"],
        virya: "Heating",
        doshaEffect: { vata: "Pacifying", pitta: "Increasing", kapha: "Pacifying" }
      }
    },
    {
      name: "Garlic",
      calories: 149,
      ayurvedic: {
        rasa: ["Pungent"],
        virya: "Heating",
        doshaEffect: { vata: "Pacifying", pitta: "Increasing", kapha: "Pacifying" }
      }
    },
    {
      name: "Lemon",
      calories: 29,
      ayurvedic: {
        rasa: ["Sour", "Sweet"],
        virya: "Heating",
        doshaEffect: { vata: "Pacifying", pitta: "Increasing", kapha: "Pacifying" }
      }
    },
    {
      name: "Black Pepper",
      calories: 251,
      ayurvedic: {
        rasa: ["Pungent"],
        virya: "Heating",
        doshaEffect: { vata: "Pacifying", pitta: "Increasing", kapha: "Pacifying" }
      }
    },
    {
      name: "Fennel",
      calories: 345,
      ayurvedic: {
        rasa: ["Sweet", "Pungent"],
        virya: "Cooling",
        doshaEffect: { vata: "Pacifying", pitta: "Pacifying", kapha: "Neutral" }
      }
    },
    {
      name: "Mint",
      calories: 44,
      ayurvedic: {
        rasa: ["Pungent", "Sweet"],
        virya: "Cooling",
        doshaEffect: { vata: "Increasing", pitta: "Pacifying", kapha: "Pacifying" }
      }
    }
  ]

  const addIngredient = () => {
    if (newIngredient.name && newIngredient.quantity > 0) {
      const dbIngredient = ingredientDatabase.find(
        ing => ing.name.toLowerCase() === newIngredient.name.toLowerCase()
      )
      
      if (dbIngredient) {
        const ingredient: Ingredient = {
          id: Date.now().toString(),
          name: newIngredient.name,
          quantity: newIngredient.quantity,
          unit: newIngredient.unit,
          calories: dbIngredient.calories,
          ayurvedic: dbIngredient.ayurvedic
        }
        setIngredients([...ingredients, ingredient])
        setNewIngredient({ name: '', quantity: 0, unit: 'g' })
        toast({
          title: "Ingredient Added",
          description: `${ingredient.name} has been added to your recipe.`
        })
      } else {
        toast({
          title: "Ingredient Not Found",
          description: "Please select from available ingredients in our database. Try: Rice, Turmeric, Ghee, Ginger, etc.",
          variant: "destructive"
        })
      }
    }
  }

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter(ing => ing.id !== id))
  }

  const addInstruction = () => {
    setInstructions([...instructions, ''])
  }

  const updateInstruction = (index: number, value: string) => {
    const updated = [...instructions]
    updated[index] = value
    setInstructions(updated)
  }

  const removeInstruction = (index: number) => {
    if (instructions.length > 1) {
      setInstructions(instructions.filter((_, i) => i !== index))
    }
  }

  const calculateNutrition = () => {
    const totalCalories = ingredients.reduce((sum, ing) => {
      return sum + (ing.calories * ing.quantity / 100)
    }, 0)
    return {
      totalCalories: Math.round(totalCalories),
      caloriesPerServing: Math.round(totalCalories / servings)
    }
  }

  const analyzeAyurvedicProperties = () => {
    const rasaCount: Record<string, number> = {}
    const viryaCount: Record<string, number> = {}
    const doshaEffects = { vata: 0, pitta: 0, kapha: 0 }

    ingredients.forEach(ing => {
      // Count rasa
      ing.ayurvedic.rasa.forEach(rasa => {
        rasaCount[rasa] = (rasaCount[rasa] || 0) + 1
      })

      // Count virya
      viryaCount[ing.ayurvedic.virya] = (viryaCount[ing.ayurvedic.virya] || 0) + 1

      // Analyze dosha effects
      Object.entries(ing.ayurvedic.doshaEffect).forEach(([dosha, effect]) => {
        if (effect === 'Pacifying') doshaEffects[dosha as keyof typeof doshaEffects] -= 1
        if (effect === 'Increasing') doshaEffects[dosha as keyof typeof doshaEffects] += 1
      })
    })

    const dominantRasa = Object.keys(rasaCount).reduce((a, b) => 
      rasaCount[a] > rasaCount[b] ? a : b, 'Sweet')
    const dominantVirya = Object.keys(viryaCount).reduce((a, b) => 
      viryaCount[a] > viryaCount[b] ? a : b, 'Neutral')

    return { dominantRasa, dominantVirya, doshaEffects }
  }

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${recipeName || 'Recipe'} - NutriVeda`,
  })

  const saveRecipe = async () => {
    if (!recipeName.trim()) {
      toast({
        title: "Recipe Name Required",
        description: "Please enter a recipe name before saving.",
        variant: "destructive"
      })
      return
    }
    
    if (ingredients.length === 0) {
      toast({
        title: "Add Ingredients",
        description: "Please add at least one ingredient to your recipe.",
        variant: "destructive"
      })
      return
    }

    // Create recipe data object
    const recipeData = {
      name: recipeName,
      description,
      cookingTime: parseInt(cookingTime) || 0,
      servings,
      ingredients: ingredients.map(ing => ({
        name: ing.name,
        quantity: ing.quantity,
        unit: ing.unit,
        calories: ing.calories,
        ayurvedic: ing.ayurvedic
      })),
      instructions: instructions.filter(inst => inst.trim()),
      nutrition,
      ayurvedic,
      createdAt: new Date().toISOString()
    }

    try {
      // Save to localStorage as a demo (in real app, save to database)
      const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]')
      savedRecipes.push({ ...recipeData, id: Date.now().toString() })
      localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes))

      toast({
        title: "Recipe Saved!",
        description: `${recipeName} has been saved to your recipe collection.`
      })
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save recipe. Please try again.",
        variant: "destructive"
      })
    }
  }

  const exportRecipe = () => {
    if (!recipeName.trim()) {
      toast({
        title: "Recipe Name Required",
        description: "Please enter a recipe name before exporting.",
        variant: "destructive"
      })
      return
    }
    
    handlePrint()
  }

  const nutrition = calculateNutrition()
  const ayurvedic = analyzeAyurvedicProperties()

  const getDoshaIcon = (dosha: string) => {
    switch (dosha) {
      case 'vata': return <Wind className="h-4 w-4 text-blue-600" />
      case 'pitta': return <Flame className="h-4 w-4 text-orange-600" />
      case 'kapha': return <Droplets className="h-4 w-4 text-green-600" />
      default: return null
    }
  }

  const getDoshaEffectText = (value: number) => {
    if (value > 0) return 'Increasing'
    if (value < 0) return 'Pacifying'
    return 'Neutral'
  }

  const getDoshaEffectColor = (value: number) => {
    if (value > 0) return 'text-warning'
    if (value < 0) return 'text-success'
    return 'text-muted-foreground'
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <ChefHat className="h-8 w-8 text-primary" />
            Recipe Builder
          </h1>
          <p className="text-muted-foreground">
            Create personalized recipes with automatic nutritional and Ayurvedic analysis
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recipe Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Recipe Details</CardTitle>
                <CardDescription>
                  Start by adding basic information about your recipe
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recipe-name">Recipe Name</Label>
                  <Input
                    id="recipe-name"
                    placeholder="e.g., Turmeric Golden Milk"
                    value={recipeName}
                    onChange={(e) => setRecipeName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of your recipe..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cooking-time">Cooking Time (minutes)</Label>
                    <Input
                      id="cooking-time"
                      type="number"
                      placeholder="30"
                      value={cookingTime}
                      onChange={(e) => setCookingTime(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="servings">Servings</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setServings(Math.max(1, servings - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        id="servings"
                        type="number"
                        value={servings}
                        onChange={(e) => setServings(parseInt(e.target.value) || 1)}
                        className="text-center"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setServings(servings + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ingredients */}
            <Card>
              <CardHeader>
                <CardTitle>Ingredients</CardTitle>
                <CardDescription>
                  Add ingredients to automatically calculate nutrition and Ayurvedic properties
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Ingredient Form */}
                <div className="grid grid-cols-4 gap-2">
                  <div className="col-span-2 relative">
                    <Input
                      placeholder="Ingredient name"
                      value={newIngredient.name}
                      onChange={(e) => setNewIngredient({...newIngredient, name: e.target.value})}
                      list="ingredients-list"
                    />
                    <datalist id="ingredients-list">
                      {ingredientDatabase.map((ingredient) => (
                        <option key={ingredient.name} value={ingredient.name} />
                      ))}
                    </datalist>
                  </div>
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={newIngredient.quantity}
                    onChange={(e) => setNewIngredient({...newIngredient, quantity: parseFloat(e.target.value) || 0})}
                  />
                  <div className="flex gap-1">
                    <select
                      value={newIngredient.unit}
                      onChange={(e) => setNewIngredient({...newIngredient, unit: e.target.value})}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                    >
                      <option value="g">g</option>
                      <option value="ml">ml</option>
                      <option value="cup">cup</option>
                      <option value="tsp">tsp</option>
                      <option value="tbsp">tbsp</option>
                    </select>
                  </div>
                </div>
                <Button onClick={addIngredient} className="w-full" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Ingredient
                </Button>

                {/* Ingredients List */}
                {ingredients.length > 0 && (
                  <div className="space-y-2">
                    <Separator />
                    <h4 className="font-medium">Added Ingredients</h4>
                    {ingredients.map((ingredient) => (
                      <div key={ingredient.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div>
                          <span className="font-medium">{ingredient.name}</span>
                          <span className="text-muted-foreground ml-2">
                            {ingredient.quantity} {ingredient.unit}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeIngredient(ingredient.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Cooking Instructions</CardTitle>
                <CardDescription>
                  Step-by-step instructions for preparing your recipe
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <Textarea
                        placeholder={`Step ${index + 1} instructions...`}
                        value={instruction}
                        onChange={(e) => updateInstruction(index, e.target.value)}
                      />
                    </div>
                    {instructions.length > 1 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeInstruction(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button onClick={addInstruction} variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Step
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Sidebar */}
          <div className="space-y-6">
            {/* Nutritional Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Nutritional Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                {ingredients.length > 0 ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">{nutrition.totalCalories}</div>
                      <div className="text-sm text-muted-foreground">Total Calories</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-semibold">{nutrition.caloriesPerServing}</div>
                      <div className="text-sm text-muted-foreground">Calories per serving</div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{cookingTime || '—'} minutes</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{servings} servings</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calculator className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-sm text-muted-foreground">
                      Add ingredients to see nutritional analysis
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Ayurvedic Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Ayurvedic Properties</CardTitle>
              </CardHeader>
              <CardContent>
                {ingredients.length > 0 ? (
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium mb-2">Dominant Rasa (Taste)</div>
                      <Badge variant="secondary">{ayurvedic.dominantRasa}</Badge>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-2">Dominant Virya (Energy)</div>
                      <Badge variant="outline">{ayurvedic.dominantVirya}</Badge>
                    </div>

                    <Separator />

                    <div>
                      <div className="text-sm font-medium mb-3">Effect on Doshas</div>
                      <div className="space-y-2">
                        {Object.entries(ayurvedic.doshaEffects).map(([dosha, value]) => (
                          <div key={dosha} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getDoshaIcon(dosha)}
                              <span className="text-sm capitalize">{dosha}</span>
                            </div>
                            <span className={`text-sm font-medium ${getDoshaEffectColor(value)}`}>
                              {getDoshaEffectText(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Wind className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-sm text-muted-foreground">
                      Add ingredients to see Ayurvedic analysis
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="p-4 space-y-2">
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={exportRecipe}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Hidden print component */}
        <div ref={printRef} className="hidden print:block">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">{recipeName || 'Recipe'}</h1>
              <p className="text-gray-600">{description}</p>
              <div className="flex justify-center gap-8 mt-4">
                <div className="text-center">
                  <Clock className="h-5 w-5 mx-auto mb-1" />
                  <span>{cookingTime} minutes</span>
                </div>
                <div className="text-center">
                  <Users className="h-5 w-5 mx-auto mb-1" />
                  <span>{servings} servings</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-bold mb-4">Ingredients</h2>
                <ul className="space-y-2">
                  {ingredients.map((ingredient) => (
                    <li key={ingredient.id}>
                      {ingredient.quantity} {ingredient.unit} {ingredient.name}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Nutrition & Ayurvedic Properties</h2>
                <p><strong>Total Calories:</strong> {nutrition.totalCalories}</p>
                <p><strong>Per Serving:</strong> {nutrition.caloriesPerServing} calories</p>
                <p><strong>Dominant Rasa:</strong> {ayurvedic.dominantRasa}</p>
                <p><strong>Dominant Virya:</strong> {ayurvedic.dominantVirya}</p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Instructions</h2>
              <ol className="list-decimal list-inside space-y-2">
                {instructions.filter(inst => inst.trim()).map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecipeBuilder