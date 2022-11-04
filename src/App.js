import React, { Component, Fragment } from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";

import Layout from "./components/Layout/Layout";
import Backdrop from "./components/Backdrop/Backdrop";
import Toolbar from "./components/Toolbar/Toolbar";
import MainNavigation from "./components/Navigation/MainNavigation/MainNavigation";
import MobileNavigation from "./components/Navigation/MobileNavigation/MobileNavigation";
import ErrorHandler from "./components/ErrorHandler/ErrorHandler";
import FeedPage from "./pages/Feed/Feed";
import LoginPage from "./pages/Auth/Login";
import SignupPage from "./pages/Auth/Signup";
import "./App.css";
import RecoverPassword from "./pages/Auth/RecoverPassword";
import { projectSettings } from "./config";
import InfoBanner from "./components/InfoBanner/InfoBanner";

class App extends Component {
  state = {
    showBackdrop: false,
    showMobileNav: false,
    isAuth: false,
    token: null,
    userId: null,
    userName: null,
    authLoading: false,
    error: null,
    info: true,
    showModal: null,
  };

  componentDidMount() {
    const token = localStorage.getItem("token");
    const expiryDate = localStorage.getItem("expiryDate");
    if (!token || !expiryDate) {
      return;
    }
    if (new Date(expiryDate) <= new Date()) {
      this.logoutHandler();
      return;
    }
    const userId = localStorage.getItem("userId");
    const remainingMilliseconds =
      new Date(expiryDate).getTime() - new Date().getTime();
    this.setState({ isAuth: true, token: token, userId: userId });
    this.setAutoLogout(remainingMilliseconds);
  }

  mobileNavHandler = (isOpen) => {
    this.setState({ showMobileNav: isOpen, showBackdrop: isOpen });
  };

  backdropClickHandler = () => {
    this.setState({
      showBackdrop: false,
      showMobileNav: false,
      error: null,
    });
  };

  logoutHandler = () => {
    this.setState({ isAuth: false, token: null });
    localStorage.removeItem("token");
    localStorage.removeItem("expiresIn");
    localStorage.removeItem("expiryDate");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
  };

