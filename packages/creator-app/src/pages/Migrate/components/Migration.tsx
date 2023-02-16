import { datadogRum } from '@datadog/browser-rum';
import { AlexaProject } from '@voiceflow/alexa-types';
import { Alert, Box, BoxFlex, Button, Input, Select, toast } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import * as Errors from '@/config/errors';
import * as Account from '@/ducks/account';
import * as ProductV2 from '@/ducks/productV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import { useAsyncMountUnmount, useSelector } from '@/hooks';

interface MigrationProps {
  onError?: (error: string) => void;
  onSuccess: () => void;
}

const Migration: React.FC<MigrationProps> = ({ onSuccess }) => {
  const projectID = useSelector(Session.activeProjectIDSelector);
  const productMap = useSelector(ProductV2.productMapSelector);
  const amazonAccount = useSelector(Account.amazonAccountSelector);
  const selectedVendor = useSelector(ProjectV2.active.alexa.ownVendorIDSelector);

  const [vendorID, setVendorID] = React.useState<string>(selectedVendor ?? '');
  const [projectMember, setProjectMember] = React.useState<AlexaProject.MemberPlatformData | null>(null);
  const [skillID, setSkillID] = React.useState<string>('');
  const [products, setProducts] = React.useState<Record<string, string>>({});

  const updateData = () => {
    const vendorData = projectMember?.vendors?.find((data) => data.vendorID === vendorID);
    setSkillID(vendorData?.skillID || '');

    const alexaProducts = vendorData?.products || {};
    const productIDs = Array.from(new Set([...Object.keys(alexaProducts), ...Object.keys(productMap)]));
    setProducts(
      productIDs.reduce<Record<string, string>>((acc, value) => {
        acc[value] = alexaProducts[value] || '';
        return acc;
      }, {})
    );
  };

  useAsyncMountUnmount(async () => {
    if (!projectID) {
      datadogRum.addError(Errors.noActiveProjectID());
      toast.genericError();
      return;
    }

    setProjectMember((await client.api.project.member.get<AlexaProject.MemberPlatformData>(projectID)).platformData);
  });

  React.useEffect(() => {
    updateData();
  }, [vendorID, projectMember]);

  const save = async () => {
    if (!vendorID) {
      datadogRum.addError('invalid vendor');
      toast.error('invalid vendor');
      return;
    }

    if (!projectID) {
      datadogRum.addError(Errors.noActiveProjectID());
      toast.genericError();
      return;
    }

    if (!skillID.startsWith('amzn1.ask.skill')) {
      datadogRum.addError(`invalid skill ID: ${skillID}`);
      toast.error(`invalid skill ID: ${skillID}`);
      return;
    }

    const sanitizedProducts: Record<string, string> = {};
    // eslint-disable-next-line guard-for-in, no-restricted-syntax
    for (const productID in products) {
      const amazonProductID = products[productID];
      if (!amazonProductID.trim()) {
        continue;
      }
      if (!amazonProductID.startsWith('amzn1.adg.product')) {
        toast.error(`invalid product ID: ${amazonProductID}`);
        return;
      }
      sanitizedProducts[productID] = amazonProductID;
    }

    try {
      const vendorData = {
        vendorID,
        skillID,
        products: sanitizedProducts,
      };
      if (!projectMember) {
        await client.api.project.member.create(projectID, { platformData: { vendors: [vendorData], selectedVendor: vendorID } });
      } else if (!projectMember?.vendors?.find((vendor) => vendor.vendorID === vendorID)) {
        await client.api.project.member.platformDataAdd(projectID, 'vendors', vendorData);
      } else {
        await client.api.project.member.platformDataUpdate(projectID, 'vendors.[$vendorID]', vendorData, { vendorID });
      }
      onSuccess();
    } catch (error) {
      toast.error(`invalid assistant member data ${error}`);
    }
  };

  return (
    <Box>
      <Alert mb={16} variant={Alert.Variant.DANGER}>
        Updating the Skill ID will cause Voiceflow to overwrite any existing content on the development version of the Skill on Alexa Developer
        Console - <b>Applies on next upload</b>
      </Alert>
      <h3>Vendor ID</h3>
      <Box mb={32} width="100%">
        <Select
          value={vendorID}
          options={amazonAccount?.vendors?.map(({ id }) => id) || []}
          getOptionLabel={(id) => `${amazonAccount?.vendors.find((data) => data.id === id)?.name} (${id})`}
          onSelect={setVendorID}
        />
      </Box>
      <BoxFlex>
        <h3>Skill ID</h3>
      </BoxFlex>
      <Box mb={32} width="100%">
        <Input value={skillID} onChangeText={(value) => setSkillID(value)} placeholder="no existing Skill ID" />
      </Box>
      <h3>In Skill Products</h3>
      {Object.keys(products).map((productID) => (
        <Box key={productID} width="100%" mb={16}>
          <>
            {productMap[productID]?.name} <b>({productID})</b>
          </>
          <Input
            value={products[productID]}
            onChangeText={(value) => setProducts({ ...products, [productID]: value })}
            placeholder="no existing alexa product ID"
          />
        </Box>
      ))}
      <Alert mb={16}>Please verify all the updated data is correct, or there could be catastrophic problems linking with Alexa</Alert>
      <Button onClick={save}>Update</Button>
    </Box>
  );
};

export default Migration;
