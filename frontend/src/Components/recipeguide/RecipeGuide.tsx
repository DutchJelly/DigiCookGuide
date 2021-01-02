
import React, {useState, useEffect, useRef} from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { useLocation, useHistory } from 'react-router-dom'
import useSound from 'use-sound'
import { getAudioUrl } from 'google-tts-api'
import DisableableBtn from '../util/DisableableBtn'

import './styling.css'

function usePulse(ref: React.RefObject<HTMLDivElement>) {
    const [isPulsing, setIsPulsing] = useState(false);

    const pulse = (duration: number) => {
        if(isPulsing) return;
        if(!ref.current) return;
        setIsPulsing(true);
        ref.current.classList.add('pulse');
        setInterval(() => { //This'll leak if the component is unmounted while this is running. TODO fix that.
            ref.current?.classList.remove('pulse');
            setIsPulsing(false);
        }, duration*1000); 
    }
    return [pulse];
}

function MentalNote(props: {mentalNote: MentalNote, allSteps: RecipeStep[], currentInstructionIndex: number}){
    const ref = useRef<HTMLDivElement>(null);
    const [pulse] = usePulse(ref);
    useEffect(() => {
        pulse(1.5);
    }, []);
    let pendingInstructionIndex = props.allSteps.findIndex(x => x.id === props.mentalNote.pendingInstructionId);
    if(pendingInstructionIndex === -1){
        console.error(`mental note has a non-existing pending instruction property: id(${props.mentalNote.pendingInstructionId})`);
        // return null; TODO change this back
    }
    else if(pendingInstructionIndex < props.currentInstructionIndex)
        return null;
    return(
        <div className="mentalNote" ref={ref}>
            <div className="noteText"><span className="notePrefix">Note: </span>{props.mentalNote.note}</div>
        </div>
    );
}

function Timer(props: {timer: Timer, callback: (t: Timer) => any}){
    const timerRef = useRef<HTMLDivElement>(null);
    const [endTime, setEndTime] = useState(Date.now() + props.timer.durationSeconds * 1000);
    const [timeLeft, setTimeLeft] = useState(endTime - Date.now());
    const [paused, setPaused] = useState(false);
    const [isNotified, setIsNotified] = useState(false);

    const [pulse] = usePulse(timerRef);
    useEffect(() => {
        pulse(1.5);
    }, []);

    //This doesn't work for some reason.
    const url = getAudioUrl('10 seconds left on a timer', {
        lang: 'en-US',
        slow: false,
        host: 'https://translate.google.com',
    });

    const [playTimerSpeach] = useSound(url);


    



    //Credits to https://stackoverflow.com/questions/57137094/implementing-a-countdown-timer-in-react-with-hooks
    useEffect(() => {
        if(!timeLeft) {
            props.callback(props.timer);
            return;
        }

        const runningInterval = setInterval(() => {
            if(paused) {
                setEndTime(endTime+1000);
                return;
            }
            setTimeLeft(Math.max(0, endTime - Date.now()));
            if(timeLeft < 10000) {
                timerRef.current!.classList.toggle('animate');
                if(!isNotified) {
                    playTimerSpeach();
                    setIsNotified(true);
                }
            }
        }, 1000);
        return () => clearInterval(runningInterval);
    }, [timeLeft, paused]); //Rerun code when timeLeft changes.

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
        if(h) return `${h}:${m < 10 ? '0': ''}${m}:${s < 10 ? '0' : ''}${s}`;
        if(m) return `${m}:${s < 10 ? '0' : ''}${s}`;
        return `${s}`;
    }

    return(
        <div className="outerTimer" ref={timerRef}>
            <div className="recipeTimer">
                <div className="timerText">{props.timer.note}</div>
                <div className="timerValue">{formatTime(timeLeft)}</div>
            </div>
            <button className="pauseBtn" onClick={() => setPaused(!paused)}>{paused ? '(click to unpause)' : '(click to pause)'}</button>
        </div>
    );

}


function UserFeedback(props: {userFeedback: UserFeedback, callback: (f: UserFeedback) => any}){
    const elemRef = useRef<HTMLDivElement>(null);
    const [pulse] = usePulse(elemRef);
    useEffect(() => {
        pulse(1.5);
    }, []);
    return(
        <div className="userFeedback" ref={elemRef}>
            <div className="feedbackText">{props.userFeedback.note}</div>
            <button onClick={() => props.callback(props.userFeedback)} className="userFeedbackBtn">{props.userFeedback.command}</button>
        </div>
    );
}

