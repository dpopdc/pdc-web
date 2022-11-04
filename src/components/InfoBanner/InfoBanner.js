import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import './InfoBanner.css'

import { AiFillCloseCircle } from "react-icons/ai";
import { MdError } from 'react-icons/md'

const InfoBanner = (props) => {
    const [hide, setHide] = useState("")

    useEffect(() => {
        const timer = setTimeout(() => {
            setHide('hide_container');
        }, 6000)

        return () => clearTimeout(timer)
    }, [])

    return ReactDOM.createPortal(
        <div className={`info__container ${props.design} ${hide}`}>
            <div className="info_message">
                <label className="message__title"><MdError />{props.title}</label>
                <p className="message__details">{props.message}</p>
            </div>
            <div className="info__actions">
                <i>
                    <AiFillCloseCircle onClick={props.onCloseBanner} />
                </i>
            </div>
        </div>,
        document.getElementById("info-root")
    );
}

export default InfoBanner;