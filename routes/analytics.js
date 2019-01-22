const { hashids } = require('./../services')
const { getEnvVariable } = require('./../util')
const analytics = new (require('analytics-node'))(getEnvVariable('SEGMENT_WRITE_KEY'))

exports.trackOnboarding = (req, res) => {
    analytics.track({
        userId: req.user.id,
        event: 'Onboarding Survey',
        properties: {
            state: req.body.state
        }
    })
    res.sendStatus(200)
}

exports.trackCanvasTime = (req, res) => {
    analytics.track({
        userId: req.user.id,
        event: 'Canvas Session',
        properties: {
            skill_id: hashids.decode(req.body.skill_id)[0],
            duration: req.body.duration / 1000
        }
    })
    res.sendStatus(200)
}