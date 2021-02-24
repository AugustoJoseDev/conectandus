import React from 'react'

import './style.css'

const RoundSubmit = ({ ...props }) => (
    <div className="round-submit-wrapper">
        <input className="round-submit" type="submit" { ...props } />
    </div>
)

export default RoundSubmit