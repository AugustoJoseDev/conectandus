import React from 'react'
import { Link } from 'react-router-dom'

import './style.css'

const AnchorButton = ({ children, ...props }) => (
    <div className="anchor-button-wrapper">
        <Link className="anchor-button" { ...props }>{ children }</Link>
    </div>
)

export default AnchorButton