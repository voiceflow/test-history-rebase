import skillReducer, * as actions from './../version'
import { testSkill } from '../../containers/Canvas/__mock__/MockSkill'

const initialState = {
    skill: {},
    loading: false,
    error: null,
    user_modules: {}
};

const skill = testSkill
describe('Test Skill Reducer', () => {
    it('render initial skill state', () => {
        expect(skillReducer(undefined, {})).toEqual(initialState);
    });

    it('should handle FETCH_VERSION_BEGIN', () => {
        const startFetch = {
            type: actions.FETCH_VERSION_BEGIN
        };
        expect(skillReducer(initialState, startFetch)).toEqual({
            loading: true,
            error: null,
            skill: {},
            user_modules: {}
        })
    });

    it('should handle FETCH_VERSION_SUCCESS', () => {
        const successFetch = {
            type: actions.FETCH_VERSION_SUCCESS,
            payload: {skills: skill},
        }
        expect(skillReducer({}, successFetch)).toEqual({
            loading: false,
            skill: testSkill
        })
    })

    it('should handle FETCH_LIVE_VERSION_SUCCESS', () => {
        const fetchLiveSkill = {
            type: actions.FETCH_LIVE_VERSION_SUCCESS,
            payload: {
                live: skill,
                show: true
            },
        }
        expect(skillReducer({}, fetchLiveSkill)).toEqual({
            loading: false,
            live_version: testSkill,
            live_mode: true,
            show_live_mode_modal: true
        })
    })

    it('should handle FETCH_DEV_SKILL_SUCCESS', () => {
        const dev_skill = skill
        const fetchDevSkill = {
            type: actions.FETCH_DEV_VERSION_SUCCESS,
            payload: {dev_skill},
        }
        expect(skillReducer({}, fetchDevSkill)).toEqual({
            dev_skill: testSkill,
            loading: false
        })
    })

    it('should handle FETCH_VERSION_FAILURE', () => {
        const fetchSkillFail = {
            type: actions.FETCH_VERSION_FAILURE,
            payload: {error: true}
        }
        expect(skillReducer(initialState, fetchSkillFail)).toEqual({loading: false, error: true, skill: {}, user_modules: {}})
    })

    it('should handle TOGGLE_LIVE', () => {
        const payload = {
            skill: skill,
            skill_id: '12345',
            live_version: testSkill,
            live_mode: false
        }
        const toggleLive = {
            type: actions.TOGGLE_LIVE,
            payload: payload
        }
        expect(skillReducer(initialState, toggleLive)).toEqual({
            skill: testSkill,
            diagram_id: '12345',
            error: null,
            loading: false,
            live_version: testSkill,
            live_mode: false,
            user_modules: {}
        })
    })

    it('should handle UPDATE_SKILL', () => {
        let initial = initialState
        initial.skill = testSkill
        const updateSkill = {
            type: actions.UPDATE_SKILL,
            payload: {type: 'name', val: 'test'}
        }
        let newSkill= testSkill
        newSkill.name = 'test'
        expect(skillReducer(initial, updateSkill)).toEqual({
            error: null,
            loading: false,
            skill: newSkill,
            user_modules: {}
        })
    })

    it('should handle SET_LIVE_MODE_MODAL', () => {
        const setLive = {
            type: actions.SET_LIVE_MODE_MODAL,
            payload: {isLive: false}
        }
        expect(skillReducer({}, setLive)).toEqual({show_live_mode_modal: false})
    })

})
