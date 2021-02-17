import React from 'react'

import './style.css'

const App = ({ message, ...props }) => (
    <p className="prompt-box" { ...props }>{ message }</p>
)

export default App