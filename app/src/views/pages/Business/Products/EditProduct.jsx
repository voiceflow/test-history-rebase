import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux'
import ProductDescriptionForm from './ProductDescriptionForm';
import PhrasesForm from './PhrasesForm';
import PricingForm from './PricingForm';
import IconsForm from './IconsForm';
import { addProduct, updateProduct } from './../../../../actions/productActions'
import { setError } from 'ducks/modal'
import ProductDetailsForm from './ProductDetailsForm';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import {TAX_CATEGORY} from './Constants.js';
import subSchema from './Schemas/subSchema.json';
import entitlementSchema from './Schemas/entitlementSchema.json';
import consumableSchema from './Schemas/consumableSchema.json';

const STAGES = ["Description", "Pricing", "Invocations", "Icons", "Details"];

const stepperTheme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  overrides: {
    MuiStepConnector: {
      line: {
        borderColor: '#cdd7e0 !important',
      }
    },
    MuiStepIcon: {
      root:{
        color: '#cdd7e0 !important',
      },
      completed: {
        color: '#42a5ff !important',
        borderRadius: '50%',
      },
      active: {
        color: '#42a5ff !important',
        boxShadow: '0 2px 5px 0 rgba(0, 0, 0, .10) !important',
        borderRadius: '50%',
        margin: '0px !important',
        transform: 'scale(1.35)',
        transition: 'all 0.25s',
        border: '1px solid #fff',
      }
    },
    MuiStepLabel:{
      label: {
        color:'#b6c2cc !important',
      },
      active: {
        color: '#2b3950 !important',
      }
    }
  }
})

class EditProduct extends React.Component {
  constructor(props) {
    super(props);
    let id = this.props.computedMatch.params.id

    this.state = {
      stage: 0,
      product_id: id,
      data: {},
      name: "",
      summary: "",
      purchaseType:"ENTITLEMENT" ,
      subType: "Monthly",
      trial: 0,
      unit: "",
      price: "",
      distCountries: "US",
      taxCategory: TAX_CATEGORY[0],
      phrases: [''],
      small_icon: null,
      large_icon: null,
      keywords: [],
      description: "",
      prompt: "",
      policy: "",
      testInstruct: "",
      loading: id !== 'new'
    };

    this.updateStage = this.updateStage.bind(this);
    this.updateProduct = this.updateProduct.bind(this);
    this.renderForm = this.renderForm.bind(this);
    this.populateData = this.populateData.bind(this);
    this.submit = this.submit.bind(this);
    this.invalidSubmit = this.invalidSubmit.bind(this);
  }

  componentDidMount() {
      if(this.state.product_id !== 'new'){
          axios.get(`/skill/${this.props.skill_id}/product/${this.state.product_id}`)
          .then(res => {
              let data = res.data[0].data;
              this.setState({
                  data: res.data[0] ? res.data[0] : {},
                  name: data.publishingInformation ? data.publishingInformation.locales["en-US"].name :"",
                  summary: data.publishingInformation ? data.publishingInformation.locales["en-US"].summary :"",
                  purchaseType: data.type ? data.type :"ENTITLEMENT" ,
                  subType: data.subscriptionInformation ? data.subscriptionInformation.subscriptionPaymentFrequency :"Monthly",
                  trial: data.subscriptionInformation ? data.subscriptionInformation.subscriptionTrialPeriodDays :0,
                  unit: data.publishingInformation ? data.publishingInformation.locales["en-US"].name :"",
                  price: data.publishingInformation ? data.publishingInformation.pricing["amazon.com"].defaultPriceListing.price :"",
                  distCountries: "US",
                  taxCategory: data.publishingInformation ? data.publishingInformation.taxInformation.category.toLowerCase().replace(/_/g, ' ') :TAX_CATEGORY[0],
                  phrases: data.publishingInformation ? data.publishingInformation.locales["en-US"].examplePhrases :[''],
                  small_icon: data.publishingInformation ? data.publishingInformation.locales["en-US"].smallIconUri :null,
                  large_icon: data.publishingInformation ? data.publishingInformation.locales["en-US"].largeIconUri :null,
                  keywords: data.publishingInformation ? data.publishingInformation.locales["en-US"].keywords.toString() :[],
                  description: data.publishingInformation ? data.publishingInformation.locales["en-US"].description :"",
                  buyDescription: data.publishingInformation ? data.publishingInformation.locales["en-US"].customProductPrompts.boughtCardDescription :"",
                  prompt: data.publishingInformation ? data.publishingInformation.locales["en-US"].customProductPrompts.purchasePromptDescription :"",
                  policy: data.publishingInformation ? data.privacyAndCompliance.locales["en-US"].privacyPolicyUrl :"",
                  testInstruct: data.testingInstructions ? data.testingInstructions :"",
                  content: res.data.content,
                  title: res.data.title,
                  subject: res.data.subject,
                  sender: res.data.sender,
                  loading: false
              });
              if(this.iframe){
                  const iframe = this.iframe;
                  const doc = iframe.contentDocument;
                  doc.body.innerHTML = res.data.content;
              }
          }).catch(err => {
              console.error(err)
              this.props.setError('Unable to Retrieve Template')
          })
      }else{
          this.setState({
              title: 'New Product'
          });
          if(this.iframe){
              const iframe = this.iframe;
              const doc = iframe.contentDocument;
              doc.body.innerHTML = this.state.content;
          }
      }
  }

  updateStage(stage){
    this.setState({stage: stage})
  }

