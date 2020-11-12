/// <reference types="react-scripts" />

interface MentalNote {

}

interface Timer {

}

interface RecipeStep {
    instruction: String,
    id: Number,
    image: Url,
    mentalNotes: MentalNote[],
    timers: Timer[]
}

interface Recipe {
    steps: RecipeStep[],
    ingredients: String[],
    author: String,
    difficulty: Number,
}