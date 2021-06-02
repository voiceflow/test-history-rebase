import { styled } from '@/hocs';

const KeyBubble = styled.div`
  padding: 3px 10px;
  border-radius: 5px;
  margin-right: 5px;
  background: #eef4f6;
  font-size: 13px;
  font-weight: 600;
  color: linear-gradient(to bottom, rgba(238, 244, 246, 0.85), var(--ice-blue)), linear-gradient(to bottom, var(--white), var(--white));
  display: inline-block;
`;

export default KeyBubble;
