import { FlexApart, Link } from '@voiceflow/ui';
import React from 'react';

import PlatformUploadButton from '@/components/PlatformUploadButton';
import * as Documentation from '@/config/documentation';
import { FeatureFlag } from '@/config/features';
import { ExportType, ModalType } from '@/constants';
import * as IntentV2 from '@/ducks/intentV2';
import { useFeature, useModals, useSelector } from '@/hooks';

import { ExportContext } from './Context';

const ExportFooter: React.FC = () => {
  const { isExporting, onExport, exportType } = React.useContext(ExportContext)!;
  const intents = useSelector(IntentV2.allIntentsSelector);
  const noModelData = exportType === ExportType.MODEL && intents.length === 0;

  const IMM_MODALS_V2 = useFeature(FeatureFlag.IMM_MODALS_V2);

  const { open: openInteractionModelModal } = useModals(ModalType.INTERACTION_MODEL);
  const { open: openNLUQuickview } = useModals(ModalType.NLU_MODEL_QUICK_VIEW);

  return (
    <FlexApart fullWidth>
      {exportType === ExportType.MODEL ? (
        <Link onClick={() => (IMM_MODALS_V2.isEnabled ? openNLUQuickview() : openInteractionModelModal())}>Open NLU Manager</Link>
      ) : (
        <Link href={Documentation.PROJECT_EXPORT}>Learn More</Link>
      )}

      <PlatformUploadButton
        icon="sync"
        label="Export"
        onClick={() => (isExporting ? undefined : onExport())}
        isActive={!!isExporting}
        disabled={noModelData}
      />
    </FlexApart>
  );
};

export default ExportFooter;
