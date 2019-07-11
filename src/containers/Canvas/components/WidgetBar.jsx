import Button from 'components/Button';
import SvgIcon from 'components/SvgIcon';
import React from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';
import HomeIcon from 'svgs/home.svg';
import StarIcon from 'svgs/nav-star.svg';
import ZoomInIcon from 'svgs/zoom-in.svg';
import ZoomOutIcon from 'svgs/zoom-out.svg';

import WidgetBarWrapper from './WidgetBarWrapper';

const BaseWidgetBar = ({ toggleKeyboard, keyboardHelp, engine, setOpen, update, preview, isCanvas, menuOpen }) => (
  <WidgetBarWrapper isCanvas isTest={!isCanvas} menuOpen={menuOpen}>
    <div className="canvas-controls__action __type-dual">
      <Button isWhiteCirc onClick={() => zoom(1000, engine, update)} className="round-left zoom-btn">
        <SvgIcon className="zoom-in-icon" icon={ZoomInIcon} height={14} width={14} />
      </Button>
      <Button isWhiteCirc onClick={() => zoom(-1000, engine, update)} className="round-right zoom-btn">
        <SvgIcon className="zoom-out-icon" icon={ZoomOutIcon} height={14} width={14} />
      </Button>
    </div>
    <Tooltip title="Go to home" position="top" distance={8}>
      <Button isWhiteCirc className="__type-single" onClick={() => centerDiagram(engine, setOpen)}>
        <SvgIcon className="home-icon" icon={HomeIcon} height={14} width={14} />
      </Button>
    </Tooltip>
    {!preview && (
      <Tooltip title="See Shortcuts" position="top" distance={8}>
        <Button isWhiteCirc className="__type-single" onClick={() => toggleKeyboard(!keyboardHelp)}>
          <SvgIcon className="star-icon" icon={StarIcon} height={14} width={14} />
        </Button>
      </Tooltip>
    )}
  </WidgetBarWrapper>
);

const mapStateToProps = (state) => ({
  menuOpen: state.userSetting.menuOpen,
});

export const WidgetBar = connect(mapStateToProps)(BaseWidgetBar);

function centerDiagram(engine, setOpen) {
  const model = engine.getDiagramModel();
  const nodes = model.getNodes();

  // eslint-disable-next-line no-restricted-syntax
  for (const key in nodes) {
    if (nodes[key].extras && nodes[key].extras.type === 'story') {
      // engine.setSuperSelect(nodes[key])
      nodes[key].setSelected();
      setOpen(true);
      model.setZoomLevel(80);
      model.setOffset(300 - nodes[key].x * 0.8, 300 - nodes[key].y * 0.8, true, engine);
      return;
    }
  }
}

function zoom(delta, engine, update) {
  const diagramModel = engine.getDiagramModel();
  const oldZoomFactor = diagramModel.getZoomLevel() / 100;
  const scrollDelta = delta / 60;

  if (scrollDelta < 0) {
    if (diagramModel.getZoomLevel() + scrollDelta > 10) {
      diagramModel.setZoomLevel(diagramModel.getZoomLevel() + scrollDelta);
    } else {
      diagramModel.setZoomLevel(10);
    }
  } else {
    if (diagramModel.getZoomLevel() + scrollDelta < 150) {
      diagramModel.setZoomLevel(diagramModel.getZoomLevel() + scrollDelta);
    } else {
      diagramModel.setZoomLevel(150);
    }
  }

  const zoomFactor = diagramModel.getZoomLevel() / 100;

  const boundingRect = engine.canvas.getBoundingClientRect();
  const clientWidth = boundingRect.width;
  const clientHeight = boundingRect.height;
  // compute difference between rect before and after scroll
  const widthDiff = clientWidth * zoomFactor - clientWidth * oldZoomFactor;
  const heightDiff = clientHeight * zoomFactor - clientHeight * oldZoomFactor;
  // compute mouse coords relative to canvas
  const clientX = clientWidth / 2 - boundingRect.left;
  const clientY = clientHeight / 2 - boundingRect.top;

  // compute width and height increment factor
  const xFactor = (clientX - diagramModel.getOffsetX()) / oldZoomFactor / clientWidth;
  const yFactor = (clientY - diagramModel.getOffsetY()) / oldZoomFactor / clientHeight;

  diagramModel.setOffset(diagramModel.getOffsetX() - widthDiff * xFactor, diagramModel.getOffsetY() - heightDiff * yFactor);

  update(engine);
}
