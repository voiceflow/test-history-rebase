import React from 'react';
import ReactJson from 'react-json-view';

import ResultsMetaFooter from './components/ResultsMetaFooter';
import ResultsMetaHeader from './components/ResultsMetaHeader';

function Formatted({ requestResponse, copyJSONPath, responseMetaData }) {
  return (
    <>
      <ResultsMetaHeader data={responseMetaData} />
      <ReactJson
        style={{ padding: '15px', 'font-size': '13px' }}
        src={requestResponse}
        theme="monokai"
        displayDataTypes={false}
        name="response"
        enableClipboard={copyJSONPath}
      />
      <ResultsMetaFooter data={responseMetaData} />
    </>
  );
}

export default Formatted;
