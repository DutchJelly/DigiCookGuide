import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import RecipeGuide from './Components/recipeguide/RecipeGuide';

import './assets/main.css'

let recipe = {
  steps: [{
      instruction: 'Zet een pan die ongeveer 3/4 gevuld is met water op het vuur.',
      id: 0,
      dependsOn: 0,
      image: 'https://denverwatertap.org/wp-content/uploads/2017/12/boiling-water-flickrcommons-Scott-Ackerman.jpg',
      mentalNotes: [],
      timers: [],
      feedbacks: [{
        command: 'cooking water',
        note: 'Als het water kookt, klik dan op de knop of zeg het commando.',
        pendingInstructionId: 2,
        important: true,
      }]
    },{
      instruction: 'Doe de spaghetti in het kokende water.',
      id: 2,
      dependsOn: 2,
      image: 'https://www.todayifoundout.com/wp-content/uploads/2014/01/cooking-pasta.jpg',
      mentalNotes: [],
      timers: [{
        note: 'Kook de spaghetti.',
        durationSeconds: 600,
        pendingInstructionId: 3,
        important: true,
      }],
      feedbacks: []
    },{
      instruction: 'Giet de spaghetti af, en zet de spaghetti ergens van het vuur neer.',
      id: 3,
      dependsOn: 3,
      image: 'https://media.libelle.nl/m/kdm8t04ihtu3.jpg',
      mentalNotes: [{
        note: 'Als de spaghetti te heet is, zullen de eieren te veel stollen, laat het dus afkoelen.',
        pendingInstructionId: 6
      }],
      timers: [],
      feedbacks: []
    },{
      instruction: 'Snij de knoflook en peterselie in fijne stukjes.',
      id: 4,
      dependsOn: 4,
      image: 'https://www.culy.nl/wp-content/uploads/2013/09/Knoflook-stock.jpg',
      mentalNotes: [],
      timers: [],
      feedbacks: []
    },{ 
      instruction: 'Doe de spekblokjes in een hete pan met wat olie.',
      id: 1,
      dependsOn: 1,
      image: 'https://www.leukerecepten.nl/wp-content/uploads/2019/07/spaghetti_carbonara_01.jpg',
      mentalNotes: [],
      timers: [],
      feedbacks: [{
        command: 'bacon is done',
        note: 'Als de spekjes mooi krokant zijn gebakken (niet helemaal afgebakken), klik dan op de knop of activeer hem met het voice commando.',
        pendingInstructionId: 5,
        important: true,
      }]
    },{
      instruction: 'Bak de knoflook en peterselie kort mee met de spekjes.',
      id: 5,
      dependsOn: 4,
      image: 'https://www.leukerecepten.nl/wp-content/uploads/2019/07/spaghetti_carbonara_01.jpg',
      mentalNotes: [],
      timers: [],
      feedbacks: []
    },{
      instruction: 'Mix de eieren en de kaas goed door elkaar in een bakje.',
      id: 9,
      dependsOn: 3,
      image: 'https://www.leukerecepten.nl/wp-content/uploads/2019/07/spaghetti_carbonara_02.jpg',
      mentalNotes: [],
      timers: [],
      feedbacks: []
    },{
      instruction: 'Doe de eieren, kaas en peper door de spaghetti en roer goed.',
      id: 6,
      dependsOn: 9,
      image: 'https://www.leukerecepten.nl/wp-content/uploads/2019/07/spaghetti_carbonara_04.jpg',
      mentalNotes: [],
      timers: [],
      feedbacks: []
    },{
      instruction: 'Voeg de spekjes nu toe aan het spaghettimengsel.',
      id: 7,
      dependsOn: 6,
      image: 'https://www.leukerecepten.nl/wp-content/uploads/2019/07/spaghetti_carbonara_04.jpg',
      mentalNotes: [],
      timers: [],
      feedbacks: []
    },{
      instruction: 'Serveer direct!',
      id: 8,
      dependsOn: 7,
      image: 'https://www.leukerecepten.nl/wp-content/uploads/2019/07/pasta-carbonara_v.jpg',
      mentalNotes: [],
      timers: [],
      feedbacks: []
    }
  ],
  ingredients: [],
  author: "Jelle",
  difficulty: 5
} as Recipe

ReactDOM.render(
  <React.StrictMode>
    <RecipeGuide recipe={recipe}/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
