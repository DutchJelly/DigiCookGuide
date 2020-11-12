/// <reference types="react-scripts" />

interface MentalNote {
    note: string, //mental note string
    pendingInstructionId: number, //stop after this instruction
}

interface Timer {
    note: string, //the note that is displayed in the Recipe Notes section
    durationSeconds: number, //duration of the timer in seconds
    pendingInstructionId: number, //the instruction that the timer will execute when finished
    important: boolean //if the timer finishes, and this is true, it'll get priority over other instructions
}

interface RecipeStep {
    instruction: String,
    id: number,
    image: Url,
    mentalNotes: MentalNote[], //Notes for stuff like 'keep stiring in the pan until x'
    timers: Timer[] //timers that will run after the instruction until some instruction
}

interface Recipe {
    steps: RecipeStep[],
    ingredients: String[],
    author: String,
    difficulty: number,
}