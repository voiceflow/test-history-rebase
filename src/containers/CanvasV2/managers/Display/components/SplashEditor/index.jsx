import React from 'react';

import FullImage from '@/componentsV2/Upload/ImageUpload/FullImage';
import VariablesInput from '@/componentsV2/VariablesInput';
import { FormControl } from '@/containers/CanvasV2/components/Editor';
import { useDidUpdateEffect } from '@/hooks/lifecycle';

import dataSourceTemplate from '../../templates/datasourceTemplate';
import documentTemplate from '../../templates/documentTemplate';

const injectDatasourceValues = (datasourceTemplate, header = '', backgroundImageURL) => {
  // The property name of the datasource object that houses the data
  const datasourceProperty = 'bodyTemplate7Data';
  datasourceTemplate[datasourceProperty].title = header;
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

  useDidUpdateEffect(() => {
    updateSplashDisplay(splashHeader, backgroundImage);
  }, [splashHeader, backgroundImage, updateSplashDisplay]);

  return (
    <>
      <FormControl label="Text Header or Variable">
        <VariablesInput value={splashHeader} onBlur={({ text }) => onChange({ splashHeader: text })} placeholder="Enter header here" />
      </FormControl>

      <FormControl label="Background Image" contentBottomUnits={0}>
        <FullImage update={(val) => onChange({ backgroundImage: val })} image={backgroundImage} />
      </FormControl>
    </>
  );
}

export default SplashEditor;
