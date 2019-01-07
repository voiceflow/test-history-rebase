const getEnvVariable = (var_name) => {
    const env = process.env.NODE_ENV
  
    // convert to uppercase
    const envString = env.toUpperCase()
    const varString = var_name.toUpperCase()
  
    // access the environment variables for this environment first
    let variable = process.env[`${varString}_${envString}`]
    if (variable === undefined) {
        // check if universal variable exists
        variable = process.env[varString]
    }  
    return variable
}

exports.getEnvVariable = getEnvVariable;