import React, {useState, useRef, useEffect} from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import './styling.css'


type TimerIdentifier = {
    step: number,
    index: number
}

export default function RecipeSettings(){
    const location = useLocation();
    const history = useHistory();
    const overlayRef = useRef<HTMLDivElement>(null);
    const [recipe, setRecipe] = useState(location.state as Recipe);
    const [inputWaitingTimer, setInputWaitingTimer] = useState<TimerIdentifier | undefined>(undefined);
    const [currentOverlayInput, setOverlayInput] = useState('');
    // const [overlayInputValidator, setOverlayInputValidator] = useState<StringValidator | undefined>(undefined)

    const enableOverlay = (timer: TimerIdentifier | undefined, initialValue: string = '') => {
        setInputWaitingTimer(timer);
        setOverlayInput(initialValue);
        // if(!timer) {
        //     setOverlayInputValidator(undefined);
        // }
    }

    const setTimer = (timer: TimerIdentifier, value: string) => {
        if(value === '') return;
        let step = recipe.steps.find(x => x.id === timer.step);
        if(!step) throw new Error('Invalid state: timer identifier belongs to non-existing step');
        step.timers[timer.index].durationSeconds = parseInt(value);
        setRecipe(recipe);
    }

    const isNumber = (arg: string) => !isNaN(parseInt(arg));

    useEffect(() => {
        if(!inputWaitingTimer) return;
        overlayRef.current!.focus();
    }, [inputWaitingTimer])

    return(
        <div className="settingscontainer">
            {/* TODO: this tenary expression could be more easily read if we'd use components */}
            {inputWaitingTimer ?
                <div ref={overlayRef} tabIndex={-1} className="overlay" onKeyDown={(event) => {
                    switch(event.key) {
                        case 'Escape':
                            enableOverlay(undefined);
                            return;
                        case 'Enter':
                            setTimer(inputWaitingTimer, currentOverlayInput);
                            enableOverlay(undefined);
                            return;
                        case 'Backspace':
                            setOverlayInput(currentOverlayInput.slice(0, -1));
                            return;
                    }
                    if(isNumber(event.key)) //TODO: make this use the overlayvalidator
                        setOverlayInput(currentOverlayInput + event.key);
                }}>
                    <div className="currentInput">{currentOverlayInput}</div>
                    <div className="info">Press [enter] to set, and [esc] to exit</div>

                </div> 
            : <>
                
                <h1>settings / overview</h1>
                <button className="backBtn" onClick={() => {
                    history.push({
                        pathname: '/'
                    });
                }}>
                    Back
                </button>
                <button className="cookBtn" onClick={() => {
                    history.push({
                        pathname: 'recipeguide',
                        state: recipe
                    });
                }}>
                    Cook!
                </button>
                <div className="steps">
                    {recipe.steps.map((x) => 
                        <div className="step" key={x.id}>
                            <div className="id">ID: {x.id}</div>
                            <div className="image" style={{backgroundImage: `url(${x.image})`}}></div>
                            <div className="instruction"><span className="label">Instruction:</span> {x.instruction}</div>
                            <div className="dependsOn"><span className="label">Depends on:</span> {x.dependsOn.join(', ')}</div>
                            
                            <div className="timers"><ul>{x.timers.map((y, i) => <li key={i}><span className="label">Timer with note: </span><i>{y.note}</i><br /><button onClick={() => {
                                enableOverlay({index: i, step: x.id}, y.durationSeconds.toString());
                                //setOverlayInputValidator(isNumber) //This doesn't work for some reason
                            }}>({y.durationSeconds} seconds) Click to change</button></li>)}</ul></div>
                            <div className="feedbacks"><ul>{x.feedbacks.map((y, i) => <li key={i}><span className="label">Feedback awaiting for with note: </span> <i>{y.note}</i>.</li>)}</ul></div>
                            <div className="notes"></div>
                        </div>
                    )}
                </div>
                
            </>}
        </div>
        
    )
}





