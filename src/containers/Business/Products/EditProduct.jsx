import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';

// Components
import Button from '@/components/Button';
import { FullSpinner } from '@/components/Spinner';
// Ducks
import { setError } from '@/ducks/modal';
import { addProduct, updateProduct } from '@/ducks/product';

import GuidedSteps from '../../../components/GuidedSteps';
// Constants
import { TAX_CATEGORY } from './Constants';
import IconsForm from './IconsForm';
import PhrasesForm from './PhrasesForm';
import PricingForm from './PricingForm';
// Form components
import ProductDescriptionForm from './ProductDescriptionForm';
import ProductDetailsForm from './ProductDetailsForm';
import consumableSchema from './Schemas/consumableSchema.json';
import entitlementSchema from './Schemas/entitlementSchema.json';
import subSchema from './Schemas/subSchema.json';

const AMAZON_KEY = 'amazon.com';

class EditProduct extends React.Component {
  constructor(props) {
    super(props);
    const id = this.props.computedMatch.params.id;

    this.state = {
      stage: 0,
      product_id: id,
      data: {},
      name: '',
      summary: '',
      purchaseType: 'ENTITLEMENT',
      subType: 'Monthly',
      trial: 0,
      unit: '',
      price: '',
      distCountries: 'US',
      taxCategory: TAX_CATEGORY[0],
      phrases: [''],
      small_icon: null,
      large_icon: null,
      keywords: [],
      description: '',
      prompt: '',
      policy: '',
      testInstruct: '',
      loading: id !== 'new',
    };
  }

  componentDidMount() {
    if (this.state.product_id !== 'new') {
      axios
        .get(`/skill/${this.props.skill_id}/product/${this.state.product_id}`)
        .then((res) => {
          const data = res.data[0].data;
          this.setState({
            data: res.data[0] ? res.data[0] : {},
            name: data.publishingInformation ? data.publishingInformation.locales['en-US'].name : '',
            summary: data.publishingInformation ? data.publishingInformation.locales['en-US'].summary : '',
            purchaseType: data.type ? data.type : 'ENTITLEMENT',
            subType: data.subscriptionInformation ? data.subscriptionInformation.subscriptionPaymentFrequency : 'Monthly',
            trial: data.subscriptionInformation ? data.subscriptionInformation.subscriptionTrialPeriodDays : 0,
            unit: data.publishingInformation ? data.publishingInformation.locales['en-US'].name : '',
            price: data.publishingInformation ? data.publishingInformation.pricing[AMAZON_KEY].defaultPriceListing.price : '',
            distCountries: 'US',
            taxCategory: data.publishingInformation
              ? data.publishingInformation.taxInformation.category.toLowerCase().replace(/_/g, ' ')
              : TAX_CATEGORY[0],
            phrases:
              data.publishingInformation && data.publishingInformation.locales['en-US'].examplePhrases.length > 0
                ? data.publishingInformation.locales['en-US'].examplePhrases
                : [''],
            small_icon: data.publishingInformation ? data.publishingInformation.locales['en-US'].smallIconUri : null,
            large_icon: data.publishingInformation ? data.publishingInformation.locales['en-US'].largeIconUri : null,
            keywords: data.publishingInformation ? data.publishingInformation.locales['en-US'].keywords.toString() : [],
            description: data.publishingInformation ? data.publishingInformation.locales['en-US'].description : '',
            buyDescription: data.publishingInformation ? data.publishingInformation.locales['en-US'].customProductPrompts.boughtCardDescription : '',
            prompt: data.publishingInformation ? data.publishingInformation.locales['en-US'].customProductPrompts.purchasePromptDescription : '',
            policy: data.publishingInformation ? data.privacyAndCompliance.locales['en-US'].privacyPolicyUrl : '',
            testInstruct: data.testingInstructions ? data.testingInstructions : '',
            content: res.data.content,
            title: res.data.title,
            subject: res.data.subject,
            sender: res.data.sender,
            loading: false,
          });
          if (this.iframe) {
            const iframe = this.iframe;
            const doc = iframe.contentDocument;

            // eslint-disable-next-line xss/no-mixed-html
            doc.body.innerHTML = res.data.content;
          }
        })
        .catch((err) => {
          console.error(err);
          this.props.setError('Unable to Retrieve Template');
        });
    } else {
      this.setState({
        title: 'New Product',
      });
      if (this.iframe) {
        const iframe = this.iframe;
        const doc = iframe.contentDocument;

        // eslint-disable-next-line xss/no-mixed-html
        doc.body.innerHTML = this.state.content;
      }
    }
  }

