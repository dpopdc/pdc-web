import React from "react"
import './Tooltip.css'

const Tooltip = props => {
    return (
        <div className="tooltip__container">
            <span className="tooltip__text">{props.text}</span>
            {props.children}
        </div>
    )
}

export default Tooltip