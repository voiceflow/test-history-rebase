import React from 'react'
import { Alert } from 'reactstrap'

export default ({error, color}) => (
  error ? (
  <Alert color={color}>
    {error}
  </Alert> )
  : null
)
