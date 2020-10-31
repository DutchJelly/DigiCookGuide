
import React, {useState, useEffect, ReactNode} from 'react'
import './RecipeGuide.css'

type RecipeGuideProps = {
    recipe: Recipe
}


function ScrollButton(props: {scrollHandler: Function, show: boolean, children: ReactNode}){
    let classes = `scrollButton ${props.show ? '' : 'hide'}`;
    return (
        <button className={classes} onClick={() => props.scrollHandler(-1)}>{props.children}</button>
    )
}   

export default function RecipeGuide(props: RecipeGuideProps){
    
    const [currentStep, setCurrentStep] = useState(0);

    let scroll = (x:Number) => {

    };

    return(
        <div className="guide">
            <div className="progressText">{currentStep}/{props.recipe.steps.length}</div>

            <div className="test">
                {() => {
                    let someHtml = <div>Some html</div>
                    let htmlList = [];
                    for(let i = 0; i < 10; i++)
                        htmlList.push(someHtml);
                    return someHtml;
                }}
            </div>

            <ScrollButton scrollHandler={() => scroll(-1)} show={currentStep > 0}>Previous</ScrollButton>
            <ScrollButton scrollHandler={() => scroll(1)} show={currentStep > 0}>Next</ScrollButton>
        </div>
    );

} 