import Bold from './Bold';

export default {
  getDecorations(block) {
    const key = block.depth > 0 ? 'BOLD' : null;
    return Array(block.getLength()).fill(key);
  },
  getComponentForKey() {
    return Bold;
  },
  getPropsForKey() {
    return {};
  },
};
