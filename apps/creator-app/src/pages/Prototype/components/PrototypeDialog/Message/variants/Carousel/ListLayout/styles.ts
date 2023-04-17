import { ButtonGroup, hexToRGBA, toRGBAString } from '@voiceflow/ui';

import { styled, transition } from '@/hocs/styled';

export const Container = styled.div`
  background-color: #fdfdfd;
  box-shadow: 0 4px 12px 0 #13214405, 0 2px 4px 0 #13214405, 0 2px 2px 0 #13214402, 0 1px 1px 0 #13214402, 0 1px 0 0 #13214407, 0 0 0 1px #13214413;
  border-radius: 8px;
  width: 306px;
`;

export const Card = styled.div`
  display: flex;
  padding: 16px 20px 20px;
  flex-direction: column;

  &:not(:first-child) {
    border-top: solid 1px #eaeff4;
  }
`;

export const CardHeader = styled.header`
  display: flex;
`;

export const CardHeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

export const CardTitle = styled.div`
  line-height: normal;
  color: #132144;
  font-weight: 600;
  font-size: 15px;
`;

export const CardDescription = styled.div`
  font-size: 13px;
  color: #62778c;
  line-height: 1.54;
  margin-top: 4px;

  display: -webkit-box;
  max-height: 40px;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Button = styled(ButtonGroup.Button)`
  ${transition('background-color')}
  color: ${({ color }) => toRGBAString(hexToRGBA(color ?? '#3D82E2'))};

  height: 45px;
  border-radius: 8px;

  &:hover {
    background-color: #fdfdfd;
  }
`;
