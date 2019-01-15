const {find} = require('lodash')

const intentHasSlots = (intent) => {
    for (let i = 0; i < intent.inputs.length; i++) {
        const input = intent.inputs[i]
        if (input.slots && input.slots.length > 0) {
            return true
        }
    }
    return false
}

const getIntentSlots = (intent, slots_set) => {
    if (!intent) {
        return []
    }
    const slot_keys = new Set()
    const slots = []
    for (let i = 0; i < intent.inputs.length; i++) {
        const input = intent.inputs[i]
        if (input.slots && input.slots.length > 0) {
            input.slots.forEach(slot_key => {
                if (!slot_keys.has(slot_key)) {
                    slot_keys.add(slot_key)
                    const slot_obj = find(slots_set, {
                        key: slot_key
                    })
                    if (slot_obj) slots.push(slot_obj)
                }
            })
        }
    }
    return slots
}

exports.intentHasSlots = intentHasSlots;
exports.getIntentSlots = getIntentSlots;