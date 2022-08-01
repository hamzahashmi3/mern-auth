import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

const Layout = ({ children}) => {
    
    const nav = () => (
        <ul className="nav nav-tabs bg-primary">
            <li className="nav-item">
                <Link to="/" className="nav-link text-light">
                    Home
                </Link>
            </li>
            <li className="nav-item">
                <Link to="/signin" className="nav-link text-light">
                    Signin
                </Link>
            </li>
            <li className="nav-item">
                <Link to="/signup" className="nav-link text-light">
                    Signup
                </Link>
            </li>
        </ul>
    );

    return (
        <Fragment>
            {nav()}
            <div className="container">{children}</div>
        </Fragment>
    );
};

export default Layout;