import { styled } from '@/hocs';

export const InnerContainer = styled.div`
  padding: 35px;
  max-width: 1000px;
  margin: auto;
  display: flex;
`;

export const LeftSection = styled.div`
  min-width: 200px;
  margin-right: 30px;
`;

export const RightSection = styled.div`
  max-width: 700px;
  flex: 1;
`;

export const SkillEventsErrorMessage = styled.div`
  color: #e91e63;
  font-size: 13px;
`;

export const ErrorMessage = styled.div`
  color: #e91e63;
  font-size: 13px;
  margin-top: 5px;
`;
