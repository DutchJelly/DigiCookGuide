import React from 'react'

export default function RecipeInstruction(props: RecipeStep){
    


    return(
        <div className="recipestep">
            
            <div className="instructions">{props.instruction}</div>
            <div className="image">{props.image}</div>

        </div>
    );
}


