import { Box, Dropdown, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import * as Domain from '@/ducks/domain';
import { useSelector } from '@/hooks';

import HistoryDivider from '../HistoryDivider';
import { Menu } from './components';
import * as S from './styles';

const DomainsActions: React.FC = () => {
  const domain = useSelector(Domain.active.domainSelector);

  if (!domain) return null;

  return (
    <>
      <Box.Flex ml={8} gap={8} overflow="hidden">
        <HistoryDivider />

        <Dropdown menu={(onToggle) => <Menu onClose={onToggle} />} offset={{ offset: [0, 6] }} placement="bottom" selfDismiss>
          {({ ref, onToggle, isOpen }) => (
            <S.Container ref={ref} onClick={onToggle} isActive={isOpen}>
              <S.Name>{domain.name}</S.Name>
              <SvgIcon icon="arrowRightTopics" mt={2} size={9} rotation={90} />
            </S.Container>
          )}
        </Dropdown>
      </Box.Flex>
    </>
  );
};

export default DomainsActions;
