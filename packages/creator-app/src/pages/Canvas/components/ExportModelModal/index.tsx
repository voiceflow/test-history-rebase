import { PlanType } from '@voiceflow/internal';
import { BlockText, Box, Button, FlexApart, Link, Select, stopImmediatePropagation, toast } from '@voiceflow/ui';
import React from 'react';

import BubbleText from '@/components/BubbleText';
import ChatWithUsLink from '@/components/ChatLink';
import Modal, { ModalBody, ModalFooter } from '@/components/Modal';
import PlatformUploadButton from '@/components/PlatformUploadButton';
import * as Documentation from '@/config/documentation';
import { Permission } from '@/config/permissions';
import { ModalType, NLPProvider, NLPProviderLabels, PLAN_TYPE_META } from '@/constants';
import * as Export from '@/ducks/export';
import * as Tracking from '@/ducks/tracking';
import { connect } from '@/hocs';
import { useModals, usePermission } from '@/hooks';
import { ConnectedProps } from '@/types';

const ExportModelModal: React.FC<ConnectedExportModelModalProps> = ({ exportModel }) => {
  const [isExporting, setExporting] = React.useState(false);
  const [exportNLPProvider, setExportNLPProvider] = React.useState<NLPProvider | undefined>(undefined);
  const [canExport] = usePermission(Permission.MODEL_EXPORT);
  const { open: openPaymentsModal } = useModals(ModalType.PAYMENT);

  const verifyType = (type: NLPProvider | undefined) => {
    if (!type) {
      return 'Model must have a type';
    }

    return null;
  };

  const onClick = () => {
    const error = verifyType(exportNLPProvider);

    if (error) {
      toast.error(error);
    } else {
      setExporting(true);
      exportModel(exportNLPProvider!, Tracking.ModelExportOriginType.NLU_MANAGER).then(() => setExporting(false)); // placeholder to pass circleci tests
    }
  };

  return (
    <Modal id={ModalType.EXPORT_MODEL} title="Export Model">
      <Box width="100%">
        <ModalBody>
          <label>Export For {!canExport && <BubbleText color={PLAN_TYPE_META[PlanType.PRO].color}>PRO</BubbleText>}</label>
          <Select
            value={exportNLPProvider}
            options={Object.values(NLPProvider)}
            onSelect={setExportNLPProvider}
            searchable
            placeholder="Select an option"
            getOptionLabel={(value) => NLPProviderLabels[value!]}
          />
          <BlockText fontSize={13} color="#62778c" lineHeight="normal" marginTop={12}>
            <span>Don't see the export format you're looking for? </span>
            <ChatWithUsLink>Contact Us.</ChatWithUsLink>
          </BlockText>
        </ModalBody>
        <ModalFooter onClick={stopImmediatePropagation()}>
          <FlexApart fullWidth>
            <Link href={Documentation.MODEL_EXPORT}>Learn More</Link>
            {!canExport && <Button onClick={openPaymentsModal}>Upgrade</Button>}
            {canExport && (
              <PlatformUploadButton isActive={!!isExporting} label="Export" icon="arrowSpin" onClick={stopImmediatePropagation(onClick)} />
            )}
          </FlexApart>
        </ModalFooter>
      </Box>
    </Modal>
  );
};

const mapDispatchToProps = {
  exportModel: Export.exportModel,
};

type ConnectedExportModelModalProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(ExportModelModal);
