
import { notStrictEqual } from 'assert'
import React, {useState, useEffect, ReactNode, Children} from 'react'
import DisableableBtn from '../util/DisableableBtn'
import RecipeInstruction from './RecipeInstruction'

import './styling.css'


type RecipeGuideProps = {
    recipe: Recipe
}


function MentalNote(props: {mentalNote: MentalNote, allSteps: RecipeStep[], currentInstructionIndex: number}){
    let pendingInstructionIndex = props.allSteps.findIndex(x => x.id === props.mentalNote.pendingInstructionId);
    if(pendingInstructionIndex === -1){
        console.error(`mental note has a non-existing pending instruction property: id(${props.mentalNote.pendingInstructionId})`);
        // return null; TODO change this back
    }
    else if(pendingInstructionIndex <= props.currentInstructionIndex)
        return null;
    return(
        <div className="mentalNote">
            <div className="noteText"><span className="notePrefix">Note #{props.mentalNote.pendingInstructionId}: </span>{props.mentalNote.note}</div>
        </div>
    );
}

function Timer(props: {timer: Timer, callback: (t: Timer) => any}){
    const [endTime] = useState(Date.now() + props.timer.durationSeconds * 1000);
    const [timeLeft, setTimeLeft] = useState(endTime - Date.now());

    //Credits to https://stackoverflow.com/questions/57137094/implementing-a-countdown-timer-in-react-with-hooks
    useEffect(() => {
        if(!timeLeft) {
            props.callback(props.timer);
            return;
        }

        const runningInterval = setInterval(() => {
            setTimeLeft(Math.max(0, endTime - Date.now()));
        }, 1000);
        return () => clearInterval(runningInterval);
    }, [timeLeft]); //Rerun code when timeLeft changes.

    //When the end time updates, we update the time left accordingly. WARNING: not tested
    useEffect(() => {
        setTimeLeft(Math.max(0, endTime - Date.now()));
    }, [endTime]);

    const formatTime = (t: number) => {
        let s = Math.floor(t/1000);
        let m = Math.floor(s/60);
        s -= m*60;
        let h = Math.floor(m/60);
        m -= h*60;
        let timeString = '';
        if(h) return `${h} hours, ${m} minutes and ${s} seconds`;
        if(m) return `${m} minutes and ${s} seconds`;
        return `${s} seconds`;
    }

    return(
        <div className="recipeTimer">
            <div className="timerText">{props.timer.note}</div>
            <div className="timerValue"><span className="timerValPrefix">Remaining: </span>{formatTime(timeLeft)}</div>
        </div>
    );

}

