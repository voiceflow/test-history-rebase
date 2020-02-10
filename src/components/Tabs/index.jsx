import PropTypes from 'prop-types';
import React from 'react';

import { useKeygen } from '@/components/KeyedComponent';

import ActiveLine from './components/ActiveLine';
import Tab from './components/Tab';
import Wrapper from './components/Wrapper';

function Tabs({ as = 'button', options, selected, onChange, innerRef }) {
  const genKey = useKeygen();
  const tabsRef = React.useRef({});
  const activeLineRef = React.useRef(null);
  const [activeLineColor, setActiveLineColor] = React.useState(null);

  const onRef = (value) => (node) => {
    tabsRef.current[value] = node;
  };

  React.useEffect(() => {
    const selectedOption = options.find(({ value }) => value === selected);
    const selectedNode = tabsRef.current[(selectedOption?.value)];
    let animationFrame;

    if (selectedOption?.color) {
      setActiveLineColor(selectedOption.color);
    }

    if (selectedNode && selectedNode.parentNode) {
      animationFrame = requestAnimationFrame(() => {
        const { left: wrapperNodeLeft } = selectedNode.parentNode.getBoundingClientRect();
        const { left: selectedNodeLeft } = selectedNode.getBoundingClientRect();

        activeLineRef.current.style.width = `${selectedNode.clientWidth}px`;
        activeLineRef.current.style.transform = `translateX(${selectedNodeLeft - wrapperNodeLeft}px)`;
      });
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [options, selected]);

  return (
    <Wrapper>
      {options.map(({ value, label, color, ...tabProps }) => (
        <Tab
          {...tabProps}
          {...{ [innerRef ? 'innerRef' : 'ref']: onRef(value) }}
          color={color}
          as={as}
          key={genKey(value)}
          onClick={() => onChange(value)}
          isActive={selected === value}
        >
          {label}
        </Tab>
      ))}

      <ActiveLine color={activeLineColor} ref={activeLineRef} />
    </Wrapper>
  );
}

Tabs.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any,
      label: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    })
  ).isRequired,
  selected: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  innerRef: PropTypes.bool,
};

export default Tabs;
