import React, { useEffect, useRef } from 'react'
import {useField} from '@unform/core'

import './style.css'

const TextArea = ({ name, ...props }) => {
    const ref = useRef(null)
    const {fieldName, registerField, defaultValue} = useField(name)

    useEffect(()=>{
        
        registerField({
            name:fieldName,
            ref:ref.current,
            path:'value'
        })

    },[fieldName,registerField])

    return (
        <textarea ref={ref} {...props}>{defaultValue}</textarea>
    )
}

export default TextArea