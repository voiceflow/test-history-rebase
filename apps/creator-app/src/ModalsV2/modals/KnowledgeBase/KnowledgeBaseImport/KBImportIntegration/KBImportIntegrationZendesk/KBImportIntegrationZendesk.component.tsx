import { BaseModels } from '@voiceflow/base-types';
import { Box, Divider } from '@voiceflow/ui-next';
import React from 'react';

import { Modal } from '@/components/Modal';
import { useHotkey } from '@/hooks/hotkeys';
import { Hotkey } from '@/keymap';
import { stopPropagation } from '@/utils/handler.util';

import { KBRefreshRateSelect } from '../../components/KBRefreshRateSelect/KBRefreshRateSelect.component';
import { IKBImportIntegrationZendesk } from './KBImportIntegrationZendesk.interface';
import { KBZendeskFilterSelect } from './KBZendeskFilterSelect.component';

export const KBImportIntegrationZendesk: React.FC<IKBImportIntegrationZendesk> = ({ onClose, enableClose, disableClose, disabled }) => {
  const [refreshRate, setRefreshRate] = React.useState(BaseModels.Project.KnowledgeBaseDocumentRefreshRate.NEVER);
  const [brandId, setBrandId] = React.useState<string[]>([]);
  const [locale, setLocale] = React.useState<string[]>([]);
  const [category, setCategory] = React.useState<string[]>([]);
  const [label, setLabel] = React.useState<string[]>([]);
  const [numDataSources, setNumDataSources] = React.useState(140);

  const BRAND_ID_OPTIONS = ['Brand 1', 'Brand 2', 'Brand 3'];
  const LOCALE_OPTIONS = ['English', 'French', 'German', 'Spanish'];
  const CATEGORY_OPTIONS = ['Category 1', 'Category 2', 'Category 3'];
  const LABEL_OPTIONS = ['Label 1', 'Label 2', 'Label 3'];

  React.useEffect(() => {
    disableClose();
    setTimeout(() => {
      setNumDataSources(140 - (brandId.length + locale.length + category.length + label.length) * 10);
      enableClose();
    }, 1000);
  }, [brandId, locale, category, label]);

  const resetFilters = () => {
    setBrandId([]);
    setLocale([]);
    setCategory([]);
    setLabel([]);
  };

  const areFilters = React.useMemo(() => brandId.length || locale.length || category.length || label.length, [brandId, locale, category, label]);

  const importDataSources = () => {
    disableClose();
    setTimeout(() => {
      enableClose();
      onClose();
    }, 5000);
  };

  useHotkey(Hotkey.MODAL_SUBMIT, importDataSources, { preventDefault: true });

  return (
    <>
      <Modal.Header title="Import from Zendesk" onClose={onClose} />

      <Box direction="column" pt={20}>
        <Box pb={16} pl={24}>
          <Divider noPadding label={areFilters ? `Reset filters` : 'Filters'} onLabelClick={areFilters ? stopPropagation(resetFilters) : undefined} />
        </Box>
        <Box direction="column" gap={16} px={24} pb={24}>
          <KBZendeskFilterSelect
            label="Brand ID"
            value={brandId}
            options={BRAND_ID_OPTIONS}
            disabled={disabled}
            onValueChange={setBrandId}
            placeholder="Select brands (optional)"
          />
          <KBZendeskFilterSelect
            label="Locale"
            value={locale}
            options={LOCALE_OPTIONS}
            disabled={disabled || !brandId.length}
            onValueChange={setLocale}
            placeholder="Select locale (optional)"
          />
          <KBZendeskFilterSelect
            label="Categories"
            value={category}
            options={CATEGORY_OPTIONS}
            disabled={disabled || !locale.length}
            onValueChange={setCategory}
            placeholder="Select category (optional)"
          />
          <KBZendeskFilterSelect
            label="Labels"
            value={label}
            options={LABEL_OPTIONS}
            disabled={disabled || !category.length}
            onValueChange={setLabel}
            placeholder="Select labels (optional)"
          />
        </Box>
        <Divider noPadding />
        <Box px={24} pb={24} pt={20}>
          <KBRefreshRateSelect value={refreshRate} onValueChange={setRefreshRate} disabled={disabled} />
        </Box>
      </Box>

      <Modal.Footer>
        <Modal.Footer.Button label="Cancel" variant="secondary" onClick={onClose} disabled={disabled} />
        <Modal.Footer.Button label={`Import ${numDataSources} data sources`} onClick={importDataSources} disabled={disabled} isLoading={disabled} />
      </Modal.Footer>
    </>
  );
};
