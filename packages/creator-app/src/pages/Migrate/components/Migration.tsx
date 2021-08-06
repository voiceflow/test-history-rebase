import { AlexaProjectMemberData } from '@voiceflow/alexa-types';
import { Alert, AlertVariant, Box, BoxFlex, Button, Input, Select, toast } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import * as Errors from '@/config/errors';
import * as Account from '@/ducks/account';
import * as Product from '@/ducks/product';
import * as Project from '@/ducks/project';
import * as Session from '@/ducks/session';
import { connect } from '@/hocs';
import { useAsyncMountUnmount } from '@/hooks';
import { ConnectedProps } from '@/types';
import * as Sentry from '@/vendors/sentry';

interface MigrationProps {
  onError: (error: string) => void;
  onSuccess: () => void;
}

const Migration: React.FC<MigrationProps & ConnectedMigrationProps> = ({ amazonAccount, productMap, projectID, selectedVendor, onSuccess }) => {
  const [vendorID, setVendorID] = React.useState<string>(selectedVendor ?? '');
  const [projectMember, setProjectMember] = React.useState<AlexaProjectMemberData | null>(null);
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
      Sentry.error(Errors.noActiveProjectID());
      toast.genericError();
      return;
    }

    setProjectMember((await client.api.project.member.get<AlexaProjectMemberData>(projectID)).platformData);
  });

  React.useEffect(() => {
    updateData();
  }, [vendorID, projectMember]);

  const save = async () => {
    if (!vendorID) {
      Sentry.error('invalid vendor');
      toast.error('invalid vendor');
      return;
    }

    if (!projectID) {
      Sentry.error(Errors.noActiveProjectID());
      toast.genericError();
      return;
    }

    if (!skillID.startsWith('amzn1.ask.skill')) {
      Sentry.error(`invalid skill ID: ${skillID}`);
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
      if (!projectMember?.vendors?.find((vendor) => vendor.vendorID === vendorID)) {
        await client.api.project.member.platformDataAdd(projectID, 'vendors', vendorData);
      } else {
        await client.api.project.member.platformDataUpdate(projectID, 'vendors.[$vendorID]', vendorData, { vendorID });
      }
      onSuccess();
    } catch (error) {
      toast.error(`invalid project member data ${error}`);
    }
  };

  return (
    <Box>
      <Alert variant={AlertVariant.DANGER}>
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
        <Input value={skillID} onChange={(e) => setSkillID(e.target.value)} placeholder="no existing Skill ID" />
      </Box>
      <h3>In Skill Products</h3>
      {Object.keys(products).map((productID) => (
        <Box key={productID} width="100%" mb={16}>
          <>
            {productMap[productID]?.name} <b>({productID})</b>
          </>
          <Input
            value={products[productID]}
            onChange={(e) => setProducts({ ...products, [productID]: e.target.value })}
            placeholder="no existing alexa product ID"
          />
        </Box>
      ))}
      <Alert>Please verify all the updated data is correct, or there could be catastrophic problems linking with Alexa</Alert>
      <Button onClick={save}>Update</Button>
    </Box>
  );
};

const mapStateToProps = {
  projectID: Session.activeProjectIDSelector,
  amazonAccount: Account.amazonAccountSelector,
  selectedVendor: Project.alexa.activeVendorIDSelector,
  productMap: Product.productMapSelector,
};

type ConnectedMigrationProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(Migration) as React.FC<MigrationProps>;
