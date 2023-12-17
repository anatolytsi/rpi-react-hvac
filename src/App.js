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
            valveStates: [],
            valveActiveStates: [],
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
            valveActiveStates: [],
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
        axios.all([
            axios.get(getUrl('temperatureFeed'), {headers}),
            axios.get(getUrl('temperatureOutside'), {headers}),
            axios.get(getUrl('temperatureInside'), {headers}),
            axios.get(getUrl('temperatureHe/1'), {headers}),
            axios.get(getUrl('temperatureHe/2'), {headers}),
            axios.get(getUrl('temperatureHe/3'), {headers}),
            axios.get(getUrl('mode'), {headers}),
            axios.get(getUrl('hysteresis'), {headers}),
            axios.get(getUrl('valve/1'), {headers}),
            axios.get(getUrl('valve/2'), {headers}),
            axios.get(getUrl('valve/3'), {headers}),
            axios.get(getUrl('valve/4'), {headers}),
            axios.get(getUrl('valveActivated/1'), {headers}),
            axios.get(getUrl('valveActivated/2'), {headers}),
            axios.get(getUrl('valveActivated/3'), {headers}),
            axios.get(getUrl('valveActivated/4'), {headers})
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
                valveOpened4,
                valveActivated1,
                valveActivated2,
                valveActivated3,
                valveActivated4) => {
                this.setState({
                    temperatureFeed: temperatureFeed.data,
                    temperatureOutside: temperatureOutside.data,
                    temperatureInside: temperatureInside.data,
                    temperatureHe1: temperatureHe1.data,
                    temperatureHe2: temperatureHe2.data,
                    temperatureHe3: temperatureHe3.data,
                    mode: mode.data,
                    hysteresis: hysteresis.data,
                    valveStates: [valveOpened1.data, valveOpened2.data, valveOpened3.data, valveOpened4.data],
                    valveActiveStates: [valveActivated1.data, valveActivated2.data, valveActivated3.data, valveActivated4.data]
                })
            }))
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
