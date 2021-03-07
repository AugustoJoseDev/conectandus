import React from 'react'

import './style.css'

const Submit = ({ ...props }) => (
    <div className="submit-wrapper">
        <input className="submit" type="submit" { ...props } />
    </div>
)

export default Submit