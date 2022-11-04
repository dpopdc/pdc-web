import React, { Component, Fragment } from "react";

import { required, length } from "../../../util/validators";
import MultiForm from "../../MultiForm/MultiForm";

const POST_FORM = {
    _id: {
        value: "",
        valid: false,
        touched: false,
        validators: [required, length({ min: 1 })],
    },
    group: {
        value: "",
        valid: false,
        touched: false,
        validators: [required],
    },
    name: {
        value: "",
        valid: false,
        touched: false,
        validators: [required, length({ min: 5 })],
    },
    birthDate: {
        value: "",
        valid: false,
        touched: false,
        validators: [required],
    },
    address: {
        value: "",
        valid: false,
        touched: false,
        validators: [required],
    },
    baptismDate: {
        value: "",
        valid: false,
        touched: false,
        validators: [required],
    },
    baptismParish: {
        value: "",
        valid: false,
        touched: false,
        validators: [required],
    },
    baptismDiocese: {
        value: "",
        valid: false,
        touched: false,
        validators: [required],
    },
    mom: {
        name: {
            value: "",
            valid: false,
            touched: false,
            validators: [required, length({ min: 5 })],
        },
        address: {
            value: "",
            valid: false,
            touched: false,
            validators: [required],
        },
        email: {
            value: "",
            valid: false,
            touched: false,
            validators: [required],
        },
        contact: {
            value: "",
            valid: false,
            touched: false,
            validators: [required],
        },
    },
    dad: {
        name: {
            value: "",
            valid: false,
            touched: false,
            validators: [required, length({ min: 5 })],
        },
        address: {
            value: "",
            valid: false,
            touched: false,
            validators: [required],
        },
        email: {
            value: "",
            valid: false,
            touched: false,
            validators: [required],
        },
        contact: {
            value: "",
            valid: false,
            touched: false,
            validators: [required, length({ min: 9 })],
        },
    },
    other: {
        details: {
            value: "",
            valid: false,
            touched: false,
            validators: []
        },
        catechism: {
            value: null,
            valid: false,
            touched: false,
            validators: [required],
        },
        guardian: {
            value: null,
            valid: false,
            touched: false,
            validators: [required],
        },
    }
};

class FeedEdit extends Component {
    state = {
        postForm: POST_FORM,
        formIsValid: false,
        imagePreview: null,
    };

