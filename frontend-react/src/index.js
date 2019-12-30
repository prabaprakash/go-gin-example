import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Feedback from './Feedback';
import Feedbacks from './Feedbacks';
import * as serviceWorker from './serviceWorker';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

export const Routers = () => <Router>
    <div>
        <Switch>
            <Route path="/Feedbacks">
                <Feedbacks />
            </Route>
            <Route path="/">
                <Feedback />
            </Route>
        </Switch>
    </div>
</Router>
ReactDOM.render(<Routers />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
