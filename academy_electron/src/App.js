import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import store from "./store";
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';

import './assets/css/Theme.css';

import { getUser } from "./redux/actions/auth";
import { AUTH_ERROR } from "./redux/actions/types";

import ReduxToastr from "react-redux-toastr";
import Routes from "./routes/Routes";

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
                <Routes />
                <ReduxToastr
                timeOut={5000}
                newestOnTop={true}
                position="top-right"
                transitionIn="fadeIn"
                transitionOut="fadeOut"
                progressBar
                closeOnToastrClick
                />
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