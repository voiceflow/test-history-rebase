import React from 'react';
import ReactDOM from 'react-dom';

import SvgIcon from '@/components/SvgIcon';
import { ModalLayerContext } from '@/contexts';
import { useToggle } from '@/hooks';

import { Backdrop, Container, Header } from './components';

const Modal = ({ id, title, isSmall = true, children }) => {
  const [isOpen, toggleOpen] = useToggle(false);
  const { rootRef, register } = React.useContext(ModalLayerContext);

  React.useEffect(() => {
    register(id, toggleOpen);

    return () => register(id, null);
  }, [id, toggleOpen, register]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      <Container isSmall={isSmall}>
        <Header>
          {title}
          <SvgIcon icon="close" variant="standard" size={12} onClick={toggleOpen} />
        </Header>
        {children}
      </Container>
      <Backdrop onClick={toggleOpen} />
    </>,
    rootRef.current
  );
};

export default Modal;
