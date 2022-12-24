import { css, styled } from '@/hocs/styled';
import { breakpoints } from '@/styles/breakpoints';

const Container = styled.div`
  .prototype-password-input {
    min-height: 60px;
    border-radius: 8px;
    text-align: center;
    font-size: 18px;

    /* Prevents text from getting cut off by the input itself */
    line-height: 18px;

    ::placeholder {
      font-size: 18px;

      /* Prevents text from getting cut off by the input itself */
      line-height: 60px;
    }

    ${breakpoints({
      xs: css`
        min-width: 320px;
      `,
      sm: css`
        min-width: 420px;
      `,
    })}
  }
`;

export default Container;
