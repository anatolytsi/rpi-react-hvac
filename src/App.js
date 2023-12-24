import React from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import axios from 'axios';
import './App.css'
import Cookies from 'universal-cookie/es6';
import MD5 from 'crypto-js/md5';

import LoginForm from './components/Auth/Auth';
import PageSimple from './components/PageSimple/PageSimple'
import PageAdvanced from './components/PageAdvanced/PageAdvanced';
import NotFound from './components/NotFound/NotFound';
import Menu from './components/Menu/Menu';

require('dotenv').config();

const baseUrl = process.env.REACT_APP_THING_HOST;
const getUrl = (path) => `${baseUrl}/${path}`;

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
            valveStates: [false, false, false, false],
            valveActiveStates: [true, true, true, true],
            mode: 'manual',
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
            valveStates: [false, false, false, false],
            valveActiveStates: [true, true, true, true],
            mode: 'manual',
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

    getHeaders() {
        let headers = {
            'Content-Type' : 'application/json',
            'Accept' : 'application/json'
        }
        if (this.isAuthenticated()) {
            headers['Authorization'] = `Basic ${this.state.token}`;
        }
        return headers;
    }

    setToken(token) {
        const cookies = new Cookies();
        cookies.set('token', token, {secure: true, sameSite: 'none'});
        this.setState({token}, () => {
            this.loadData();
            setInterval(() => this.loadData(), 10000);
        });
    }

    getToken({token, username, password}) {
        if (!(token || (username && password))) return;
        if (!token) {
            username = MD5(username).toString();
            password = MD5(password).toString();
            token = btoa(`${username}:${password}`);
        }
        axios.get(getUrl('suAccess'), {
            headers: {
                'Authorization': `Basic ${token}`
            }})
            .then((response) => {
                this.setState({isSuperuser: response.data});
                this.setToken(token);
            })
            .catch((err) => console.error(err));
    }

    getTokenFromStorage() {
        const cookies = new Cookies();
        const token = cookies.get('token');
        this.getToken({token});
    }

    loadData() {
        const headers = this.getHeaders();
        axios.get(getUrl('fullState'), {headers})
        .then((response) => {
            console.log(response)
            this.setState({
                temperatureFeed: response.data.feed_temperature,
                temperatureOutside: response.data.outside_temperature,
                temperatureInside: response.data.inside_temperature,
                temperatureHe1: response.data.he_temperatures[0],
                temperatureHe2: response.data.he_temperatures[1],
                temperatureHe3: response.data.he_temperatures[2],
                mode: response.data.mode,
                hysteresis: response.data.hysteresis,
                valveStates: [...response.data.valves_states],
                valveActiveStates: [...response.data.valves_activated_states]
            })
        })
        .catch(error => console.error(error));
    }

    async updateValveState(number) {
        const headers = this.getHeaders();
        let opened = await axios.get(getUrl(`valve/${number}`), {headers});
        opened = opened.data;
        let valveStates = [...this.state.valveStates];
        valveStates[number - 1] = opened;
        this.setState({valveStates});
    }

    async updateValveActiveState(number) {
        const headers = this.getHeaders();
        let valveActive = await axios.get(getUrl(`valveActivated/${number}`), {headers});
        valveActive = valveActive.data;
        let valveActiveStates = [...this.state.valveActiveStates];
        valveActiveStates[number - 1] = valveActive;
        this.setState({valveActiveStates});
    }

    async setValveActivated(number, activated) {
        const headers = this.getHeaders();
        await axios.post(
            getUrl(`valveActivated/${number}`),
            {'value': activated},
            {headers}
        );
    }

    async openValve(number) {
        const headers = this.getHeaders();
        await axios.post(
            getUrl(`valve/${number}`),
            {'action': 'open'},
            {headers}
        );
    }

    async closeValve(number) {
        const headers = this.getHeaders();
        await axios.post(
            getUrl(`valve/${number}`),
            {'action': 'close'},
            {headers}
        );
    }

    async setHysteresis(hysteresis) {
        const headers = this.getHeaders();
        await axios.post(
            getUrl('hysteresis'),
            {'value': hysteresis},
            {headers}
        );
        this.setState({hysteresis});
    }

    async setMode(mode) {
        // TODO: get mode from rpi
        const headers = this.getHeaders();
        await axios.post(
            getUrl('mode'),
            {'type': mode},
            {headers}
        );
        this.setState({mode});
    }

    async setFeedTemperature(temperature) {
        this.setState({temperatureFeed: temperature});
        const headers = this.getHeaders();
        await axios.post(
            getUrl('temperatureFeed'),
            {'value': temperature},
            {headers}
        );
    }

    componentDidMount() {
        this.getTokenFromStorage()
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
                                             setFeedTemperature={async (temperature) => await this.setFeedTemperature(temperature)}
                                             valveStates={this.state.valveStates}
                                             valveActiveStates={this.state.valveActiveStates}
                                             updateValveState={async (number) => await this.updateValveState(number)}
                                             setValveActivated={async (number, activated) => await this.setValveActivated(number, activated)}
                                             updateValveActiveState={async (number) => await this.updateValveActiveState(number)}
                                             openValve={async (number) => await this.openValve(number)}
                                             closeValve={async (number) => await this.closeValve(number)}
                                             mode={this.state.mode}
                                             hysteresis={this.state.hysteresis}
                                             setHysteresis={async (hysteresis) => await this.setHysteresis(hysteresis)}
                                             setMode={async (mode) => await this.setMode(mode)}
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
