import React from 'react'
import axios from 'axios';
import {Alert} from 'reactstrap'
import { getSlotsForKeys } from '../util'
import { getIntentSlots } from '../Helper'
import { setError } from './modalActions'
import _ from 'lodash'

export const fetchVersionBegin = () => ({
  type: "FETCH_VERSION_BEGIN"
});

export const fetchVersionSuccess = skills => ({
  type: "FETCH_VERSION_SUCCESS",
  payload: { skills }
});

export const fetchVersionBlocked = message => ({
    type: "FETCH_VERSION_BLOCKED",
    payload: { message }
})

export const resetVersion = () => ({
    type: "RESET_VERSION",
})

export const fetchVersionFailure = error => ({
  type: "FETCH_VERSION_FAILURE",
  payload: { error }
});

export const fetchLiveVersionSuccess = (live, show) => ({
    type: "FETCH_LIVE_VERSION_SUCCESS",
    payload: { live, show }
})

export const fetchDevVersionSuccess = (dev_skill) => ({
    type: "FETCH_DEV_VERSION_SUCCESS",
    payload: { dev_skill }
})

export const setLiveModeModal = isLive => ({
    type: "SET_LIVE_MODE_MODAL",
    payload: { isLive }
})

export const updateVersion = (type, val) => dispatch => {
    dispatch({
        type: "UPDATE_VERSION",
        payload: { type, val }
    })
    return Promise.resolve()
}

export const updateEntireVersion = (skill) => ({
    type: "UPDATE_ENTIRE_VERSION",
    payload: { skill }
})

export const updateVersionMerge = (type, val) => ({
    type: "UPDATE_VERSION_MERGE",
    payload: { type, val }
})

export const toggleLive = (skill, diagram_id, live_version, live_mode) => dispatch => {
    dispatch({
        type: "TOGGLE_LIVE",
        payload: { skill, diagram_id, live_version, live_mode }
    })
}

export const removeFulfillment = intent_key => ({
    type: "REMOVE_FULFILLMENT",
    payload: { intent_key }
})

export const updateFulfillment = ( intent_key, slot_config ) => ({
    type: "UPDATE_FULFILLMENT",
    payload: { intent_key, slot_config }
})

export const updateLocales = (locale) => {
    return (dispatch, getState) => {
        let locales = getState().skills.skill.locales;
        if (locales.includes(locale)) {
            if (locales.length > 1) {
                _.remove(locales, (v) => { return v === locale })
            }
        } else {
            locales.push(locale)
        }
        dispatch(updateVersion('locales', locales))
    }
}

export const updateIntents = () => {
    return (dispatch, getState) => {
        const intents = getState().skills.skill.intents
        const slots = getState().skills.skill.slots

        intents.forEach((intent, i) => {
            let is_google = false
            let is_alexa = false

            let intent_slots = getSlotsForKeys(intent.inputs.map(input => input.slots), slots)
            intent_slots.forEach(intent_slot => {
                const slot_type = intent_slot.type

                if (slot_type && slot_type.toLowerCase() !== 'custom') {
                    if (/AMAZON/.test(slot_type)) is_alexa = true
                    if (/^@sys\./.test(slot_type)) is_google = true
                }
            })
            let platform = null
            if (is_google && !is_alexa) platform = 'google'
            if (is_alexa && !is_google) platform = 'alexa'
            intents[i]._platform = platform
        })
        dispatch(updateVersion('intents', intents))
    }
}

export const setCanFulfill = (intent_key, new_value) => {
    return (dispatch, getState) => {
        const skill = getState().skills.skill
        const fulfillments = skill.fulfillment;
        let fulfillment = fulfillments[intent_key]

        if (fulfillment && !new_value){
            dispatch(removeFulfillment(intent_key))
        } else if (!fulfillment && new_value)  {
            const slot_config = {};
            const intent = _.find(skill.intents, {key: intent_key})
            const intent_slots = getIntentSlots(intent, skill.slots);
            
            intent_slots.forEach(slot => {
                slot_config[slot.key] = []
            })
            dispatch(updateFulfillment(intent_key, slot_config))
        }
    }
}

