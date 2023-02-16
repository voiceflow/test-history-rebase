import { Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import { createDividerMenuItemOption, Select } from '@voiceflow/ui';
import React from 'react';

import TagSelect from '@/components/TagSelect';
import { Identifier } from '@/styles/constants';

interface LocalesSelectProps {
  type: Platform.Constants.ProjectType | null;
  locales: string[];
  disabled?: boolean;
  platform: Platform.Constants.PlatformType | null;
  onChange: (values: string[]) => void;
}

const LocalesSelect: React.FC<LocalesSelectProps> = ({ type, locales, platform, disabled, onChange }) => {
  const projectConfig = Platform.Config.getTypeConfig({ type, platform });

  const preferredOptions = React.useMemo(
    () => Utils.array.unique([...projectConfig.project.locale.preferredLocales, createDividerMenuItemOption(), ...projectConfig.project.locale.list]),
    [projectConfig]
  );

  const localeName = projectConfig.project.locale.name.toLowerCase();

  return projectConfig.project.locale.multi ? (
    <TagSelect
      id={Identifier.PROJECT_CREATE_SELECT_MULTIPLE_LOCALES}
      value={locales}
      options={preferredOptions}
      onChange={onChange}
      disabled={disabled}
      useLayers
      placeholder={`Select ${localeName}`}
      getOptionLabel={(value) => value && projectConfig.project.locale.labelMap[value]}
      createInputPlaceholder={localeName}
    />
  ) : (
    <Select
      id={Identifier.PROJECT_CREATE_SELECT_LOCALE}
      value={locales[0]}
      options={preferredOptions}
      onSelect={(value) => onChange([value])}
      disabled={disabled}
      useLayers
      searchable
      placeholder={`Select ${localeName}`}
      getOptionLabel={(value) => value && projectConfig.project.locale.labelMap[value]}
    />
  );
};

export default LocalesSelect;
