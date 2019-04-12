import React from 'react'
import { components } from 'react-select';

export const selectStyles = {
    control: styles => ({
        ...styles,
        backgroundColor: 'white',
    }),
    option: (provided, state) => {
        if (state.data.value === 'Create Variable') {
            return {
                ...provided,
                borderTop: '1px solid #dce5e8',
                textAlign: 'center !important',
                color: '#3153E4',
                bottom: 0,
                position: 'sticky',
                backgroundColor: 'white',
                borderRadius: '0px 0px 8px 8px',
                paddingLeft: '0 !important',
                paddingRight: '0 !important',
                whiteSpace: 'nowrap',
                overflowX: 'hidden',
                overflowY: 'hidden',
                backgroundImage: 'none',
                '&:hover': {
                    backgroundImage: 'none',
                    color: '#3153E4'
                },
                '&:active': {
                    backgroundImage: 'none',
                }
            }
        }
        return {
            ...provided,
        }
    }
}

export const variableComponent = props => {
    if (props.data.value === 'Create Variable') {
        return (
            <components.Option {...props}>
                <div
                    style={{ display: "inline-block" }}
                    onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        localStorage.setItem(
                          "tab",
                          "variables"
                        )
                        props.data.openVar('variables')
                    }}
                >
                    {props.data.value}
                </div>
            </components.Option>
        )
    }
    return (
        <components.Option {...props}>
            <div style={{ display: "inline-block" }}>{props.data.value}</div>
        </components.Option>
    )
}
