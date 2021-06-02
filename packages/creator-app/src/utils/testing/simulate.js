import { capitalizeFirstLetter } from '@/utils/string';

const simulate = (event, component) => component.root.props[`on${capitalizeFirstLetter(event)}`]();

export default simulate;
