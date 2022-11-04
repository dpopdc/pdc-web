import React, { Component } from "react";
import { Link } from 'react-router-dom'

import Input from "../../components/Form/Input/Input";
import Button from "../../components/Button/Button";
import { required, length, email } from "../../util/validators";
import Auth from "./Auth";
import './Login.css'

import { RiEyeCloseLine } from 'react-icons/ri'

class Login extends Component {
    state = {
        loginForm: {
            email: {
                value: "",
                valid: false,
                touched: false,
                validators: [required, email],
            },
            password: {
                value: "",
                valid: false,
                touched: false,
                validators: [required, length({ min: 5 })],
            },
            formIsValid: false,
        },
    };

    inputChangeHandler = (input, value) => {
        this.setState((prevState) => {
            let isValid = true;
            for (const validator of prevState.loginForm[input].validators) {
                isValid = isValid && validator(value);
            }
            const updatedForm = {
                ...prevState.loginForm,
                [input]: {
                    ...prevState.loginForm[input],
                    valid: isValid,
                    value: value,
                },
            };
            let formIsValid = true;
            for (const inputName in updatedForm) {
                formIsValid = formIsValid && updatedForm[inputName].valid;
            }
            return {
                loginForm: updatedForm,
                formIsValid: formIsValid,
            };
        });
    };

    inputBlurHandler = (input) => {
        this.setState((prevState) => {
            return {
                loginForm: {
                    ...prevState.loginForm,
                    [input]: {
                        ...prevState.loginForm[input],
                        touched: true,
                    },
                },
            };
        });
    };

    render() {
        return (
            <div className="auth-container">
                <Auth>
                    <h1>Bem-Vindo</h1>
                    <hr></hr>
                    <p>Introduza os seus dados para iniciar sessão.</p>
                    <hr></hr>
                    <form
                        onSubmit={(e) =>
                            this.props.onLogin(e, {
                                email: this.state.loginForm.email.value,
                                password: this.state.loginForm.password.value,
                            })
                        }
                    >
                        <Input
                            id="email"
                            label="Email"
                            type="email"
                            control="text"
                            onChange={this.inputChangeHandler}
                            onBlur={this.inputBlurHandler.bind(this, "email")}
                            value={this.state.loginForm["email"].value}
                            valid={this.state.loginForm["email"].valid}
                            touched={this.state.loginForm["email"].touched}
                        />
                        <Input
                            id="password"
                            label="Password"
                            type="password"
                            control="password"
                            onChange={this.inputChangeHandler}
                            onBlur={this.inputBlurHandler.bind(
                                this,
                                "password"
                            )}
                            value={this.state.loginForm["password"].value}
                            valid={this.state.loginForm["password"].valid}
                            touched={this.state.loginForm["password"].touched}
                        />
                        <Button
                            design="raised"
                            type="submit"
                            loading={this.props.loading}
                        >
                            Iniciar Sessão
                        </Button>
                    </form>
                    <Link to="/signup" className="info__message">Ainda não tem conta?</Link>
                </Auth>
            </div>
        );
    }
}

export default Login;
