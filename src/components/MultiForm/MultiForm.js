import React, { Component } from "react";
import "./MultiForm.css";
import Pager from "../Pager/Pager";

import PupilDetails from "./PupilDetails";
import ParentsDetails from "./ParentsDetails";
import OtherDetails from "./OtherDetails";

class MultiForm extends Component {
    state = {
        step: 1,
        disabled: false
    };
    // go back to previous step
    prevStep = () => {
        const currentStep = this.state.step;
        this.setState({ step: currentStep - 1 });
    };

    // proceed to the next step
    nextStep = () => {
        const currentStep = this.state.step;
        this.setState({ step: currentStep + 1 });
    };

    handleDisabled = (value) => {
        this.setState({disabled: value})
    }

    render() { 
        return (
            <Pager
                onClose={this.props.cancelPostChangeHandler}
                onSubmit={this.props.acceptPostChangeHandler}
                handleNext={this.nextStep}
                handlePrevious={this.prevStep}
                currentPage={this.state.step}
                disabled={this.props.isEditing ? false : this.state.disabled}
            >
                {this.state.step === 1 && (
                    <PupilDetails
                        handleChange={this.props.inputChangeHandler}
                        handleBluer={this.props.inputBlurHandler}
                        handleDisabled={this.handleDisabled}
                        values={this.props.values}
                    />
                )}
                {this.state.step === 2 && (
                    <ParentsDetails
                        handleChange={this.props.inputChangeHandler}
                        handleBluer={this.props.inputBlurHandler}
                        handleDisabled={this.handleDisabled}
                        values={this.props.values}
                    />
                )}
                {this.state.step === 3 && (
                    <OtherDetails
                        handleChange={this.props.inputChangeHandler}
                        handleBluer={this.props.inputBlurHandler}
                        handleDisabled={this.handleDisabled}
                        values={this.props.values}
                    />
                )}
            </Pager>
        );
    }
}

export default MultiForm;