    componentDidUpdate(prevProps, prevState) {
        console.log(this.props.selectedPost)

        if (
            this.props.editing &&
            prevProps.editing !== this.props.editing &&
            prevProps.selectedPost !== this.props.selectedPost
        ) {
            const postForm = {
                _id: {
                    ...prevState.postForm._id,
                    value: this.props.selectedPost._id,
                    valid: true,
                },
                group: {
                    ...prevState.postForm.group,
                    value: this.props.selectedPost.group,
                    valid: true,
                },
                name: {
                    ...prevState.postForm.name,
                    value: this.props.selectedPost.name,
                    valid: true,
                },
                birthDate: {
                    ...prevState.postForm.birthDate,
                    value: this.props.selectedPost.birthDate,
                    valid: true,
                },
                address: {
                    ...prevState.postForm.address,
                    value: this.props.selectedPost.address,
                    valid: true,
                },
                baptismDate: {
                    ...prevState.postForm.baptismDate,
                    value: this.props.selectedPost.baptismDate,
                    valid: true,
                },
                baptismParish: {
                    ...prevState.postForm.baptismParish,
                    value: this.props.selectedPost.baptismParish,
                    valid: true,
                },
                baptismDiocese: {
                    ...prevState.postForm.baptismDiocese,
                    value: this.props.selectedPost.baptismDiocese,
                    valid: true,
                },
                mom: {
                    name: {
                        ...prevState.postForm.mom.name,
                        value: this.props.selectedPost.mom.name,
                        valid: true,
                    },
                    address: {
                        ...prevState.postForm.mom.address,
                        value: this.props.selectedPost.mom.address,
                        valid: true,
                    },
                    email: {
                        ...prevState.postForm.mom.email,
                        value: this.props.selectedPost.mom.email,
                        valid: true,
                    },
                    contact: {
                        ...prevState.postForm.mom.contact,
                        value: this.props.selectedPost.mom.contact,
                        valid: true,
                    },
                },
                dad: {
                    name: {
                        ...prevState.postForm.dad.name,
                        value: this.props.selectedPost.dad.name,
                        valid: true,
                    },
                    address: {
                        ...prevState.postForm.dad.address,
                        value: this.props.selectedPost.dad.address,
                        valid: true,
                    },
                    email: {
                        ...prevState.postForm.dad.email,
                        value: this.props.selectedPost.dad.email,
                        valid: true,
                    },
                    contact: {
                        ...prevState.postForm.dad.contact,
                        value: this.props.selectedPost.dad.contact,
                        valid: true,
                    },
                },
                other: {
                    details: {
                        ...prevState.postForm.other.details,
                        value: this.props.selectedPost.other.details,
                        valid: true,
                    },
                    catechism: {
                        ...prevState.postForm.other.catechism,
                        value: this.props.selectedPost.other.catechism,
                        valid: true,
                    },
                    guardian: {
                        ...prevState.postForm.guardian,
                        value: this.props.selectedPost.other.guardian,
                        valid: true,
                    },
                }
            };
            this.setState({ postForm: postForm, formIsValid: true });
        }
    }

    postInputChangeHandler = (input, value, parent) => {
        this.setState((prevState) => {
            let isValid = true;
            let updatedForm = null;

            if (parent !== undefined) {
                for (const validator of prevState.postForm[parent][input]
                    .validators) {
                    isValid = isValid && validator(value);
                }

                updatedForm = {
                    ...prevState.postForm,
                    [parent]: {
                        ...prevState.postForm[parent],
                        [input]: {
                            ...prevState.postForm[parent][input],
                            value: value,
                            valid: isValid,
                        },
                    },
                };
            }

            if (parent === undefined) {
                for (const validator of prevState.postForm[input].validators) {
                    isValid = isValid && validator(value);
                }

                updatedForm = {
                    ...prevState.postForm,
                    [input]: {
                        ...prevState.postForm[input],
                        value: value,
                        valid: isValid,
                    },
                };
            }

            let formIsValid = true;
            for (const inputName in updatedForm) {
                formIsValid = formIsValid && updatedForm[inputName].valid;
            }
            return {
                postForm: updatedForm,
                formIsValid: formIsValid,
            };
        });
    };

    inputBlurHandler = (input) => {
        this.setState((prevState) => {
            return {
                postForm: {
                    ...prevState.postForm,
                    [input]: {
                        ...prevState.postForm[input],
                        touched: true,
                    },
                },
            };
        });
    };

    cancelPostChangeHandler = () => {
        this.setState({
            postForm: POST_FORM,
            formIsValid: false,
        });
        this.props.onCancelEdit();
    };

    acceptPostChangeHandler = () => {
        const post = {
            ...this.state.postForm
        };
        this.props.onFinishEdit(post);
        this.setState({
            postForm: POST_FORM,
            formIsValid: false,
            imagePreview: null,
        });
    };

    render() {
        return this.props.editing || this.props.adding ? (
            <Fragment>
                <section>
                    <MultiForm
                        cancelPostChangeHandler={this.cancelPostChangeHandler}
                        acceptPostChangeHandler={this.acceptPostChangeHandler}
                        inputChangeHandler={this.postInputChangeHandler}
                        inputBlurHandler={this.inputBlurHandler}
                        values={this.state.postForm}
                        isEditing={this.props.editing}
                    />
                </section>
            </Fragment>
        ) : null;
    }
}

export default FeedEdit;
