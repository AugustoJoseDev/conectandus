import React, { useEffect, useRef } from 'react'
import {useField} from '@unform/core'

import './style.css'

const Input = ({ name, ...props }) => {
    const inputRef = useRef(null)
    const {fieldName, registerField, defaultValue} = useField(name)

    useEffect(()=>{
        
        registerField({
            name:fieldName,
            ref:inputRef.current,
            path:'value'
        })

    },[fieldName,registerField])

    return (
        <input ref={inputRef} {...{defaultValue}} {...props}/>
    )
}

export default Input