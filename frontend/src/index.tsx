import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import RecipeGuide from './Components/recipeguide/RecipeGuide';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './assets/main.css'
import RecipePicker from './Components/recipepicker/RecipePicker';
import RecipeSettings from './Components/recipesettings/RecipeSettings';

ReactDOM.render(
  <Router>
    <Switch>
      <Route exact path="/">
        <RecipePicker />
      </Route>
      <Route exact path="/recipesettings">
        <RecipeSettings />
      </Route>
      <Route exact path="/recipeguide" component={RecipeGuide}/>
      <Route>Page not found</Route>
    </Switch>
  </Router>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
