'use client'

import React, { useState } from "react";
import { useRecipes } from "../context/RecipeContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Utensils, BookOpen, Plus, Search, ChefHat, X } from "lucide-react";

const RecipeList = () => {
  const { recipes, addRecipe, deleteRecipe, suggestRecipe } = useRecipes();
  const [newRecipeName, setNewRecipeName] = useState("");
  const [availableIngredients, setAvailableIngredients] = useState("");

  const handleAddRecipe = () => {
    if (newRecipeName.trim()) {
      addRecipe(newRecipeName);
      setNewRecipeName("");
    }
  };

  const handleSuggestRecipes = () => {
    if (availableIngredients.trim()) {
      suggestRecipe(availableIngredients);
      setAvailableIngredients("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-sky-50 to-cyan-50">
      <div className="p-8 w-full max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <ChefHat className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
            Recipe Collection
          </h1>
          <p className="text-gray-600">Discover and create delicious recipes</p>
        </div>

        <div className="max-w-md mx-auto backdrop-blur-sm bg-white/50 rounded-xl shadow-xl p-1 mb-12">
          <Tabs defaultValue="Add Recipe" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="Add Recipe" className="data-[state=active]:bg-primary/20">
                <Plus className="w-4 h-4 mr-2" />
                Add Recipe
              </TabsTrigger>
              <TabsTrigger value="Suggest" className="data-[state=active]:bg-primary/20">
                <Search className="w-4 h-4 mr-2" />
                Suggest Recipe
              </TabsTrigger>
            </TabsList>

            <TabsContent value="Add Recipe">
              <Card className="border-none bg-white/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Utensils className="w-5 h-5" />
                    Create New Recipe
                  </CardTitle>
                  <CardDescription>Add a new recipe to your collection</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input
                      value={newRecipeName}
                      onChange={(e) => setNewRecipeName(e.target.value)}
                      placeholder="Enter dish name..."
                      className="h-12 bg-white/70"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddRecipe()}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleAddRecipe} 
                    className="w-full h-11 font-medium"
                    disabled={!newRecipeName.trim()}
                  >
                    Generate Recipe
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="Suggest">
              <Card className="border-none bg-white/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Find Recipe
                  </CardTitle>
                  <CardDescription>Discover recipes based on your ingredients</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input
                      value={availableIngredients}
                      onChange={(e) => setAvailableIngredients(e.target.value)}
                      placeholder="e.g., chicken, rice, tomatoes..."
                      className="h-12 bg-white/70"
                      onKeyPress={(e) => e.key === 'Enter' && handleSuggestRecipes()}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleSuggestRecipes} 
                    className="w-full h-11 font-medium"
                    disabled={!availableIngredients.trim()}
                  >
                    Find Recipes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.name}
              recipe={recipe}
              deleteRecipe={deleteRecipe}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const RecipeCard = ({ recipe, deleteRecipe }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Card className="group bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl border-none shadow-lg">
        <CardHeader className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <CardTitle className="text-xl font-semibold text-gray-800 group-hover:text-primary transition-colors">
            {recipe.name}
          </CardTitle>
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-500 mb-1">Key Ingredients</p>
            <p className="text-gray-700">
              {recipe.ingredients.slice(0, 3).join(", ")}
              {recipe.ingredients.length > 3 && "..."}
            </p>
          </div>
        </CardHeader>
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full group-hover:bg-primary/5"
            onClick={() => setIsModalOpen(true)}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            View Recipe
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl w-full max-h-[80vh] overflow-y-auto bg-white/95 backdrop-blur-sm">
          <DialogHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold text-gray-800">
                {recipe.name}
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsModalOpen(false)}
                className="h-8 w-8 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-8 py-4">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-primary">Ingredients</h3>
              <ul className="grid grid-cols-2 gap-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-primary/40 mr-2" />
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-primary">Instructions</h3>
              <ol className="space-y-3">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-3 text-gray-700">
                    <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
                      {index + 1}
                    </span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-primary">Tips</h3>
              <ul className="space-y-2">
                {recipe.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <span className="text-primary">💡</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <CardFooter className="flex justify-end gap-3 pt-6 border-t">
            <Button
              variant="destructive"
              onClick={() => {
                deleteRecipe(recipe.name);
                setIsModalOpen(false);
              }}
              className="hover:bg-red-600"
            >
              Delete Recipe
            </Button>
            <DialogClose asChild>
              <Button variant="outline">
                Close
              </Button>
            </DialogClose>
          </CardFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RecipeList;