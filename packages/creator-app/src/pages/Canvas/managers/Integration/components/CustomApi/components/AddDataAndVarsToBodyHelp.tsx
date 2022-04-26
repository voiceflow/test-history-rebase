import { Tooltip } from '@voiceflow/ui';
import React from 'react';

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

const AddDataAndVarsToBodyHelp: React.FC = () => (
  <>
    <Tooltip.Paragraph marginBottomUnits={2}>
      Let’s say your skill collects the customer’s name and saves it to the <b>{'{FirstName}'}</b> variable.
    </Tooltip.Paragraph>

    <Tooltip.Paragraph marginBottomUnits={2}>To send the name via POST request, you need to enter the following body:</Tooltip.Paragraph>

    <Tooltip.Section marginBottomUnits={2}>
      <Tooltip.JSONCode html={jsonExample1} />
    </Tooltip.Section>

    <Tooltip.Paragraph marginBottomUnits={2}>
      To add custom data to the POST body (e.g., customer’s country for the US only skill), you can use the following structure:
    </Tooltip.Paragraph>

    <Tooltip.Section marginBottomUnits={2}>
      <Tooltip.JSONCode html={jsonExample2} />
    </Tooltip.Section>

    <Tooltip.Paragraph marginBottomUnits={2}>To add a parent object for user details, you may stick to the following pattern:</Tooltip.Paragraph>

    <Tooltip.Section>
      <Tooltip.JSONCode html={jsonExample3} />
    </Tooltip.Section>
  </>
);

export default AddDataAndVarsToBodyHelp;
