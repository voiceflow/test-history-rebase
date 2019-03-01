import {withStateHandlers} from 'recompose';

export const error = withStateHandlers(
    ({ error = null }) => ({
        onError: error
    }),
    {
        setError: ({ onError }) => err => ({
            onError: err
        }),
        clearError: ({ onError }) => err => ({
            onError: null,
        })
    }
)
