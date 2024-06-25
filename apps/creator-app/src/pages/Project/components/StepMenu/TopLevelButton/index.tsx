import { Animations, Portal, SvgIcon, Text, usePopper } from '@voiceflow/ui';
import React from 'react';

import { useHover } from '@/hooks';
import { ClassName } from '@/styles/constants';

import type { TopLibraryItem, TopStepItem } from '../constants';
import LibrarySubMenu from '../LibrarySubMenu';
import SubMenu from '../SubMenu';
import { useLibrarySubMenuTabs } from './hooks';
import * as S from './styles';

interface TopLevelButtonItem {
  section: TopStepItem | TopLibraryItem;
  animationIndex: number;
}

const TopLevelButton: React.FC<TopLevelButtonItem> = ({ section, animationIndex }) => {
  const [isHovered, , hoverHandlers, setHovering] = useHover();

  const rootPopper = usePopper({
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [-7, 0] /* Ensure the dropdown menu's top side lines up with the button */,
        },
      },
    ],
    placement: 'right-start',
  });

  const {
    currentTab,
    setCurrentTab,
    tabsData,
    processedTabItems,
    searchText,
    setSearchText,
    cancelSearch,
    showSearchbar,
  } = useLibrarySubMenuTabs({
    librarySections: section.isLibrary ? section.librarySections : { templates: [], customBlocks: [] },
  });

  return (
    <div {...hoverHandlers} className={ClassName.STEP_MENU_ITEM}>
      <Animations.FadeLeft
        distance={-10}
        delay={Math.max(animationIndex, 0) * 0.06}
        duration={animationIndex < 0 ? 0 : 0.1}
      >
        <S.ButtonContainer focused={isHovered} ref={rootPopper.setReferenceElement}>
          {!!section.icon && <SvgIcon icon={section.icon} size={section.label === 'Logic' ? 24 : 22} />}

          <Text paddingTop="3px" fontSize="11px" fontWeight={600}>
            {section.label}
          </Text>
        </S.ButtonContainer>
      </Animations.FadeLeft>

      {section.steps && isHovered && (
        <Portal portalNode={document.body}>
          <div
            ref={rootPopper.setPopperElement}
            style={rootPopper.styles.popper}
            {...rootPopper.attributes.popper}
            className={ClassName.SUB_STEP_MENU}
          >
            {section.isLibrary ? (
              <LibrarySubMenu
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                tabsData={tabsData}
                processedTabItems={processedTabItems}
                searchText={searchText}
                setSearchText={setSearchText}
                cancelSearch={cancelSearch}
                showSearchbar={showSearchbar}
                onDrop={() => setHovering(false)}
              />
            ) : (
              <SubMenu steps={section.steps} onDrop={() => setHovering(false)} />
            )}
          </div>
        </Portal>
      )}
    </div>
  );
};

export default TopLevelButton;
