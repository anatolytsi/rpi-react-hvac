import React from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import axios from 'axios';
import './App.css'
import Cookies from 'universal-cookie/es6';

import LoginForm from './components/Auth/Auth';
import PageSimple from './components/PageSimple/PageSimple'
import PageAdvanced from './components/PageAdvanced/PageAdvanced';
import NotFound from './components/NotFound/NotFound';
import Menu from './components/Menu/Menu';

require('dotenv').config();

const baseUrl = process.env.REACT_APP_THING_HOST;
const thingName = process.env.REACT_APP_THING_NAME;

const getProperty = (prop) => {
    return axios.get(`${baseUrl}/${thingName}/properties/${prop}`);
}

const writeProperty = (prop, value) => {
    return axios.put(`${baseUrl}/${thingName}/properties/${prop}`, value, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
const invokeAction = (action, value) => {
    return axios.post(`${baseUrl}/${thingName}/actions/${action}`, value, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            temperatureFeed: 0,
            temperatureOutside: 0,
            temperatureInside: 0,
            temperatureHe1: 0,
            temperatureHe2: 0,
            temperatureHe3: 0,
            valveStates: [],
            mode: 'autoWinter',
            hysteresis: 0,
            isSuperuser: false,
            token: ''
        };
        this.thing = undefined;
    }

    logout() {
        this.setToken('', '');
        this.setState({
            temperatureFeed: 0,
            temperatureOutside: 0,
            temperatureInside: 0,
            temperatureHe1: 0,
            temperatureHe2: 0,
            temperatureHe3: 0,
            valveStates: [],
            mode: 'autoWinter',
            hysteresis: 0,
            isSuperuser: false,
            token: ''
        });
    }

    isAuthenticated() {
        return !!this.state.token;
    }

    isSuperuser() {
        return this.state.isSuperuser;
    }

    setToken(token) {
        const cookies = new Cookies();
        cookies.set('token', token);
        this.setState({token}, () => {
            this.loadData();
            setInterval(() => this.loadData(), 10000);
        });
    }

    getToken({username = '', password = '', token = ''}) {
        if (!username && !password && !token) return;
        invokeAction('authenticate', {username, password, token})
            .then((response) => {
                if (!response.data.token) {
                    alert('Invalid login or password');
                    return
                }
                this.setState({isSuperuser: response.data.isSu});
                this.setToken(response.data.token);
            }).catch((err) => {
            console.error(err)
        })
    }

    getTokenAndPincodeFromStorage() {
        const cookies = new Cookies();
        const token = cookies.get('token');
        this.getToken({token});
    }

    loadData() {
        axios.all([
            getProperty('temperatureFeed'),
            getProperty('temperatureOutside'),
            getProperty('temperatureInside'),
            getProperty('temperatureHe1'),
            getProperty('temperatureHe2'),
            getProperty('temperatureHe3'),
            getProperty('mode'),
            getProperty('hysteresis'),
            getProperty('valveOpened1'),
            getProperty('valveOpened2'),
            getProperty('valveOpened3'),
            getProperty('valveOpened4')
        ])
            .then(axios.spread((
                temperatureFeed,
                temperatureOutside,
                temperatureInside,
                temperatureHe1,
                temperatureHe2,
                temperatureHe3,
                mode,
                hysteresis,
                valveOpened1,
                valveOpened2,
                valveOpened3,
                valveOpened4) => {
                this.setState({
                    temperatureFeed: temperatureFeed.data,
                    temperatureOutside: temperatureOutside.data,
                    temperatureInside: temperatureInside.data,
                    temperatureHe1: temperatureHe1.data,
                    temperatureHe2: temperatureHe2.data,
                    temperatureHe3: temperatureHe3.data,
                    mode: mode.data,
                    hysteresis: hysteresis.data,
                    valveStates: [valveOpened1.data, valveOpened2.data, valveOpened3.data, valveOpened4.data]
                })
            }))
            .catch(error => console.error(error));
    }

    async updateValveState(number) {
        let opened = await getProperty(`valveOpened${number}`);
        opened = opened.data;
        let valveStates = [...this.state.valveStates];
        valveStates[number - 1] = opened;
        this.setState({valveStates});
    }

    async openValve(number) {
        await invokeAction(`openValve${number}`, this.state.token);
    }

    async closeValve(number) {
        await invokeAction(`closeValve${number}`, this.state.token);
    }

    setHysteresis(hysteresis) {
        this.setState({hysteresis});
        writeProperty('hysteresis', hysteresis);
    }

    setMode(mode) {
        // TODO: get mode from rpi
        this.setState({mode});
        writeProperty('mode', mode);
    }

    setFeedTemperature(temperature) {
        this.setState({temperatureFeed: temperature});
        writeProperty('temperatureFeed', temperature);
    }

    componentDidMount() {
        this.getTokenAndPincodeFromStorage()
    }

    render() {
        return (
            <Router>
                <Menu isAuthenticated={this.isAuthenticated()}
                      isSuperuser={this.isSuperuser()}
                      logout={() => this.logout()}
                      username={this.isSuperuser() ? 'Бог' : 'Администратор'}
                />
                <Switch>
                    <Route exact path='/simple' component={() => {
                        if (!this.isAuthenticated()) return <Redirect to='/login'/>;
                        return <PageSimple temperatureFeed={this.state.temperatureFeed}
                                           temperatureOutside={this.state.temperatureOutside}
                                           temperatureInside={this.state.temperatureInside}
                                           temperatureHe1={this.state.temperatureHe1}
                                           temperatureHe2={this.state.temperatureHe2}
                                           temperatureHe3={this.state.temperatureHe3}
                                           setFeedTemperature={(temperature) => this.setFeedTemperature(temperature)}
                        />;
                    }}/>
                    <Route exact path='/advanced' component={() => {
                        if (!this.isAuthenticated()) return <Redirect to='/login'/>;
                        if (!this.isSuperuser()) return <Redirect to='/simple'/>;
                        return <PageAdvanced temperatureFeed={this.state.temperatureFeed}
                                             temperatureOutside={this.state.temperatureOutside}
                                             temperatureInside={this.state.temperatureInside}
                                             temperatureHe1={this.state.temperatureHe1}
                                             temperatureHe2={this.state.temperatureHe2}
                                             temperatureHe3={this.state.temperatureHe3}
                                             setFeedTemperature={(temperature) => this.setFeedTemperature(temperature)}
                                             valveStates={this.state.valveStates}
                                             updateValveState={(number) => this.updateValveState(number)}
                                             openValve={(number) => this.openValve(number)}
                                             closeValve={(number) => this.closeValve(number)}
                                             mode={this.state.mode}
                                             hysteresis={this.state.hysteresis}
                                             setHysteresis={(hysteresis) => this.setHysteresis(hysteresis)}
                                             setMode={(mode) => this.setMode(mode)}
                        />;
                    }}/>
                    <Route exact path='/login' component={() => {
                        if (this.isAuthenticated() && this.isSuperuser()) return <Redirect to='/advanced'/>;
                        if (this.isAuthenticated()) return <Redirect to='/'/>;
                        return <LoginForm
                            getAuth={(username, password) => this.getToken({username, password})}/>
                    }}/>
                    <Redirect from='/' to='/simple'/>
                    <Route component={NotFound}/>
                </Switch>
            </Router>
        )
    }
}

export default App;
