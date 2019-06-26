import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import store from "./store";
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';

import './bootstrap.css';
import './App.css';

import PrivateRoute from './containers/PrivateRoute';

import TeacherView from './containers/TeacherView';
import StudentView from './containers/StudentView';
import LoginView from './containers/LoginView';
import RegisterView from './containers/RegisterView';
import MyNavbar from './components/MyNavbar';

import { getUser } from "./actions/auth";
import { AUTH_ERROR } from "./actions/types";

import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faMicrophone, faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons'

library.add(faMicrophone, faMicrophoneSlash)

class App extends Component {
    componentDidMount() {
        if (localStorage.getItem("token")) {
            store.dispatch(getUser());
        } else {
            store.dispatch({ type: AUTH_ERROR });
        }
    }

    render() {
        return (
            <Provider store={store}>
                <BrowserRouter>
                    <div className="App">
                        <MyNavbar />
                        <Switch>
                            <PrivateRoute exact path="/" teacherOnly={true} component={TeacherView} />
                            <PrivateRoute exact path="/student" component={StudentView} />
                            <Route exact path="/login" component={LoginView} />
                            <Route exact path="/register" component={RegisterView} />
                        </Switch>
                    </div>
                </BrowserRouter>
            </Provider>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
module.hot.accept();