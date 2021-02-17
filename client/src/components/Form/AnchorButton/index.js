import React from 'react'

import './style.css'

const AnchorButton = ({ children, ...props }) => (
    <div className="anchor-button-wrapper">
        <a className="anchor-button" { ...props }>{ children }</a>
    </div>
)

export default AnchorButton