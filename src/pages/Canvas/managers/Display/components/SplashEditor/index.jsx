import React from 'react';

import Section from '@/components/Section';
import FullImage from '@/components/Upload/ImageUpload/FullImage';
import VariablesInput from '@/components/VariablesInput';
import { useDidUpdateEffect } from '@/hooks/lifecycle';
import { FormControl } from '@/pages/Canvas/components/Editor';
import { transformVariablesToReadable } from '@/utils/slot';

import dataSourceTemplate from '../../templates/datasourceTemplate';
import documentTemplate from '../../templates/documentTemplate';

const injectDatasourceValues = (datasourceTemplate, header = '', backgroundImageURL) => {
  // The property name of the datasource object that houses the data
  const datasourceProperty = 'bodyTemplate7Data';
  datasourceTemplate[datasourceProperty].title = transformVariablesToReadable(header);
  datasourceTemplate[datasourceProperty].image.sources[0].url = backgroundImageURL;
  datasourceTemplate[datasourceProperty].image.sources[1].url = backgroundImageURL;
};

function SplashEditor({ splashHeader, onChange, backgroundImage, displayID, createDisplay, updateDisplay, skillID }) {
  const updateSplashDisplay = React.useCallback(
    async (header, backgroundImageURL) => {
      const docTemplate = documentTemplate;
      const dataTemplate = dataSourceTemplate;

      injectDatasourceValues(dataTemplate, header, backgroundImageURL);

      const documentString = JSON.stringify(docTemplate, null, '\t');
      const datasourceString = JSON.stringify(dataTemplate, null, '\t');

      const payload = { document: documentString, datasource: datasourceString, title: header };
      if (displayID) {
        await updateDisplay(skillID, displayID, payload);
        onChange({ jsonFileName: null, datasource: datasourceString });
      } else {
        const displayID = await createDisplay(skillID, payload);
        onChange({ displayID, datasource: datasourceString });
      }
    },
    [createDisplay, displayID, onChange, skillID, updateDisplay]
  );
  const onBlur = (value) => {
    onChange({ splashHeader: value.text });
  };

  useDidUpdateEffect(() => {
    updateSplashDisplay(splashHeader, backgroundImage);
  }, [splashHeader, backgroundImage, updateSplashDisplay]);

  return (
    <Section isDividerNested>
      <FormControl label="Text Header or Variable">
        <VariablesInput value={splashHeader} onBlur={onBlur} placeholder="Enter header here" />
      </FormControl>

      <FormControl label="Background Image" contentBottomUnits={0}>
        <FullImage update={(val) => onChange({ backgroundImage: val })} image={backgroundImage} />
      </FormControl>
    </Section>
  );
}

export default SplashEditor;
