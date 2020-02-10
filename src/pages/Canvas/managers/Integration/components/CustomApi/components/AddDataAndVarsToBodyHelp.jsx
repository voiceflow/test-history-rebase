import React from 'react';

import { JSONCode, Paragraph, Section } from '@/components/Tooltip';

const jsonExample1 = `{
    <span>"Name"</span>:  <span>"{FirstName}"</span>
}`;

const jsonExample2 = `{
    <span>"Name"</span>:  <span>"{FirstName}"</span>
    <span>"Country"</span>:  <span>"US"</span>
}`;

const jsonExample3 = `{
    <span>"Details"</span>:  {
        <span>"Name"</span>:  <span>"{FirstName}"</span>
        <span>"Country"</span>:  <span>"US"</span>
    }
}`;

function AddDataAndVarsToBodyHelp() {
  return (
    <>
      <Paragraph marginBottomUnits={2}>
        Let’s say your skill collects the customer’s name and saves it to the <b>{'{FirstName}'}</b> variable.
      </Paragraph>

      <Paragraph marginBottomUnits={2}>To send the name via POST request, you need to enter the following body:</Paragraph>

      <Section marginBottomUnits={2}>
        <JSONCode html={jsonExample1} />
      </Section>

      <Paragraph marginBottomUnits={2}>
        To add custom data to the POST body (e.g., customer’s country for the US only skill), you can use the following structure:
      </Paragraph>

      <Section marginBottomUnits={2}>
        <JSONCode html={jsonExample2} />
      </Section>

      <Paragraph marginBottomUnits={2}>To add a parent object for user details, you may stick to the following pattern:</Paragraph>

      <Section>
        <JSONCode html={jsonExample3} />
      </Section>
    </>
  );
}

export default AddDataAndVarsToBodyHelp;
