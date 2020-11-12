
import React, {useState, useEffect, ReactNode, Children} from 'react'
import DisableableBtn from '../util/DisableableBtn'
import RecipeInstruction from './RecipeInstruction'
import RunningSteps from './RunningSteps'

import './styling.css'


type RecipeGuideProps = {
    recipe: Recipe
}

export default function RecipeGuide(props: RecipeGuideProps){
    
    const [currentStep, setCurrentStep] = useState(0);

    let scroll = (x:number) => setCurrentStep(currentStep + x);

    return(
        <div className="guide">

            

            
            <div className="main" style={{gridArea: "main"}}>
                
                <div className="instructions" style={{gridArea: "instructions"}}>
                    <RecipeInstruction {...props.recipe.steps[currentStep]}/>
                </div>
                
                <div className="guideMenu" style={{gridArea: "guideMenu"}}>
                    <DisableableBtn className="scrollButton" cb={() => scroll(-1)} clickable={currentStep > 0}>Previous</DisableableBtn>
                    <div className="progressbarWrapper">
                        <div className="progressbarOutline">
                            <div className="progressbarFiller" />
                            <div className="progressText">{currentStep}/{props.recipe.steps.length}</div>
                        </div>
                    </div>
                    <DisableableBtn className="scrollButton" cb={() => scroll(1)} clickable={currentStep < props.recipe.steps.length-1}>Next</DisableableBtn>
                </div>
            </div>
            <div className="aside" style={{gridArea: "aside"}}>
                <h1>Cooking Notes</h1>
            </div>
            
        </div>
    );

} 