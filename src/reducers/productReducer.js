
import update from 'immutability-helper'

const initialState = {
    products: [],
}

export default function productReducer(state = initialState, action) {
    switch(action.type){
        case 'FETCH_PRODUCT_BEGIN':
            return {
                ...state,
                loading: true,
            }
        case 'SET_PRODUCTS':
            return {
                ...state,
                products: action.payload.products,
                loading: false,
            }
        case 'FETCH_PRODUCTS_FAILURE':
            return {
                ...state,
                err: action.payload.error,
                loading: false,
            }
        case 'UPDATE_PRODUCT':
            let idx = state.products.findIndex(p => p.id === action.payload.product.id);
            return {
                ...state,
                products: update(state.products, {$splice: [[idx, 1, action.payload.product]]})
            }
        case 'ADD_PRODUCT':
            return {
                ...state,
                products: update(state.products, {$push: [action.payload.product]})
            }
        case 'REMOVE_PRODUCT':
            let index = state.products.findIndex(p => p.id === action.payload.product_id);
            return {
                ...state,
                products: update(state.products, {$splice: [[index, 1]]})
            }
        default:
            return state
    }
}