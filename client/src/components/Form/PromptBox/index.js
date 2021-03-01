import React from 'react'

import './style.css'

const App = ({ children, ...props }) => (
    <p className="prompt-box" { ...props }>{ children }</p>
)

export default App