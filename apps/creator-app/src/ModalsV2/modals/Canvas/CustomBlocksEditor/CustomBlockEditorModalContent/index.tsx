import type * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import type { CustomBlocksFormProps, Form } from '../CustomBlocksForm';
import { CustomBlocksForm } from '../CustomBlocksForm';
import { inferVariableNames } from './utils';

type EditorFormFields = 'name' | 'body' | 'stop' | 'paths' | 'defaultPath';
export type SubmittedCustomBlock = Pick<Realtime.CustomBlock, EditorFormFields | 'parameters'>;

interface ModalContentProps {
  currentFormVal?: Pick<Partial<Realtime.CustomBlock>, EditorFormFields>;
  title: string;
  confirmText: string;
  onSubmit: (form: SubmittedCustomBlock) => void;
  onCancel: VoidFunction;
  detectDuplicateNames: boolean;
  style?: CustomBlocksFormProps['style'];
}

const ModalContent: React.FC<ModalContentProps> = ({
  currentFormVal,
  title,
  confirmText,
  onSubmit,
  onCancel,
  detectDuplicateNames,
  style = {},
}) => {
  const onReceiveFormData = async ({ name, stopOnBlock, body, paths }: Form) =>
    onSubmit({
      name,
      body,
      stop: stopOnBlock,
      paths: paths.map(({ label }: { label: string }) => label.trim()),
      defaultPath: paths.findIndex(({ isDefault }: { isDefault?: boolean }) => isDefault),
      parameters: inferVariableNames(body),
    });

  return (
    <CustomBlocksForm
      title={title}
      confirmText={confirmText}
      onCancel={onCancel}
      onSubmit={onReceiveFormData}
      currentFormVal={currentFormVal}
      style={style}
      detectDuplicateNames={detectDuplicateNames}
    />
  );
};

export default ModalContent;
