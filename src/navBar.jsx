import React, { useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import { userContex } from "./userContex";

let NavBar = () => {
    let userContext = useContext(userContex);
    let handleLogout = (event) => {
        event.preventDefault();
        userContext.dispatch({
            type: "logout"
        });
        document.location.hash = "/";

    }
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark navBar-style">
            <a className="navbar-brand" href="/#">E-Commerce</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    {!userContext.user.isLoggedIn ? (<li className="nav-item">
                        <NavLink className="nav-link" to="/" activeClassName="active" exact={true}>Login</NavLink>
                    </li>) : ""}
                    {!userContext.user.isLoggedIn ? (<li className="nav-item">
                        <NavLink className="nav-link" to="/register" activeClassName="active">Register</NavLink>
                    </li>) : ""}
                    {userContext.user.isLoggedIn && userContext.user.currentUserRole == "user" ? (<li className="nav-item">
                        <NavLink className="nav-link" to="/dashBoard" activeClassName="active">
                            <i className="fa fa-dashboard mr-1"></i>Dash Board
                        </NavLink>
                    </li>) : ""}
                    {userContext.user.isLoggedIn && userContext.user.currentUserRole == "user" ? (<li className="nav-item">
                        <NavLink to="/store" className="nav-link" activeClassName="active">
                            <i className="fa fa-shopping-bag mr-1"></i>Store</NavLink>
                    </li>) : ""}
                    {userContext.user.isLoggedIn && userContext.user.currentUserRole == "admin" ? (<li className="nav-item">
                        <NavLink to="/adminProduct" className="nav-link" activeClassName="active">
                            <i className="fa fa-suitcase">{" "}Products</i></NavLink>
                    </li>) : ""}

                </ul>
                <div style={{ marginRight: 100 }}>
                    <ul>
                        {userContext.user.isLoggedIn ? (<li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="/#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="fa fa-user-circle"></i>{userContext.user.CurrentUserName}
                            </a>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <a className="dropdown-item" href="/#" onClick={handleLogout}>Logout</a>
                            </div>
                        </li>) : ""}
                    </ul>
                </div>

            </div>
        </nav>
    )
}
export default NavBar;