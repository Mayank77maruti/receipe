// pages/index.js
import { RecipeProvider } from "./context/RecipeContext";
import RecipeList from "./components/RecipeList";
import { CopilotPopup } from "@copilotkit/react-ui";
import { ModeToggle } from "@/components/Toggle";
import { AiOutlinePlusCircle } from "react-icons/ai";

export default function Home() {
  return (
    <>
      <nav className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:bg-gradient-to-r dark:from-gray-800 dark:via-gray-900 dark:to-black border-b-2 border-indigo-600 py-5 fixed z-10">
        <div className="container mx-auto flex justify-between items-center max-w-screen-xl px-6">
          {/* Left Side */}
          <div className="text-2xl font-bold text-red tracking-wide cursor-pointer hover:text-yellow-200 transition">
            🍲 RecipeGen
          </div>

          {/* Right Side */}
          <div className="flex items-center">
            <ModeToggle />
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded-full shadow-md flex items-center">
              <AiOutlinePlusCircle className="text-xl" />
              New Recipe
            </button>
          </div>
        </div>
      </nav>

      <RecipeProvider>
        <div className="container mx-auto px-4 py-24 max-w-screen-lg min-h-screen flex flex-col items-center bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 text-center transition-all">
          <RecipeList />
        </div>
      </RecipeProvider>

      <CopilotPopup
        instructions={
          "You are assisting the user as best as you can. Answer in the best way possible given the data you have."
        }
        labels={{
          title: "Recipe Generator",
          initial: "What dish do you want to eat?",
        }}
        className="fixed bottom-6 right-6 shadow-lg transition-transform transform hover:scale-105"
      />
    </>
  );
}
