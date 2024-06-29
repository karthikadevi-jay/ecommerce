import React, { useReducer } from "react";
import Login from "./login";
import Register from "./register";
import DashBoard from "./dashBoard";
import NoMatchPage from "./noMatchPage";
import { HashRouter } from "react-router-dom";
import { Route, Switch } from "react-router-dom";
import NavBar from "./navBar";
import { userContex } from "./userContex";
import Store from "./store";
import AdminProduct from "./adminProduct";
let initialUser = {
    isLoggedIn: false,
    currentUserId: null,
    CurrentUserName: null,
    currentUserRole: null
}
let reducer = (state, action) => {
    switch (action.type) {
        case "login":
            return {
                isLoggedIn: true,
                currentUserId: action.payload.currentUserId,
                CurrentUserName: action.payload.CurrentUserName,
                currentUserRole: action.payload.currentUserRole
            };
        case "logout":
            return {
                isLoggedIn: false,
                currentUserId: null,
                CurrentUserName: null,
                currentUserRole: null
            }
        default:
            return state;
    }
}
function App() {
    let [user, dispatch] = useReducer(reducer, initialUser);
    return (
        <userContex.Provider value={{ user, dispatch }}>
            <HashRouter>
                <NavBar />
                <div className="container-fluid">
                    <Switch>
                        <Route path="/" exact component={Login} />
                        <Route path="/register" exact component={Register} />
                        <Route path="/dashBoard" exact component={DashBoard} />
                        <Route path="/store" exact component={Store} />
                        <Route path="/adminProduct" exact component={AdminProduct} />
                        <Route path="*" component={NoMatchPage} />
                    </Switch>
                </div>
            </HashRouter>
        </userContex.Provider>
    )
}
export default App;