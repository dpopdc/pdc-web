import React, { useState } from "react";
import ReactDOM from "react-dom";

import Button from "../Button/Button";
import "./ConfirmationModal.css";

import { BsFillTrashFill } from 'react-icons/bs'
import Input from "../Form/Input/Input";

const ConfirmationModal = (props) => {
    const [valid, setValid] = useState(false)

    const handleChange = () => {
        props.toDelete.name === document.getElementById('delete').value ? setValid(true) : setValid(false)
    }

    const handleModalConfirmation = () => {
        props.onDelete(props.toDelete._id)
        props.onCancel()
    }

    return ReactDOM.createPortal(
        <div className="modal danger">
            {props.title !== "" && (
                <header className="modal__header">
                    <h1>Antes de avançar, confirme!</h1>
                </header>
            )}
            <div className="modal__content">
                <p>Remover um utlizador fará com que o mesmo seja apagado permanentemente, tem a certeza que o pretende fazer?</p>
                <p>Se sim, introduza abaixo <b className="unselectable">{props.toDelete.name}</b> e clique confirmar.</p>
                <Input
                    id="delete"
                    label=""
                    type="text"
                    control="text"
                    onChange={handleChange}
                />
            </div>
            <div className="modal__actions">
                <Button
                    design="secondary"
                    onClick={props.onCancel}
                >
                    Cancelar
                </Button>
                <Button
                    design="delete"
                    onClick={handleModalConfirmation}
                    disabled={!valid}
                    loading={props.isLoading}
                >
                    <i><BsFillTrashFill /> Confirmar</i>
                </Button>
            </div>
        </div>,
        document.getElementById("modal-root")
    );
}
export default ConfirmationModal;
