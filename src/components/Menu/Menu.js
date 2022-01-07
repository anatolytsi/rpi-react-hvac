import React from 'react';
import {Link} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


class Menu extends React.Component {
    render() {
        return (
            <nav className='navbar navbar-expand-lg navbar-light bg-light'>
                <Link to='/' className='ms-2 navbar-brand mb-0 h1'>
                    Панели
                </Link>
                <div className='collapse navbar-collapse' id='navbarNavAltMarkup'>
                    <div className='navbar-nav'>
                        <Link to='/simple' className='nav-item nav-link active'>
                            Простая
                        </Link>
                        {this.props.isSuperuser ?
                            <Link to='/complex' className='nav-item nav-link active'>
                                Расширенная
                            </Link> :
                            <div></div>
                        }
                    </div>
                </div>
                {this.props.isAuthenticated ?
                    <a href='/#' onClick={() => {
                        this.props.logout()
                    }} className='ms-2 navbar-brand'>{`${this.props.username} | Выйти`}</a> :
                    <Link to='/login' className='ms-2 navbar-brand'>
                        Логин
                    </Link>
                }
            </nav>
        )
    }
}

export default Menu;
