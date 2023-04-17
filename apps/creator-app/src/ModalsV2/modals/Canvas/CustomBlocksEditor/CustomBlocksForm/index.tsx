import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Button, ButtonVariant, Modal, System } from '@voiceflow/ui';
import React from 'react';

import * as CustomBlock from '@/ducks/customBlock';
import { useSelector, useToggle } from '@/hooks';

import { Editor, Tooltip } from './components';
import { PathData } from './components/Editor';

const DEFAULT_PATH: PathData = { label: 'Default path', isDefault: true };

export interface Form {
  name: string;
  body: string;
  stopOnBlock: boolean;
  paths: PathData[];
}

export interface CustomBlocksFormProps {
  title: string;
  confirmText: string;
  onCancel: VoidFunction;
  onSubmit: (form: Form) => void | Promise<void>;
  currentFormVal?: Pick<Partial<Realtime.CustomBlock>, 'name' | 'body' | 'stop' | 'paths' | 'defaultPath'>;
  style?: {
    confirmButton?: { width: string };
  };
  detectDuplicateNames: boolean;
}

export const CustomBlocksForm: React.FC<CustomBlocksFormProps> = ({
  title,
  confirmText,
  onCancel,
  onSubmit,
  currentFormVal = {},
  style = {},
  detectDuplicateNames,
}) => {
  const { name: defaultName, body: defaultBody, stop: defaultStop, paths: defaultPathnames, defaultPath: defaultPathIndex } = currentFormVal;

  const defaultPaths = defaultPathnames?.map((pathname, index) => ({
    label: pathname,
    isDefault: index === defaultPathIndex,
  }));

  const allCustomBlocks = useSelector(CustomBlock.allCustomBlocksSelector);

  const [name, setName] = React.useState(defaultName ?? '');
  const [body, setBody] = React.useState(defaultBody ?? '');
  const [stopOnBlock, toggleStopOnBlock] = useToggle(defaultStop ?? false);
  const [paths, setPaths] = React.useState(defaultPaths ?? [DEFAULT_PATH]);

  const [nameErrorMsg, setNameErrorMsg] = React.useState<string | null>(null);

  const [isLoading, setIsLoading] = useToggle(false);

  const submitForm = React.useCallback(async () => {
    setIsLoading(true);

    const processedName = name.trim();
    const isEmptyName = processedName.length === 0;
    const isDuplicateName = detectDuplicateNames && allCustomBlocks.some((block) => block.name.toLowerCase() === processedName.toLowerCase());

    if (isEmptyName) {
      setNameErrorMsg('Name required for custom block.');
    } else if (isDuplicateName) {
      setNameErrorMsg('A custom block with that name already exists.');
    } else {
      setNameErrorMsg(null);
    }

    if (!isEmptyName && !isDuplicateName) {
      await onSubmit({
        name: processedName,
        stopOnBlock,
        body,
        paths,
      });
    }

    setIsLoading(false);
  }, [name, stopOnBlock, body, paths]);

  return (
    <>
      <Modal.Header
        border
        sticky
        actions={
          <Box.Flex>
            <Tooltip />

            <System.IconButtonsGroup.Base ml={18}>
              <Modal.Header.CloseButton onClick={onCancel} />
            </System.IconButtonsGroup.Base>
          </Box.Flex>
        }
      >
        {title}
      </Modal.Header>

      <Editor
        name={name}
        setName={setName}
        nameErrorMsg={nameErrorMsg}
        stopOnBlock={stopOnBlock}
        body={body}
        toggleStopOnBlock={toggleStopOnBlock}
        paths={paths}
        setPaths={setPaths}
        onBodyChange={setBody}
      />

      <Modal.Footer sticky={true}>
        <Button onClick={onCancel} variant={ButtonVariant.TERTIARY} squareRadius style={{ marginRight: '10px' }}>
          Cancel
        </Button>
        <Button onClick={submitForm} squareRadius isLoading={isLoading} style={style.confirmButton ?? {}} disabled={isLoading}>
          {confirmText}
        </Button>
      </Modal.Footer>
    </>
  );
};
