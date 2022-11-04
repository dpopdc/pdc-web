import React from "react";
import ReactDOM from "react-dom";

import Button from "../Button/Button";
import "./Pager.css";

import { AiFillCloseCircle } from "react-icons/ai";

const pager = (props) =>
    ReactDOM.createPortal(
        <div className="pager">
            <div className="pager__actions">
                <button className="close__btn" onClick={props.onClose}>
                    <i>
                        <AiFillCloseCircle />
                    </i>
                </button>
            </div>
            <div className="pager__header">
                <h1>Olá {localStorage.getItem("userName")},</h1>
                <p style={{ color: "#A3A3A3" }}>
                    Temos todo o gosto em receber este novo catequizando num dos
                    grupos de catequese da nossa Paróquia, mas antes de mais
                    precisamos de recolher alguns dados sobre o mesmo. Se tiver
                    dúvidas em relação à proteção de dados, comece por ler aqui
                </p>
            </div>
            <div className="pager__container ">{props.children}</div>
            <div className="pager__footer">
                {props.currentPage > 1 && (
                    <Button
                        design="danger"
                        mode="flat"
                        onClick={props.handlePrevious}
                    >
                        Voltar
                    </Button>
                )}
                <Button
                    design="success"
                    mode="raised"
                    onClick={
                        props.currentPage < 3
                            ? props.handleNext
                            : () => {
                                  props.onSubmit();
                                  props.onClose();
                              }
                    }
                    disabled={props.disabled}
                >
                    {props.currentPage === 3 ? "Submter" : "Continuar"}
                </Button>
            </div>
        </div>,
        document.getElementById("pager-root")
    );

export default pager;
