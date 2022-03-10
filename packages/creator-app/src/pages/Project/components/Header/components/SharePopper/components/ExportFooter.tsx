import { FlexApart, Link } from '@voiceflow/ui';
import React from 'react';

import PlatformUploadButton from '@/components/PlatformUploadButton';
import * as Documentation from '@/config/documentation';
import { ModalType } from '@/constants';
import * as IntentV2 from '@/ducks/intentV2';
import { useModals, useSelector } from '@/hooks';

import { ExportType } from '../constants';
import { ExportContext } from '../contexts';

const ExportFooter: React.FC = () => {
  const { isExporting, onExport, exportType } = React.useContext(ExportContext)!;
  const intents = useSelector(IntentV2.allIntentsSelector);
  const noModelData = exportType === ExportType.MODEL && intents.length === 0;
  const { open: openInteractionModelModal } = useModals(ModalType.INTERACTION_MODEL);

  return (
    <FlexApart fullWidth>
      {exportType === ExportType.MODEL ? (
        <Link onClick={() => openInteractionModelModal()}>Open NLU Manager</Link>
      ) : (
        <Link href={Documentation.PROJECT_EXPORT}>Learn More</Link>
      )}

      <PlatformUploadButton
        isActive={!!isExporting}
        disabled={noModelData}
        label="Export"
        icon="sync"
        onClick={() => (isExporting ? undefined : onExport())}
      />
    </FlexApart>
  );
};

export default ExportFooter;
