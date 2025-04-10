import React, { useState, useEffect } from "react";
import axios from "axios";
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

const RecipeDetail = ({ id, isLoggedIn, onSave, onShare, onPrint, onClose }) => {
  const [recipe, setRecipe] = useState(null);
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  // Fetch the recipe data from the backend
  useEffect(() => {
    const fetchRecipeData = async () => {
      try {
        const response = await axios.get(`/api/recipe/${id}`);
        setRecipe(response.data);
        setSaved(response.data.isSaved); // Assuming your data has `isSaved` field
      } catch (error) {
        console.error("Error fetching recipe data:", error);
      }
    };

    fetchRecipeData();
  }, [id]);

  if (!recipe) {
    return <div>Loading...</div>;
  }

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
        <img src={recipe.image} alt={recipe.title} className="recipe-image" />
        <div className="match-percentage">
          <Badge variant="secondary" className="bg-white/80 text-black">
            {recipe.matchPercentage}% Match
          </Badge>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold">{recipe.title}</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              {recipe.dietaryTags.map((tag, index) => (
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
            <span>{recipe.cookingTime} mins</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <span>{recipe.servings} servings</span>
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
                <CardDescription>For {recipe.servings} servings</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
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
                  {recipe.instructions.map((instruction) => (
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
