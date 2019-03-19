import _ from 'lodash';

export const combineAppendValidation = current => {
    if (current === 'temp' || !current.extras) {
        return false;
    }
    switch(current.extras.type){
        case 'exit':
            return false;
        case 'interaction':
            return false;
        case 'choice':
            return false;
        case 'if':
            return false;
        case 'stream':
            return false;
        case 'random':
            return false;
        default:
            return true;
    }
}

export const appendValidator = node => {
    if (!node.extras) {
        return false;
    }
    switch (node.extras.type) {
        case 'god':
            return false;
        case 'story':
            return false;
        case 'flow':
            return false;
        case 'intent':
            return false;
        case 'comment':
            return false;
        case 'command':
            return false;
        default:
            return true;
    }
}

export const combineValidation = (current, target, setError) => {
    if (current.parentCombine || target.parentCombine) {
        return false;
    }
    if (current.extras.type === 'god' && target.extras.type === 'god'){
        setError('cannot combine two combine blocks')
        return false;
    }
    if (!_.isEmpty(target.combines) && _.last(target.combines) !== 'temp') {
        switch(_.last(target.combines).extras.type){
            case 'exit':
                switch(current.extras.type){
                    case 'exit':
                        return false;
                    case 'choice':
                        return false;
                    case 'stream':
                        return false;
                    case 'interaction':
                        return false;
                    case 'if':
                        return false;
                    case 'random':
                        return false;
                    default:
                        break;
                }
                break;
            case 'choice':
                switch(current.extras.type){
                    case 'choice':
                        return false;
                    case 'exit':
                        return false;
                    case 'stream':
                        return false;
                    case 'interaction':
                        return false
                    case 'if':
                        return false;
                    case 'random':
                        return false;
                    default:
                        break;
                }
                break;
            case 'stream':
                switch(current.extras.type){
                    case 'stream':
                        return false;
                    case 'exit':
                        return false;
                    case 'choice':
                        return false;
                    case 'interaction':
                        return false;
                    case 'if':
                        return false;
                    case 'random':
                        return false;
                    default:
                        break;
                }
                break;
            case 'interaction':
                switch(current.extras.type){
                    case 'interaction':
                        return false;
                    case 'exit':
                        return false;
                    case 'choice':
                        return false;
                    case 'stream':
                        return false;
                    case 'if':
                        return false;
                    case 'random':
                        return false;
                    default:
                        break;
                }
                break;
            case 'if':
                switch(current.extras.type){
                    case 'if':
                        return false;
                    case 'exit':
                        return false;
                    case 'choice':
                        return false;
                    case 'stream':
                        return false;
                    case 'interaction':
                        return false;
                    case 'random':
                        return false;
                    default:
                        break;
                }
            break;
            case 'random':
                switch(current.extras.type){
                    case 'if':
                        return false;
                    case 'exit':
                        return false;
                    case 'choice':
                        return false;
                    case 'stream':
                        return false;
                    case 'interaction':
                        return false;
                    case 'random':
                        return false;
                    default:
                        break;
                }
            break;
        default:
            break;
        }
    }
    switch(target.extras.type){
        case 'story':
            return false;
        case 'flow':
            return false;
        case 'intent':
            return false;
        case 'comment':
            return false;
        case 'command':
            return false;
        default:
            break;
    }
    switch(current.extras.type){
        case 'god':
            return false;
        case 'story':
            return false;
        case 'flow':
            return false;
        case 'intent':
            return false;
        case 'comment':
            return false;
        case 'command':
            return false;
        default:
            return true;
    }
}