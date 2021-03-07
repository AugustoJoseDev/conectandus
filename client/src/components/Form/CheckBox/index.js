import React from 'react'

import './style.css'
import Input from '../Input'

const CheckBox = ({ name,label, ...props }) => {
    
    return(
        <label className="checkbox-container">{label}
            <Input type="checkbox" {...{name, ...props}}/>
            <span className="checkmark"></span>
        </label>
    )

}

export default CheckBox