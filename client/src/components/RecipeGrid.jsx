import React, { useState } from "react";
import "../styles/RecipeGrid.css";
import RecipeCard from "./RecipeCard";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const RecipeGrid = ({ recipes = [], isLoading = false, error = "" }) => {
  const [sortBy, setSortBy] = useState("match");
  const [filterTime, setFilterTime] = useState([60]);
  const [activeView, setActiveView] = useState("grid");

  const mockRecipes = [
    {
      id: "1",
      title: "Spaghetti Carbonara",
      image:
        "https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=800&q=80",
      matchPercentage: 95,
      cookingTime: 30,
      difficulty: "Easy",
      dietaryTags: ["Italian", "Pasta"],
    },
    {
      id: "2",
      title: "Vegetable Stir Fry",
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
      matchPercentage: 85,
      cookingTime: 25,
      difficulty: "Easy",
      dietaryTags: ["Vegetarian", "Asian"],
    },
    {
      id: "3",
      title: "Chicken Tikka Masala",
      image:
        "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80",
      matchPercentage: 80,
      cookingTime: 45,
      difficulty: "Medium",
      dietaryTags: ["Indian", "Spicy"],
    },
    {
      id: "4",
      title: "Avocado Toast",
      image:
        "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=800&q=80",
      matchPercentage: 75,
      cookingTime: 10,
      difficulty: "Easy",
      dietaryTags: ["Vegetarian", "Breakfast"],
    },
    {
      id: "5",
      title: "Beef Lasagna",
      image:
        "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&q=80",
      matchPercentage: 70,
      cookingTime: 90,
      difficulty: "Hard",
      dietaryTags: ["Italian", "Beef"],
    },
    {
      id: "6",
      title: "Greek Salad",
      image:
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80",
      matchPercentage: 65,
      cookingTime: 15,
      difficulty: "Easy",
      dietaryTags: ["Vegetarian", "Mediterranean"],
    },
  ];

  const displayRecipes = recipes.length > 0 ? recipes : mockRecipes;

  const sortedRecipes = [...displayRecipes].sort((a, b) => {
    if (sortBy === "match") return b.matchPercentage - a.matchPercentage;
    if (sortBy === "time") return a.cookingTime - b.cookingTime;
    return a.title.localeCompare(b.title);
  });

  const filteredRecipes = sortedRecipes.filter(
    (recipe) => recipe.cookingTime <= filterTime[0]
  );

  const handleTimeFilterChange = (value) => setFilterTime(value);

  if (isLoading) {
    return (
      <div className="recipe-grid-container">
        <div className="recipe-grid-header">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="recipe-grid">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="recipe-card-skeleton">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex space-x-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recipe-grid-container">
        <div className="text-center py-10">
          <h3 className="text-xl font-semibold text-destructive mb-2">
            Error Loading Recipes
          </h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (filteredRecipes.length === 0) {
    return (
      <div className="recipe-grid-container">
        <div className="text-center py-10">
          <h3 className="text-xl font-semibold mb-2">No Recipes Found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or adding different ingredients.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-grid-container">
      <div className="recipe-grid-header">
        <Tabs
          defaultValue="grid"
          value={activeView}
          onValueChange={setActiveView}
          className="w-full"
        >
          <div className="recipe-grid-toolbar">
            <TabsList>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>

            <div className="recipe-grid-controls">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Max Time:</span>
                <div className="w-[150px]">
                  <Slider
                    defaultValue={[60]}
                    max={120}
                    step={5}
                    value={filterTime}
                    onValueChange={handleTimeFilterChange}
                  />
                </div>
                <span className="text-sm">{filterTime[0]} min</span>
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="match">Best Match</SelectItem>
                  <SelectItem value="time">Cooking Time</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mb-4">
            <Badge variant="outline" className="mr-2">
              {filteredRecipes.length} recipes found
            </Badge>
            {filterTime[0] < 120 && (
              <Badge variant="outline" className="mr-2">
                Under {filterTime[0]} minutes
              </Badge>
            )}
          </div>

          <TabsContent value="grid">
            <div className="recipe-grid">
              {filteredRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} {...recipe} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list">
            <div className="flex flex-col space-y-4">
              {filteredRecipes.map((recipe) => (
                <div key={recipe.id} className="recipe-list-item">
                  <div className="recipe-list-image">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4 flex-1">
                    <h3 className="text-lg font-semibold mb-2">
                      {recipe.title}
                    </h3>
                    <div className="flex items-center mb-2">
                      <span className="text-sm font-medium text-green-600 mr-2">
                        {recipe.matchPercentage}% match
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {recipe.cookingTime} min
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recipe.dietaryTags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RecipeGrid;
