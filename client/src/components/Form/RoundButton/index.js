import React from 'react'

import './style.css'

const RoundButton = ({ children, ...props }) => (
    <div className="round-button-wrapper">
        <a className="round-button" { ...props }>{ children }</a>
    </div>
)

export default RoundButton