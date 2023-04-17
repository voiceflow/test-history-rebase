import { LoadCircleSmall } from '@voiceflow/ui';

import { styled, transition } from '@/hocs/styled';

export const ShadowBox = styled.div`
  ${transition('left', 'height', 'box-shadow', 'transform')}
  position: absolute;
  left: 315px;
  width: 100%;
  height: 60px;
  background: white;
  box-shadow: 10px 6px 12px 1px rgba(19, 33, 68, 0.04);
`;

export const QueryIconContainer = styled.div`
  width: 42px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

export const TabLoader = styled(LoadCircleSmall)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25px;
`;
