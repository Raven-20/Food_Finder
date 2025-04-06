import React, { useState } from "react";
import "../styles/RecipeDetail.css";
import "../styles/card.css";
import {
  Share2,
  Clock,
  Users,
  Bookmark,
  BookmarkCheck,
  Printer,
  Heart,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

const RecipeDetail = ({
  id = "1",
  title = "Vegetable Stir Fry with Tofu",
  image = "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
  matchPercentage = 85,
  cookingTime = 30,
  servings = 4,
  ingredients = [
    { name: "Tofu", amount: "14", unit: "oz" },
    { name: "Bell Peppers", amount: "2", unit: "medium" },
    { name: "Broccoli", amount: "1", unit: "cup" },
    { name: "Carrots", amount: "2", unit: "medium" },
    { name: "Soy Sauce", amount: "3", unit: "tbsp" },
    { name: "Garlic", amount: "3", unit: "cloves" },
    { name: "Ginger", amount: "1", unit: "tbsp" },
    { name: "Vegetable Oil", amount: "2", unit: "tbsp" },
  ],
  instructions = [
    { step: 1, description: "Press tofu to remove excess water, then cut into 1-inch cubes." },
    { step: 2, description: "Chop all vegetables into bite-sized pieces." },
    { step: 3, description: "Heat oil in a large wok or skillet over medium-high heat." },
    { step: 4, description: "Add tofu and cook until golden brown on all sides, about 5 minutes." },
    { step: 5, description: "Remove tofu and set aside. Add garlic and ginger to the pan and stir for 30 seconds." },
    { step: 6, description: "Add vegetables and stir-fry for 5-7 minutes until crisp-tender." },
    { step: 7, description: "Return tofu to the pan, add soy sauce, and toss to combine." },
    { step: 8, description: "Cook for another 2 minutes until everything is heated through." },
  ],
  dietaryTags = ["Vegetarian", "Dairy-Free", "Low-Carb"],
  isLoggedIn = true,
  isSaved = false,
  onSave = () => {},
  onShare = () => {},
  onPrint = () => {},
  onClose = () => {},
}) => {
  const [saved, setSaved] = useState(isSaved);
  const [liked, setLiked] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const handleSave = () => {
    setSaved(!saved);
    onSave();
  };

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleShare = () => {
    setIsShareDialogOpen(true);
    onShare();
  };

  const handlePrint = () => {
    onPrint();
  };

  return (
    <div className="recipe-detail-container">
      <div className="image-wrapper">
        <img src={image} alt={title} className="recipe-image" />
        <div className="match-percentage">
          <Badge variant="secondary" className="bg-white/80 text-black">
            {matchPercentage}% Match
          </Badge>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              {dietaryTags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handleLike}>
              <Heart className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            <Button variant="outline" size="icon" onClick={handleSave}>
              {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
            </Button>
            <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share Recipe</DialogTitle>
                  <DialogDescription>Share this recipe with friends and family.</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <Button variant="outline" className="w-full">Facebook</Button>
                  <Button variant="outline" className="w-full">Twitter</Button>
                  <Button variant="outline" className="w-full">WhatsApp</Button>
                  <Button variant="outline" className="w-full">Email</Button>
                </div>
                <DialogFooter>
                  <Button variant="secondary" onClick={() => setIsShareDialogOpen(false)}>Close</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="icon" onClick={handlePrint}>
              <Printer className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-6 mb-6">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <span>{cookingTime} mins</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <span>{servings} servings</span>
          </div>
        </div>

        <Separator className="my-6" />

        <Tabs defaultValue="ingredients">
          <TabsList className="w-full">
            <TabsTrigger value="ingredients" className="flex-1">Ingredients</TabsTrigger>
            <TabsTrigger value="instructions" className="flex-1">Instructions</TabsTrigger>
          </TabsList>
          <TabsContent value="ingredients" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Ingredients</CardTitle>
                <CardDescription>For {servings} servings</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {ingredients.map((ingredient, index) => (
                    <li key={index} className="ingredient-item">
                      <span>{ingredient.name}</span>
                      <span className="text-muted-foreground">
                        {ingredient.amount} {ingredient.unit}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="instructions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
                <CardDescription>Step by step cooking guide</CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  {instructions.map((instruction) => (
                    <li key={instruction.step} className="flex gap-4">
                      <div className="step-number">{instruction.step}</div>
                      <div className="flex-1 pt-1">{instruction.description}</div>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-end">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
