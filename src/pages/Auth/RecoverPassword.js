import React, { Component } from "react";

import Input from "../../components/Form/Input/Input";
import Button from "../../components/Button/Button";
import { required, length } from "../../util/validators";
import Auth from "./Auth";

class RecoverPassword extends Component {
  state = {
    recoverForm: {
      password: {
        value: "",
        valid: false,
        touched: false,
        validators: [required, length({ min: 5 })],
      },
      email: {
        value: "",
        valid: false,
        touched: false,
        validators: [required],
      },
      formIsValid: false,
    },
  };

  inputChangeHandler = (input, value) => {
    this.setState((prevState) => {
      let isValid = true;
      for (const validator of prevState.recoverForm[input].validators) {
        isValid = isValid && validator(value);
      }
      const updatedForm = {
        ...prevState.recoverForm,
        [input]: {
          ...prevState.recoverForm[input],
          valid: isValid,
          value: value,
        },
      };
      let formIsValid = true;
      for (const inputName in updatedForm) {
        formIsValid = formIsValid && updatedForm[inputName].valid;
      }
      return {
        recoverForm: updatedForm,
        formIsValid: formIsValid,
      };
    });
  };

  inputBlurHandler = (input) => {
    this.setState((prevState) => {
      return {
        recoverForm: {
          ...prevState.recoverForm,
          [input]: {
            ...prevState.recoverForm[input],
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
          <h1>Reposiçao Password</h1>
          <hr></hr>
          <p>
            Utilize o formulário para repor a sua password, após submissão do
            mesmo poderá efetuar login com a nova password. Obrigado
          </p>
          <hr></hr>
          <form onSubmit={(e) => this.props.onRecoverPassword(e, this.state)}>
            <Input
              id="email"
              label="Email"
              control="email"
              onChange={this.inputChangeHandler}
              onBlur={this.inputBlurHandler.bind(this, "email")}
              value={this.state.recoverForm["email"].value}
              valid={this.state.recoverForm["email"].valid}
              touched={this.state.recoverForm["email"].touched}
            />
            <Input
              id="password"
              label="Nova Password"
              control="password"
              onChange={this.inputChangeHandler}
              onBlur={this.inputBlurHandler.bind(this, "password")}
              value={this.state.recoverForm["password"].value}
              valid={this.state.recoverForm["password"].valid}
              touched={this.state.recoverForm["password"].touched}
            />
            <Button design="success" type="submit" loading={this.props.loading}>
              Confirmar
            </Button>
          </form>
        </Auth>
      </div>
    );
  }
}

export default RecoverPassword;
