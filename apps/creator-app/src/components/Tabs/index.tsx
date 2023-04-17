import { TippyTooltip, TippyTooltipProps } from '@voiceflow/ui';
import React from 'react';

import { useKeygen, useOnScreen, useRAF } from '@/hooks';
import { ClassName } from '@/styles/constants';

import { ActiveLine, Tab as TabItem, Wrapper } from './components';

export interface Tab<V extends string = string> {
  id?: string;
  value: V;
  label: React.ReactNode;
  color?: string;
  tooltip?: TippyTooltipProps;
  capitalize?: boolean;
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
  const tabsRef = React.useRef<Record<string, Element | null>>({});
  const activeLineRef = React.useRef<HTMLDivElement>(null);

  const genKey = useKeygen();
  const [scheduler] = useRAF();

  const selectedOption = React.useMemo(() => options.find(({ value }) => value === selected), [options, selected]);

  const onRef = (value: string) => (node: Element | null) => {
    tabsRef.current[value] = node;
  };

  const ref = React.useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(ref);

  React.useLayoutEffect(() => {
    const selectedNode = selectedOption ? tabsRef.current[selectedOption.value] : null;

    if (selectedNode && selectedNode.parentNode) {
      const { parentNode } = selectedNode;

      if (!(parentNode instanceof Element)) return;

      scheduler(() => {
        const { left: wrapperNodeLeft } = parentNode.getBoundingClientRect();
        const { left: selectedNodeLeft } = selectedNode.getBoundingClientRect();

        if (activeLineRef.current) {
          activeLineRef.current.style.width = `${selectedNode.clientWidth}px`;
          activeLineRef.current.style.transform = `translateX(${selectedNodeLeft - wrapperNodeLeft}px)`;
        }
      });
    }
  }, [options, selectedOption, isVisible]);

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
          <TippyTooltip
            {...tooltip}
            tag="div"
            key={genKey(value)}
            ref={(instance) => onRef(value)(instance ?? null)}
            style={{ display: 'block', height: '100%', ...tooltip.style }}
          >
            {tab}
          </TippyTooltip>
        ) : (
          tab
        );
      })}

      <ActiveLine color={selectedOption?.color} ref={activeLineRef} />
    </Wrapper>
  );
};

export default Tabs;
