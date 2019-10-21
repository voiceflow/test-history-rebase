/* eslint-disable no-shadow */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { AvForm, AvGroup } from 'availity-reactstrap-validation';
import React from 'react';

import Button from '@/componentsV2/Button';
import DropdownMultiselect from '@/componentsV2/DropdownMultiselect';
import { productByIDSelector, updateProduct } from '@/ducks/product';
import { connect } from '@/hocs';
import { CountriesName, MarketPlaceAvailability } from '@/services/LocaleMap';
import Input from '@/componentsV2/Input';

import { AvailabilitySubSection, NextButtonContainer, PriceInput, SubSection, Text } from './components';

const MarketPlaceOptions = MarketPlaceAvailability.map(({ marketPlace, currency }) => ({
  value: marketPlace,
  label: `${marketPlace} (${currency})`,
}));

class MarketPlace extends React.PureComponent {
  state = {
    invalidPrice: false,
    invalidIndex: null,
  };

  get selectedPlaces() {
    return Object.keys(this.props.product.marketPlaces);
  }

  get buttonLabel() {
    return this.selectedPlaces.length === 0 ? 'Select All' : 'Unselect All';
  }

  render() {
    const { invalidPrice, invalidIndex } = this.state;
    const { product, changeStep } = this.props;

    return (
      <AvForm onValidSubmit={changeStep}>
        <AvGroup>
          <SubSection>
            <label>Marketplace Availability</label>
            <DropdownMultiselect
              autoWidth={true}
              placeholder="Select MarketPlace"
              options={MarketPlaceOptions}
              onSelect={this.setMarketPlace}
              selectedItems={this.selectedPlaces}
              buttonLabel={this.buttonLabel}
              buttonClick={this.selectAllMarketPlaceToggle}
              dropdownLabel="Marketplaces"
              selectedValue={this.selectedPlaces.join(', ')}
            />
          </SubSection>

          {this.selectedPlaces.length !== 0 && (
            <SubSection flex topAlign>
              <AvailabilitySubSection size="25%">
                <label>Pricing</label>
                {MarketPlaceAvailability.map(({ marketPlace: place, icon, min, max }, index) => {
                  return (
                    this.selectedPlaces.includes(place) && (
                      <div key={index}>
                        <SubSection flex>
                          <Input
                            name="price"
                            placeholder={`e.g. ${min}`}
                            value={product.marketPlaces[place].price}
                            onChange={this.onPriceChange(place, index)}
                          />
                          <Text>{icon}</Text>
                        </SubSection>
                        {invalidPrice && index === invalidIndex && (
                          <Text small noPadding error>
                            {min} min/
                            {max[product.type]} max
                          </Text>
                        )}
                      </div>
                    )
                  );
                })}
              </AvailabilitySubSection>

              <AvailabilitySubSection size="75%">
                <label>Distribution Countries & Regions</label>
                {MarketPlaceAvailability.map(({ marketPlace: place, countries: allCountries }, index) => {
                  return (
                    this.selectedPlaces.includes(place) && (
                      <div key={index}>
                        <DropdownMultiselect
                          placement="top"
                          autoWidth={true}
                          placeholder="Select Countries"
                          options={allCountries.map((country) => ({ value: country, label: `${country} (${CountriesName[country]})` }))}
                          onSelect={this.setCountries(place)}
                          selectedItems={product.marketPlaces[place].countries}
                          buttonLabel={product.marketPlaces[place].countries.length === 0 ? 'Select All' : 'Unselect All'}
                          buttonClick={this.selectAllCountriesToggle(place, allCountries)}
                          dropdownLabel="Countries"
                          selectedValue={product.marketPlaces[place].countries.join(', ')}
                        />
                      </div>
                    )
                  );
                })}
              </AvailabilitySubSection>
            </SubSection>
          )}
        </AvGroup>

        <NextButtonContainer>
          <Button variant="secondary">Next</Button>
        </NextButtonContainer>
      </AvForm>
    );
  }

  selectAllMarketPlaceToggle = () => {
    const { product, updateProduct } = this.props;

    if (this.selectedPlaces.length === 0) {
      updateProduct({
        ...product,
        marketPlaces: MarketPlaceAvailability.map(({ marketPlace, currency, min }) => {
          return {
            [marketPlace]: {
              ...product.marketPlaces[marketPlace],
              currency,
              price: min,
              countries: [],
            },
          };
        }).reduce((r, c) => Object.assign(r, c), {}),
      });
    } else {
      updateProduct({ ...product, marketPlaces: {} });
    }
  };

  setMarketPlace = (place) => {
    const {
      product: { marketPlaces = {}, ...restProduct },
      updateProduct,
    } = this.props;

    if (this.selectedPlaces.includes(place)) {
      updateProduct({
        ...restProduct,
        marketPlaces: this.selectedPlaces.reduce((object, key) => {
          if (key !== place) {
            object[key] = marketPlaces[key];
          }
          return object;
        }, {}),
      });
    } else {
      updateProduct({
        ...restProduct,
        marketPlaces: {
          ...marketPlaces,
          [place]: {
            ...marketPlaces[place],
            price: 0,
            countries: [],
            currency: MarketPlaceAvailability.find((value) => value.marketPlace === place).currency,
          },
        },
      });
    }
  };

  onPriceChange = (place, index) => (e) => {
    const {
      product: { marketPlaces = {}, ...restProduct },
      updateProduct,
    } = this.props;

    if (e.target.value < MarketPlaceAvailability[index].min || e.target.value > MarketPlaceAvailability[index].max[restProduct.type]) {
      this.setState({ invalidPrice: true, invalidIndex: index });
    } else {
      this.setState({ invalidPrice: false, invalidIndex: null });

      updateProduct({
        ...restProduct,
        marketPlaces: {
          ...marketPlaces,
          [place]: {
            ...marketPlaces[place],
            price: e.target.value,
          },
        },
      });
    }
  };

  selectAllCountriesToggle = (place, allCountries) => () => {
    const {
      product: { marketPlaces = {}, ...restProduct },
      updateProduct,
    } = this.props;

    if (marketPlaces[place].countries.length === 0) {
      updateProduct({
        ...restProduct,
        marketPlaces: {
          ...marketPlaces,
          [place]: {
            ...marketPlaces[place],
            countries: allCountries,
          },
        },
      });
    } else {
      updateProduct({
        ...restProduct,
        marketPlaces: {
          ...marketPlaces,
          [place]: {
            ...marketPlaces[place],
            countries: [],
          },
        },
      });
    }
  };

  setCountries = (place) => (country) => {
    const {
      product: { marketPlaces = {}, ...restProduct },
      updateProduct,
    } = this.props;

    if (marketPlaces[place].countries.includes(country)) {
      updateProduct({
        ...restProduct,
        marketPlaces: {
          ...marketPlaces,
          [place]: {
            ...marketPlaces[place],
            countries: marketPlaces[place].countries.filter((value) => value !== country),
          },
        },
      });
    } else {
      updateProduct({
        ...restProduct,
        marketPlaces: {
          ...marketPlaces,
          [place]: {
            ...marketPlaces[place],
            countries: [...marketPlaces[place].countries, country],
          },
        },
      });
    }
  };
}

const mapStateToProps = {
  product: productByIDSelector,
};

const mapDispatchToProps = {
  updateProduct,
};

const mergeProps = ({ product: productByIDSelector }, { updateProduct }, { productID }) => ({
  product: productByIDSelector(productID),
  updateProduct: (product) => updateProduct(productID, product),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(MarketPlace);
