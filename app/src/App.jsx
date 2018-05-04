import React from 'react';
import { Switch, Route } from 'react-router-dom';

import './App.css';

import Header from './Header';
import Home from './Home';

const App = () => (
  <div className="app">
    <Header />
    <Switch>
      <Route exact path='/' component={ Home } />
    </Switch>
  </div>
);

export default App;