export const fetchVersion = (skill_id, preview, diagram_id) => {
    return dispatch => {
        dispatch(fetchVersionBegin());
        // TODO UPDATE THIS ROUTE
        return axios.get(`/skill/${skill_id}?${preview ? 'preview=1' : 'simple=1'}`, {
                headers: {
                    Pragma: 'no-cache'
                }
            })
            .then(res => {
                let skill = res.data
                if (preview && !skill.preview) {
                    dispatch(fetchVersionBlocked(<Alert color="danger">Preview not enabled for this skill</Alert>))
                    return
                }

                // TODO: this function is horrible and needs to die
                let globals = Array.isArray(skill.global) ? skill.global : []
                // make sure that there are no duplicate variables and that the defaults are included
                let global_variables = ['sessions', 'user_id', 'timestamp', 'platform', 'locale']
                if (window.user_detail.admin > 0) {
                    global_variables.push('access_token')
                }
                if (Array.isArray(globals)) {
                    globals.forEach(v => {
                        if (!global_variables.includes(v)) {
                            global_variables.push(v)
                        }
                    })
                }
                skill.global = global_variables

                // NULL CHECK ON FULFILLMENT
                if (!skill.fulfillment) {
                    skill.fulfillment = {}
                }

                skill.platform = skill.platform === 'google' ? 'google' : 'alexa'
                if (diagram_id && skill.diagram !== diagram_id){
                    skill.diagram = diagram_id
                }

                if(!preview){
                  dispatch(fetchDevVersionSuccess(skill))
                  dispatch(fetchLiveVersion(skill.project_id))
                }
                
                dispatch(fetchVersionSuccess(skill))
            })
            .catch(err => {
                dispatch(fetchVersionFailure('Unable to load project'))
            })
    }
}

export const fetchLiveVersion = project_id => {
    return (dispatch, getStore) => {
        dispatch(fetchVersionBegin());
        return axios.get(`/project/${project_id}/live_version`)
            .then(res => {
                let skill_id = getStore().skills.skill.project_id
                if (skill_id === res.data.live_version){
                    dispatch(fetchDevVersion(project_id))
                }
                dispatch(fetchLiveVersionSuccess(res.data.live_version, skill_id === res.data.live_version))
            })
            .catch(err => {
                console.error(err)
                dispatch(fetchVersionFailure('Unable to load live versions'))
            })
    }
}

export const fetchDevVersion = project_id => {
    return dispatch => {
        dispatch(fetchVersionBegin());
        return axios.get(`/skill/${project_id}/dev_version`)
            .then(res => {
                dispatch(fetchDevVersionSuccess(res.data))
            })
            .catch(err => {
                console.error(err)
                dispatch(fetchVersionFailure('Unable to fetch dev skills'))
            })
    }
}

export const updateSkillDB = (publish = false, cb) => {
    return (dispatch, getState) => {
        const s = getState().skills.skill
        const category = (s.category && s.category.value ? s.category.value : null)

        let store;

        if (publish === true) {
            store = {
                purchase: s.purchase,
                personal: s.personal,
                copa: s.copa,
                ads: s.ads,
                export: s.export,
                instructions: s.instructions
            }
        }

        let properties = {
            name: s.name,
            inv_name: s.inv_name,
            summary: s.summary,
            description: s.description,
            keywords: s.keywords,
            invocations: s.invocations,
            small_icon: s.small_icon,
            large_icon: s.large_icon,
            category: category,
            locales: s.locales,
            privacy_policy: !_.isEmpty(s.privacy_policy) ? s.privacy_policy : '',
            terms_and_cond: s.terms_and_cond,
            ...store
        }

        if (!properties.name) {
            return dispatch(setError('Publish Settings not Saved: No Project Name'))
        }

        axios.patch(('/skill/' + s.skill_id + (publish === true ? '?publish=true' : '')), {
                ...properties,
                locales: JSON.stringify(properties.locales)
            })
            .then(res => {
                dispatch(updateEntireVersion(properties))
                if (typeof cb === 'function') cb()
            })
            .catch(err => {
                console.log(err)
                dispatch(setError('Save Error, Publish Settings not Saved'))
            })
    }
}

export const FETCH_VERSION_BEGIN = 'FETCH_VERSION_BEGIN';
export const FETCH_VERSION_SUCCESS = 'FETCH_VERSION_SUCCESS';
export const FETCH_LIVE_VERSION_SUCCESS = 'FETCH_LIVE_VERSION_SUCCESS'
export const FETCH_DEV_VERSION_SUCCESS = 'FETCH_DEV_VERSION_SUCCESS'
export const FETCH_VERSION_FAILURE = 'FETCH_VERSION_FAILURE';
export const FETCH_VERSION = 'FETCH_VERSION';
export const TOGGLE_LIVE = 'TOGGLE_LIVE'
export const UPDATE_VERSION = 'UPDATE_VERSION'
export const UPDATE_ENTIRE_VERSION = 'UPDATE_ENTIRE_VERSION'
export const UPDATE_VERSION_MERGE = 'UPDATE_VERSION_MERGE'
export const SET_LIVE_MODE_MODAL = 'SET_LIVE_MODE_MODAL';
export const REMOVE_FULFILLMENT = 'REMOVE_FULFILLMENT'
export const UPDATE_FULFILLMENT = 'UPDATE_FULFILLMENT'
export const RESET_VERSION = 'RESET_VERSION'