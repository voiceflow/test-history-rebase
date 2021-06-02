import styled from 'styled-components';

export const TeamSummaryWrapper = styled.div`
  margin: 20px 10px;
  padding: 2rem;
  background: ${(props) => props.theme.palette.background.highlight};
  border-radius: 5px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25);

  .card {
    background: ${(props) => props.theme.palette.background.highlight};
  }
`;
