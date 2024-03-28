import { BaseModels } from '@voiceflow/base-types';
import { tid } from '@voiceflow/style';
import { Box, Divider, notify, Scroll, Tooltip, useCreateConst } from '@voiceflow/ui-next';
import { validatorFactory } from '@voiceflow/utils-designer';
import React from 'react';

import { Modal } from '@/components/Modal';
import { LimitType } from '@/constants/limits';
import { Designer } from '@/ducks';
import { useHotkey } from '@/hooks/hotkeys';
import { useInputState } from '@/hooks/input.hook';
import { useUpgradeModal } from '@/hooks/modal.hook';
import { usePlanLimitConfig } from '@/hooks/planLimitV2';
import { useDispatch } from '@/hooks/store.hook';
import { useTrackingEvents } from '@/hooks/tracking';
import { useValidators } from '@/hooks/validate.hook';
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
import { KBZendeskFilterMultiSelect } from './KBZendeskFilterMultiSelect.component';
import { KBZendeskFilterSelect } from './KBZendeskFilterSelect.component';
import { captionStyles } from './KBZendeskFilterSelect.css';

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
  const [isLoadingDocumentCount, setIsLoadingDocumentCount] = React.useState(false);
  const [isLoadingFilters, setIsLoadingFilters] = React.useState(true);
  const [isDocumentLimitExceeded, setIsDocumentLimitExceeded] = React.useState(false);
  const [trackingEvents] = useTrackingEvents();
  const upgradeModal = useUpgradeModal();

  const brand = useInputState<ZendeskFilterBrand | null>({ value: null });
  const [locales, setLocales] = React.useState<ZendeskFilterLocale[]>([]);
  const [categories, setCategories] = React.useState<ZendeskFilterBase[]>([]);
  const [labels, setLabels] = React.useState<ZendeskFilterLabel[]>([]);
  const [userSegments, setUserSegments] = React.useState<ZendeskFilterUserSegment[]>([]);

  const [brandOptions, setBrandOptions] = React.useState<ZendeskFilterBrand[]>([]);
  const [categoryOptions, setCategoryOptions] = React.useState<ZendeskFilterBase[]>([]);
  const [userSegmentOptions, setUserSegmentOptions] = React.useState<ZendeskFilterUserSegment[]>([]);

  const getDocumentCount = useDispatch(Designer.KnowledgeBase.Integration.effect.getIntegrationDocumentCount);
  const getFilters = useDispatch(Designer.KnowledgeBase.Integration.effect.getIntegrationFilters);
  const importIntegration = useDispatch(Designer.KnowledgeBase.Integration.effect.importIntegration);

  const planConfig = usePlanLimitConfig(LimitType.KB_DOCUMENTS);

  const validator = useValidators({
    brand: useCreateConst(() => [validatorFactory((brand: ZendeskFilterBrand | null) => !!brand, 'Brand is required.'), brand.setError]),
  });

  const areFilters = React.useMemo(
    () => brand.value || locales.length || categories.length || labels.length || userSegments.length,
    [brand.value, locales, categories, labels, userSegments]
  );

  const updateDocumentCount = async () => {
    if (!brand.value) return;
    setIsLoadingDocumentCount(true);
    const countFilters = {
      labels,
      locales,
      brands: brand.value ? [brand.value] : [],
      categories,
      userSegments,
    };
    const data = await getDocumentCount('zendesk', countFilters)
      .then((data) => {
        setIsDocumentLimitExceeded(false);
        return data;
      })
      .catch((error) => {
        if (error.response.status === 413) setIsDocumentLimitExceeded(true);
        return { count: null, userSegments: [] };
      });

    setNumDataSources(data.count);
    setUserSegmentOptions(data.userSegments);
    setIsLoadingDocumentCount(false);
  };

  const getDocumentFilters = async () => {
    setIsLoadingFilters(true);
    const filters = await getFilters('zendesk', brand.value?.subdomain);
    if (!brand.value) setBrandOptions(filters.brands || []);
    setFilters(filters);
    setIsLoadingFilters(false);
    if (brand.value) updateDocumentCount();
  };

  const resetFilters = () => {
    brand.setValue(null);
    setLocales([]);
    setCategories([]);
    setLabels([]);
    setUserSegments([]);
    setNumDataSources(null);
  };

  React.useEffect(() => {
    getDocumentFilters();
    setCategories([]);
    setLabels([]);
    setUserSegments([]);
    setLocales([]);
  }, [brand.value]);

  React.useEffect(() => {
    getDocumentFilters();
  }, []);

  React.useEffect(() => {
    if (!filters.categories || !locales) return;

    const options = locales
      .flatMap((l) => {
        return filters?.categories?.[l.locale.toLowerCase()];
      })
      .filter((item): item is ZendeskFilterBase => item !== undefined);

    const validSelections = categories.filter((category) => options.some((option) => option.id === category.id));
    setCategories(validSelections);
    setCategoryOptions(options);
  }, [filters, locales]);

  const importDataSources = async () => {
    const result = validator.validate({ brand: brand.value });

    if (!result.success || !result.data.brand) return;

    disableClose();

    const importFilters = {
      labels,
      locales,
      brands: result.data.brand ? [result.data.brand] : [],
      categories,
      userSegments,
    };

    trackingEvents.trackAiKnowledgeBaseIntegrationFiltersUsed({ Filters: importFilters });

    const timeout = setTimeout(() => {
      enableClose();
      notify.short.error('Failed to import data sources');
    }, 300000);

    await importIntegration(BaseModels.Project.IntegrationTypes.ZENDESK, refreshRate, importFilters)
      .then(() => {
        notify.short.info('Importing data sources from Zendesk', { showIcon: false });
        clearTimeout(timeout);
        enableClose();
        onClose();
        onSuccess();
        return null;
      })
      .catch((error) => {
        if (error.response.status === 406 && planConfig) {
          notify.long.warning(
            `Document limit (${planConfig.limit}) reached for your current subscription. Please adjust import configuration or upgrade to continue.`,
            {
              pauseOnHover: true,
              bodyClassName: 'vfui',
              actionButtonProps: { label: 'Upgrade', onClick: () => upgradeModal.openVoid(planConfig.upgradeModal({ limit: planConfig.limit })) },
            }
          );
        } else {
          notify.short.error('Failed to import data sources');
        }
      })
      .finally(() => {
        clearTimeout(timeout);
        enableClose();
      });
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
              isLabelDisabled={disabled}
              label={areFilters ? `Reset filters` : 'Filters'}
              onLabelClick={areFilters ? stopPropagation(resetFilters) : undefined}
            />
          </Box>
          <Box direction="column" gap={16} px={24} pb={24}>
            <KBZendeskFilterSelect
              label="Brand"
              value={brand.value}
              options={brandOptions || []}
              disabled={disabled || isLoadingFilters}
              errorMessage={brand.error}
              onValueChange={brand.setValue}
              onDropdownClose={updateDocumentCount}
              placeholder="Select brand (required)"
              testID={tid(testID, 'brands')}
            />
            <KBZendeskFilterMultiSelect
              label="User segments"
              value={userSegments}
              options={userSegmentOptions}
              disabled={disabled || !brand.value || isLoadingFilters || isLoadingDocumentCount || isDocumentLimitExceeded}
              onValueChange={setUserSegments}
              onDropdownClose={updateDocumentCount}
              hasTooltip={isDocumentLimitExceeded || !brand.value}
              tooltipVariant={isDocumentLimitExceeded ? 'alert' : 'basic'}
              tooltipMessage={brand.value ? 'Document limit (5000) reached for Zendesk API. Add additional filters to enable user segments. ' : ''}
              placeholder="Select user segments (optional)"
              testID={tid(testID, 'user-segments')}
            />
            <KBZendeskFilterMultiSelect
              label="Locales"
              value={locales}
              options={filters.locales || []}
              disabled={disabled || !brand.value || isLoadingFilters}
              onValueChange={setLocales}
              onDropdownClose={updateDocumentCount}
              placeholder="Select locales (optional)"
              hasTooltip={!brand.value}
              testID={tid(testID, 'locales')}
            />
            <KBZendeskFilterMultiSelect
              label="Categories"
              value={categories}
              options={categoryOptions}
              disabled={disabled || !locales.length || isLoadingFilters}
              onValueChange={setCategories}
              onDropdownClose={updateDocumentCount}
              placeholder="Select categories (optional)"
              hasTooltip={!locales.length}
              tooltipMessage={!locales.length ? "Categories can't be selected until one or more locales have been chosen." : ''}
              testID={tid(testID, 'categories')}
            />
            <KBZendeskFilterMultiSelect
              label="Labels"
              value={labels}
              options={filters.labels || []}
              disabled={disabled || !brand.value || isLoadingFilters}
              onValueChange={setLabels}
              onDropdownClose={updateDocumentCount}
              placeholder="Select labels (optional)"
              hasTooltip={!brand.value}
              tooltipMessage="This filter is disabled until the brand has a selection present."
              testID={tid(testID, 'labels')}
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

        {isDocumentLimitExceeded && (
          <Tooltip
            width={205}
            placement="top"
            hasArrow
            variant="alert"
            referenceElement={({ onOpen, onClose, ref }) => (
              <div ref={ref} onMouseEnter={onOpen} onMouseLeave={onClose}>
                <Modal.Footer.Button
                  label="Document limit reached"
                  onClick={importDataSources}
                  disabled
                  isLoading={disabled || isLoadingDocumentCount}
                  testID={tid(testID, 'import')}
                />
              </div>
            )}
          >
            {() => (
              <Box direction="column">
                <Tooltip.Caption className={captionStyles}>
                  Document limit (5000) reached for Zendesk API. Add additional filters to reduce number of total documents being imported.
                </Tooltip.Caption>
              </Box>
            )}
          </Tooltip>
        )}
        {!isDocumentLimitExceeded &&
          (!numDataSources && brand.value ? (
            <Tooltip
              width={185}
              placement="top"
              hasArrow
              referenceElement={({ onOpen, onClose, ref }) => (
                <div ref={ref} onMouseEnter={onOpen} onMouseLeave={onClose}>
                  <Modal.Footer.Button
                    label="Import 0 data sources"
                    onClick={importDataSources}
                    disabled
                    isLoading={disabled || isLoadingDocumentCount}
                    testID={tid(testID, 'import')}
                  />
                </div>
              )}
            >
              {() => (
                <Box direction="column">
                  <Tooltip.Caption className={captionStyles}>
                    The filters applied result in no matched data sources. Consider removing filters.
                  </Tooltip.Caption>
                </Box>
              )}
            </Tooltip>
          ) : (
            <Modal.Footer.Button
              label={`Import ${numDataSources === null ? '' : numDataSources} data sources`}
              onClick={importDataSources}
              disabled={disabled || isLoadingDocumentCount}
              isLoading={disabled || isLoadingDocumentCount}
              testID={tid(testID, 'import')}
            />
          ))}
      </Modal.Footer>
    </>
  );
};