  updateStage = (stage) => {
    this.setState({ stage });
  };

  handleChange = (property, value) => (event) => {
    if (!_.isUndefined(value)) {
      this.setState({ [property]: value });
    } else if (!_.isNull(event)) {
      if (!_.isUndefined(event.target)) {
        this.setState({ [property]: event.target.value });
      } else {
        this.setState({ [property]: event });
      }
    } else {
      this.setState({ [property]: event });
    }
  };

  handlePhraseChange = (idx) => (e) => {
    const newPhrases = _.map(this.state.phrases, (phrase, pidx) => {
      if (idx !== pidx) return phrase;
      return e.target.value;
    });
    this.setState({ phrases: newPhrases });
  };

  handlePhraseAdd = (e) => {
    e.preventDefault();
    this.setState({
      phrases: this.state.phrases.concat(['']),
    });
    return false;
  };

  handlePhraseRemove = (idx) => (e) => {
    if (e) e.preventDefault();
    this.setState({
      phrases: _.filter(this.state.phrases, (p, pidx) => idx !== pidx),
    });
  };

  submit = () => {
    let template;
    switch (this.state.purchaseType) {
      case 'ENTITLEMENT':
        template = entitlementSchema;
        break;
      case 'SUBSCRIPTION':
        template = subSchema;
        template.subscriptionInformation.subscriptionPaymentFrequency = this.state.subType.toUpperCase();
        template.subscriptionInformation.subscriptionTrialPeriodDays = this.state.trial;
        break;
      case 'CONSUMABLE':
      default:
        template = consumableSchema;
    }
    template = this.populateData(template);
    this.updateProduct(template, null, _.isEmpty(this.state.data));
  };

  updateProduct = (data, node, newProduct = true) => {
    if (newProduct) {
      const product = {
        data,
        skill: this.props.skill_id,
        name: data.publishingInformation.locales['en-US'].name,
      };

      axios
        .post('/skill/product?new=1', product)
        .then((res) => {
          product.id = res.data.id;
          this.props.history.push(`/tools/${this.props.skill_id}/products`);
          this.props.dispatch(addProduct(product));
        })
        .catch(() => {
          this.setState({ saving: false });
          this.props.setError('Unable to create new Product');
        });
    } else {
      const curr = this.state.data;
      curr.data = data;
      curr.name = data.publishingInformation.locales['en-US'].name;
      curr.skill = this.props.skill_id;
      axios
        .post('/skill/product', curr)
        .then(() => {
          this.props.dispatch(updateProduct(curr));
          this.props.history.push(`/tools/${this.props.skill_id}/products`);
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.log(err.response);
          this.setState({ saving: false });
          this.props.setError('Unable to update Product');
        });
    }
  };

  populateData = (data) => {
    const locales = {};
    const info = data.publishingInformation;
    const privacy = data.privacyAndCompliance;
    const prompts = {};
    locales.name = this.state.name;
    locales.smallIconUri = this.state.small_icon;
    locales.largeIconUri = this.state.large_icon;
    locales.summary = this.state.summary;
    locales.description = this.state.description;
    locales.examplePhrases = !_.isNull(this.state.phrases.name) ? this.state.phrases.filter((phrase) => phrase.trim()) : [];
    locales.keywords = typeof this.state.keywords === 'string' ? this.state.keywords.split(',') : [];
    info.pricing[AMAZON_KEY].defaultPriceListing.price = this.state.price;
    info.pricing[AMAZON_KEY].releaseDate = moment().format('YYYY-MM-DD');
    prompts.boughtCardDescription = this.state.buyDescription;
    prompts.purchasePromptDescription = this.state.prompt;
    locales.customProductPrompts = prompts;
    info.taxInformation.category = this.state.taxCategory.toUpperCase().replace(/ /g, '_');
    data.type = this.state.purchaseType;
    privacy.locales['en-US'].privacyPolicyUrl = this.state.policy;
    data.testingInstructions = this.state.testInstruct;
    info.locales['en-US'] = locales;
    data.referenceName = this.state.name.replace(/ /g, '_').toLowerCase();

    return data;
  };

