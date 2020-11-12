
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
    const [mentalNotes, setMentalNotes] = useState(Array<MentalNote>());
    const [timers, setTimers] = useState(Array<Timer>());

    let scroll = (x:number) => setCurrentStep(currentStep + x);

    let getProgressPercentage = () => {
        const length = props.recipe.steps.length;
        if(length === 0) return 100;

        return (currentStep/props.recipe.steps.length) * 100;
    }

    return(
        <div className="guide">
            <button className="exitBtn rounded-br">Exit Recipe Guide</button>
        
            <div className="main" style={{gridArea: "main"}}>
                <div className="instructions" style={{gridArea: "instructions"}}>
                    <div className="instructionImageWrapper">
                        <img src={props.recipe.steps[currentStep].image} alt=""/>
                    </div>
                    <div className="instructionTextWrapper">
                        {props.recipe.steps[currentStep].instruction}
                    </div>
                </div>
                
                <div className="guideMenu" style={{gridArea: "guideMenu"}}>
                    <DisableableBtn className="scrollButton rounded-tr" cb={() => scroll(-1)} clickable={currentStep > 0}>Previous</DisableableBtn>
                    <div className="progressbarWrapper">
                        <div className="progressbarOutline">
                            <div className="progressbarFiller" style={{width: `${getProgressPercentage()}%`}}/>
                            <div className="progressText">{currentStep}/{props.recipe.steps.length}</div>
                        </div>
                    </div>
                    <DisableableBtn className="scrollButton rounded-tl" cb={() => scroll(1)} clickable={currentStep < props.recipe.steps.length-1}>Next</DisableableBtn>
                </div>
            </div>
            <div className="aside" style={{gridArea: "aside"}}>
                <h1>Cooking Notes</h1>
            </div>
            
        </div>
    );

} 