import React from 'react';
import ReactJson from 'react-json-view';

import ResultsMetaFooter from './components/ResultsMetaFooter';
import ResultsMetaHeader from './components/ResultsMetaHeader';

const Formatted = ({ requestResponse, copyJSONPath, responseMetaData }) => (
  <>
    <ResultsMetaHeader data={responseMetaData} />
    <ReactJson
      style={{ padding: 15, fontSize: 13 }}
      src={requestResponse}
      theme="monokai"
      displayDataTypes={false}
      name="response"
      enableClipboard={copyJSONPath}
    />
    <ResultsMetaFooter data={responseMetaData} />
  </>
);

export default Formatted;