  invalidSubmit = (_event, errors) => {
    this.props.setError(`Invalid Product - ${JSON.stringify(errors)}`);
  };

  setStage = (stepNum) => {
    this.setState({
      stage: stepNum,
    });
  };

  renderBlocks = () => {
    const blocks = [];
    const enterText = <>Submit</>;
    blocks.push({
      title: 'Description',
      content: (
        <ProductDescriptionForm
          handleChange={this.handleChange}
          name={this.state.name}
          synonyms={this.state.synonyms}
          summary={this.state.summary}
          detailed={this.state.detailed}
          continue={this.updateStage}
        />
      ),
    });

    blocks.push({
      title: 'Pricing',
      content: (
        <PricingForm
          handleChange={this.handleChange}
          purchaseType={this.state.purchaseType}
          price={this.state.price}
          distCountries={this.state.distCountries}
          taxCategory={this.state.taxCategory}
          subType={this.state.subType}
          updateStage={this.updateStage}
        />
      ),
    });

    blocks.push({
      title: 'Invocations',
      content: (
        <PhrasesForm
          handleChange={this.handlePhraseChange}
          handleAdd={this.handlePhraseAdd}
          handleRemove={this.handlePhraseRemove}
          phrases={this.state.phrases}
          updateStage={this.updateStage}
        />
      ),
    });

    blocks.push({
      title: 'Icons',
      content: (
        <IconsForm
          handleChange={this.handleChange}
          large_icon={this.state.large_icon}
          small_icon={this.state.small_icon}
          updateStage={this.updateStage}
        />
      ),
    });

    blocks.push({
      title: 'Details',
      content: (
        <ProductDetailsForm
          handleChange={this.handleChange}
          keywords={this.state.keywords}
          description={this.state.description}
          prompt={this.state.prompt}
          policy={this.state.policy}
          testInstruct={this.state.testInstruct}
          buyDescription={this.state.buyDescription}
          updateStage={this.updateStage}
          submit={this.submit}
        />
      ),
    });

    return <GuidedSteps blocks={blocks} submitText={enterText} haveFooter step={this.state.stage} setStage={this.setStage} forceFollow noDetail />;
  };

  renderForm = () => {
    switch (this.state.stage) {
      case 0:
        return (
          <ProductDescriptionForm
            handleChange={this.handleChange}
            name={this.state.name}
            synonyms={this.state.synonyms}
            summary={this.state.summary}
            detailed={this.state.detailed}
            continue={this.updateStage}
          />
        );
      case 1:
        return (
          <PricingForm
            handleChange={this.handleChange}
            purchaseType={this.state.purchaseType}
            price={this.state.price}
            distCountries={this.state.distCountries}
            taxCategory={this.state.taxCategory}
            subType={this.state.subType}
            updateStage={this.updateStage}
          />
        );
      case 2:
        return (
          <PhrasesForm
            handleChange={this.handlePhraseChange}
            handleAdd={this.handlePhraseAdd}
            handleRemove={this.handlePhraseRemove}
            phrases={this.state.phrases}
            updateStage={this.updateStage}
          />
        );
      case 3:
        return (
          <IconsForm
            handleChange={this.handleChange}
            large_icon={this.state.large_icon}
            small_icon={this.state.small_icon}
            updateStage={this.updateStage}
          />
        );
      case 4:
      default:
        return (
          <ProductDetailsForm
            handleChange={this.handleChange}
            keywords={this.state.keywords}
            description={this.state.description}
            prompt={this.state.prompt}
            policy={this.state.policy}
            testInstruct={this.state.testInstruct}
            buyDescription={this.state.buyDescription}
            updateStage={this.updateStage}
            submit={this.submit}
          />
        );
    }
  };

  render() {
    if (this.state.loading) {
      return <FullSpinner name="Products" />;
    }

    return (
      <div className="h-100 w-100">
        <Button
          className="goback-btn position-fixed"
          onClick={() => {
            this.props.history.push(`/tools/${this.props.skill_id}/products`);
          }}
          style={{ top: 135, left: 120 }}
        />
        <div style={{ marginTop: '20px' }}>{this.renderBlocks()}</div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setError: (err) => dispatch(setError(err)),
  };
};
export default connect(
  null,
  mapDispatchToProps
)(EditProduct);
