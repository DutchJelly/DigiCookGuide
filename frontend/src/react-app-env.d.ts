/// <reference types="react-scripts" />


interface RecipeStep {
    instruction: String,
    counter: Number,
    image: Url
}

interface Recipe {
    steps: RecipeStep[],
    ingredients: String[],
    author: String,
    difficulty: Number,
}