import { createPortal } from 'react-dom';

// eslint-disable-next-line xss/no-mixed-html
export const portalRootNode = (globalThis.document?.querySelector('#root') || globalThis.document?.body) as HTMLElement; // for tests

export interface PortalProps extends React.PropsWithChildren {
  portalNode?: HTMLElement | null;
}

const Portal: React.FC<PortalProps> = ({ children, portalNode }) => createPortal(children, portalNode ?? portalRootNode);

export default Portal;
