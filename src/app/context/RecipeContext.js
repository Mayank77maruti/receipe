"use client";
import { createContext, useState, useContext } from "react";
import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";

const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);

  useCopilotReadable({
    description: "The current list of recipes",
    value: JSON.stringify(recipes),
  });

  useCopilotAction({
    name: "addRecipeFromName",
    description: "Add the recipe from its name",
    parameters: [
      {
        name: "recipeName",
        type: "string",
        description: "The name of the recipe to add",
        required: true,
      }
    ],
    handler: ({ recipeName }) => {
      addRecipe(recipeName);
    },
  });

  useCopilotAction({
    name: "deleteRecipeFromName",
    description: "Deletes a recipe from its name",
    parameters: [
      {
        name: "recipeName",
        type: "string",
        description: "The name of the recipe to delete",
        required: true,
      },
    ],
    handler: ({ recipeName }) => {
      try {
        deleteRecipe(recipeName);
        console.log(`Recipe "${recipeName}" deleted successfully`);
      } catch (error) {
        console.error(`Error deleting recipe "${recipeName}":`, error);
      }
    },
  });

  useCopilotAction({
    name: "suggestRecipes",
    description: "Suggests recipes based on available ingredients",
    parameters: [
      {
        name: "Ingredients",
        type: "string",
        description: "list of available ingredients user is given",
        required: true,
      },
    ],
    handler: ({ Ingredients }) => {
      suggestRecipe(Ingredients);
    },
  });

  const generateRecipeDetails = async (recipeName) => {
    try {
      // Send an HTTP request to the /api/generate endpoint
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipeName }), // Send recipeName in the body
      });
  
      // Wait for the response to be converted to JSON format
      const data = await response.json();
  
      // Check if the request was successful
      if (response.ok) {
        const { recipename, ingredients, instructions, tips } = data;
        return {
          recipename,
          ingredients,
          instructions,
          tips,
        };
      } else {
        console.error("Error generating recipe:", data.error);
        return null;
      }
  
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };
  const suggestRecipeDetails = async (ingredients) => {
    try {
      const response = await fetch("/api/suggest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredients }), 
      });
  
      // Wait for the response to be converted to JSON format
      const data = await response.json();
  
      // Check if the request was successful
      if (response.ok) {
        const { recipename, ingredients, instructions, tips } = data;
        return {
          recipename,
          ingredients,
          instructions,
          tips,
        };
      } else {
        console.error("Error generating recipe:", data.error);
        return null;
      }
  
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };
  
  const addRecipe = async (recipeName) => {
    // Call the function to generate recipe details using the recipe name
    const generatedDetails = await generateRecipeDetails(recipeName);
  
    if (generatedDetails) {
      // If the details were successfully generated, add them to the recipes state
      setRecipes((prev) => [
        ...prev,
        {
          name: generatedDetails.recipename,
          ingredients: generatedDetails.ingredients,
          instructions: generatedDetails.instructions,
          tips: generatedDetails.tips,
          createdAt: new Date(),
        },
      ]);
    } else {
      console.error("Failed to generate recipe details.");
    }
  };
  
  const suggestRecipe = async (ingredients) => {
    const generatedDetails = await suggestRecipeDetails(ingredients);
  
    if (generatedDetails) {
      // If the details were successfully generated, add them to the recipes state
      setRecipes((prev) => [
        ...prev,
        {
          name: generatedDetails.recipename,
          ingredients: generatedDetails.ingredients,
          instructions: generatedDetails.instructions,
          tips: generatedDetails.tips,
          createdAt: new Date(),
        },
      ]);
    } else {
      console.error("Failed to generate recipe details.");
    }
  };
  

  const deleteRecipe = (recipeName) => {
    console.log("try to delete")
    setRecipes((prev) => prev.filter((recipe) => recipe.name !== recipeName));
  };

  const resetAllRecipes = () => {
    setRecipes([]);
  };

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        addRecipe,
        deleteRecipe,
        resetAllRecipes,
        suggestRecipe
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipes = () => useContext(RecipeContext);
