import { BlockVariant } from '@/constants/canvas';

export const BLOCK_WIDTH = 330;

const BLOCK_THEME = {
  variants: {
    [BlockVariant.STANDARD]: {
      backgroundImage: 'linear-gradient(to bottom, #EBEFF4, #e7eaf1)',
      color: '#62778c',
      activeColor: '#132144',
      borderColor: '#D4D9E0',
      activeBorderColor: '#C5CBD6',
      editTitleColor: 'rgba(98, 119, 140, 0.16)',
      iconColor: '#62778c',
    },
    [BlockVariant.BLUE]: {
      backgroundImage: ' linear-gradient(to bottom, #D1ECF8, #c5e7f6)',
      color: '#0f7ec0',
      activeColor: '#05588a',
      borderColor: '#BDD9EE',
      activeBorderColor: '#A2C1DC',
      editTitleColor: 'rgba(15, 126, 192, 0.16)',
      iconColor: '#0f7ec0',
    },
    [BlockVariant.GREEN]: {
      backgroundImage: 'linear-gradient(to bottom, #EAF1EA, #e5eee5)',
      color: '#6b7a6b',
      activeColor: '#485648',
      borderColor: '#CBD8CC',
      activeBorderColor: '#BECDC3',
      editTitleColor: 'rgba(107, 122, 107, 0.16)',
      iconColor: '#6b7a6b',
    },
    [BlockVariant.RED]: {
      backgroundImage: 'linear-gradient(to bottom, #FFE0E7, #ffd8e2)',
      color: '#a84862',
      activeColor: '#76273d',
      borderColor: '#E5D6DA',
      activeBorderColor: '#D8CBD1',
      editTitleColor: 'rgba(168, 72, 98, 0.16)',
      iconColor: '#a84862',
    },
    [BlockVariant.PURPLE]: {
      backgroundImage: 'linear-gradient(to bottom, #EDE5F1, #e8deee)',
      color: '#765e84',
      activeColor: '#4e355d',
      borderColor: '#DBD5DD',
      activeBorderColor: '#CDCAD5',
      editTitleColor: ' rgba(118, 94, 132, 0.15)',
      iconColor: '#765e84',
    },
  },
  width: BLOCK_WIDTH,
} as const;

export const getIconColor = (variant: BlockVariant = BlockVariant.STANDARD): string => BLOCK_THEME.variants[variant].iconColor;

export default BLOCK_THEME;
