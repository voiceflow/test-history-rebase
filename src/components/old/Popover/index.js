import React from 'react';
import { findDOMNode } from 'react-dom';
import Overlay from 'react-overlays/lib/Overlay';

const PopoverStyle = {
  position: 'absolute',
  padding: '0 10px',
  zIndex: 3,
};

const PopoverInnerStyle = {
  color: '#666',
  backgroundColor: 'transparent',
  boxShadow: '0 2px 9px 0 rgba(0,0,0,0.03)',
  borderRadius: '6px',
};

const PlacementStyles = {
  left: {
    tooltip: { marginLeft: -3, padding: '0 5px' },
    arrow: {
      right: 0,
      marginTop: -5,
      borderWidth: '5px 0 5px 5px',
      borderLeftColor: '#fff',
    },
  },
  right: {
    tooltip: { marginRight: 3, padding: '0 5px' },
    arrow: {
      left: 0,
      marginTop: -5,
      borderWidth: '5px 5px 5px 0',
      borderRightColor: '#fff',
    },
  },
  top: {
    tooltip: { marginTop: -3, padding: '5px 0' },
    arrow: {
      bottom: 0,
      marginLeft: -5,
      borderWidth: '5px 5px 0',
      borderTopColor: '#fff',
    },
  },
  bottom: {
    tooltip: { marginBottom: 3, marginRight: 20, padding: '5px 0' },
    arrow: {
      top: 0,
      marginLeft: -5,
      borderWidth: '0 5px 5px',
      borderBottomColor: '#fff',
    },
  },
};

const PopoverContent = props => {
  const placementStyle = PlacementStyles[props.placement];

  const { style, innerStyle, children } = props;

  return (
    <div
      className="ignore-react-onclickoutside"
      style={{ ...PopoverStyle, ...placementStyle.tooltip, ...style }}
    >
      <div style={{ ...PopoverInnerStyle, ...innerStyle }}>{children}</div>
    </div>
  );
};

const Popover = props => (
  <Overlay
    show={props.show}
    onHide={props.onHide}
    placement={props.placement}
    container={props.container}
    target={() => findDOMNode(props.target)}
    rootClose={props.hideWithOutsideClick || true}
    contentStyle={{ maxWidth: 'none' }}
  >
    <PopoverContent innerStyle={props.style} style={props.containerStyle}>
      {props.children}
    </PopoverContent>
  </Overlay>
);

export default Popover;
