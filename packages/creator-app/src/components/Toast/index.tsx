import React from 'react';
import * as Toastify from 'react-toastify';
import { Overwrite } from 'utility-types';

import Portal from '@/components/Portal';
import SvgIcon, { Icon, IconVariant } from '@/components/SvgIcon';
import { createGlobalStyle } from '@/hocs';

import Message from './components/Message';

type ToastMethodName = 'info' | 'error' | 'success' | 'warn';

type ToastMethod = (content: Toastify.ToastContent, options?: Toastify.ToastOptions) => Toastify.ToastId;

const wrapWithMessage: (method: ToastMethod, icon?: Icon, color?: string) => ToastMethod & Partial<Record<ToastMethodName, ToastMethod>> =
  (method, icon, color) => (message, options) =>
    method(
      <Message icon={icon} iconColor={color}>
        {message}
      </Message>,
      {
        ...options,
        ...(options?.closeButton === true && { closeButton: <SvgIcon icon="close" variant={IconVariant.TERTIARY} clickable size={10} ml={24} /> }),
      }
    );

const toast = wrapWithMessage(Toastify.toast) as ToastMethod &
  Overwrite<Toastify.Toast, Record<ToastMethodName, ToastMethod>> & { genericError: VoidFunction };

(Object.keys(Toastify.toast) as any[]).forEach((methodName: keyof Toastify.Toast) => {
  toast[methodName] = Toastify.toast[methodName] as any;
});

toast.info = wrapWithMessage(Toastify.toast.info, 'info', '#5D9DF5');
toast.error = wrapWithMessage(Toastify.toast.error, 'error', '#E91E63');
toast.success = wrapWithMessage(Toastify.toast.success, 'checkmark', '#42B761');
toast.warn = wrapWithMessage(Toastify.toast.warn, 'warning', '#E5B813');

toast.genericError = () => toast.error('Something went wrong. Please try again');

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
      <Toastify.ToastContainer autoClose={5000} newestOnTop closeButton={false} hideProgressBar draggable={false} pauseOnFocusLoss={false} />
    </Portal>
  </>
);
