import React from 'react';

import { variableInputValueIsEmpty } from '@/utils/variableInput';

import LineItem from './components/Lineitem';
import ResultsTable from './components/ResultsTable';

function Results({ variableMap }) {
  const validMappings = variableMap.filter((mapping) => !variableInputValueIsEmpty(mapping.path));

  return (
    <ResultsTable borderless>
      <thead>
        <tr>
          <th style={{ width: '40%' }}>Data Path</th>
          <th style={{ width: '40%' }}>Value</th>
          <th style={{ width: '20%' }}>Stored to</th>
        </tr>
      </thead>
      <tbody>
        {validMappings.map((variable, index) => (
          <LineItem key={index} variable={variable} />
        ))}
      </tbody>
    </ResultsTable>
  );
}

export default Results;