  loginHandler = (event, authData) => {
    event.preventDefault();
    this.setState({ authLoading: true });
    fetch(`${projectSettings.API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: authData.email,
        password: authData.password,
      }),
    })
      .then((res) => {
        if (authData.email === "" || authData.password === "") {
          throw new Error(
            "Parece que não introduziu todos os dados solicitados, verifique e volte a tentar!"
          );
        }

        if (res.status === 422) {
          throw new Error("Erro de validação.");
        }

        if (res.status !== 200 && res.status !== 201) {
          throw new Error(
            "Os dados introduzidos não se encontram corretos, verifique e volte a tentar. Obrigado"
          );
        }

        return res.json();
      })
      .then((resData) => {
        localStorage.setItem("token", resData.token);
        localStorage.setItem("userId", resData.userId);
        localStorage.setItem("userName", resData.userName);
        localStorage.setItem("userRole", resData.role || "");
        this.setState({
          isAuth: true,
          token: resData.token,
          authLoading: false,
          userId: resData.userId,
          userName: resData.userName,
        });

        const remainingMilliseconds = 86400000;
        const expiryDate = new Date(
          new Date().getTime() + remainingMilliseconds
        );
        localStorage.setItem("expiryDate", expiryDate.toISOString());
        this.setAutoLogout(remainingMilliseconds);
      })
      .catch((err) => {
        this.setState({
          isAuth: false,
          authLoading: false,
          error: err,
        });
      });
  };

  signupHandler = (event, authData) => {
    event.preventDefault();
    this.setState({ authLoading: true });
    fetch(`${projectSettings.API_URL}/auth/signup`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: authData.signupForm.email.value,
        password: authData.signupForm.password.value,
        name: `${authData.signupForm.name.value} ${authData.signupForm.sirname.value}`,
      }),
    })
      .then((res) => {
        if (res.status === 422) {
          throw new Error(
            "Ao que parece já existe uma conta com este email. Por favor, reponha a palavra se já não se lembra da mesma."
          );
        }
        if (res.status !== 200 && res.status !== 201) {
          throw new Error(
            "Ups, algo aconteceu e não nos foi possível criar o utilizador. Tente mais tarde, obrigado!"
          );
        }
        return res.json();
      })
      .then((resData) => {
        this.setState({ isAuth: false, authLoading: false });
        this.props.history.replace("/");
      })
      .catch((err) => {
        this.setState({
          isAuth: false,
          authLoading: false,
          error: err,
        });
      });
  };

  recoverHandler = (event, authData) => {
    event.preventDefault();
    this.setState({ authLoading: true });

    fetch(
      `${projectSettings.API_URL}/auth/recover/${authData.recoverForm.email.value}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: authData.recoverForm.password.value,
        }),
      }
    )
      .then((res) => {
        if (res.status === 422) {
          throw new Error(
            "Pedimos desculpa, ao que parece já existe uma conta com este email. Por favor, reponha a palavra se já não se lembra da mesma."
          );
        }
        if (res.status !== 200 && res.status !== 201) {
          throw new Error(
            "Ups, algo aconteceu e não nos foi possível repor a password. Tente mais tarde, obrigado!"
          );
        }
        return res.json();
      })
      .then((resData) => {
        this.setState({ isAuth: false, authLoading: false });
        this.props.history.replace("/");
      })
      .catch((err) => {
        this.setState({
          isAuth: false,
          authLoading: false,
          error: err,
        });
      });
  };

  setAutoLogout = (milliseconds) => {
    setTimeout(() => {
      this.logoutHandler();
    }, milliseconds);
  };

  errorHandler = () => {
    this.setState({ error: null });
  };

  infoHandler = () => {
    console.log(this.state.info);
    this.setState({ info: !this.state.info });
  };

  render() {
    let routes = (
      <Switch>
        <Route
          path="/"
          exact
          render={(props) => (
            <LoginPage
              {...props}
              onLogin={this.loginHandler}
              loading={this.state.authLoading}
            />
          )}
        />
        <Route
          path="/signup"
          exact
          render={(props) => (
            <SignupPage
              {...props}
              onSignup={this.signupHandler}
              loading={this.state.authLoading}
            />
          )}
        />
        <Route
          path="/recover"
          exact
          render={(props) => (
            <RecoverPassword
              {...props}
              onRecoverPassword={this.recoverHandler}
              loading={this.state.authLoading}
            />
          )}
        />
      </Switch>
    );
    if (this.state.isAuth) {
      routes = (
        <Switch>
          <Route
            path="/"
            exact
            render={(props) => (
              <FeedPage userId={this.state.userId} token={this.state.token} />
            )}
          />
          <Redirect to="/" />
        </Switch>
      );
    }

    return (
      <Fragment>
        {this.state.showBackdrop && (
          <Backdrop onClick={this.backdropClickHandler} />
        )}
        <ErrorHandler error={this.state.error} onHandle={this.errorHandler} />
        {this.state.info && !window.location.href.includes("/recover") && (
          <InfoBanner
            design="info"
            title="Informação"
            message="Todas as password foram repostas, por medidas de segurança. Pedimos que cada um faça a reposição da sua password através do link abaixo. Obrigado"
            link={`${projectSettings.APP_URL}/recover`}
            onHandle={this.infoHandler}
          />
        )}
        {this.state.isAuth && (
          <Layout
            header={
              <div>
                <Toolbar>
                  <MainNavigation
                    onOpenMobileNav={this.mobileNavHandler.bind(this, true)}
                    onLogout={this.logoutHandler}
                    isAuth={this.state.isAuth}
                  />
                </Toolbar>
                <h1>Dashboard</h1>
              </div>
            }
            mobileNav={
              <MobileNavigation
                open={this.state.showMobileNav}
                mobile
                onChooseItem={this.mobileNavHandler.bind(this, false)}
                onLogout={this.logoutHandler}
                isAuth={this.state.isAuth}
              />
            }
            main={routes}
          />
        )}
        {!this.state.isAuth && (
          <Layout header={null} mobileNav={null} main={routes} />
        )}
      </Fragment>
    );
  }
}

export default withRouter(App);
