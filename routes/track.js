const { hashids, analytics } = require('./../services')

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

exports.trackOnboarding = (req, res) => {
    analytics.track({
        userId: req.user.id,
        event: 'Onboarding Page',
        properties: {
            page: req.body.page
        }
    })
    res.sendStatus(200)
}

exports.trackFirstSessionUpload = (req, res) => {
    analytics.track({
        userId: req.user.id,
        event: 'First Session Upload'
    })
    res.sendStatus(200)
}

exports.trackFirstProject = (req, res) => {
    analytics.track({
        userId: req.user.id,
        event: 'Started First Project'
    })
    res.sendStatus(200)
}

exports.trackDevAccount = (req, res) => {
    analytics.track({
        userId: req.user.id,
        event: 'Dev Account Setup'
    })
    res.sendStatus(200)
}