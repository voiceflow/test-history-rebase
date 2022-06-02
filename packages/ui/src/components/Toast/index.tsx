import Box from '@ui/components/Box';
import Portal from '@ui/components/Portal';
import SvgIcon, { Icon, IconVariant } from '@ui/components/SvgIcon';
import { ClickableText } from '@ui/components/Text';
import { createGlobalStyle } from '@ui/styles';
import { COLOR_BLUE, COLOR_RED } from '@ui/styles/constants';
import React from 'react';
import * as Toastify from 'react-toastify';
import { Overwrite } from 'utility-types';

import Message from './components/Message';

type ToastMethodName = 'info' | 'error' | 'success' | 'warn';

type ToastMethod = (content: Toastify.ToastContent, options?: Toastify.ToastOptions) => Toastify.ToastId;

export const ToastCallToAction: React.FC<{ onClick: () => void }> = ({ onClick, children }) => {
  return (
    <Box mt={8} textAlign="right">
      <ClickableText onClick={onClick}>{children}</ClickableText>
    </Box>
  );
};

type ToastMethodFactory = (method: ToastMethod, icon?: Icon, color?: string) => ToastMethod & Partial<Record<ToastMethodName, ToastMethod>>;
type CustomToastMethod = (method: ToastMethodName, icon?: Icon, color?: string) => ToastMethod & Partial<Record<ToastMethodName, ToastMethod>>;

const wrapWithMessage: ToastMethodFactory = (method, icon, color) => (message, options) =>
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
  Overwrite<Toastify.Toast, Record<ToastMethodName, ToastMethod>> & { genericError: VoidFunction; custom: CustomToastMethod };

(Object.keys(Toastify.toast) as any[]).forEach((methodName: ToastMethodName) => {
  toast[methodName] = Toastify.toast[methodName] as any;
});

Object.assign(toast, {
  info: wrapWithMessage(Toastify.toast.info, 'info', COLOR_BLUE),
  error: wrapWithMessage(Toastify.toast.error, 'error', COLOR_RED),
  success: wrapWithMessage(Toastify.toast.success, 'checkmark', '#42B761'),
  warn: wrapWithMessage(Toastify.toast.warn, 'warning', '#E5B813'),
  genericError: () => toast.error('Something went wrong. Please try again'),
  custom: (methodName: ToastMethodName, icon?: Icon, color?: string) => wrapWithMessage(Toastify.toast[methodName], icon, color),
});

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
