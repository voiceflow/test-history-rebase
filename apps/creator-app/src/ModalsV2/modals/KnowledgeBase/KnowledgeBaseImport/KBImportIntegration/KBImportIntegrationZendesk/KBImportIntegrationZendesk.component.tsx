import { BaseModels } from '@voiceflow/base-types';
import { tid } from '@voiceflow/style';
import { Box, Divider, notify, Scroll } from '@voiceflow/ui-next';
import React from 'react';

import { Modal } from '@/components/Modal';
import { Designer } from '@/ducks';
import { useHotkey } from '@/hooks/hotkeys';
import { useDispatch } from '@/hooks/store.hook';
import { useTrackingEvents } from '@/hooks/tracking';
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

export const KBImportIntegrationZendesk: React.FC<IKBImportIntegrationZendesk> = ({
  onClose,
  onSuccess,
  enableClose,
  disableClose,
  disabled,
  testID,
}) => {
  const [refreshRate, setRefreshRate] = React.useState(BaseModels.Project.KnowledgeBaseDocumentRefreshRate.NEVER);
  const [filters, setFilters] = React.useState<ZendeskFilters>({});
  const [numDataSources, setNumDataSources] = React.useState<number | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [trackingEvents] = useTrackingEvents();

  const [brands, setBrands] = React.useState<ZendeskFilterBrand[]>([]);
  const [locales, setLocales] = React.useState<ZendeskFilterLocale[]>([]);
  const [categories, setCategories] = React.useState<ZendeskFilterBase[]>([]);
  const [labels, setLabels] = React.useState<ZendeskFilterLabel[]>([]);
  const [userSegments, setUserSegments] = React.useState<ZendeskFilterUserSegment[]>([]);

  const [brandIdOptions, setBrandIdOptions] = React.useState<ZendeskFilterBrand[]>([]);
  const [localeOptions, setLocaleOptions] = React.useState<ZendeskFilterLocale[]>([]);
  const [categoryOptions, setCategoryOptions] = React.useState<ZendeskFilterBase[]>([]);
  const [labelOptions, setLabelOptions] = React.useState<ZendeskFilterLabel[]>([]);
  const [userSegmentOptions, setUserSegmentOptions] = React.useState<ZendeskFilterUserSegment[]>([]);

  const getDocumentCount = useDispatch(Designer.KnowledgeBase.Integration.effect.getIntegrationDocumentCount);
  const getFilters = useDispatch(Designer.KnowledgeBase.Integration.effect.getIntegrationFilters);
  const getUserSegments = useDispatch(Designer.KnowledgeBase.Integration.effect.getIntegrationUserSegments);
  const importIntegration = useDispatch(Designer.KnowledgeBase.Integration.effect.importIntegration);

  const updateDocumentCount = async () => {
    setIsLoading(true);
    const filters = {
      labels,
      locales,
      brands,
      categories,
      userSegments,
    };
    await getDocumentCount('zendesk', filters)
      .then((numDocs) => setNumDataSources(numDocs))
      .finally(() => setIsLoading(false));
  };

  React.useEffect(() => {
    updateDocumentCount();
  }, [brands, locales, categories, labels, userSegments]);

  const getDocumentFilters = async () => {
    const filters = await getFilters('zendesk');
    getUserSegmentOptions();
    setFilters(filters);
    setBrandIdOptions(filters.brands || []);
    setLocaleOptions(filters.locales || []);
    setLabelOptions(filters.labels || []);
  };

  React.useEffect(() => {
    getDocumentFilters();
  }, []);

  React.useEffect(() => {
    const options = locales
      .flatMap((l) => {
        return filters?.categories?.[l.locale.toLowerCase()];
      })
      .filter((item): item is ZendeskFilterBase => item !== undefined);

    setCategoryOptions(options);
  }, [filters, locales]);

  const getUserSegmentOptions = async () => {
    const filters = {
      labels,
      locales,
      brands,
      categories,
    };
    const options = await getUserSegments(filters);
    setUserSegmentOptions(options);
  };

  React.useEffect(() => {
    getUserSegmentOptions();
  }, [labels, locales, brands, categories]);

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

  const canSubmit = React.useMemo(
    () => !!categories.length || !!labels.length || (!brands.length && !locales.length),
    [categories, brands, locales, labels]
  );

  const importDataSources = async () => {
    disableClose();

    const filters = {
      labels,
      locales,
      brands,
      categories,
      userSegments,
    };

    trackingEvents.trackAiKnowledgeBaseIntegrationFiltersUsed({ Filters: filters });
    const status = await importIntegration(BaseModels.Project.IntegrationTypes.ZENDESK, refreshRate, filters);

    enableClose();

    if (status === 200) {
      notify.short.success('Importing data sources from Zendesk');
      onClose();
      onSuccess();
    } else {
      notify.short.error('Failed to import data sources');
    }
  };

  useHotkey(Hotkey.MODAL_SUBMIT, importDataSources, { preventDefault: true });

  return (
    <>
      <Modal.Header
        title="Import from Zendesk"
        onClose={onClose}
        leftButton={<Modal.Header.Icon iconName="Zendesk" iconProps={{ name: 'Zendesk', width: '24.33px' }} />}
        testID={tid(testID, 'header')}
      />

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
              label="Brands"
              value={brands}
              options={brandIdOptions}
              disabled={disabled}
              onValueChange={setBrands}
              placeholder="Select brands (optional)"
              testID={tid(testID, 'brands')}
            />
            <KBZendeskFilterSelect
              label="Locales"
              value={locales}
              options={localeOptions}
              disabled={disabled || !brands.length}
              onValueChange={setLocales}
              placeholder="Select locales (optional)"
              hasTooltip={!brands.length}
              testID={tid(testID, 'locales')}
            />
            <KBZendeskFilterSelect
              label="Categories"
              value={categories}
              options={categoryOptions}
              disabled={disabled || !locales.length}
              onValueChange={setCategories}
              placeholder="Select categories (optional)"
              hasTooltip={!locales.length}
              testID={tid(testID, 'categories')}
            />
            <KBZendeskFilterSelect
              label="Labels"
              value={labels}
              options={labelOptions}
              disabled={disabled || !categories.length}
              onValueChange={setLabels}
              placeholder="Select labels (optional)"
              hasTooltip={!categories.length}
              testID={tid(testID, 'labels')}
            />
            <KBZendeskFilterSelect
              label="User segments"
              value={userSegments}
              options={userSegmentOptions}
              disabled={disabled}
              onValueChange={setUserSegments}
              placeholder="Select user segments (optional)"
              testID={tid(testID, 'user-segments')}
            />
          </Box>
          <Divider noPadding />
          <Box px={24} pb={24} pt={20}>
            <KBRefreshRateSelect value={refreshRate} onValueChange={setRefreshRate} disabled={disabled} testID={tid(testID, 'refresh-rate')} />
          </Box>
        </Box>
      </Scroll>

      <Modal.Footer>
        <Modal.Footer.Button label="Cancel" variant="secondary" onClick={onClose} disabled={disabled} testID={tid(testID, 'cancel')} />

        <Modal.Footer.Button
          label={`Import ${numDataSources === null ? '' : numDataSources} data sources`}
          onClick={importDataSources}
          disabled={disabled || !canSubmit || !numDataSources || isLoading}
          isLoading={disabled || isLoading}
          testID={tid(testID, 'import')}
        />
      </Modal.Footer>
    </>
  );
};
