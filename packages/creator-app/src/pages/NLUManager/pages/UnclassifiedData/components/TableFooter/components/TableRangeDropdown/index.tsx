import { Box, Divider, Dropdown, FlexCenter, Menu, Slider, stopPropagation, SvgIcon, Text } from '@voiceflow/ui';
import React from 'react';

import { useNLUManager } from '@/pages/NLUManager/context';
import { MIN_PAGINATION_ITEMS } from '@/pages/NLUManager/pages/UnclassifiedData/constants';
import { getUnclassifiedDataMaxRange } from '@/pages/NLUManager/utils';

import * as S from './styles';

const PAGE_RANGE = 100;

const TableRangeDropdown: React.OldFC = () => {
  const nluManager = useNLUManager();
  const showPagination = nluManager.unclassifiedUtterances.length > PAGE_RANGE;
  const [pagination, setPagination] = React.useState(nluManager.unclassifiedDataPage);
  const pages = Math.round(nluManager.totalUnclassifiedItems / PAGE_RANGE);
  const maxRange = React.useMemo(() => getUnclassifiedDataMaxRange(nluManager.unclassifiedDataPage), [nluManager.unclassifiedDataPage]);

  const handleIconLeftClick = () => {
    if (maxRange === MIN_PAGINATION_ITEMS) return;
    const newPage = pagination - 1;
    setPagination(newPage);
    nluManager.setUnclassifiedDataPage(newPage);
    nluManager.scrollToTop();
  };

  const handleIconRightClick = () => {
    const newPage = pagination + 1;
    if (newPage > pages) return;
    setPagination(newPage);
    nluManager.setUnclassifiedDataPage(newPage);
    nluManager.scrollToTop();
  };

  const handleDataChange = (newPage: number) => {
    if (newPage > pages) return;
    setPagination(newPage);
    nluManager.setUnclassifiedDataPage(newPage);
    nluManager.scrollToTop();
  };

  React.useEffect(() => {
    if (nluManager.unclassifiedDataPage === pagination) return;
    setPagination(nluManager.unclassifiedDataPage);
  }, [nluManager.unclassifiedDataPage]);

  return (
    <S.DropdownContainer showPagination={showPagination}>
      <Dropdown
        menu={() => (
          <Menu width={283} swallowMouseDownEvent={false}>
            <S.SliderContainer onClick={stopPropagation()}>
              <Slider min={0} max={pages} included onChange={handleDataChange} value={pagination} color="#3d82e2" />

              <FlexCenter>
                <SvgIcon icon="arrowLeftSmall" color="#6E849A" clickable onClick={handleIconLeftClick} variant={SvgIcon.Variant.STANDARD} />
                <Divider isVertical isSecondaryColor style={{ margin: '0 8px 0 8px' }} />
                <SvgIcon
                  icon="arrowLeftSmall"
                  rotation={180}
                  color="#6E849A"
                  clickable
                  onClick={handleIconRightClick}
                  variant={SvgIcon.Variant.STANDARD}
                />
              </FlexCenter>
            </S.SliderContainer>
          </Menu>
        )}
      >
        {({ ref, onToggle, isOpen }) => (
          <S.DropdownButtonContainer
            ref={ref}
            onClick={() => {
              if (!showPagination) return;
              onToggle();
            }}
            showPagination={showPagination}
          >
            <Text fontSize={13} color={isOpen ? '#3D82E2' : '#132144'}>
              {nluManager.unclassifiedDataPage * PAGE_RANGE} - {maxRange}
            </Text>
            {showPagination && <SvgIcon size={10} icon="arrowLeft" rotation={270} active={isOpen} variant={SvgIcon.Variant.STANDARD} clickable />}
          </S.DropdownButtonContainer>
        )}
      </Dropdown>

      <Box mb={3}>
        <Text fontSize={13} color="#62778C">
          of {nluManager.unclassifiedUtterances.length}
        </Text>
      </Box>
    </S.DropdownContainer>
  );
};

export default TableRangeDropdown;
