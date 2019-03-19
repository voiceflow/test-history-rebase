export const setConfirm = confirm => ({
    type: "SET_CONFIRM",
    payload: {
       confirm: {
           ...confirm,
           confirm: () => {
            //    this.setState({
            //        confirm: null
            //    })
               if (typeof confirm.confirm !== 'function') return

               if (confirm.params) {
                   confirm.confirm(...confirm.params)
               } else {
                   confirm.confirm()
               }
           }
       }
    }
})

export const setError = error => ({
    type: "SET_ERROR",
    payload: {error}
})

export const setDefault = def=> ({
    type: "SET_DEFAULT",
    payload: {def}
})

export const clearModal = () => ({
    type: "CLEAR_MODAL"
})

export const SET_CONFIRM = 'SET_CONFIRM'
export const SET_ERROR = 'SET_ERROR'
export const SET_DEFAULT = 'SET_DEFAULT'
export const CLEAR_MODAL = 'CLEAR_MODAL'