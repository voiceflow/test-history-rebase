import React from 'react'
import cloneDeep from 'lodash/cloneDeep';

const SECTIONS = [{
    title: 'basic',
    items: [
        { text: 'Speak', type: 'speak', icon: <i className="fas fa-comment"/>, tip: 'Tell Alexa to play sounds or talk to the user' },
        { text: 'Choice', type: 'choice', icon: <i className="fas fa-project-diagram"/>, tip: 'Listen for the user to make a choice from a list of options you set'  },
    ]
},{
    title: 'logic',
    items: [
        { text: 'Set', type: 'set', icon: <i className="fas fa-code"/>, tip: 'Set the value of a variable, or many variables at once' },
        { text: 'If', type: 'if', icon: <i className="fas fa-code-branch"/>, tip: 'Set conditions that activate paths only when true' },
        { text: 'Capture', type: 'capture', icon: <i className="fas fa-microphone"/>, tip: 'Capture what the user says into a variable' },
        { text: 'Random', type: 'random', icon: <i className="fas fa-random"/>, tip: 'Choose randomly from a set number of paths' },
   ]
},{
    title: 'advanced',
    items: [
        { text: 'Intent', type: 'intent', icon: <i className="fas fa-step-forward"/>, tip: 'Handle intents, from within the skill and upon skill launch with CanFulfillIntent)'},
        { text: 'Command', type: 'command', icon: <i className="fas fa-exclamation"/>, tip: 'Give users info about their current state'},
        { text: 'Interaction', type: 'interaction', icon: <i className="fas fa-user-alt"/>, tip: 'Select choices and capture slot values from user input' },
        { text: 'Stream', type: 'stream', icon: <i className="fas fa-play"/>, tip: 'Stream long audio files & URLs for the user' },
        { text: 'API', type: 'api', icon: <i className="fas fa-globe"/>, tip: 'Use external APIs and store responses into variables' },
        { text: 'Flow', type: 'flow', icon: <i className="fas fa-clone"/>, tip: 'Organize your project into manageable sections or perform computations'},
   ]
},{
    title: 'functional',
    items: [
        { text: 'Exit', type: 'exit', icon: <i className="fas fa-sign-out"/>, tip: 'End the skill on the current flow' },
        { text: 'Combine', type: 'combine', icon: <i className="fas fa-compress-alt"/>, tip: 'Combine Different Audio Files to bypass Amazon 5 Audio limit' },
        { text: 'Comment', type: 'comment', icon: <i className="far fa-comment-alt"/>, tip: 'Add notes to your diagram'},
    ]
},{
    title: 'visuals',
    items: [
        { text: 'Card', type: 'card', icon: <i className="fas fa-sticky-note"/>, tip: 'Tell Alexa to show a card'  },
        { text: 'Display', type: 'display', icon: <i className="far fa-image"/>, tip: 'Show a Multimodal Display on the screen using APL' }
    ]
}]

const getSections = () => {
    let sections = cloneDeep(SECTIONS);

    // premium blocks
    if(window.user_detail.admin > 0){
        sections.push({
            title: 'business',
            items: [
                { text: 'Permissions', type: 'permissions', icon: <i className="fas fa-lock"></i>, tip: 'Ask users for access to their info (Name, Email, Phone)'  },
                { text: 'Mail', type: 'mail', icon: <i className="fas fa-envelope"></i>, tip: 'Send Emails via SendGrid' },
                { text: 'Link Account', type: 'link_account', icon: <i className="far fa-link"/>, tip: 'Retrieve access token from external account' },
                { text: 'Payment', type: 'payment', icon: <i className="fas fa-dollar-sign"/>, tip: 'Request payment from user'},
                { text: 'Cancel Payment', type: 'cancel', icon: <i className="fas fa-user-minus"/>, tip: 'Refund a purchase or cancel an user\'s subscription'}
            ]
        })
    }
    if(window.user_detail.admin >= 60){
        sections[sections.length-1].items.push({ text: 'Reminder', type: 'reminder', icon: <i className="fas fa-bell"/>, tip: 'Send a remind to the user in a set amount of time'})
    }

    return sections
}

const getBlocks = () => {
    let blocks = []
    getSections().forEach(section => {
        if(Array.isArray(section.items)){
            section.items.forEach(block => blocks.push(block))
        }
    })

    return blocks
}

export {
    getSections,
    getBlocks
}
