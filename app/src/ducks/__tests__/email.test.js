import emailReducer from './../email'
import * as actions from './../email'

describe('Test Email Reducer', () => {
    it('render initial email state', () => {
        expect(emailReducer(undefined, {})).toEqual({
            email_templates: [],
        })
    });

    it('should handle FETCH_EMAIL_BEGIN', () => {
        const fetchEmail = {
            type: actions.FETCH_EMAIL_BEGIN,
        }
        expect(emailReducer([], fetchEmail)).toEqual({
            loading: true
        })
    })

    it('should handle SET_EMAILS', () => {
        const setEmails = {
            type: actions.SET_EMAILS,
            payload: {emails: ['p1', 'p2']}
        }
        expect(emailReducer([], setEmails)).toEqual({
            email_templates: ['p1', 'p2'],
            loading: false
        })
    })

    it('should handle FETCH_EMAILS_FAILURE', () => {
        const failed = {
            type: actions.FETCH_EMAILS_FAILURE,
            payload: {error: true}
        }
        expect(emailReducer([], failed)).toEqual({
            err: true,
            loading: false
        })
    })

    it('should handle UPDATE_EMAIL', () => {
        const initial = [
            {template_id: 1, val: 'test1'},
            {template_id: 2, val: 'test2'},
            {template_id: 3, val: 'test3'}
        ]
         const update = {
             type: actions.UPDATE_EMAIL,
             payload: {
                 email: {
                     template_id: 2,
                     val: 'updated_test_2'
                 }
             }
         }
         expect(emailReducer({email_templates: initial}, update)).toEqual({
             email_templates: [
                 {template_id: 1, val: 'test1'},
                 {template_id: 2, val: 'updated_test_2'},
                 {template_id: 3, val: 'test3'}
             ]
         })
    })
    it('should handle ADD_EMAIL', () => {
        const add = {
            type: actions.ADD_EMAIL,
            payload: {email: 'test'}
        }
        expect(emailReducer({email_templates: []}, add)).toEqual({
            email_templates: ['test']
        })
    });

    it('should handle REMOVE_EMAIL', () => {
        const initial = [
            {template_id: 1, val: 'test1'},
            {template_id: 2, val: 'test2'},
            {template_id: 3, val: 'test3'}
        ]
        const remove = {
            type: actions.REMOVE_EMAIL,
            payload: {email_id: 2}
        }
        expect(emailReducer({email_templates: initial}, remove)).toEqual({
            email_templates: [
                 {template_id: 1, val: 'test1'},
                 {template_id: 3, val: 'test3'}
             ]
        })
    })
})