import Box from '@ui/components/Box';
import Portal from '@ui/components/Portal';
import SvgIcon, { SvgIconTypes } from '@ui/components/SvgIcon';
import { ClickableText } from '@ui/components/Text';
import { createGlobalStyle } from '@ui/styles';
import { COLOR_BLUE, COLOR_GREEN, COLOR_RED } from '@ui/styles/constants';
import React from 'react';
import * as Toastify from 'react-toastify';
import { Overwrite } from 'utility-types';

import Message from './components/Message';

type ToastMethodName = 'info' | 'error' | 'success' | 'warn';

type ToastMethod = (content: Toastify.ToastContent, options?: Toastify.ToastOptions) => Toastify.ToastId;

export const ToastCallToAction: React.FC<{ onClick: () => void }> = ({ onClick, children }) => (
  <Box mt={8} textAlign="right">
    <ClickableText onClick={onClick}>{children}</ClickableText>
  </Box>
);

type ToastMethodFactory = (
  method: ToastMethod,
  icon?: SvgIconTypes.Icon,
  color?: string
) => ToastMethod & Partial<Record<ToastMethodName, ToastMethod>>;

type CustomToastMethod = (
  method: ToastMethodName,
  icon?: SvgIconTypes.Icon,
  color?: string
) => ToastMethod & Partial<Record<ToastMethodName, ToastMethod>>;

const wrapWithMessage: ToastMethodFactory = (method, icon, color) => (message, options) =>
  method(
    <Message icon={icon} iconColor={color}>
      {message}
    </Message>,
    {
      ...options,
      ...(options?.closeButton === true && { closeButton: <SvgIcon icon="close" variant={SvgIcon.Variant.TERTIARY} clickable size={10} ml={24} /> }),
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
  success: wrapWithMessage(Toastify.toast.success, 'checkmark', COLOR_GREEN),
  warn: wrapWithMessage(Toastify.toast.warn, 'warning', '#E5B813'),
  genericError: () => toast.error('Something went wrong. Please try again'),
  custom: (methodName: ToastMethodName, icon?: SvgIconTypes.Icon, color?: string) => wrapWithMessage(Toastify.toast[methodName], icon, color),
});

const ToastGlobalStyles = createGlobalStyle`
  .Toastify {
    &__toast-container {
      width: auto !important;
      max-width: 380px;
    }

    &__toast {
      padding: 24px 32px !important;
      border-radius: 8px !important;
      background-color: #fff !important;
      box-shadow: 0px 12px 24px rgba(19, 33, 68, 0.04), 0px 8px 12px rgba(19, 33, 68, 0.04), 0px 4px 4px rgba(19, 33, 68, 0.02),
        0px 2px 2px rgba(19, 33, 68, 0.01), 0px 1px 1px rgba(19, 33, 68, 0.01), 0px 0px 0px rgba(17, 49, 96, 0.03), 0px 0px 0px 1px rgba(17, 49, 96, 0.06) !important;
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
