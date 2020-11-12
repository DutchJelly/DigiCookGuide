import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import RecipeGuide from './Components/recipeguide/RecipeGuide';

import './assets/main.css'

let recipe = {
  steps: [{ 
      instruction: 'Cut the carrots in pieces of approximately 4 millimeters.',
      counter: 0,
      image: 'https://static01.nyt.com/images/2016/05/03/dining/03COOKING-KNIFESKILLS1/03COOKING-KNIFESKILLS1-square640.jpg'
    },{
      instruction: 'Cut some more carrets ;)',
      counter: 0,
      image: 'https://static01.nyt.com/images/2016/05/03/dining/03COOKING-KNIFESKILLS1/03COOKING-KNIFESKILLS1-square640.jpg'
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
