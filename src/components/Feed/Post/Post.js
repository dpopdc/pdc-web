import React from "react";
import "./Post.css";

import {
    BsCalendar3,
    BsPeople,
    BsTrash,
    BsPencilSquare,
    BsFileEarmarkPdf,
} from "react-icons/bs";
import Tooltip from "../../Tooltip/Tooltip";

const post = (props) => (
    <article className="post">
        <header className="puppil__data">
            <div className="puppil__avatar">
                <div className="puppil__letter">
                    {props.pupil.name.charAt(0).toUpperCase()}
                </div>
            </div>
            <div className="puppil__info">
                <span>NOME</span>
                <p>{`${props.pupil.name.split(" ")[0]} ${props.pupil.name.split(" ")[
                    props.pupil.name.split(" ").length - 1
                ]
                    }`}</p>
            </div>
            <div className="puppil__info puppil__info--date">
                <span>DATA NASCIMENTO</span>
                <p>
                    <i style={{ paddingRight: ".6rem" }}>
                        <BsCalendar3 />
                    </i>
                    {new Date(props.pupil.birthDate).toLocaleString('pt-PT', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>
            <div className="puppil__info">
                <span>GRUPO CATEQUESE</span>
                <p>
                    <i style={{ paddingRight: ".6rem" }}>
                        <BsPeople />
                    </i>
                    {props.pupil.group}
                </p>
            </div>
            <div className="puppil__info">
                <span>ESTADO INSCRIÇÃO</span>
                <div
                    className={`puppils__status status__${props.pupil.state.status}`}
                >
                    {props.pupil.state.label}
                </div>
            </div>
        </header>
        <div className="post__actions">
            {console.log(props.pupil.file)}
            {props.pupil.file !== undefined && (
                <Tooltip text="Ver ficha">
                    <a href={props.pupil.file === undefined ? '' : props.pupil.file.url} target={'_blank'} disabled={props.pupil.file === undefined ? true : false}>
                        <i>
                            <BsFileEarmarkPdf />
                        </i>
                    </a>
                </Tooltip>
            )}
            <Tooltip text="Editar">
                <a onClick={props.onStartEdit}>
                    <i>
                        <BsPencilSquare />
                    </i>
                </a>
            </Tooltip>
            <Tooltip text="Remover">
                <a style={{ color: "#EB8B9E" }} onClick={props.onDelete}>
                    <i>
                        <BsTrash />
                    </i>
                </a>
            </Tooltip>
        </div>
    </article>
);

export default post;
