import React from 'react'
import axios from 'axios';
import {Alert} from 'reactstrap'
import { getSlotsForKeys } from './../util'
import { getIntentSlots } from './../Helper'
import _ from 'lodash'

export const fetchSkillsBegin = () => ({
  type: "FETCH_SKILL_BEGIN"
});

export const fetchSkillsSuccess = skills => ({
  type: "FETCH_SKILLS_SUCCESS",
  payload: { skills }
});

export const fetchSkillsBlocked = message => ({
    type: "FETCH_SKILLS_BLOCKED",
    payload: { message }
})

export const resetSkill = () => ({
    type: "RESET_SKILL",
})

export const fetchSkillsFailure = error => ({
  type: "FETCH_SKILLS_FAILURE",
  payload: { error }
});

export const fetchLiveSkillsSuccess = (live, show) => ({
    type: "FETCH_LIVE_SKILLS_SUCCESS",
    payload: { live, show }
})

export const fetchDevSkillsSuccess = (dev_skill) => ({
    type: "FETCH_DEV_SKILLS_SUCCESS",
    payload: { dev_skill }
})

export const setLiveModeModal = isLive => ({
    type: "SET_LIVE_MODE_MODAL",
    payload: { isLive }
})

export const updateSkill = (type, val) => dispatch => {
    dispatch({
        type: "UPDATE_SKILL",
        payload: { type, val }
    })
    return Promise.resolve()
}

export const updateEntireSkill = (skill) => ({
    type: "UPDATE_ENTIRE_SKILL",
    payload: { skill }
})

export const updateSkillMerge = (type, val) => ({
    type: "UPDATE_SKILL_MERGE",
    payload: { type, val }
})

export const toggleLive = (skill, diagram_id, live_version, live_mode) => dispatch => {
    dispatch({
        type: "TOGGLE_LIVE",
        payload: { skill, diagram_id, live_version, live_mode }
    })
    return Promise.resolve()
}

export const removeFulfillment = intent_key => ({
    type: "REMOVE_FULFILLMENT",
    payload: { intent_key }
})

export const updateFulfillment = ( intent_key, slot_config ) => ({
    type: "UPDATE_FULFILLMENT",
    payload: { intent_key, slot_config }
})

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
        dispatch(updateSkill('intents', intents))
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

export const fetchSkills = (skill_id, preview, diagram_id) => {
    return dispatch => {
        dispatch(fetchSkillsBegin());
        return axios.get(`/skill/${skill_id}?${preview ? 'preview=1' : 'simple=1'}`, {
                headers: {
                    Pragma: 'no-cache'
                }
            })
            .then(res => {
                let skill = res.data
                if (preview && !skill.preview) {
                    dispatch(fetchSkillsBlocked(<Alert color="danger">Preview not enabled for this skill</Alert>))
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
                dispatch(fetchDevSkillsSuccess(skill))
                dispatch(fetchLiveSkills(skill_id))
                dispatch(fetchSkillsSuccess(skill))
            })
            .catch(err => {
                dispatch(fetchSkillsFailure('Unable to load project'))
            })
    }
}

export const fetchLiveSkills = skill_id => {
    return dispatch => {
        dispatch(fetchSkillsBegin());
        return axios.get(`/skill/${skill_id}/live_version`)
            .then(res => {
                if (skill_id === res.data.live_version){
                    dispatch(fetchDevSkills(skill_id))
                }
                dispatch(fetchLiveSkillsSuccess(res.data.live_version, skill_id === res.data.live_version))
            })
            .catch(err => {
                console.error(err)
                dispatch(fetchSkillsFailure('Unable to load live versions'))
            })
    }
}

export const fetchDevSkills = skill_id => {
    return dispatch => {
        dispatch(fetchSkillsBegin());
        return axios.get(`/skill/${skill_id}/dev_version`)
            .then(res => {
                dispatch(fetchDevSkillsSuccess(res.data))
            })
            .catch(err => {
                console.error(err)
                dispatch(fetchSkillsFailure('Unable to fetch dev skills'))
            })
    }
}

export const FETCH_SKILLS_BEGIN = 'FETCH_SKILLS_BEGIN';
export const FETCH_SKILLS_SUCCESS = 'FETCH_SKILLS_SUCCESS';
export const FETCH_LIVE_SKILLS_SUCCESS = 'FETCH_LIVE_SKILLS_SUCCESS'
export const FETCH_DEV_SKILLS_SUCCESS = 'FETCH_DEV_SKILLS_SUCCESS'
export const FETCH_SKILLS_FAILURE = 'FETCH_SKILLS_FAILURE';
export const FETCH_SKILLS = 'FETCH_SKILLS';
export const TOGGLE_LIVE = 'TOGGLE_LIVE'
export const UPDATE_SKILL = 'UPDATE_SKILL'
export const UPDATE_ENTIRE_SKILL = 'UPDATE_ENTIRE_SKILL'
export const UPDATE_SKILL_MERGE = 'UPDATE_SKILL_MERGE'
export const SET_LIVE_MODE_MODAL = 'SET_LIVE_MODE_MODAL';
export const REMOVE_FULFILLMENT = 'REMOVE_FULFILLMENT'
export const UPDATE_FULFILLMENT = 'UPDATE_FULFILLMENT'
export const RESET_SKILL = 'RESET_SKILL'