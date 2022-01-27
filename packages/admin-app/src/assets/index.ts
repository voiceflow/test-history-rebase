// MAKE SURE TO USE @/assets/… import paths to get the correct import type for SVGs (string vs React.FC)

// logos
export { default as googleLogo } from '@/assets/svgs/google.svg?url';

// wordmarks
export { default as wordmark } from '@/assets/images/wordmark.png';
export { default as wordmarkLight } from '@/assets/svgs/wordmark-light.svg?url';

// TODO: should be able to replace these with instances of <SvgIcon />
export { default as errorIcon } from '@/assets/svgs/error.svg?url';
export { default as searchIcon } from '@/assets/svgs/search.svg?url';
