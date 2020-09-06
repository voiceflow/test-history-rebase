import Flex, { FlexCenter } from '@/components/Flex';
import { styled } from '@/hocs';

export const SectionBox = styled(Flex)`
  border-radius: 5px;
  box-shadow: 0 1px 3px 0 rgba(17, 49, 96, 0.08), 0 0 1px 1px rgba(17, 49, 96, 0.08);
  background-color: white;
  padding: 32px;
`;

export const ContentContainer = styled(Flex)`
  padding: 50px;
`;

export const SectionContainer = styled(FlexCenter)`
  min-width: 640px;
  max-width: 640px;
`;

export const SectionInnerContainer = styled.div`
  width: 100%;
`;

export const SectionTitle = styled.div`
  margin-bottom: 16px;
  color: #132144;
  font-weight: 600;
  font-size: 15px;
`;

export const ContentSection = styled(FlexCenter)`
  flex: 4;
`;

export const SpacingSection = styled.div`
  flex: 1;
`;

export const PlatformText = styled.span`
  text-transform: capitalize;
`;

export const Text = styled.div`
  color: #62778c;
  font-size: 13px;
  margin-right: 16px;
`;

export const LinkContainer = styled.div`
  margin-top: 10px;
`;

export const ActionContainer = styled.div`
  width: 250px;
  position: relative;

  & > div {
    float: right;
  }
`;
