import { Box, Flex, Text, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import * as NLU from '@/config/nlu';
import { Permission } from '@/config/permissions';
import { LimitType } from '@/config/planLimitV2';
import { NLUImportOrigin } from '@/constants';
import { styled } from '@/hocs';
import { useNLUImport, usePermission, usePlanLimit } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';
import { NLUImportModel } from '@/models';

interface ModelImportProps {
  nluConfig: NLU.Base.Config;
  importModel: NLUImportModel | null;
  onImportModel: (importModel: NLUImportModel) => void;
  isImportLoading: boolean;
  setIsImportLoading: (isLoadingImport: boolean) => void;
}

export const ImportLink = styled(Text)<{ disabled: boolean }>`
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  color: ${({ disabled }) => (disabled ? 'rgba(93, 157, 245, 0.5)' : 'rgba(93, 157, 245, 1)')};

  &:hover {
    color: #3d82e2 !important;
  }
`;

const ModelImport: React.FC<ModelImportProps> = ({ nluConfig, onImportModel, importModel, isImportLoading, setIsImportLoading }) => {
  const nluImport = useNLUImport({ platform: nluConfig.type, onImport: onImportModel });

  const [permissionImportNLU] = usePermission(Permission.BULK_UPLOAD);
  const upgradeModal = ModalsV2.useModal(ModalsV2.Upgrade);
  const planLimit = usePlanLimit({ type: LimitType.NLU_IMPORT });

  const textColor = isImportLoading ? 'rgba(98, 119, 140, 0.5)' : 'rgba(98, 119, 140, 1)';

  const onHandleImportClick = () => {
    if (!permissionImportNLU && planLimit) {
      upgradeModal.open(planLimit.upgradeModal);
    } else {
      nluImport.onUploadClick(NLUImportOrigin.PROJECT);
    }
  };

  useDidUpdateEffect(() => {
    setIsImportLoading(nluImport.isImporting);
  }, [nluImport.isImporting]);

  return (
    <Box mt={12}>
      {importModel ? (
        <Text fontSize={13} color={textColor}>
          <Text color="#132144">{`${importModel.intents.length} `}</Text>intents containing{' '}
          <Text color="#132144">{`${importModel.slots.length} `}</Text> entities successfully imported.
        </Text>
      ) : (
        <Flex>
          <ImportLink disabled={isImportLoading} fontSize={13} onClick={onHandleImportClick}>
            {`Import ${nluConfig.nlps[0].import?.name} NLU model`}
          </ImportLink>

          <Box color="rgba(141, 162, 181, 0.5)" pl={8} pr={8}>
            •
          </Box>

          <Text fontSize={13} color={textColor}>
            {`${nluImport.acceptedFileFormatsLabel} files supported`}
          </Text>
        </Flex>
      )}
    </Box>
  );
};

export default ModelImport;
