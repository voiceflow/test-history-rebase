import { styled } from '@/hocs/styled';

export interface SubSectionProps {
  size?: string;
}

const SubSection = styled.div<SubSectionProps>`
  width: ${({ size = '100%' }) => size};

  & > * {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    margin-bottom: 14px;
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`;

export default SubSection;
