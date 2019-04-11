import { findDOMNode } from 'react-dom'
import memoizeOne from 'memoize-one'

const getBoundingRect = component => memoizeOne(findDOMNode(component).getBoundingClientRect())

export const style = {
    backgroundColor: 'white',
}

export const source = {
    beginDrag(props) {
        return {
            id: props.id,
            index: props.index,
            section: props.section,
        }
    }
}

export const target = {
    hover(props, monitor, component){
        if (!component || props.section !== 'favorites' || monitor.getItem().section !== 'favorites') return null;

        const dragIndex = monitor.getItem().index
        const hoverIndex = props.index

        if (dragIndex === hoverIndex) return;

        const hoverBoundingRect = getBoundingRect(component)
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

        const clientOffset = monitor.getClientOffset()

        const hoverClientY = clientOffset.y - hoverBoundingRect.top
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

        props.reorder(dragIndex, hoverIndex)
        monitor.getItem().index = hoverIndex
    }
}