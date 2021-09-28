import { TippyTooltip, TippyTooltipProps, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import { useKeygen, useOnScreen } from '@/hooks';
import { ClassName } from '@/styles/constants';

import { ActiveLine, Tab as TabItem, Wrapper } from './components';

export interface Tab<V extends string = string> {
  id?: string;
  value: V;
  label: React.ReactNode;
  color?: string;
  tooltip?: TippyTooltipProps;
  [key: string]: any;
}

export interface TabsProps<V extends string = string> {
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
  options: Tab<V>[];
  onChange: (nextSelected: V) => void;
  innerRef?: boolean;
  selected?: V;
}

const Tabs = <V extends string = string>({ as = 'button', options, selected, onChange, innerRef }: TabsProps<V>): React.ReactElement<any, any> => {
  const genKey = useKeygen();
  const tabsRef = React.useRef<Record<string, HTMLElement | null>>({});
  const activeLineRef = React.useRef<HTMLDivElement>(null);
  const [activeLineColor, setActiveLineColor] = React.useState<string | undefined>();

  const onRef = (value: string) => (node: HTMLElement | null) => {
    tabsRef.current[value] = node;
  };
  const ref = React.useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(ref);

  useDidUpdateEffect(() => {
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
  }, [options, selected, isVisible]);

  return (
    <Wrapper ref={ref} className={ClassName.TABS}>
      {options.map(({ value, label, color, tooltip, ...tabProps }) => {
        const tab = (
          <TabItem
            {...tabProps}
            {...{ [innerRef ? 'innerRef' : 'ref']: tooltip ? null : onRef(value) }}
            as={as}
            key={genKey(value)}
            color={color}
            onClick={() => onChange(value)}
            isActive={selected === value}
            className={ClassName.TAB}
          >
            {label}
          </TabItem>
        );

        return tooltip ? (
          <TippyTooltip {...tooltip} tag="div" key={genKey(value)} ref={(instance) => onRef(value)(instance?.tooltipDOM ?? null)}>
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
