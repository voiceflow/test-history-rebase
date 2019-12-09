import React from 'react';
import { ToastContainer as ToastifyContainer, toast as toastify } from 'react-toastify';

import Portal from '@/componentsV2/Portal';
import { createGlobalStyle } from '@/hocs';

import Message from './components/Message';

const wrapWithMessage = (method, icon, color) => (message, options) =>
  method(
    <Message icon={icon} iconColor={color}>
      {message}
    </Message>,
    options
  );

const toast = wrapWithMessage(toastify);

Object.keys(toastify).forEach((methodName) => {
  toast[methodName] = toastify[methodName];
});

toast.info = wrapWithMessage(toastify.info, 'info', '#5D9DF5');
toast.error = wrapWithMessage(toastify.error, 'error', '#E91E63');
toast.success = wrapWithMessage(toastify.success, 'checkmark', '#42B761');
toast.warning = wrapWithMessage(toastify.warning, 'warning', '#e98e1e');

const ToastGlobalStyles = createGlobalStyle`
  .Toastify {
    &__toast-container {
      width: auto !important;
      min-width: 300px;
      max-width: 380px;
    }

    &__toast {
      padding: 24px 32px !important;
      border-radius: 5px !important;
      background-color: #fff !important;
      box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.06), 0 8px 16px 0 rgba(17, 49, 96, 0.16) !important;
    }
  }
`;

export { toast };

export const ToastContainer = () => (
  <>
    <ToastGlobalStyles />
    <Portal portalNode={window.document.body}>
      <ToastifyContainer autoClose={5000} newestOnTop closeButton={false} hideProgressBar draggable={false} pauseOnFocusLoss={false} />
    </Portal>
  </>
);
