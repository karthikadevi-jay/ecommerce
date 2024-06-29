import React, { useState, useEffect, useContext, useRef } from "react";
import { userContex } from "./userContex";
import { type } from "@testing-library/user-event/dist/type";
let Register = (props) => {
    let userContext = useContext(userContex);
    let [state, setState] = useState({
        email: "",
        password: "",
        fullName: "",
        dateOfBirth: "",
        gender: "",
        country: "",
        receiveNewsLetter: ""
    });
    let [countries] = useState([
        { id: 1, countryName: "India" },
        { id: 2, countryName: "USA" },
        { id: 3, countryName: "UK" },
        { id: 4, countryName: "Canada" },
        { id: 5, countryName: "China" },
        { id: 6, countryName: "Russia" }

    ]);
    let [errors, setErrors] = useState({
        email: [],
        password: [],
        fullName: [],
        dateOfBirth: [],
        gender: [],
        country: [],
        receiveNewsLetter: []
    });
    let [dirty, setDirty] = useState({
        email: false,
        password: false,
        fullName: false,
        dateOfBirth: false,
        gender: false,
        country: false,
        receiveNewsLetter: false
    });
    let [massage, setMassage] = useState("");
    let myEmailRef = useRef();
    let validate = () => {
        const validEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
        const validPassword = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15})/;
        let errorsData = {}
        Object.keys(errors).forEach((v) => {
            errorsData[v] = [];
            switch (v) {
                case "email":
                    if (!state.email) {
                        errorsData[v].push("ple enter the email");
                    }
                    if (state.email) {
                        if (!validEmail.test(state.email)) {
                            errorsData[v].push("Enter propper mail id");
                        }
                    }
                    break;
                case "password":
                    if (!state.password) {
                        errorsData[v].push("should not leave password empty");
                    }
                    if (state.password) {
                        if (!validPassword.test(state.password)) {
                            errorsData[v].push("must contain at least 16 character");
                        }
                    }
                    break;
                case "fullName":
                    if (!state.fullName) {
                        errorsData[v].push("ple enter your name");
                    }
                    break;
                case "dateOfBirth":
                    if (!state.dateOfBirth) {
                        errorsData[v].push("ple enter date of birth");
                    }
                    if (state.dateOfBirth) {
                        let dob = new Date(state.dateOfBirth).getTime();
                        let today = new Date().getTime();
                        if (today - (18 * 365.25 * 24 * 60 * 60 * 1000) < dob) {
                            errorsData[v].push("age must be greater than 18");
                        }
                    }
                    break;
                case "country":
                    if (!state.country) {
                        errorsData[v].push("ple select state");
                    }
                    break;
                default:
                    break;
            }
        });
        setErrors(errorsData);
    }
    useEffect(validate, [state]);
    useEffect(() => {
        document.title = "Register-Ecommerce";
        myEmailRef.current.focus();
    }, []);
    let isValid = () => {
        let valid = true;
        for (let key in errors) {
            if (errors[key].length > 0) {
                valid = false
            }
        }
        return valid;
    }
    let onRegistration = async () => {
        let newDirty = dirty;
        Object.keys(dirty).forEach((v) => {
            newDirty[v] = true;
        });
        setDirty(newDirty);
        validate();
        if (isValid()) {
            console.log("valid", isValid())
            let user = {
                email: state.email,
                password: state.password,
                fullName: state.fullName,
                dateOfBirth: state.dateOfBirth,
                gender: state.gender,
                country: state.country,
                receiveNewsLetter: state.receiveNewsLetter,
                role: "user"
            }
            let response = await fetch("http://localhost:4500/users", {
                method: "POST",
                body: JSON.stringify(user),
                headers: { "Content-type": "application/json" }
            });
            let body = await response.json();
            if (response.ok) {
                setMassage("successfully Register");
                userContext.dispatch({
                    type: "login",
                    payload: {
                        currentUserId: body.id,
                        CurrentUserName: body.fullName,
                        currentUserRole: body.role
                    }
                });
                if (body.role == "user") {
                    props.history.replace("/dashBoard");
                }
                else {
                    props.history.replace("/adminProduct");
                }
            }
            else {
                setMassage("Error in Registration");
            }

        }
        else {
            setMassage("Invalid Data");
        }
    }
    return (
        <div className="register-form">
            <h2 className="text-center border-bottom">Register</h2>
            <div className="text-danger">
                <ul>
                    {Object.keys(errors).map((v) => {
                        if (dirty[v]) {
                            return errors[v].map((err) => {
                                return <li key={err}>{err}</li>
                            });
                        }
                        else {
                            return "";
                        }
                    })}

                </ul>
            </div>
            <p>
                <label htmlFor="txtEmail">Email:</label>
                <input type="text" id="txtEmail" name="email"
                    value={state.email}
                    onChange={(e) => {
                        setState({ ...state, [e.target.name]: e.target.value });
                    }}
                    onBlur={(e) => {
                        setDirty({ ...dirty, [e.target.name]: true });
                        validate();
                    }}
                    ref={myEmailRef}
                />
            </p>
            <div className="text-danger">
                {dirty.email && errors.email[0] ? errors.email : ""}
            </div>
            <p>
                <label htmlFor="pPassword">Password:</label>
                <input type="password" id="pPassword" name="password"
                    value={state.password}
                    onChange={(e) => {
                        setState({ ...state, [e.target.name]: e.target.value });
                    }}
                    onBlur={(e) => {
                        setDirty({ ...dirty, [e.target.name]: true });
                        validate();
                    }}
                />
            </p>
            <div className="text-danger">
                {dirty.password && errors.password[0] ? errors["password"] : ""}
            </div>
            <p>
                <label htmlFor="txtFullName">Full Name:</label>
                <input type="text" id="txtFullName" name="fullName"
                    value={state.fullName}
                    onChange={(e) => {
                        setState({ ...state, fullName: e.target.value });
                    }}
                    onBlur={(e) => {
                        setDirty({ ...dirty, fullName: true });
                        validate();
                    }}
                />
            </p>
            <div className="text-danger">
                {dirty.fullName && errors.fullName[0] ? errors["fullName"] : ""}
            </div>
            <p>
                <label htmlFor="dDob">DOB:</label>
                <input type="date" id="dDob" name="dateOfBirth"
                    value={state.dateOfBirth}
                    onChange={(e) => {
                        setState({ ...state, dateOfBirth: e.target.value });
                    }}
                    onBlur={(e) => {
                        setDirty({ ...dirty, dateOfBirth: true });
                        validate();
                    }}
                />
            </p>
            <div className="text-danger">
                {dirty.dateOfBirth && errors.dateOfBirth[0] ? errors.dateOfBirth : ""}
            </div>
            <p>
                <label>Gender:</label>
                <input type="radio" id="rMale" name="gender"
                    value="male"
                    checked={state.gender === "male" ? true : false}
                    onChange={(e) => {
                        setState({ ...state, gender: e.target.value });
                    }}
                    onBlur={(e) => {
                        setDirty({ ...dirty, gender: true });
                        validate();
                    }}
                />
                <label htmlFor="rMale">Male</label>
                <input type="radio" id="rFemale" name="gender"
                    value="female"
                    checked={state.gender === "female" ? true : false}
                    onChange={(e) => {
                        setState({ ...state, gender: e.target.value });
                    }}
                    onBlur={(e) => {
                        setDirty({ ...dirty, gender: true });
                        validate();
                    }}
                />
                <label htmlFor="rFemale">Female</label>
            </p>
            <div className="text-danger">
                {dirty.gender && errors["gender"][0] ? errors["gender"] : ""}
            </div>
            <p>
                <label htmlFor="sCountry">Country:</label>
                <select id="sCountry" name="country" value={state.country}
                    onChange={(e) => {
                        setState({ ...state, country: e.target.value });
                    }}
                    onBlur={(e) => {
                        setDirty({ ...dirty, country: true });
                        validate();
                    }}
                >
                    <option>select one</option>
                    {countries.map((country) => (
                        <option key={country.id} value={country.countryName}>{country.countryName}</option>
                    ))}
                </select>
            </p>
            <div className="text-danger">
                {dirty.country && errors.country[0] ? errors.country : ""}
            </div>
            <p>
                <input type="checkbox" id="checked" name="receiveNewsLetter"
                    value="true"
                    checked={state.receiveNewsLetter === true ? true : false}
                    onChange={(e) => {
                        setState({ ...state, receiveNewsLetter: e.target.checked });
                    }}
                />
                <label htmlFor="checked">Recive News Letter</label>
            </p>
            <p>
                {massage}
            </p>
            <p>
                <button className="btn btn-primary" onClick={onRegistration}>Register</button>
            </p>
        </div>
    )
}
export default Register;