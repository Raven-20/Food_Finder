import React, { useState } from "react";
import "../styles/SearchSection.css";
import { Search, X, Plus, Filter } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

const SearchSection = ({
  ingredients,
  dietaryFilters,
  onAddIngredient,
  onRemoveIngredient,
  onToggleFilter,
  onClearAll,
  onSearch
}) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);

  // Handle ingredient input and addition
  const handleAddIngredient = () => {
    const trimmed = inputValue.trim();
    if (trimmed) {
      const newIngredient = {
        id: Date.now().toString(),
        name: trimmed
      };
      onAddIngredient(newIngredient);
      setInputValue("");
    }
  };

  // Handle keydown for adding ingredient with Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  // Handle the search action
  const handleSearch = () => {
    // Get the list of ingredients and selected filters from state
    const ingredientsList = ingredients.map(ingredient => ingredient.name).join(',');
    const dietaryFiltersList = selectedFilters.join(',');

    // Send the fetch request to the backend
    fetch(`/api/recipes/search?ingredients=${ingredientsList}&dietaryFilters=${dietaryFiltersList}`)
      .then(response => response.json())
      .then(data => {
        // Handle the response, e.g., display the recipes
        console.log(data); // You would likely update your recipes state here
      })
      .catch(error => {
        console.error('Error fetching recipes:', error);
      });
  };

  return (
    <div className="search-section">
      <div className="search-header">
        <h2>Find Recipes with Your Ingredients</h2>
      </div>

      <div className="search-controls">
        <div className="input-wrapper">
          <Search className="search-icon" />
          <Input
            type="text"
            placeholder="Add an ingredient..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="ingredient-input"
          />
        </div>
        <Button onClick={handleAddIngredient}>
          <Plus className="icon" />
          Add
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <Filter className="icon" />
              Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="filter-popover">
              <h4>Dietary Preferences</h4>
              <p>Select your dietary restrictions.</p>
              <div className="checkboxes">
                {dietaryFilters.map((filter) => (
                  <div key={filter.id} className="checkbox-row">
                    <Checkbox
                      id={filter.id}
                      checked={filter.active}
                      onCheckedChange={() => onToggleFilter(filter.id)}
                    />
                    <Label htmlFor={filter.id}>{filter.name}</Label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Button onClick={onSearch} className="bg-primary text-white">
          Search Recipes
        </Button>

        {ingredients.length > 0 && (
          <Button variant="ghost" onClick={onClearAll}>
            Clear All
          </Button>
        )}
      </div>

      {ingredients.length > 0 && (
        <div className="ingredient-tags">
          {ingredients.map((ingredient) => (
            <Badge key={ingredient.id} variant="secondary" className="tag">
              {ingredient.name}
              <X
                className="remove-icon"
                onClick={() => onRemoveIngredient(ingredient.id)}
              />
            </Badge>
          ))}
        </div>
      )}

      {dietaryFilters.some((filter) => filter.active) && (
        <div className="active-filters">
          <span>Active filters:</span>
          {dietaryFilters
            .filter((filter) => filter.active)
            .map((filter) => (
              <Badge key={filter.id} variant="outline" className="tag">
                {filter.name}
              </Badge>
            ))}
        </div>
      )}
    </div>
  );
};

export default SearchSection;