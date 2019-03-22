const { pool, hashids, analytics, writeToLogs } = require('./../services')

exports.trackSessionTime = (req, res) => {
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

exports.trackCanvasTime = (req, res) => {
    if (req.body.duration) {
        analytics.track({
            userId: req.user.id,
            event: 'Active Canvas Session',
            properties: {
                skill_id: hashids.decode(req.body.skill_id)[0],
                duration: req.body.duration / 1000
            }
        })
    }
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
    let isQualified = false;
    pool.query(`SELECT * FROM user_info WHERE creator_id = $1`, [req.user.id], (err, data) => {
        if (err){
            writeToLogs('CREATOR_BACKEND_ERRORS', {err: err})
        }
        if (data.rows.length > 0 && data.rows[0].creator_id === req.user.id){
            if (data.rows[0].purpose === 'IDEA'){
                isQualified = true;
            }
        }
    })
    analytics.track({
        userId: req.user.id,
        event: 'Dev Account Setup',
        properties: {
            isQualified: isQualified
        },
    })
    res.sendStatus(200)
}