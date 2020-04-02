import { createPortal } from 'react-dom';

export const rootNode = document.querySelector('#root') || document.body; // for tests

export type PortalProps = {
  portalNode?: HTMLElement;
};

const Portal: React.FC<PortalProps> = ({ children, portalNode = rootNode }) => {
  return createPortal(children, portalNode);
};

export default Portal;
