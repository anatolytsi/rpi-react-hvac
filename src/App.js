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

let crypto = require('crypto');

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
    return axios.post(`${baseUrl}/${thingName}/actions/${action}`, value);
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
            password: '',
            username: '',
            isSuperuser: false
        };
        this.thing = undefined;
    }

    logout() {
        this.setPassAndUser('', '');
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
            isSuperuser: false
        });
    }

    isAuthenticated() {
        return !!this.state.password;
    }

    isSuperuser() {
        return this.state.isSuperuser;
    }

    setPassAndUser(password, username) {
        const cookies = new Cookies();
        cookies.set('password', password);
        cookies.set('username', username);
        this.setState({password, username}, () => this.loadData());
    }

    getPassAndUser(username, password) {
        console.log('Authing')
        let usernames = [process.env.REACT_APP_USERNAME, process.env.REACT_APP_SU_USERNAME];
        let passwords = [process.env.REACT_APP_PASSWORD, process.env.REACT_APP_SU_PASSWORD];
        let userCorrect = usernames.indexOf(username) > -1;
        let passCorrect = passwords.indexOf(password) > -1;
        if (userCorrect && passCorrect) {
            if (username === usernames[1]) this.setState({isSuperuser: true});
            let passwordHash = crypto.createHash('md5').update(password).digest('hex');
            let usernameHash = crypto.createHash('md5').update(username).digest('hex');
            this.setPassAndUser(passwordHash, usernameHash);
            return
        }
        let usernamesHash = [
            crypto.createHash('md5').update(process.env.REACT_APP_USERNAME).digest('hex'),
            crypto.createHash('md5').update(process.env.REACT_APP_SU_USERNAME).digest('hex')
        ];
        let passwordsHash = [
            crypto.createHash(process.env.REACT_APP_PASSWORD).digest('hex'),
            crypto.createHash(process.env.REACT_APP_SU_PASSWORD).digest('hex')
        ];
        let userHashCorrect = usernamesHash.indexOf(username) > -1;
        let passHashCorrect = passwordsHash.indexOf(password) > -1;
        if (userHashCorrect && passHashCorrect) {
            if (username === usernamesHash[1]) this.setState({isSuperuser: true});
            this.setPassAndUser(password, username);
            return
        }
        alert('Invalid login or password');
    }

    getPassAndUserFromStorage() {
        const cookies = new Cookies();
        const username = cookies.get('username');
        const password = cookies.get('password');
        let usernameSuHash = crypto.createHash('md5').update(process.env.REACT_APP_SU_USERNAME).digest('hex');
        if (username === usernameSuHash) {
            this.setState({isSuperuser: true})
        }
        this.setState({password, username}, () => {
            this.loadData();
            setInterval(() => this.loadData(), 10000);
        });
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
        await invokeAction(`openValve${number}`);
    }

    async closeValve(number) {
        await invokeAction(`closeValve${number}`);
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
        this.getPassAndUserFromStorage()
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
                    <Route exact path='/complex' component={() => {
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
                        if (this.isAuthenticated() && this.isSuperuser()) return <Redirect to='/complex'/>;
                        if (this.isAuthenticated()) return <Redirect to='/'/>;
                        return <LoginForm getAuth={(username, password) => this.getPassAndUser(username, password)}/>
                    }}/>
                    <Redirect from='/' to='/simple'/>
                    <Route component={NotFound}/>
                </Switch>
            </Router>
        )
    }
}

export default App;
