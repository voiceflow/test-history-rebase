import { Portal, portalRootNode, stopPropagation } from '@voiceflow/ui';
import React, { Ref } from 'react';
import { Manager, Popper, PopperProps, Reference } from 'react-popper';

import { useDismissable } from '@/hooks';
import { FadeDownDelayedContainer, SlideContainer } from '@/styles/animations';
import { Nullable } from '@/types';

import { SelectMenuContainer, SelectMenuHeader } from './components';

export { MenuSection } from './components';

const DEFAULT_PORTAL_NODE = document.body;

export type DropdownPlacement = PopperProps['placement'];

interface SelectMenuProps {
  children: (ref: Ref<any>, onToggle: () => void, isOpen: boolean, data: any) => React.ReactNode;
  selfDismiss?: boolean;
  portal?: HTMLElement;
  placement?: DropdownPlacement;
  sections: (setData: (data: any) => void, data: any) => any;
  data?: any;
  actionDisabled?: boolean;
}

const SelectMenu: React.FC<SelectMenuProps> = ({
  children,
  sections,
  selfDismiss = false,
  portal = DEFAULT_PORTAL_NODE,
  placement = 'bottom-start',
  data = {},
  actionDisabled,
}) => {
  const containerRef = React.useRef<Nullable<HTMLDivElement>>(null);
  const [menuData, setMenuData] = React.useState(data);
  const [isOpen, onToggle] = useDismissable(false, { ref: selfDismiss ? containerRef : undefined });

  const clearData = () => {
    setMenuData({});
  };

  return (
    <Manager>
      <Reference>{({ ref }) => children(ref, onToggle, isOpen, data)}</Reference>
      {isOpen && (
        <Portal portalNode={portal}>
          <Popper modifiers={{ preventOverflow: { boundariesElement: portalRootNode } }} placement={placement}>
            {({ ref, style, placement }) => (
              <div ref={ref} style={{ ...style }} data-placement={placement}>
                <SlideContainer onClick={stopPropagation(null, true)}>
                  <SelectMenuContainer>
                    <FadeDownDelayedContainer>
                      <SelectMenuHeader actionDisabled={actionDisabled} onClear={clearData} title="All filters" />
                      {sections(setMenuData, menuData)}
                    </FadeDownDelayedContainer>
                  </SelectMenuContainer>
                </SlideContainer>
              </div>
            )}
          </Popper>
        </Portal>
      )}
    </Manager>
  );
};

export default SelectMenu;
