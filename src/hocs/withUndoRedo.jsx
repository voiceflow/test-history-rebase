import {withStateHandlers} from 'recompose';
import update from 'immutability-helper';

export const undo = withStateHandlers(
    ({ undo = [] }) => ({
        undoEvents: undo
    }),
    {
        addUndo: ({ undoEvents }) => (node, type) => ({
            undoEvents: update(undoEvents, {$push: [{node: node, eventType: type}]})
        }),
        removeUndo: ({ undoEvents }) => () => ({
            undoEvents: update(undoEvents, {$splice: [[undoEvents.length-1, 1]]}),
        }),
        shiftUndo: ({ undoEvents }) => (value) => ({
            undoEvents: update(undoEvents, {$splice: [[0,1]]})
        }),
        clearUndo: ({ undoEvents }) => () => ({
            undoEvents: []
        })
    }
)

export const redo = withStateHandlers(
    ({ redo = [] }) => ({
        redoEvents: redo
    }),
    {
        addRedo: ({ redoEvents }) => (event) => ({
            redoEvents: update(redoEvents, { $push: [event] })
        }),
        removeRedo: ({ redoEvents }) => () => ({
            redoEvents : update(redoEvents, {$splice: [[redoEvents.length-1, 1]]})
        }),
        clearRedo: () => () => ({
            redoEvents: []
        })
    }
)