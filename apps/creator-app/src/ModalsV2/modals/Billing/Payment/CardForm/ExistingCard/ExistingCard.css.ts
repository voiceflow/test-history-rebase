import { recipe } from '@voiceflow/style';
import { Tokens } from '@voiceflow/ui-next/styles';

export const cardButton = recipe({
  base: {
    width: '70px',
    height: '70px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    borderRadius: Tokens.border.radius[6],
    border: `1px solid ${Tokens.colors.black[32]}`,
    fontSize: Tokens.typography.size[12],
    fontWeight: Tokens.typography.weight[600],
    transition: Tokens.transition(['border-color', 'background-color']),
    cursor: 'pointer',
    ':hover': {
      borderColor: Tokens.colors.accent.accent500,
    },
  },
  variants: {
    active: {
      true: {
        borderColor: Tokens.colors.accent.accent500,
        backgroundColor: Tokens.colors.accent.accent50,
      },
    },
  },
});
