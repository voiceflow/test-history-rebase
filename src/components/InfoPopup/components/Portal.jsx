import ReactDom from 'react-dom';

const modalRoot = document.getElementById('modal-root');

export default function Portal({ isActive, children }) {
  if (isActive) {
    return ReactDom.createPortal(children, modalRoot);
  }
  return children;
}
