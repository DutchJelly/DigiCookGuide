import React, {useState, useEffect} from 'react'
import { useLocation, useHistory, Link } from 'react-router-dom'
import './styling.css'


export default function RecipeSettings(){
    const location = useLocation();
    const history = useHistory();
    const [recipe, setRecipe] = useState(location.state as Recipe);

    return(
        <div>
            <div className="steps">
                {recipe.steps.map(x => {
                    <div className="step">
                        <div className="id">{x.id}</div>
                        <div className="instruction">{x.instruction}</div>
                        <div className="dependsOn">{x.dependsOn}</div>
                        <div className="image">{x.image}</div>
                        <div className="timers"></div>
                        <div className="feedbacks"></div>
                        <div className="notes"></div>
                    </div>
                })}
            </div>
            Recipe settings
            {recipe.steps.length}
            <button onClick={() => {
                history.push({
                    pathname: 'recipeguide',
                    state: recipe
                });
            }}>
            </button>
        </div>
        
    )
}





