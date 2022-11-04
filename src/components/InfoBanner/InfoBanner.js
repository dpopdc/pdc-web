import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import "./InfoBanner.css";

import { AiFillCloseCircle } from "react-icons/ai";
import { MdError } from "react-icons/md";

const InfoBanner = (props) => {
  const [hide, setHide] = useState("");

  useEffect(() => {
    if (props.design != "info") {
      const timer = setTimeout(() => {
        setHide("hide_container");
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleLinkClick = (e) => {
    e.preventDefault();

    window.location.href = props.link;
    props.onHandle();
  };

  return ReactDOM.createPortal(
    <div className={`info__container ${props.design} ${hide}`}>
      <div className="info_message">
        <label className="message__title">
          <MdError />
          {props.title}
        </label>
        <div style={{ padding: ".4rem 0" }}>
          <p className="message__details">{props.message}</p>
        </div>
        {(props.link !== "" && props.link != null) && (
          <a
            href={`${props.link}`}
            className="message__details"
            onClick={handleLinkClick}
          >
            repor password
          </a>
        )}
      </div>
      <div className="info__actions">
        <i>
          <AiFillCloseCircle
            onClick={props.onHandle}
            style={{ cursor: "pointer" }}
          />
        </i>
      </div>
    </div>,
    document.getElementById("info-root")
  );
};

export default InfoBanner;
