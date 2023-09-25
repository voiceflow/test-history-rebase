import 'react-toastify/dist/ReactToastify.css';

import Box from '@ui/components/Box';
import Portal from '@ui/components/Portal';
import SvgIcon, { SvgIconTypes } from '@ui/components/SvgIcon';
import { ClickableText } from '@ui/components/Text';
import { createGlobalStyle } from '@ui/styles';
import { COLOR_BLUE, COLOR_GREEN, COLOR_RED } from '@ui/styles/constants';
import { Utils } from '@voiceflow/common';
import React from 'react';
import * as Toastify from 'react-toastify';

type ToastMethodName = 'info' | 'error' | 'success' | 'warn';

type ToastMethod = <T = unknown>(content: Toastify.ToastContent<T>, options?: Toastify.ToastOptions) => Toastify.Id;

export const ToastCallToAction: React.FC<React.PropsWithChildren<{ onClick: () => void }>> = ({ onClick, children }) => (
  <Box mt={8} textAlign="right">
    <ClickableText onClick={onClick}>{children}</ClickableText>
  </Box>
);

interface CustomOptions<T> {
  icon?: SvgIconTypes.Icon;
  color?: string;
  method: ToastMethodName;
  content: Toastify.ToastContent<T>;
  options?: Toastify.ToastOptions;
}

type ToastMethodFactory = (method: ToastMethod, icon?: SvgIconTypes.Icon, color?: string) => ToastMethod;

type CustomToastMethod = <T>(options: CustomOptions<T>) => void;

const wrapWithMessage: ToastMethodFactory = (method, icon, color) => (message, options) =>
  method(message, {
    ...options,
    ...(options?.closeButton === true && { closeButton: <SvgIcon icon="close" variant={SvgIcon.Variant.TERTIARY} clickable size={10} ml={24} /> }),
    icon: options?.icon ?? (icon ? () => <SvgIcon icon={icon} color={color} size={16} /> : undefined),
  });

const toast = wrapWithMessage(Toastify.toast) as typeof Toastify.toast & { genericError: VoidFunction; custom: CustomToastMethod };

Utils.object.getKeys(Toastify.toast).forEach((method) => {
  toast[method] = Toastify.toast[method] as any;
});

Object.assign(toast, {
  warn: wrapWithMessage(Toastify.toast.warn, 'warning', '#D0C263'),
  info: wrapWithMessage(Toastify.toast.info, 'info', COLOR_BLUE),
  error: wrapWithMessage(Toastify.toast.error, 'warning', COLOR_RED),
  custom: ({ icon, color, method, content, options }: CustomOptions<any>) => wrapWithMessage(Toastify.toast[method], icon, color)(content, options),
  success: wrapWithMessage(Toastify.toast.success, 'checkmark', COLOR_GREEN),
  genericError: () => toast.error('Something went wrong. Please try again'),
});

const ToastGlobalStyles = createGlobalStyle`
  .Toastify {
    &__toast-container.old-toast-container {
      width: auto !important;
      max-width: 380px;
    }

    &__toast.old-toast {
      color: #131144;
      padding: 24px 32px !important;
      border-radius: 8px !important;
      background-color: #fff !important;
      font-family: 'Open Sans', sans-serif;
      box-shadow: 0px 12px 24px rgba(19, 33, 68, 0.04), 0px 8px 12px rgba(19, 33, 68, 0.04), 0px 4px 4px rgba(19, 33, 68, 0.02),
        0px 2px 2px rgba(19, 33, 68, 0.01), 0px 1px 1px rgba(19, 33, 68, 0.01), 0px 0px 0px rgba(17, 49, 96, 0.03), 0px 0px 0px 1px rgba(17, 49, 96, 0.06) !important;
    }

    &__toast-body {
      padding: 0 !important;
    }

    &__toast-icon {
      align-self: flex-start;
      padding-top: 4px;
    }
  }
`;

export { toast };

export const ToastContainer = () => (
  <>
    <ToastGlobalStyles />
    <Portal portalNode={globalThis.document.body}>
      <Toastify.ToastContainer
        autoClose={5000}
        newestOnTop
        closeButton={false}
        hideProgressBar
        draggable={false}
        pauseOnFocusLoss={false}
        toastClassName="old-toast"
        className="old-toast-container"
      />
    </Portal>
  </>
);
