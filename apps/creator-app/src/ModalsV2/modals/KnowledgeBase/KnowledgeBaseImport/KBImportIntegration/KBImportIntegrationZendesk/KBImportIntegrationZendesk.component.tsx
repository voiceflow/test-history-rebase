import { BaseModels } from '@voiceflow/base-types';
import { Box, Divider, Scroll } from '@voiceflow/ui-next';
import React from 'react';

import { Modal } from '@/components/Modal';
import { Designer } from '@/ducks';
import { useHotkey } from '@/hooks/hotkeys';
import { useDispatch } from '@/hooks/store.hook';
import { Hotkey } from '@/keymap';
import {
  ZendeskFilterBase,
  ZendeskFilterBrand,
  ZendeskFilterLabel,
  ZendeskFilterLocale,
  ZendeskFilters,
  ZendeskFilterUserSegment,
} from '@/models/KnowledgeBase.model';
import { stopPropagation } from '@/utils/handler.util';

import { KBRefreshRateSelect } from '../../components/KBRefreshRateSelect/KBRefreshRateSelect.component';
import { IKBImportIntegrationZendesk } from './KBImportIntegrationZendesk.interface';
import { KBZendeskFilterSelect } from './KBZendeskFilterSelect.component';

export const KBImportIntegrationZendesk: React.FC<IKBImportIntegrationZendesk> = ({ onClose, enableClose, disableClose, disabled }) => {
  const [refreshRate, setRefreshRate] = React.useState(BaseModels.Project.KnowledgeBaseDocumentRefreshRate.NEVER);
  const [filters, setFilters] = React.useState<ZendeskFilters>({});
  const [brands, setBrands] = React.useState<ZendeskFilterBrand[]>([]);
  const [locales, setLocales] = React.useState<ZendeskFilterLocale[]>([]);
  const [categories, setCategories] = React.useState<ZendeskFilterBase[]>([]);
  const [labels, setLabels] = React.useState<ZendeskFilterLabel[]>([]);
  const [userSegments, setUserSegments] = React.useState<ZendeskFilterUserSegment[]>([]);
  const [numDataSources, setNumDataSources] = React.useState(140);

  const getDocumentCount = useDispatch(Designer.KnowledgeBase.Integration.effect.getIntegrationDocumentCount);
  const getFilters = useDispatch(Designer.KnowledgeBase.Integration.effect.getIntegrationFilters);
  const getUserSegments = useDispatch(Designer.KnowledgeBase.Integration.effect.getIntegrationUserSegments);
  const importIntegration = useDispatch(Designer.KnowledgeBase.Integration.effect.importIntegration);

  let brandIdOptions = [] as ZendeskFilterBrand[];
  let localeOptions = [] as ZendeskFilterLocale[];
  let labelOptions = [] as ZendeskFilterLabel[];
  const userSegmentOptions = [] as ZendeskFilterUserSegment[];

  const updateDocumentCount = async () => {
    disableClose();
    const filters = {
      labels,
      locales,
      brands,
      categories,
      userSegments,
    };
    const numDocs = await getDocumentCount('zendesk', filters);
    setNumDataSources(numDocs);
    enableClose();
  };

  React.useEffect(() => {
    updateDocumentCount();
  }, [brands, locales, categories, labels]);

  const getDocumentFilters = async () => {
    const filters = await getFilters('zendesk');
    setFilters(filters);
    brandIdOptions = filters.brands || [];
    localeOptions = filters.locales || [];
    labelOptions = filters.labels || [];
  };

  React.useEffect(() => {
    getDocumentFilters();
  }, []);

  const categoryOptions = React.useMemo(
    () => locales.flatMap((l) => filters?.categories?.[l.locale]).filter((item): item is ZendeskFilterBase => item !== undefined),
    [filters, locales]
  );

  const getUserSegmentOptions = async () => {
    setUserSegments(await getUserSegments());
  };

  React.useEffect(() => {
    if (!labels.length) return;
    getUserSegmentOptions();
  }, [labels]);

  const resetFilters = () => {
    setBrands([]);
    setLocales([]);
    setCategories([]);
    setLabels([]);
    setUserSegments([]);
  };

  const areFilters = React.useMemo(
    () => brands.length || locales.length || categories.length || labels.length || userSegments.length,
    [brands, locales, categories, labels, userSegments]
  );

  const importDataSources = () => {
    disableClose();
    const filters = {
      labels,
      locales,
      brands,
      categories,
      userSegments,
    };
    importIntegration('zendesk', refreshRate, filters);
    enableClose();
    onClose();
  };

  useHotkey(Hotkey.MODAL_SUBMIT, importDataSources, { preventDefault: true });

  return (
    <>
      <Modal.Header title="Import from Zendesk" onClose={onClose} leftButton={<Modal.Header.Icon iconName="Zendesk" />} />

      <Scroll style={{ display: 'block' }}>
        <Box direction="column" pt={20}>
          <Box pb={16} pl={24}>
            <Divider
              noPadding
              label={areFilters ? `Reset filters` : 'Filters'}
              onLabelClick={areFilters ? stopPropagation(resetFilters) : undefined}
            />
          </Box>
          <Box direction="column" gap={16} px={24} pb={24}>
            <KBZendeskFilterSelect
              label="Brand ID"
              value={brands}
              options={brandIdOptions}
              disabled={disabled}
              onValueChange={setBrands}
              placeholder="Select brands (optional)"
            />
            <KBZendeskFilterSelect
              label="Locale"
              value={locales}
              options={localeOptions}
              disabled={disabled || !brands.length}
              onValueChange={setLocales}
              placeholder="Select locale (optional)"
              hasTooltip={!brands.length}
            />
            <KBZendeskFilterSelect
              label="Categories"
              value={categories}
              options={categoryOptions}
              disabled={disabled || !locales.length}
              onValueChange={setCategories}
              placeholder="Select category (optional)"
              hasTooltip={!locales.length}
            />
            <KBZendeskFilterSelect
              label="Labels"
              value={labels}
              options={labelOptions}
              disabled={disabled || !categories.length}
              onValueChange={setLabels}
              placeholder="Select labels (optional)"
              hasTooltip={!categories.length}
            />
            <KBZendeskFilterSelect
              label="User segments"
              value={userSegments}
              options={userSegmentOptions}
              disabled={disabled || !labels.length}
              onValueChange={setUserSegments}
              placeholder="Select user segments (optional)"
              hasTooltip={!labels.length}
            />
          </Box>
          <Divider noPadding />
          <Box px={24} pb={24} pt={20}>
            <KBRefreshRateSelect value={refreshRate} onValueChange={setRefreshRate} disabled={disabled} />
          </Box>
        </Box>
      </Scroll>

      <Modal.Footer>
        <Modal.Footer.Button label="Cancel" variant="secondary" onClick={onClose} disabled={disabled} />
        <Modal.Footer.Button label={`Import ${numDataSources} data sources`} onClick={importDataSources} disabled={disabled} isLoading={disabled} />
      </Modal.Footer>
    </>
  );
};
