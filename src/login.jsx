import React, { useState, useEffect, useContext, useRef } from "react"
import { userContex } from "./userContex";
import { type } from "@testing-library/user-event/dist/type";
let Login = (props) => {
    let [email, setEmail] = useState();
    let [password, setPassword] = useState();
    let [dirty, setDirty] = useState({
        email: false,
        password: false
    });
    let [errors, setErrors] = useState({
        email: [],
        password: []
    });
    let [massage, setMassage] = useState("");
    let myEmailRef = useRef();
    let userContext = useContext(userContex);
    useEffect(() => {
        document.title = "Login-Ecommerce";
        myEmailRef.current.focus();
    }, []);
    let validate = () => {
        const validEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
        const validPassword = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15})/;
        let errorsData = {};
        /* Object.keys(errors).forEach((v) => {
             errorsData[v] = [];
             switch (v) {
                 case "email":
                     if (!email) {
                         errorsData[v].push("ple enter email id");
                     }
                     if (email) {
                         if (!validEmail.test(email)) {
                             errorsData[v].push("enter proper email id");
                         }
 
                     }
                     break;
                 case "password":
                     if (!password) {
                         errorsData[v].push("ple enter password");
                     }
                     if (password) {
                         if (!validPassword.test(password)) {
                             errorsData[v].push("password contain at least 6 cheractor");
                         }
                     }
                     break;
                 default:
                     break;
             }
         });*/
        errorsData['email'] = [];
        errorsData['password'] = [];
        if (!email) {
            errorsData['email'].push("ple enter email id");
        }
        if (email) {
            if (!validEmail.test(email)) {
                errorsData['email'].push("enter proper email id");
            }

        }
        if (!password) {
            errorsData['password'].push("ple enter password");
        }
        if (password) {
            if (!validPassword.test(password)) {
                errorsData['password'].push("password contain at least 6 cheractor");
            }
        }
        //console.log(JSON.stringify(errorsData));
        setErrors(errorsData);
    }
    useEffect(validate, [email, password]);
    let isvalid = () => {
        let valid = true;
        for (let key in errors) {
            if (errors[key].length > 0) {
                valid = false;
            }
        }
        return valid;
    }
    let onClick = async () => {
        let newDirty = dirty;
        Object.keys(dirty).forEach((v) => {
            newDirty[v] = true;
        });
        setDirty(newDirty);
        validate();
        if (isvalid()) {
            console.log("isvalid", isvalid())
            let response = await fetch(`http://localhost:4500/users?email=${email}&password=${password}`, { method: "GET" });
            if (response.ok) {
                let body = await response.json();
                if (body.length > 0) {
                    console.log("body", body);
                    userContext.dispatch({
                        type: "login",
                        payload: {
                            //get methode will returen Array so here we are using index
                            currentUserId: body[0]["id"],
                            CurrentUserName: body[0]["fullName"],
                            currentUserRole: body[0]["role"]
                        }
                    });
                    if (body[0]["role"] == "user") {
                        props.history.replace("/dashBoard");
                    }
                    else {
                        props.history.replace("/adminProduct");
                    }
                }
                else {
                    setMassage("email id and password not match");
                }
            }
        }

        else {
            setMassage("Invalid data");
        }
    }
    return (
        <div className="login">
            <h1 className="text-center border-bottom">Login</h1>
            <p>
                <label htmlFor="txtEmail">Email:</label><br></br>
                <input type="text" id="txtEmail" name="email" placeholder="Email"
                    value={email}
                    onChange={(event) => {
                        setEmail(event.target.value);
                    }}
                    onBlur={(e) => {
                        setDirty({ ...dirty, [e.target.name]: true });
                        validate();
                    }}
                    ref={myEmailRef}
                />
            </p>
            <span className="text-danger">{dirty.email && errors['email'][0] ? errors['email'] : ""}</span>
            <p>
                <label htmlFor="pPassword">Password:</label><br></br>
                <input type="password" id="pPassword" name="password" placeholder="Password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                    onBlur={(e) => {
                        setDirty({ ...dirty, [e.target.name]: true });
                        validate();
                    }}
                />
            </p>
            <span className="text-danger">{dirty.password && errors["password"][0] ? errors["password"] : ""}</span>
            <p>
                {massage}
                <button className="btn btn-primary" onClick={onClick}>Login</button>
            </p>
        </div>
    )
}
export default Login;