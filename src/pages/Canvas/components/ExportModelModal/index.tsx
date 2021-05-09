import React from 'react';

import Box from '@/components/Box';
import BubbleText from '@/components/BubbleText';
import Button from '@/components/Button';
import ChatWithUsLink from '@/components/ChatLink';
import { FlexApart } from '@/components/Flex';
import Modal, { ModalBody, ModalFooter } from '@/components/Modal';
import Select from '@/components/Select';
import { BlockText, Link } from '@/components/Text';
import { toast } from '@/components/Toast';
import * as Documentation from '@/config/documentation';
import { Permission } from '@/config/permissions';
import { ModalType, NLPProvider, PLAN_TYPE_META, PlanType } from '@/constants';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { useModals, usePermission } from '@/hooks';
import UploadButton from '@/pages/Canvas/header/ActionGroup/components/UploadButton';
import { ConnectedProps } from '@/types';
import { stopImmediatePropagation } from '@/utils/dom';

import { EXPORT_TYPES } from './constants';

const ExportModelModal: React.FC<ConnectedExportModelModalProps> = ({ isExporting, exportModel }) => {
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
      exportModel(exportNLPProvider!);
    }
  };

  return (
    <Modal id={ModalType.EXPORT_MODEL} title="Export Model">
      <Box width="100%">
        <ModalBody>
          <label>Export For {!canExport && <BubbleText color={PLAN_TYPE_META[PlanType.PRO].color}>PRO</BubbleText>}</label>
          <Select
            value={exportNLPProvider}
            options={EXPORT_TYPES}
            onSelect={setExportNLPProvider}
            searchable
            placeholder="Select an option"
            getOptionLabel={(value) => EXPORT_TYPES.find((option) => option.value === value)?.label}
            getOptionValue={(option) => option?.value}
          />
          <BlockText fontSize={13} color="#62778c" lineHeight="normal" marginTop={12}>
            <span>Don't see the export format you're looking for? </span>
            <ChatWithUsLink>Contact Us.</ChatWithUsLink>
          </BlockText>
        </ModalBody>
        <ModalFooter onClick={stopImmediatePropagation()}>
          <FlexApart fullWidth>
            <Link href={Documentation.MODEL_EXPORT}>Learn More</Link>
            {!canExport && (
              <Button variant="primary" onClick={openPaymentsModal}>
                Upgrade
              </Button>
            )}
            {canExport && <UploadButton isActive={!!isExporting} label="Export" icon="publishSpin" onClick={stopImmediatePropagation(onClick)} />}
          </FlexApart>
        </ModalFooter>
      </Box>
    </Modal>
  );
};

const mapStateToProps = {
  isExporting: Skill.isModelExportingSelector,
};

const mapDispatchToProps = {
  exportModel: Skill.exportModel,
};

type ConnectedExportModelModalProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(ExportModelModal);
