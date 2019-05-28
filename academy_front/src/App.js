import React from 'react';
import logo from './logo.svg';
import './App.css';
import MainForm from './containers/MainView';

import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';

function App() {
    return (
        <div className="App">
            <Router>
                <Switch>
                    <Route path="/" exact component={MainForm} />
                    {/* <Route path="/Login/" component={Login} /> */}
                </Switch>
            </Router>
        </div>
    );
}

export default App;
