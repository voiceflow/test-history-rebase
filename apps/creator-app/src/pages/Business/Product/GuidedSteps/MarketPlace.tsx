/* eslint-disable jsx-a11y/label-has-for, jsx-a11y/label-has-associated-control */
import { AlexaProject } from '@voiceflow/alexa-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Button, ButtonVariant, Input } from '@voiceflow/ui';
import React from 'react';

import DropdownMultiselect from '@/components/DropdownMultiselect';
import * as VersionV2 from '@/ducks/versionV2';
import { useSelector } from '@/hooks';
import { CountriesName, MarketPlaceAvailability } from '@/services/LocaleMap';

import { ProductContext } from '../../contexts';
import { AvailabilitySubSection, NextButtonContainer, SubSection, Text } from './components';

const DropdownMultiselectComponent = DropdownMultiselect as React.FC<any>;

const PARENT_CONTROLS = {
  marketplace: 'amazon.com',
  price: 9.99,
};

const MarketPlaceOptions = MarketPlaceAvailability.map(({ marketPlace, currency }) => ({
  value: marketPlace,
  label: `${marketPlace} (${currency})`,
}));

export interface MarketPlaceProps {
  advanceStep: VoidFunction;
}

const MarketPlace: React.FC<MarketPlaceProps> = ({ advanceStep }) => {
  const { product, patchProduct } = React.useContext(ProductContext)!;
  const parentalControl = useSelector(VersionV2.active.alexa.parentalControlSelector);
  const [{ invalidPrice, invalidIndex }, setInvalidState] = React.useState<{ invalidPrice: boolean; invalidIndex: number | null }>({
    invalidPrice: false,
    invalidIndex: null,
  });
  const selectedPlaces = React.useMemo(() => Object.keys(product.marketPlaces) as AlexaProject.MarketPlace[], [product.marketPlaces]);
  const buttonLabel = selectedPlaces.length === 0 ? 'Select All' : 'Unselect All';

  const selectAllMarketPlaceToggle = () => {
    const nextMarketPlaces = selectedPlaces.length
      ? {}
      : MarketPlaceAvailability.reduce(
          (acc, { marketPlace, currency, min }) =>
            Object.assign(acc, {
              [marketPlace]: {
                ...product.marketPlaces[marketPlace],
                currency,
                price: min,
                countries: [],
              },
            }),
          {}
        );

    patchProduct({ marketPlaces: nextMarketPlaces });
  };

  const selectAllCountriesToggle = (place: AlexaProject.MarketPlace, allCountries: string[]) => () => {
    const { marketPlaces = {} } = product;

    patchProduct({
      marketPlaces: {
        ...marketPlaces,
        [place]: {
          ...marketPlaces[place],
          countries: !marketPlaces[place]?.countries.length ? allCountries : [],
        },
      },
    });
  };

  const setMarketPlace = (place: AlexaProject.MarketPlace) => {
    if (selectedPlaces.includes(place)) {
      patchProduct({
        marketPlaces: selectedPlaces.reduce<Partial<Record<AlexaProject.MarketPlace, Realtime.ProductMarketPlace>>>((acc, key) => {
          if (key !== place) {
            acc[key] = product.marketPlaces[key];
          }
          return acc;
        }, {}),
      });
    } else {
      patchProduct({
        marketPlaces: {
          ...product.marketPlaces,
          [place]: {
            ...product.marketPlaces[place],
            price: 0,
            countries: [],
            currency: MarketPlaceAvailability.find((value) => value.marketPlace === place)?.currency,
          },
        },
      });
    }
  };

  const setCountries = (place: AlexaProject.MarketPlace) => (country: string) => {
    const { marketPlaces = {} } = product;
    const marketPlace = marketPlaces[place];

    const nextCountries = marketPlace?.countries.includes(country)
      ? marketPlace.countries.filter((value) => value !== country)
      : [...(marketPlace?.countries ?? []), country];

    patchProduct({
      marketPlaces: {
        ...marketPlaces,
        [place]: {
          ...marketPlaces[place],
          countries: nextCountries,
        },
      },
    });
  };

  const onPriceChange = (place: AlexaProject.MarketPlace, index: number) => (value: string) => {
    const { marketPlaces = {}, type } = product;
    const price = Number(value);

    if (
      price < MarketPlaceAvailability[index].min ||
      price > MarketPlaceAvailability[index].max[type] ||
      (parentalControl && place === PARENT_CONTROLS.marketplace && price > PARENT_CONTROLS.price)
    ) {
      setInvalidState({ invalidPrice: true, invalidIndex: index });
    } else {
      setInvalidState({ invalidPrice: false, invalidIndex: null });

      patchProduct({
        marketPlaces: {
          ...marketPlaces,
          [place]: {
            ...marketPlaces[place],
            price: value,
          },
        },
      });
    }
  };

  return (
    <Box>
      <Box mb={24}>
        <SubSection>
          <label>Marketplace Availability</label>
          <DropdownMultiselectComponent
            maxHeight="300px"
            placement="bottom"
            autoWidth
            placeholder="Select MarketPlace"
            options={MarketPlaceOptions}
            onSelect={setMarketPlace}
            selectedItems={selectedPlaces}
            buttonLabel={buttonLabel}
            buttonClick={selectAllMarketPlaceToggle}
            dropdownLabel="Marketplaces"
            selectedValue={selectedPlaces.join(', ')}
          />
        </SubSection>

        {selectedPlaces.length !== 0 && (
          <SubSection flex topAlign>
            <AvailabilitySubSection size="25%">
              <label>Pricing</label>
              {MarketPlaceAvailability.map(
                ({ marketPlace: place, icon, min, max }, index) =>
                  selectedPlaces.includes(place) && (
                    <div key={index}>
                      <SubSection flex>
                        <Input
                          type="number"
                          name="price"
                          onChangeText={onPriceChange(place, index)}
                          placeholder={`e.g. ${min}`}
                          defaultValue={product.marketPlaces[place]?.price}
                        />
                        <Text>{icon}</Text>
                      </SubSection>

                      {invalidPrice && index === invalidIndex && (
                        <Text small noPadding error>
                          {min} min/
                          {parentalControl && place === PARENT_CONTROLS.marketplace ? PARENT_CONTROLS.price : max[product.type]} max
                        </Text>
                      )}
                    </div>
                  )
              )}
            </AvailabilitySubSection>

            <AvailabilitySubSection size="75%">
              <label>Distribution Countries & Regions</label>
              {MarketPlaceAvailability.map(
                ({ marketPlace: place, countries: allCountries }, index) =>
                  selectedPlaces.includes(place) && (
                    <div key={index}>
                      <DropdownMultiselectComponent
                        maxHeight="300px"
                        placement="bottom"
                        autoWidth
                        placeholder="Select Countries"
                        options={allCountries.map((country) => ({
                          value: country,
                          label: `${country} (${CountriesName[country as keyof typeof CountriesName]})`,
                        }))}
                        onSelect={setCountries(place)}
                        selectedItems={product.marketPlaces[place]?.countries}
                        buttonLabel={product.marketPlaces[place]?.countries.length === 0 ? 'Select All' : 'Unselect All'}
                        buttonClick={selectAllCountriesToggle(place, allCountries)}
                        dropdownLabel="Countries"
                        selectedValue={product.marketPlaces[place]?.countries.join(', ')}
                      />
                    </div>
                  )
              )}
            </AvailabilitySubSection>
          </SubSection>
        )}
      </Box>

      <NextButtonContainer>
        <Button variant={ButtonVariant.SECONDARY} onClick={advanceStep}>
          Next
        </Button>
      </NextButtonContainer>
    </Box>
  );
};

export default MarketPlace;
