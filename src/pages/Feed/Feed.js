import React, { Component, Fragment } from "react";

import Post from "../../components/Feed/Post/Post";
import FeedEdit from "../../components/Feed/FeedEdit/FeedEdit";
import Paginator from "../../components/Paginator/Paginator";
import Loader from "../../components/Loader/Loader";
import ModalHandler from "../../components/ModalHandler/ModalHandler";
import Backdrop from "../../components/Backdrop/Backdrop";

import "./Feed.css";

import { AiFillPlusCircle } from "react-icons/ai";
import { FaUsers } from "react-icons/fa";
import { GrInProgress, GrAlert, GrCheckmark, GrSearch } from "react-icons/gr";
import Tooltip from "../../components/Tooltip/Tooltip";
import { projectSettings } from "../../config";

class Feed extends Component {
    state = {
        isEditing: false,
        isAdding: false,
        pupils: [],
        filteredPupils: null,
        totalPosts: 0,
        editPost: null,
        pupilPage: 1,
        pupilsLoading: true,
        editLoading: false,
        isAdmin: localStorage.getItem("userRole") === "admin" ? true : false,
        showModal: false,
        pupil: null
    };

    componentDidMount() {
        this.loadPosts();
    }

    loadPosts = (direction) => {
        if (direction) {
            this.setState({ pupilsLoading: true, pupils: [] });
        }
        let page = this.state.pupilPage;
        if (direction === "next") {
            page++;
            this.setState({ pupilPage: page });
        }
        if (direction === "previous") {
            page--;
            this.setState({ pupilPage: page });
        }

        const url = this.state.isAdmin
            ? `${projectSettings.API_URL}/pupils/all`
            : `${projectSettings.API_URL}/pupils/${localStorage.getItem(
                "userId"
            )}/all?page=${page}`;

        fetch(`${url}`, {
            headers: {
                Authorization: "Bearer " + this.props.token,
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                if (res.status !== 200) {
                    throw new Error("Failed to fetch pupils.");
                }
                return res.json();
            })
            .then((resData) => {
                const pupils = resData.pupils;
                this.setState({
                    pupils: pupils.map((pupil) => {
                        return {
                            ...pupil,
                        };
                    }),
                    totalPosts: resData.totalItems,
                    pupilsLoading: false,
                });
            })
            .catch(this.catchError);
    };

    newPostHandler = () => {
        this.setState({ isAdding: true });
    };

    startEditPostHandler = (pupilId) => {
        this.setState((prevState) => {
            const pupil = {
                ...prevState.pupils.filter(pupil => pupil._id === pupilId)[0]
            };

            return {
                isEditing: true,
                editPost: pupil,
            };
        });
    };

    cancelEditHandler = () => {
        this.setState({ isEditing: false, isAdding: false, editPost: null });
    };

    finishEditHandler = (postData) => {
        this.setState({
            editLoading: true,
        });
        const formData = {};
        for (const input in postData) {
            if (input === "mom" || input === "dad" || input === "other") {
                for (const sub in postData[input]) {
                    formData[input] = {
                        ...formData[input],
                        [sub]: `${postData[input][sub].value}`,
                    };
                }
            } else {
                formData[input] = `${postData[input].value}`;
            }
        }

        formData.state = { status: "renewed", label: "Inscrito" };
        formData.creator = {
            name: localStorage.getItem("userName"),
            id: localStorage.getItem("userId"),
        };

        let url = `${projectSettings.API_URL}/pupils/add`;
        let method = "POST";
        if (this.state.editPost) {
            url = `${projectSettings.API_URL}/pupils/edit/${this.state.editPost._id}`;
            method = "PUT";
        }

        fetch(url, {
            method: method,
            body: JSON.stringify(formData),
            headers: {
                Authorization: "Bearer " + this.props.token,
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error("Creating or editing a post failed!");
                }
                return res.json();
            })
            .then((resData) => {
                const pupil = {
                    _id: resData.pupil._id,
                    name: resData.pupil.name,
                    state: resData.pupil.state,
                    birthDate: resData.pupil.birthDate,
                    group: resData.pupil.group,
                    address: resData.pupil.address,
                    baptismDate: resData.pupil.baptismDate,
                    baptismParish: resData.pupil.baptismParish,
                    baptismDiocese: resData.pupil.baptismDiocese,
                    mom: resData.pupil.mom,
                    dad: resData.pupil.dad,
                    other: resData.pupil.other,
                    file: null,
                    creator: resData.pupil.creator,
                };

                this.setState((prevState) => {
                    let updatedPupils = [...prevState.pupils];
                    if (prevState.editPost) {
                        const postIndex = prevState.pupils.findIndex(
                            (p) => p._id === prevState.editPost._id
                        );
                        updatedPupils[postIndex] = pupil;
                    } else if (prevState.pupils.length < 2) {
                        updatedPupils = prevState.pupils.concat(pupil);
                    }
                    return {
                        pupils: updatedPupils,
                        isEditing: false,
                        editPost: null,
                        editLoading: false,
                    };
                });
            })
            .catch((err) => {
                this.setState({
                    isEditing: false,
                    editPost: null,
                    editLoading: false
                });
            });
    };

    deletePupilHandler = (pupilId) => {
        this.setState({ pupilsLoading: true });
        fetch(`${projectSettings.API_URL}/pupils/remove/${pupilId}`, {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + this.props.token,
            },
        })
            .then((res) => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error("Deleting a post failed!");
                }
                return res.json();
            })
            .then((resData) => {
                this.setState((prevState) => {
                    const updatedPosts = prevState.pupils.filter(
                        (p) => p._id !== pupilId
                    );
                    return { pupils: updatedPosts, pupilsLoading: false };
                });
            })
            .catch((err) => {
                this.setState({ pupilsLoading: false });
            });
    };

    filterPupilsHandler = (e) => {
        if (
            (e.currentTarget.id === "filterBy" ||
                e.currentTarget.id === "orderBy") &&
            e.target.value === "all"
        ) {
            this.setState({
                pupils: this.state.pupils.map((pupil) => {
                    return {
                        ...pupil,
                    };
                }),
                filteredPupils: null,
                totalPosts: this.state.pupils.length,
                pupilsLoading: false,
            });
        }

        if (e.currentTarget.id === "filterBy") {
            if (e.target.value.includes("group")) {
                const filteredPupils = this.state.pupils.filter((pupil) => {
                    return (
                        `${e.target.value.split(" ")[1]}` === `${pupil.group}`
                    );
                });

                this.setState({
                    filteredPupils: filteredPupils.map((pupil) => {
                        return {
                            ...pupil,
                        };
                    }),
                    totalPosts: filteredPupils.length,
                    pupilsLoading: false,
                });
            }
        }

        if (e.currentTarget.id === "orderBy") {
            if (e.target.value === "name") {
                this.setState({
                    pupils: this.state.pupils.sort((firstEl, secondEl) =>
                        firstEl.name.localeCompare(secondEl.name)
                    ),
                    filteredPupils: null,
                    totalPosts: this.state.pupils.length,
                    pupilsLoading: false,
                });
            }

            if (e.target.value === "age") {
                this.setState({
                    pupils: this.state.pupils.sort(
                        (firstEl, secondEl) => firstEl.age - secondEl.age
                    ),
                    filteredPupils: null,
                    totalPosts: this.state.pupils.length,
                    pupilsLoading: false,
                });
            }

            if (e.target.value === "group") {
                this.setState({
                    pupils: this.state.pupils.sort(
                        (firstEl, secondEl) =>
                            parseInt(firstEl.group) - parseInt(secondEl.group)
                    ),
                    filteredPupils: null,
                    totalPosts: this.state.pupils.length,
                    pupilsLoading: false,
                });
            }
        }
    };

    searchPupilHandler = (e) => {
        const filteredPupils = this.state.pupils.filter((pupil) => {
            return pupil.name.includes(e.currentTarget.value)
        });

        this.setState({
            filteredPupils: filteredPupils.map((pupil) => {
                return {
                    ...pupil,
                };
            }),
            pupilsLoading: false,
        });
    };

    modalHandler = () => {
        this.setState({ showModal: false });
    };

    catchError = (error) => {
        this.setState({ error: error });
    };

    render() {
        return (
            <Fragment>
                {this.state.showModal && (
                    <Backdrop onClick={this.modalHandler} />
                )}
                <ModalHandler showModal={this.state.showModal} toDelete={this.state.pupil} onCancel={this.modalHandler} onDelete={this.deletePupilHandler}/>
                <FeedEdit
                    editing={this.state.isEditing}
                    adding={this.state.isAdding}
                    selectedPost={this.state.editPost}
                    loading={this.state.editLoading}
                    onCancelEdit={this.cancelEditHandler}
                    onFinishEdit={this.finishEditHandler}
                />
                <section className="feed__control">
                    <Tooltip text="Adicionar">
                        <div className="card__icon">
                            <div className="puppil__avatar" style={{width: "4rem", height: "4rem"}}>
                                <div className="puppil__letter" style={{cursor: "pointer"}}>
                                        <a onClick={this.newPostHandler}>
                                            <AiFillPlusCircle style={{width: "1.6rem", height: "1.6rem"}}/>
                                        </a>
                                </div>
                            </div>
                        </div>
                    </Tooltip>
                </section>
                {this.state.isAdmin && (
                    <section className="feed__details">
                        <div className="details__card">
                            <div className="card__icon">
                                <div className="puppil__avatar">
                                    <div className="puppil__letter">
                                        <i>
                                            <FaUsers />
                                        </i>
                                    </div>
                                </div>
                            </div>
                            <div className="card__info">
                                <h4>Catequizandos</h4>
                                <p>{this.state.totalPosts}</p>
                            </div>
                        </div>
                        <div className="details__card">
                            <div className="card__icon">
                                <div className="puppil__avatar status__renewed">
                                    <div className="puppil__letter">
                                        <i>
                                            <GrCheckmark />
                                        </i>
                                    </div>
                                </div>
                            </div>
                            <div className="card__info">
                                <h4>Renovadas</h4>
                                <p>
                                    {
                                        this.state.pupils.filter((pupil) => {
                                            return (
                                                pupil.state.status === "renewed"
                                            );
                                        }).length
                                    }
                                </p>
                            </div>
                        </div>
                        <div className="details__card">
                            <div className="card__icon">
                                <div className="puppil__avatar status__pending">
                                    <div className="puppil__letter">
                                        <i>
                                            <GrInProgress />
                                        </i>
                                    </div>
                                </div>
                            </div>
                            <div className="card__info">
                                <h4>Pendentes</h4>
                                <p>
                                    {
                                        this.state.pupils.filter((pupil) => {
                                            return (
                                                pupil.state.status === "pending"
                                            );
                                        }).length
                                    }
                                </p>
                            </div>
                        </div>
                        <div className="details__card">
                            <div className="card__icon">
                                <div className="puppil__avatar status__canceled">
                                    <div className="puppil__letter">
                                        <i>
                                            <GrAlert />
                                        </i>
                                    </div>
                                </div>
                            </div>
                            <div className="card__info">
                                <h4>Canceladas</h4>
                                <p>
                                    {
                                        this.state.pupils.filter((pupil) => {
                                            return (
                                                pupil.state.status === "canceled"
                                            );
                                        }).length
                                    }
                                </p>
                            </div>
                        </div>
                    </section>
                )}
                <section className="feed__actions">
                    <div className="action__search">
                        <i>
                            <GrSearch />
                        </i>
                        <input style={{width: '16.5vw'}}
                            type={"text"}
                            placeholder="pesquise por um nome ..."
                            onChange={this.searchPupilHandler}
                            disabled={this.state.pupils.length === 0 ? true : false}
                        />
                    </div>
                    <div className="action__filter">
                        <span>
                            filtrar
                            <select
                                id="filterBy"
                                onChange={this.filterPupilsHandler}
                                disabled={this.state.pupils.length === 0 ? true : false}
                            >
                                <option value={"all"} defaultValue>
                                    {" "}
                                    ...{" "}
                                </option>
                                <option value={"group 1"}>
                                    por grupo do 1ªano
                                </option>
                                <option value={"group 2"}>
                                    por grupo do 2ªano
                                </option>
                                <option value={"group 3"}>
                                    por grupo do 3ªano
                                </option>
                                <option value={"group 4"}>
                                    por grupo do 4ªano
                                </option>
                                <option value={"group 5"}>
                                    por grupo do 5ªano
                                </option>
                                <option value={"group 6"}>
                                    por grupo do 6ªano
                                </option>
                                <option value={"group 7"}>
                                    por grupo do 7ªano
                                </option>
                                <option value={"group 8"}>
                                    por grupo do 8ªano
                                </option>
                                <option value={"group 9"}>
                                    por grupo do 9ªano
                                </option>
                                <option value={"group 10"}>
                                    por grupo do 10ªano
                                </option>
                                <option value={"group 11"}>
                                    por grupo de jovens
                                </option>
                                <option value={"renewed"}>
                                    por inscrição válida
                                </option>
                                <option value={"pending"}>
                                    por inscrição pendente
                                </option>
                                <option value={"canceled"}>
                                    por inscrição cancelada
                                </option>
                            </select>
                        </span>
                        <span>
                            ordenar
                            <select
                                id="orderBy"
                                onChange={this.filterPupilsHandler}
                                disabled={this.state.pupils.length === 0 ? true : false}
                            >
                                <option value={"all"} defaultValue>
                                    {" "}
                                    ...{" "}
                                </option>
                                <option value={"name"}>alfabeticamente</option>
                                <option value={"age"}>por idade</option>
                                <option value={"group"}>
                                    por grupo catequese
                                </option>
                            </select>
                        </span>
                    </div>
                </section>
                <section className="feed">
                    {this.state.pupilsLoading && (
                        <div style={{ textAlign: "center", marginTop: "2rem" }}>
                            <Loader />
                        </div>
                    )}
                    {this.state.pupils.length <= 0 &&
                        !this.state.pupilsLoading ? (
                        <div style={{ textAlign: "center" }}>
                            <p>
                                <b>
                                    Ups, não conseguimos encontrar nenhuma
                                    inscrição.
                                </b>
                            </p>
                            <p>
                                Parece que ainda não inscreveu nenhum filho/a na
                                catequese, <br></br> para iniciar o processo
                                clique no mais que se encontra mais acima nesta
                                página. Obrigado{" "}
                            </p>
                        </div>
                    ) : null}
                    {!this.state.pupilsLoading && !this.state.isAdmin && (
                        <Paginator
                            onPrevious={this.loadPosts.bind(this, "previous")}
                            onNext={this.loadPosts.bind(this, "next")}
                            lastPage={Math.ceil(this.state.totalPosts / 10)}
                            currentPage={this.state.pupilPage}
                        >
                            {this.state.filteredPupils === null
                                ? this.state.pupils.map((pupil) => (
                                    <Post
                                        key={pupil._id}
                                        pupil={pupil}
                                        onStartEdit={this.startEditPostHandler.bind(
                                            this,
                                            pupil._id
                                        )}
                                        onDelete={() => this.setState({ showModal: true, pupil: pupil})}
                                    />
                                ))
                                : this.state.filteredPupils.map((pupil) => (
                                    <Post
                                        key={pupil._id}
                                        pupil={pupil}
                                        onStartEdit={this.startEditPostHandler.bind(
                                            this,
                                            pupil._id
                                        )}
                                        // onDelete={this.deletePupilHandler.bind(
                                        //     this,
                                        //     pupil._id
                                        // )}
                                        onDelete={() => {
                                            this.setState({ showModal: true, pupil: pupil})}
                                        }
                                    />
                                ))}
                        </Paginator>
                    )}
                    {!this.state.pupilsLoading &&
                        this.state.isAdmin &&
                        (this.state.filteredPupils === null
                            ? this.state.pupils.map((pupil) => (
                                <Post
                                    key={pupil._id}
                                    pupil={pupil}
                                    onStartEdit={this.startEditPostHandler.bind(
                                        this,
                                        pupil._id
                                    )}
                                    // onDelete={this.deletePupilHandler.bind(
                                    //     this,
                                    //     pupil._id
                                    // )}
                                    onDelete={() => this.setState({ showModal: true, pupil: pupil})}
                                />
                            ))
                            : this.state.filteredPupils.map((pupil) => (
                                <Post
                                    key={pupil._id}
                                    pupil={pupil}
                                    onStartEdit={this.startEditPostHandler.bind(
                                        this,
                                        pupil._id
                                    )}
                                    // onDelete={this.deletePupilHandler.bind(
                                    //     this,
                                    //     pupil._id
                                    // )}
                                    onDelete={() => this.setState({ showModal: true, pupil: pupil})}
                                />
                            )))}
                </section>
            </Fragment>
        );
    }
}

export default Feed;
