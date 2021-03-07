import React from 'react'

import './style.css'

const PromptBox = ({ children, ...props }) => (
    <p className="prompt-box" { ...props }>{ children }</p>
)

export default PromptBox