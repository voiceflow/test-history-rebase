import React from 'react'
import { ButtonGroup } from 'reactstrap'
import cn from 'classnames'

import Button from 'components/Button'

export const WidgetBar = ({ toggleKeyboard, keyboardHelp, engine, setOpen, update, open, preview }) =>
    <div id={`widget-bar`} className={cn({
        open: open
    })}>
        <ButtonGroup>
            <Button isWhiteCirc onClick={()=>zoom(1000, engine, update)} className="round-left"><i className="far fa-plus"/></Button>
            <Button isWhiteCirc onClick={()=>zoom(-1000, engine, update)} className="round-right"><i className="far fa-minus"/></Button>
        </ButtonGroup>
        <Button isWhiteCirc className="ml-2" onClick={() => centerDiagram(engine, setOpen)}><i className="fas fa-map-marker-alt"></i></Button>
        {!preview && <Button isWhiteCirc className="ml-2" onClick={() => toggleKeyboard(!keyboardHelp)}><i className="fas fa-keyboard"></i></Button>}
    </div>

const centerDiagram = ( engine, setOpen ) => {
    let model = engine.getDiagramModel()
    let nodes = model.getNodes()
    for (let key in nodes) {
        if (nodes[key].extras && nodes[key].extras.type === 'story') {
            // engine.setSuperSelect(nodes[key])
            nodes[key].setSelected()
            setOpen(true)
            model.setZoomLevel(80)
            model.setOffset((300) - (nodes[key].x * 0.8), (300) - (nodes[key].y * 0.8), true, engine)
            return
        }
    }
}

const zoom = ( delta, engine, update ) => {
    let diagramModel = engine.getDiagramModel()
    const oldZoomFactor = diagramModel.getZoomLevel() / 100
    let scrollDelta = delta / 60

    if (scrollDelta < 0) {
        if (diagramModel.getZoomLevel() + scrollDelta > 10) {
            diagramModel.setZoomLevel(diagramModel.getZoomLevel() + scrollDelta)
        } else {
            diagramModel.setZoomLevel(10)
        }
    } else {
        if (diagramModel.getZoomLevel() + scrollDelta < 150) {
            diagramModel.setZoomLevel(diagramModel.getZoomLevel() + scrollDelta)
        } else {
            diagramModel.setZoomLevel(150)
        }
    }

    const zoomFactor = diagramModel.getZoomLevel() / 100

    const boundingRect = engine.canvas.getBoundingClientRect()
    const clientWidth = boundingRect.width
    const clientHeight = boundingRect.height
    // compute difference between rect before and after scroll
    const widthDiff = clientWidth * zoomFactor - clientWidth * oldZoomFactor
    const heightDiff = clientHeight * zoomFactor - clientHeight * oldZoomFactor
    // compute mouse coords relative to canvas
    const clientX = clientWidth / 2 - boundingRect.left
    const clientY = clientHeight / 2 - boundingRect.top

    // compute width and height increment factor
    const xFactor = (clientX - diagramModel.getOffsetX()) / oldZoomFactor / clientWidth
    const yFactor = (clientY - diagramModel.getOffsetY()) / oldZoomFactor / clientHeight

    diagramModel.setOffset(
        diagramModel.getOffsetX() - widthDiff * xFactor,
        diagramModel.getOffsetY() - heightDiff * yFactor
    )

    update(engine)
}
