import React from "react";

import "./Loader.css";

const loader = (props) => (
    <div className="gooey">
        <span className="dot"></span>
        <div className="dots">
            <span></span>
            <span></span>
            <span></span>
        </div>
    </div>
);

export default loader;
