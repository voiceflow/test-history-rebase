import { Divider, Dropdown, FlexCenter, Menu, Slider, stopPropagation, SvgIcon, Text } from '@voiceflow/ui';
import React from 'react';

import { useNLUManager } from '@/pages/NLUManager/context';
import { MIN_PAGINATION_ITEMS } from '@/pages/NLUManager/pages/UnclassifiedData/constants';
import { getUnclassifiedDataMaxRange } from '@/pages/NLUManager/utils';

import * as S from './styles';

const PAGE_RANGE = 100;

const TableRangeDropdown: React.FC = () => {
  const nluManager = useNLUManager();
  const showPagination = nluManager.unclassifiedUtterances.length > PAGE_RANGE;
  const [pagination, setPagination] = React.useState(nluManager.unclassifiedDataPage);
  const pages = Math.round(nluManager.unclassifiedUtterances.length / PAGE_RANGE) - 1;
  const maxRange = React.useMemo(() => getUnclassifiedDataMaxRange(nluManager.unclassifiedDataPage), [nluManager.unclassifiedDataPage]);

  const handleIconLeftClick = () => {
    if (maxRange === MIN_PAGINATION_ITEMS) return;
    const newPage = pagination - 1;
    setPagination(newPage);
    nluManager.setUnclassifiedDataPage(newPage);
  };

  const handleIconRightClick = () => {
    if (maxRange === nluManager.unclassifiedUtterances.length) return;
    const newPage = pagination + 1;
    setPagination(newPage);
    nluManager.setUnclassifiedDataPage(newPage);
  };

  React.useEffect(() => {
    setPagination(nluManager.unclassifiedDataPage);
  }, [nluManager.unclassifiedDataPage]);

  return (
    <S.DropdownContainer showPagination={showPagination}>
      <Dropdown
        menu={() => (
          <Menu width={283} swallowMouseDownEvent={false}>
            <S.SliderContainer onClick={stopPropagation()}>
              <Slider
                min={0}
                max={pages}
                included
                onChange={setPagination}
                onAfterChange={() => nluManager.setUnclassifiedDataPage(pagination)}
                value={pagination}
              />

              <FlexCenter>
                <SvgIcon icon="arrowLeftSmall" color="#6E849A" clickable onClick={handleIconLeftClick} />
                <Divider isVertical isSecondaryColor style={{ margin: '0 8px 0 8px' }} />
                <SvgIcon icon="arrowLeftSmall" rotation={180} color="#6E849A" clickable onClick={handleIconRightClick} />
              </FlexCenter>
            </S.SliderContainer>
          </Menu>
        )}
      >
        {(ref, onToggle, isOpen) => (
          <S.DropdownButtonContainer ref={ref} onClick={onToggle} showPagination={showPagination}>
            <Text fontSize={13} color={isOpen ? '#3D82E2' : '#132144'}>
              1 - {maxRange}
            </Text>
            {showPagination && <SvgIcon size={8} icon="caretDown" color={isOpen ? '#3D82E2' : '#6E849A'} />}
          </S.DropdownButtonContainer>
        )}
      </Dropdown>

      <div style={{ marginBottom: '3px' }}>
        <Text fontSize={13} color="#62778C">
          of {nluManager.unclassifiedUtterances.length}
        </Text>
      </div>
    </S.DropdownContainer>
  );
};

export default TableRangeDropdown;
