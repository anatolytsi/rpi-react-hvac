import React from 'react';

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
    }

    changeHandler(event) {
        this.setState({[event.target.name]: event.target.value})
    }

    submitHandler(event) {
        event.preventDefault();
        this.props.getAuth(this.state.username, this.state.password);
    }

    render() {
        return (
            <div className='container-fluid h-100'>
                <div className='h-100 justify-content-center align-items-center d-flex'>
                    <form className='col-10' onSubmit={(event => this.submitHandler(event))}>
                        <div className='form-group'>
                            <label htmlFor='Login'>Логин</label>
                            <input type='text' placeholder='Логин' id='Login' name='username'
                                   className='form-control'
                                   onChange={(event) => this.changeHandler(event)}/>
                        </div>
                        <div className='form-group'>
                            <label htmlFor='Password'>Пароль</label>
                            <input type='password' placeholder='Пароль' id='Password' name='password'
                                   className='form-control'
                                   onChange={(event) => this.changeHandler(event)}/>
                        </div>
                        <button type='submit' className='btn btn-primary'>Войти</button>
                    </form>
                </div>
            </div>
        )
    }
}

export default LoginForm;
