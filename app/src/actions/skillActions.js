import React from 'react'
import axios from 'axios';
import {Alert} from 'reactstrap'

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

export const updateSkill = (type, val) => ({
    type: "UPDATE_SKILL",
    payload: { type, val }
})

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
        payload: { skill, diagram_id, live_version, live_mode}
    })
    return Promise.resolve()
}

export const fetchSkills = (skill_id, preview) => {
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
