import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';

const rootNode = document.querySelector('#root');

function Portal({ children, portalNode = rootNode }) {
  return createPortal(children, portalNode);
}

Portal.propTypes = {
  children: PropTypes.element.isRequired,
  portalNode: PropTypes.instanceOf(HTMLElement), // eslint-disable-line xss/no-mixed-html
};

export default Portal;
