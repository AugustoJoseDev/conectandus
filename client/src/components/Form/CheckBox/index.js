import React, { useEffect, useRef } from 'react'
import { useField } from '@unform/core'
import './style.css'

const CheckBox = ({ name, options, ...props }) => {
    const inputRefs = useRef([])
    const { fieldName, registerField, defaultValue = [] } = useField(name)

    useEffect(() => {
        registerField({
            name: fieldName,
            ref: inputRefs.current,
            getValue: (refs) => {
                return refs.filter(ref => ref.checked).map(ref => ref.value)
            },
            clearValue: (refs) => {
                refs.forEach(ref => {
                    ref.checked = false
                })
            },
            setValue: (refs, values) => {
                refs.forEach(ref => {
                    if (values.includes(ref.id)) {
                        ref.checked = true
                    }
                })
            },
        })
    }, [ defaultValue, fieldName, registerField ])



    return (
        <div>
            {options.map((option, index) => (
                    <label htmlFor={ option.id } key={ option.id } className="checkbox-container">
                        {option.label }
                        <input
                            defaultChecked={ defaultValue.find((dv) => dv === option.id) }
                            ref={ ref => {
                                inputRefs.current[ index ] = ref
                            } }
                            value={ option.value }
                            type="checkbox"
                            id={ option.id }
                            { ...props }
                        />
                        <span className="checkmark"></span>
                    </label>
            )) }
        </div>
    )

}

export default CheckBox