  handleChange = (property, value) => event => {
    if (!_.isUndefined(value)) {
      this.setState({ [property]: value })
    } else if (!_.isNull(event)){
      if (!_.isUndefined(event.target)) {
        this.setState({ [property]: event.target.value })
      } else {
        this.setState({ [property]: event })
      }
    } else {
      this.setState({ [property]: event })
    }
  }

  handlePhraseChange = idx => e => {
    const newPhrases = _.map(this.state.phrases, (phrase, pidx) => {
      if (idx !== pidx) return phrase;
      return e.target.value;
    })
    this.setState({ phrases: newPhrases})
  }

  handlePhraseAdd = () => {
    this.setState({
      phrases: this.state.phrases.concat([''])
    });
  }

  handlePhraseRemove = idx => () => {
    this.setState({
      phrases: _.filter(this.state.phrases, (p, pidx) => idx !== pidx)
    });
  }

  submit() {
    let template;
    switch(this.state.purchaseType) {
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
    template = this.populateData(template)
    if (_.isEmpty(this.state.data)){
      this.updateProduct(template, null, true);
    } else {
      this.updateProduct(template, null, false);
    }
  }

  updateProduct(data, node, newProduct = true) {
      if (newProduct){
        let product = {};
        product.data = data
        product.skill = this.props.skill_id;
        product.name = data.publishingInformation.locales["en-US"].name
        axios.post('/skill/product?new=1', product)
        .then(res => {
            product.id = res.data.id
            this.props.history.push(`/business/${this.props.skill_id}/products`)
            this.props.dispatch(addProduct(product))
        })
        .catch(err => {
            console.log(err.response)
            this.setState({saving: false})
            this.props.setError('Unable to create new Product')
        })
      } else {
        let curr = this.state.data;
        curr.data = data
        curr.name = data.publishingInformation.locales["en-US"].name
        axios.post('/skill/product', curr)
        .then(res => {
            this.props.dispatch(updateProduct(curr))
            this.props.history.push(`/business/${this.props.skill_id}/products`)
        })
        .catch(err => {
            console.log(err.response)
            this.setState({saving: false})
            this.props.setError('Unable to update Product')
        })
      }
  }

  populateData(data) {
    let locales = {};
    let info = data.publishingInformation;
    let privacy = data.privacyAndCompliance;
    let prompts = {};
    locales["name"] = this.state.name;
    locales["smallIconUri"] = this.state.small_icon;
    locales["largeIconUri"] = this.state.large_icon;
    locales["summary"] = this.state.summary;
    locales["description"] = this.state.description;
    locales["examplePhrases"] = !_.isNull(this.state.phrases.name) ? this.state.phrases.filter(phrase => phrase.trim()) : [];
    locales["keywords"] = this.state.keywords ? this.state.keywords.split(',') : [];
    info.pricing["amazon.com"].defaultPriceListing.price = this.state.price;
    info.pricing["amazon.com"].releaseDate = moment().format("YYYY-MM-DD");
    prompts["boughtCardDescription"] = this.state.buyDescription;
    prompts["purchasePromptDescription"] = this.state.prompt;
    locales["customProductPrompts"] = prompts;
    info.taxInformation.category = this.state.taxCategory.toUpperCase().replace(/ /g,"_");
    data.type = this.state.purchaseType;
    privacy.locales["en-US"].privacyPolicyUrl = this.state.policy;
    data.testingInstructions = this.state.testInstruct;
    info.locales["en-US"] = locales;
    data.referenceName = this.state.name.replace(/ /g, "_").toLowerCase();

    return data
  }

  invalidSubmit(event, errors, values) {
    console.log(values);
    console.log(errors);
    this.props.setError('Invalid Product - ' + JSON.stringify(errors))
  }
  renderForm(){
    switch(this.state.stage) {
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
        )
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
        )
      case 2:
        return (
          <PhrasesForm
            handleChange={this.handlePhraseChange}
            handleAdd={this.handlePhraseAdd}
            handleRemove={this.handlePhraseRemove}
            phrases={this.state.phrases}
            updateStage={this.updateStage}
          />
        )
      case 3:
        return (
          <IconsForm
            handleChange={this.handleChange}
            large_icon={this.state.large_icon}
            small_icon={this.state.small_icon}
            updateStage={this.updateStage}
          />
        )
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
        )
    }
  }
  render() {
    if(this.state.loading){
      return <div id="loading-diagram">
          <div className="text-center">
              <h5 className="text-muted mb-2">Loading Products</h5>
              <span className="loader"/>
          </div>
      </div>
    }

    return (
      <MuiThemeProvider theme={stepperTheme}>
      <div className="h-100 w-100">
            <button className="goback-btn position-fixed" onClick={()=>{
                this.props.history.push(`/business/${this.props.skill_id}/products`)
            }} style={{top: 135, left: 210}}>
            </button>
          <div>
              <div className="product-editor pt-2">
                  <div className="stepper">
                    <Stepper className="stepper" activeStep={this.state.stage} alternativeLabel>
                      {
                        _.map(STAGES, (stage, idx) => { return(
                            <Step key={idx} className="step" color='#42a5ff'>
                              <StepLabel color='#42a5ff'>{stage}</StepLabel>
                            </Step>
                        )})
                      }
                    </Stepper>
                  </div>
                  <div className="product-form">
                    <div className="product-form-inner">
                      {this.renderForm()}
                    </div>
                  </div>
              </div>
        </div>
    </div>
    </MuiThemeProvider>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setError: err => dispatch(setError(err))
  }
}
export default connect(null, mapDispatchToProps)(EditProduct);
