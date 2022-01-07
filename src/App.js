import React from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import axios from 'axios';
import './App.css'

import PageSimple from './components/PageSimple/PageSimple'
import PageAdvanced from './components/PageAdvanced/PageAdvanced';
import NotFound from './components/NotFound/NotFound';
import Menu from "./components/Menu/Menu";

const baseUrl = 'http://127.0.0.1:8000';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            temperatureFeed: 0,
            temperatureOutside: 0,
            temperatureInside: 0
        };
    }

    loadData() {
        axios.all([
            axios.get(`${baseUrl}/properties/temperatureFeed`),
            axios.get(`${baseUrl}/properties/temperatureOutside`),
            axios.get(`${baseUrl}/properties/temperatureInside`)
        ])
            .then(axios.spread((temperatureFeed,
                                temperatureOutside,
                                temperatureInside) => {
                this.setState({
                    temperatureFeed: temperatureFeed.data.results,
                    temperatureOutside: temperatureOutside.data.results,
                    temperatureInside: temperatureInside.data.results,
                })
            }))
            .catch(error => console.error(error));
    }

    setFeedTemperature(temperature) {
        this.setState({temperatureFeed: temperature});
    }

    componentDidMount() {
        // this.loadData();
    }

    render() {
        return (
            <Router>
                <Menu/>
                <Switch>
                    <Route exact path='/simple' component={() => {
                        return <PageSimple temperatureFeed={this.state.temperatureFeed}
                                           temperatureOutside={this.state.temperatureOutside}
                                           temperatureInside={this.state.temperatureInside}
                                           setFeedTemperature={(temperature) => this.setFeedTemperature(temperature)}
                        />;
                    }}/>
                    <Route exact path='/complex' component={() => {
                        return <PageAdvanced temperatureFeed={this.state.temperatureFeed}
                                             temperatureOutside={this.state.temperatureOutside}
                                             temperatureInside={this.state.temperatureInside}
                                             setFeedTemperature={(temperature) => this.setFeedTemperature(temperature)}
                        />;
                    }}/>
                    <Redirect from='/' to='/simple'/>
                    <Route component={NotFound}/>
                </Switch>
            </Router>
        )
    }
}

export default App;
