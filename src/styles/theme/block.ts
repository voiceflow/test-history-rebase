import { BlockVariant } from '@/constants/canvas';

const BLOCK_THEME = {
  variants: {
    [BlockVariant.STANDARD]: {
      backgroundImage: 'linear-gradient(to bottom, rgba(231, 234, 241, 0.8), #e7eaf1)',
      color: '#62778c',
      activeColor: '#132144',
      shadowColor: 'rgba(17, 49, 96, 0.16)',
      editTitleColor: 'rgba(98, 119, 140, 0.16)',
    },
    [BlockVariant.BLUE]: {
      backgroundImage: ' linear-gradient(to bottom, rgba(197, 231, 246, 0.8), #c5e7f6)',
      color: '#0f7ec0',
      activeColor: '#05588a',
      shadowColor: '#2a94d450',
      editTitleColor: 'rgba(15, 126, 192, 0.16)',
    },
    [BlockVariant.GREEN]: {
      backgroundImage: 'linear-gradient(to bottom, rgba(229, 238, 229, 0.8), #e5eee5)',
      color: '#6b7a6b',
      activeColor: '#485648',
      shadowColor: '#68906850 ',
      editTitleColor: 'rgba(107, 122, 107, 0.16)',
    },
    [BlockVariant.RED]: {
      backgroundImage: 'linear-gradient(to bottom, rgba(255, 216, 226, 0.8), #ffd8e2)',
      color: '#a84862',
      activeColor: '#76273d',
      shadowColor: '#b88b9750',
      editTitleColor: 'rgba(168, 72, 98, 0.16)',
    },
    [BlockVariant.PURPLE]: {
      backgroundImage: 'linear-gradient(to bottom, rgba(232, 222, 238, 0.8), #e8deee)',
      color: '#765e84',
      activeColor: '#4e355d',
      shadowColor: '#9888a250',
      editTitleColor: ' rgba(118, 94, 132, 0.15)',
    },
  },
  width: 360,
} as const;

export default BLOCK_THEME;
