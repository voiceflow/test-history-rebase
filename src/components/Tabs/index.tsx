import React from 'react';

import TippyTooltip from '@/components/TippyTooltip';
import { useKeygen } from '@/hooks';

import { ActiveLine, Tab, Wrapper } from './components';

export type Tab = {
  value: string;
  label: React.ReactNode;
  color?: string;
  [key: string]: any;
};

export type TabsProps = {
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
  options: Tab[];
  onChange: (nextSelected: string) => void;
  innerRef?: boolean;
  selected?: string;
};

const Tabs: React.FC<TabsProps> = ({ as = 'button', options, selected, onChange, innerRef }) => {
  const genKey = useKeygen();
  const tabsRef = React.useRef<Record<string, HTMLElement | null>>({});
  const activeLineRef = React.useRef<HTMLDivElement>(null);
  const [activeLineColor, setActiveLineColor] = React.useState<string | undefined>();

  const onRef = (value: string) => (node: HTMLElement | null) => {
    tabsRef.current[value] = node;
  };

  React.useEffect(() => {
    const selectedOption = options.find(({ value }) => value === selected);
    const selectedNode = selectedOption ? tabsRef.current[selectedOption.value] : null;
    let animationFrame: number;

    if (selectedOption?.color) {
      setActiveLineColor(selectedOption.color);
    }

    if (selectedNode && selectedNode.parentNode) {
      animationFrame = requestAnimationFrame(() => {
        const parentNode = selectedNode.parentNode as HTMLElement; // eslint-disable-line xss/no-mixed-html

        const { left: wrapperNodeLeft } = parentNode.getBoundingClientRect?.();
        const { left: selectedNodeLeft } = selectedNode.getBoundingClientRect();

        if (activeLineRef.current) {
          activeLineRef.current.style.width = `${selectedNode.clientWidth}px`;
          activeLineRef.current.style.transform = `translateX(${selectedNodeLeft - wrapperNodeLeft}px)`;
        }
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
      {options.map(({ value, label, color, tooltip, ...tabProps }) => {
        const tab = (
          <Tab
            {...tabProps}
            {...{ [innerRef ? 'innerRef' : 'ref']: tooltip ? null : onRef(value) }}
            as={as}
            color={color}
            key={genKey(value)}
            onClick={() => onChange(value)}
            isActive={selected === value}
          >
            {label}
          </Tab>
        );

        return tooltip ? (
          <TippyTooltip
            {...tooltip}
            tag="div"
            key={genKey(value)}
            ref={(instance) => onRef(value)(instance?.tooltipDOM ?? null)}
            className="tab-tooltip"
          >
            {tab}
          </TippyTooltip>
        ) : (
          tab
        );
      })}

      <ActiveLine color={activeLineColor} ref={activeLineRef} />
    </Wrapper>
  );
};

export default Tabs;
