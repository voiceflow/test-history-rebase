import productReducer, * as actions from './../product'

describe('Test Product Reducer', () => {
    it('render initial product state', () => {
        expect(productReducer(undefined, {})).toEqual({
            products: [],
        })
    });

    it('should handle FETCH_PRODUCT_BEGIN', () => {
        const fetchProduct = {
            type: actions.FETCH_PRODUCT_BEGIN,
        }
        expect(productReducer([], fetchProduct)).toEqual({
            loading: true
        })
    })

    it('should handle SET_PRODUCTS', () => {
        const setProducts = {
            type: actions.SET_PRODUCTS,
            payload: {products: ['p1', 'p2']}
        }
        expect(productReducer([], setProducts)).toEqual({
            products: ['p1', 'p2'],
            loading: false
        })
    })

    it('should handle FETCH_PRODUCTS_FAILURE', () => {
        const failed = {
            type: actions.FETCH_PRODUCTS_FAILURE,
            payload: {error: true}
        }
        expect(productReducer([], failed)).toEqual({
            err: true,
            loading: false
        })
    })

    it('should handle UPDATE_PRODUCT', () => {
        const initial = [
            {id: 1, val: 'test1'},
            {id: 2, val: 'test2'},
            {id: 3, val: 'test3'}
        ]
         const update = {
             type: actions.UPDATE_PRODUCT,
             payload: {
                 product: {
                     id: 2,
                     val: 'updated_test_2'
                 }
             }
         }
         expect(productReducer({products: initial}, update)).toEqual({
             products: [
                 {id: 1, val: 'test1'},
                 {id: 2, val: 'updated_test_2'},
                 {id: 3, val: 'test3'}
             ]
         })
    })
    it('should handle ADD_PRODUCT', () => {
        const add = {
            type: actions.ADD_PRODUCT,
            payload: {product: 'test'}
        }
        expect(productReducer({products: []}, add)).toEqual({
            products: ['test']
        })
    });

    it('should handle REMOVE_PRODUCT', () => {
        const initial = [
            {id: 1, val: 'test1'},
            {id: 2, val: 'test2'},
            {id: 3, val: 'test3'}
        ]
        const remove = {
            type: actions.REMOVE_PRODUCT,
            payload: {product_id: 2}
        }
        expect(productReducer({products: initial}, remove)).toEqual({
            products: [
                 {id: 1, val: 'test1'},
                 {id: 3, val: 'test3'}
             ]
        })
    })
})