function CommandFeedback(props: {command: string | null | undefined, delay: number}){
    const [show, setShow] = useState(false);
    useEffect(() => {
        if(!props.command || props.command === '') {
            if(show) setShow(false);
            return;
        }
        setShow(true);
        let interval = setInterval(() => {
            setShow(false);
        }, props.delay);

        return () => {
            clearInterval(interval);
            if(show) setShow(false);
        }
        
    }, [props.command]);

    if(!show) return null;

    return (
        <div className="commandFeedback">
            {props.command}
        </div>
    )
}

export default function RecipeGuide(){
    const sidebarRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const history = useHistory();
    const [recipe] = useState(location.state as Recipe);
    const [currentStep, setCurrentStep] = useState(0);
    const [mentalNotes, setMentalNotes] = useState(Array<MentalNote>());
    let [timers, setTimers] = useState(Array<Timer>());
    let [feedbacks, setFeedbacks] = useState(Array<UserFeedback>());
    const [isBlocked, setIsBlocked] = useState(false);

    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const [voiceFeedback, setVoiceFeedback] = useState('');
    const [executedCmd, setExecutedCmd] = useState('');
    
    const idleImage = 'https://imagesvc.meredithcorp.io/v3/mm/image?q=85&c=sc&poi=face&w=2000&h=1047&url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F19%2F2018%2F04%2F05%2FGettyImages-607041431-2000.jpg';

    const staticCommands = [{
            command: "next",
            callback: () => {
                scroll(1);
                resetTranscript();
                setExecutedCmd('');
                setExecutedCmd('next');
            },
            matchInterim: true
        },{
            command: "previous",
            callback: () => {
                scroll(-1);
                resetTranscript();
                setExecutedCmd('');
                setExecutedCmd('previous');
            },
            matchInterim: true
        }
    ];

    recipe.steps.forEach(x => {
        x.feedbacks.forEach(y => {
            staticCommands.push({
                command: y.command,
                callback: () => {
                    if(!feedbacks.includes(y)) return;
                    handleFeedback(y);
                    resetTranscript();
                    setExecutedCmd('');
                    setExecutedCmd(y.command);
                },
                matchInterim: true
            })
        })
    });


    useEffect(() => {
        if(voiceEnabled){
            SpeechRecognition.startListening({ language: 'en-US', continuous: true });
            if(!SpeechRecognition.browserSupportsSpeechRecognition()){
                setVoiceFeedback("browser does not support voice commands");
            }
        }
        else SpeechRecognition.stopListening();
    }, [voiceEnabled]);
    
    const {transcript, resetTranscript} = useSpeechRecognition({commands: staticCommands});



    //Copy steps array so we can change the order without changing the order of the original recipe.
    //The steps array will always be split in 2 parts: the left part are the finished instructions, and the right part are the unfinished ones.
    const [steps, setSteps] = useState([...recipe.steps]);

    //Look if the instruction needs to wait for a timer to finish.
    const isTimerDependant = (instructionId: number, lastExecutedInstructionIndex: number) => {
        if(timers.find(x => x.pendingInstructionId === instructionId))
            return true;
        
        //now check timers that haven't ran yet, aka they're to the right of the last executed in the queue.
        for(let i = lastExecutedInstructionIndex+1; i < steps.length; i++){
            if(steps[i].timers.find(x => x.pendingInstructionId === instructionId))
                return true;
        }
        return false;
    }

    //Look if the instruction needs to wait for user feedback.
    const isFeedbackDependent = (instructionId: number, lastExecutedInstructionIndex: number) => {
        if(feedbacks.find(x => x.pendingInstructionId === instructionId))
            return true;

        //now check feedbacks that haven't ran yet, aka they're to the right of the last executed in the queue.
        for(let i = lastExecutedInstructionIndex+1; i < steps.length; i++){
            if(steps[i].feedbacks.find(x => x.pendingInstructionId === instructionId))
                return true;
        }
        return false;
    }

    //Look if the instruction is currently directly dependent on one of the previous instructions.
    const isDirectlyDependent = (instructionId: number, lastExecutedInstructionIndex: number) => {
        let instruction = steps.find(x => x.id === instructionId);
        if(!instruction) {
            console.error(`Cannot find if instruction is directly dependent because no instruction with id ${instructionId} exists.`);
            return false;
        }
        if(!instruction.dependsOn || instruction.dependsOn.includes(instruction.id)) {
            return false;
        }
        
        return steps.some((x, i) => (instruction!.dependsOn.includes(x.id) && (i > lastExecutedInstructionIndex)));
    }

    const isDependent = (instructionId: number, lastExecutedInstructionIndex: number) => {
        console.log(`direct dep: ${isDirectlyDependent(instructionId, lastExecutedInstructionIndex)}
        feedback dep: ${isFeedbackDependent(instructionId, lastExecutedInstructionIndex)}
        timer dep: ${isTimerDependant(instructionId, lastExecutedInstructionIndex)}`);
        return isDirectlyDependent(instructionId, lastExecutedInstructionIndex) || isFeedbackDependent(instructionId, lastExecutedInstructionIndex) || isTimerDependant(instructionId, lastExecutedInstructionIndex);
    }

    //TODO fix this; it won't work because timers never contains finished timers.
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

        if(currentStep+x < 0 || currentStep+x >= steps.length)
            return;

        //When scrolling backwards, we don't want to update mental notes or timers, those keep going.
        //TODO: think of whether it is logical to just remove the timers when you go back..
        if(x < 0){
            if(isBlocked){
                setIsBlocked(false);
            }else{
                setCurrentStep(currentStep + x);
            }
            return;
        }

        let recipeStep = steps[currentStep];
        
        

        //Add timers, mental notes and feedback waiters of instruction that's scrolled past.
        //This code can be cleaned up with a more OO approach and a generic function like:
        // const addRecipeProperty = (args: UserFeedback[] | MentalNote[] | Timer[], to: UserFeedback[] | MentalNote[] | Timer[]) => { }

        if(recipeStep.feedbacks.length){
            let stateChanged = false;
            recipeStep.feedbacks.forEach(feedback => {
                if(!feedbacks.includes(feedback)){
                    feedbacks.push(feedback);
                    stateChanged = true;
                }
                    
            });
            if(stateChanged) setFeedbacks([...feedbacks]);
        }
        if(recipeStep.mentalNotes.length){
            let stateChanged = false;
            recipeStep.mentalNotes.forEach(note => {
                if(!mentalNotes.includes(note)){
                    mentalNotes.push(note);
                    stateChanged = true;
                }
                    
            });
            if(stateChanged) setMentalNotes([...mentalNotes]);
        }
        if(recipeStep.timers.length){
            let stateChanged = false;
            recipeStep.timers.forEach(timer => {
                if(!timers.includes(timer)){
                    timers.push(timer);
                    stateChanged = true;
                }
                
            });
            if(stateChanged) setTimers([...timers]);
        }


        //If a timer is waiting for the instruction that we want to scroll to, we find an instruction that is not 'timer dependant'.
        let indepInstrOffset = x;
        while(currentStep + indepInstrOffset < steps.length && isDependent(steps[currentStep+indepInstrOffset].id, currentStep))
            indepInstrOffset++;
        if(currentStep + indepInstrOffset === steps.length){
            //There is no instruction that we can do; a timer needs to finish or feedback needs to be given.
            if(isBlocked) {
                if(!sidebarRef.current?.classList.contains('animate')){
                    sidebarRef.current?.classList.add('animate');
                    setTimeout(() => {
                        sidebarRef.current?.classList.remove('animate');
                    }, 820);
                }
                
            }
            setIsBlocked(true);
            return;
        }
        //If the original offset was dependent, we need to change the order to make the independent one the next one.
        if(indepInstrOffset !== x){
            swabSteps(currentStep + x, currentStep + indepInstrOffset);
        }
        if(isBlocked) setIsBlocked(false);
        setCurrentStep(currentStep + x);
    }

    const getProgressPercentage = () => {
        const length = steps.length;
        if(length === 0) return 100;

        return ((currentStep+1)/steps.length) * 100;
    }

    const [playAlert] = useSound('/alert.wav');

    const handleTimerFinish = (t: Timer) => {
        setIsBlocked(false);
        let pendingInstructionIndex = steps.findIndex(x => x.id === t.pendingInstructionId);
        if(pendingInstructionIndex === -1) {
            console.error(`no pending instruction was found for id ${t.pendingInstructionId}`);
            setTimers(timers.filter(x => x !== t));
            return;
        }


        playAlert();

        //If the user couldn't scroll further, the user actually completed the step, so we don't swab it forwards again.
        //Also, if the current step is the one that actually started the timer that finished, we also know that it doesn't need to be swabbed forwards.
        if(isBlocked || steps[currentStep].timers.includes(t)){
            insertStep(pendingInstructionIndex, currentStep+1);
            setCurrentStep(currentStep+1);   
            setTimers(timers.filter(x => x !== t));
            return;
        }
       
        if(t.important && !isTimerImportant(steps[pendingInstructionIndex].id))
            insertStep(pendingInstructionIndex, currentStep);
        else 
            insertStep(pendingInstructionIndex, currentStep+1);
        
        setTimers(timers.filter(x => x !== t));
    }

    const handleFeedback = (f: UserFeedback) => {
        let pendingInstructionIndex = steps.findIndex(x => x.id === f.pendingInstructionId);
        setIsBlocked(false);
        feedbacks = feedbacks.filter(x => x !== f);
        setFeedbacks(feedbacks);
        if(pendingInstructionIndex === -1) {
            console.error(`no pending instruction was found for id ${f.pendingInstructionId}`);
            return;
        }

        if(isDependent(f.pendingInstructionId, currentStep)){
            //TODO this will fail if the user can't scroll further than the feedback-starting instruction because
            //it'll get started again then. It's also just not desirable to have multiple awaiters point to the
            //same instruction currently, because they'll all have to wait until the last one finishes before 
            //the pending instruction can be shown.
            console.log('is dependent');
            return;
        }

        //If the user couldn't scroll further, the user actually completed the step, so we don't swab it forwards again.
        //Or if the current instruction is the one that actually started the feedback awaiting.
        if(isBlocked || steps[currentStep].feedbacks.includes(f)){
            insertStep(pendingInstructionIndex, currentStep+1);
            setCurrentStep(currentStep+1);
            return;
        }
       
        if(f.important)
            insertStep(pendingInstructionIndex, currentStep);
        else 
            insertStep(pendingInstructionIndex, currentStep+1);        
    }


    return(
        <div className="guide">
            <button className="exitBtn rounded-br" onClick={() => {
                history.push({
                    pathname: 'recipesettings',
                    state: recipe
                });
            }}>Exit Guide</button>

            <div className="voiceControl">
                <h2>Voice support is </h2>
                <button onClick={() => setVoiceEnabled(!voiceEnabled)}className="toggleVoice">{voiceEnabled ? "enabled" : "disabled"}</button>
                <br/><span className="feedback">
                    Latest voice command: {transcript.split(" ").splice(-1)}
                </span>
            </div>
            
            <CommandFeedback command={executedCmd} delay={750}/>
        

            <div className="top" ref={sidebarRef}>
                <div className="topContainer">
                    {timers.map((timer, i) => <Timer key={i} timer={timer} callback={handleTimerFinish}/>)}
                    {feedbacks.map((feedback, i) => <UserFeedback key={i} userFeedback={feedback} callback={handleFeedback}/>)}
                    {mentalNotes.map((note, i) => <MentalNote key={i} mentalNote={note} allSteps={steps} currentInstructionIndex={currentStep}/>)}
                </div>
            </div>

            <div className="main">
                <div className="instructions" style={{gridArea: "instructions"}}>
                    <div className="instructionImageWrapper" style={{backgroundImage: `url(${isBlocked ? idleImage : steps[currentStep].image})`}}>
                    </div>
                    <div className="instructionTextWrapper">

                        {/* TODO: this doesn't get updated when a timer finishes or feedback is given */}
                        {/* {isBlocked ? 'You currently have no new instructions to do because you\'re either waiting for a timer or because the guide is waiting for some feedback from you.' : steps[currentStep].instruction} */}
                        {isBlocked ? 'You don\'t have much to do. Maybe you can do some cleaning!' : steps[currentStep].instruction}
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
            
            
        </div>
    );

} 