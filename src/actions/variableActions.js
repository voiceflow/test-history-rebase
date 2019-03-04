export const pushVariable = (variable) => ({
    type: "PUSH_VARIABLE",
    payload: { variable }
})

export const setVariables = (variables) => ({
    type: "SET_VARIABLES",
    payload: { variables }
})
export const PUSH_VARIABLE = "PUSH_VARIABLE"
export const SET_VARIABLES = "SET_VARIABLES"