export default function RecipeGuide(props: RecipeGuideProps){
    
    const [currentStep, setCurrentStep] = useState(0);
    const [mentalNotes, setMentalNotes] = useState(Array<MentalNote>());
    const [timers, setTimers] = useState(Array<Timer>());

    //Copy steps array so we can change the order without changing the order of the original recipe.
    let [steps, setSteps] = useState([...props.recipe.steps]);


    const isTimerDependant = (instructionId: number) => {
        return timers.find(x => x.pendingInstructionId === instructionId);
    }

    const isTimerImportant = (instructionId: number) => {
        let corrospondingTimer = timers.find(x => x.pendingInstructionId === instructionId);
        return corrospondingTimer && corrospondingTimer.important;
    }

    const swabSteps = (a:number, b: number) => {
        let temp = steps[a];
        steps[a] = steps[b];
        steps[b] = temp;
        setSteps(steps);
    }

    //inserts step with index a before step with index b
    const insertStep = (a:number, b: number) => {
        let swabDir = a > b ? -1 : 1;
        while(a !== b){
            swabSteps(a, a + swabDir);
            a += swabDir;
        }
        setSteps(steps);
    }

    const scroll = (x:number) => {

        //When scrolling backwards, we don't want to update mental notes or timers, those keep going.
        if(x < 0){
            setCurrentStep(currentStep + x);
            return;
        }

        let recipeStep = steps[currentStep];
        
        //If a timer is waiting for the instruction that we want to scroll to, we find an instruction that is not 'timer dependant'.
        let timerIndepInstrOff = x;
        while(currentStep + timerIndepInstrOff < steps.length && isTimerDependant(steps[currentStep + timerIndepInstrOff].id))
            timerIndepInstrOff++;
        if(currentStep + timerIndepInstrOff === steps.length){
            //There is no instruction that we can manually do: we need to wait for a timer to finish.
            return;
        }
        //If the original offset was timer dependent, we need to change the order of the recipe steps.
        if(timerIndepInstrOff !== x){
            swabSteps(currentStep + x, currentStep + timerIndepInstrOff);
        }
        

        //Add timers and mental notes of instruction that's scrolled past.
        if(recipeStep.mentalNotes.length){
            let stateChanged = false;
            recipeStep.mentalNotes.forEach(note => {
                if(!mentalNotes.includes(note)){
                    mentalNotes.push(note);
                    stateChanged = true;
                }
                    
            });
            if(stateChanged)
                setMentalNotes(mentalNotes);
        }
        if(recipeStep.timers.length){
            let stateChanged = false;
            recipeStep.timers.forEach(timer => {
                if(!timers.includes(timer)){
                    timers.push(timer);
                    stateChanged = true;
                }
                
            });
            if(stateChanged)
                setTimers(timers);
        }

        //We could remove mental notes that are not pending any more from the state, but we're dynamically just looking at
        //the pending instruction id to render the note, so it's not neccesary.

        setCurrentStep(currentStep + x);

    }

    const getProgressPercentage = () => {
        const length = steps.length;
        if(length === 0) return 100;

        return ((currentStep+1)/steps.length) * 100;
    }

    const handleTimerFinish = (t: Timer) => {
        let pendingInstructionIndex = steps.findIndex(x => x.id === t.pendingInstructionId);
        if(pendingInstructionIndex === -1) {
            console.error(`no pending instruction was found for id ${t.pendingInstructionId}`);
            setTimers(timers.filter(x => x !== t));
            return;
        }

        if(t.important && isTimerImportant(steps[pendingInstructionIndex].id))
            insertStep(pendingInstructionIndex, currentStep);
        else 
            insertStep(pendingInstructionIndex, currentStep+1);
        
        setTimers(timers.filter(x => x !== t));
    }


    return(
        <div className="guide">
            <button className="exitBtn rounded-br">Exit Recipe Guide</button>
        
            <div className="main" style={{gridArea: "main"}}>
                <div className="instructions" style={{gridArea: "instructions"}}>
                    <div className="instructionImageWrapper">
                        <img src={steps[currentStep].image} alt=""/>
                    </div>
                    <div className="instructionTextWrapper">
                        {steps[currentStep].instruction}
                    </div>
                </div>
                
                <div className="guideMenu" style={{gridArea: "guideMenu"}}>
                    <DisableableBtn className="scrollButton rounded-tr" cb={() => scroll(-1)} clickable={currentStep > 0}>Previous</DisableableBtn>
                    <div className="progressbarWrapper">
                        <div className="progressbarOutline">
                            <div className="progressbarFiller" style={{width: `${getProgressPercentage()}%`}}/>
                            <div className="progressText">{currentStep + 1}/{steps.length}</div>
                        </div>
                    </div>
                    <DisableableBtn className="scrollButton rounded-tl" cb={() => scroll(1)} clickable={currentStep < steps.length-1}>Next</DisableableBtn>
                </div>
            </div>
            <div className="aside" style={{gridArea: "aside"}}>
                <div className="asideContainer">
                    <h1>Cooking Notes</h1>
                    <h2>Timers</h2>
                    {timers.length} currently running
                    {timers.map(timer => <Timer timer={timer} callback={handleTimerFinish}/>)}
                    <h2>Mental Notes</h2>
                    {mentalNotes.map(note => <MentalNote mentalNote={note} allSteps={steps} currentInstructionIndex={currentStep}/>)}
                </div>
            </div>
            
        </div>
    );

} 