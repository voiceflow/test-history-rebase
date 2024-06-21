import * as Realtime from '@voiceflow/realtime-sdk';
import { Animations, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import * as Documentation from '@/config/documentation';
import { DragItem } from '@/constants';
import { useDragPreview } from '@/hooks/dnd.hook';
import { useFeature } from '@/hooks/feature.hook';

import { LibraryDragItem, LibraryStepType, TabData } from '../constants';
import Searchbar from '../Search';
import * as S from '../SubMenu/styles';
import Tabs from '../Tabs';
import { BASE_DELAY, DELAY_INCREMENT } from './constants';
import * as C from './containers';
import EmptyList from './EmptyList';
import Footer from './Footer';
import { useCustomBlockCreatorModal } from './hooks';
import LibrarySubMenuButton from './LibrarySubMenuButton';

interface LibrarySubMenuProps {
  onDrop: VoidFunction;
  currentTab: LibraryStepType;
  setCurrentTab: (newTab: LibraryStepType) => void;
  tabsData: { tabType: LibraryStepType; label: string }[];
  processedTabItems: TabData[];
  searchText: string;
  setSearchText: (newSearchText: string) => void;
  cancelSearch: VoidFunction;
  showSearchbar: boolean;
}

const LibrarySubMenu: React.FC<LibrarySubMenuProps> = ({
  currentTab,
  setCurrentTab,
  tabsData,
  processedTabItems,
  searchText,
  setSearchText,
  cancelSearch,
  showSearchbar,
  onDrop,
}) => {
  const mvpCustomBlocks = useFeature(Realtime.FeatureFlag.MVP_CUSTOM_BLOCK);

  const menuRef = React.useRef<HTMLDivElement>(null);

  const { openCustomBlocksCreatorModal } = useCustomBlockCreatorModal();

  useDragPreview<LibraryDragItem<TabData>>(
    DragItem.LIBRARY,
    (dragProps) => (
      <div style={{ width: `${(menuRef.current?.clientWidth ?? 154) - 12}px` }}>
        <LibrarySubMenuButton
          label={dragProps.tabData.name}
          tabData={dragProps.tabData}
          onDrop={onDrop}
          isDraggingPreview
          type={currentTab}
        />
      </div>
    ),
    { horizontalEnabled: true }
  );

  const { entityName, docLink } = React.useMemo(
    () =>
      currentTab === LibraryStepType.BLOCK_TEMPLATES
        ? {
            entityName: 'templates',
            docLink: Documentation.TEMPLATE_STEP,
          }
        : {
            entityName: 'blocks',
            docLink: Documentation.CUSTOM_BLOCK_EDITOR,
          },
    [currentTab]
  );

  return (
    <S.SubMenuContainer ref={menuRef} defaultPadding={0} width={240}>
      {mvpCustomBlocks && (
        <>
          <C.TabsContainer>
            <Tabs currentTab={currentTab} tabs={tabsData} onTabChange={setCurrentTab} />
          </C.TabsContainer>

          <SectionV2.Divider />
        </>
      )}

      {showSearchbar && (
        <>
          <C.SearchContainer>
            <Searchbar value={searchText} onSearch={setSearchText} onCancel={cancelSearch} />
          </C.SearchContainer>
          <SectionV2.Divider />
        </>
      )}

      {processedTabItems.length === 0 && (
        <C.EmptyListContainer>
          <Animations.FadeDownDelayed delay={BASE_DELAY}>
            {searchText !== '' ? (
              <Searchbar.EmptyListText onClick={cancelSearch} />
            ) : (
              <EmptyList entityName={entityName} docLink={docLink} />
            )}
          </Animations.FadeDownDelayed>
        </C.EmptyListContainer>
      )}

      {processedTabItems.length > 0 && (
        <C.FilledListContainer>
          {processedTabItems.map((tabData, index) => (
            <Animations.FadeDownDelayed key={tabData.id} delay={BASE_DELAY + index * DELAY_INCREMENT}>
              <LibrarySubMenuButton label={tabData.name} tabData={tabData} onDrop={onDrop} type={currentTab} />
            </Animations.FadeDownDelayed>
          ))}
        </C.FilledListContainer>
      )}

      {currentTab === LibraryStepType.CUSTOM_BLOCK && (
        <>
          <SectionV2.Divider />
          <Footer openCustomBlocksEditorModal={openCustomBlocksCreatorModal} />
        </>
      )}
    </S.SubMenuContainer>
  );
};

export default LibrarySubMenu;
