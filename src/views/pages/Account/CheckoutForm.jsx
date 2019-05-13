import React from 'react'
import cn from 'classnames'
import {injectStripe, CardElement} from 'react-stripe-elements'
import {Button, Input, Alert} from 'reactstrap'
import axios from 'axios'

const countries = [
    {
        "name": "United States",
        "code": "US"
    }, {
        "name": "Afghanistan",
        "code": "AF"
    }, {
        "name": "land Islands",
        "code": "AX"
    }, {
        "name": "Albania",
        "code": "AL"
    }, {
        "name": "Algeria",
        "code": "DZ"
    }, {
        "name": "American Samoa",
        "code": "AS"
    }, {
        "name": "AndorrA",
        "code": "AD"
    }, {
        "name": "Angola",
        "code": "AO"
    }, {
        "name": "Anguilla",
        "code": "AI"
    }, {
        "name": "Antarctica",
        "code": "AQ"
    }, {
        "name": "Antigua and Barbuda",
        "code": "AG"
    }, {
        "name": "Argentina",
        "code": "AR"
    }, {
        "name": "Armenia",
        "code": "AM"
    }, {
        "name": "Aruba",
        "code": "AW"
    }, {
        "name": "Australia",
        "code": "AU"
    }, {
        "name": "Austria",
        "code": "AT"
    }, {
        "name": "Azerbaijan",
        "code": "AZ"
    }, {
        "name": "Bahamas",
        "code": "BS"
    }, {
        "name": "Bahrain",
        "code": "BH"
    }, {
        "name": "Bangladesh",
        "code": "BD"
    }, {
        "name": "Barbados",
        "code": "BB"
    }, {
        "name": "Belarus",
        "code": "BY"
    }, {
        "name": "Belgium",
        "code": "BE"
    }, {
        "name": "Belize",
        "code": "BZ"
    }, {
        "name": "Benin",
        "code": "BJ"
    }, {
        "name": "Bermuda",
        "code": "BM"
    }, {
        "name": "Bhutan",
        "code": "BT"
    }, {
        "name": "Bolivia",
        "code": "BO"
    }, {
        "name": "Bosnia and Herzegovina",
        "code": "BA"
    }, {
        "name": "Botswana",
        "code": "BW"
    }, {
        "name": "Bouvet Island",
        "code": "BV"
    }, {
        "name": "Brazil",
        "code": "BR"
    }, {
        "name": "British Indian Ocean Territory",
        "code": "IO"
    }, {
        "name": "Brunei Darussalam",
        "code": "BN"
    }, {
        "name": "Bulgaria",
        "code": "BG"
    }, {
        "name": "Burkina Faso",
        "code": "BF"
    }, {
        "name": "Burundi",
        "code": "BI"
    }, {
        "name": "Cambodia",
        "code": "KH"
    }, {
        "name": "Cameroon",
        "code": "CM"
    }, {
        "name": "Canada",
        "code": "CA"
    }, {
        "name": "Cape Verde",
        "code": "CV"
    }, {
        "name": "Cayman Islands",
        "code": "KY"
    }, {
        "name": "Central African Republic",
        "code": "CF"
    }, {
        "name": "Chad",
        "code": "TD"
    }, {
        "name": "Chile",
        "code": "CL"
    }, {
        "name": "China",
        "code": "CN"
    }, {
        "name": "Christmas Island",
        "code": "CX"
    }, {
        "name": "Cocos (Keeling) Islands",
        "code": "CC"
    }, {
        "name": "Colombia",
        "code": "CO"
    }, {
        "name": "Comoros",
        "code": "KM"
    }, {
        "name": "Congo",
        "code": "CG"
    }, {
        "name": "Congo, The Democratic Republic of the",
        "code": "CD"
    }, {
        "name": "Cook Islands",
        "code": "CK"
    }, {
        "name": "Costa Rica",
        "code": "CR"
    }, {
        "name": "Cote D'Ivoire",
        "code": "CI"
    }, {
        "name": "Croatia",
        "code": "HR"
    }, {
        "name": "Cuba",
        "code": "CU"
    }, {
        "name": "Cyprus",
        "code": "CY"
    }, {
        "name": "Czech Republic",
        "code": "CZ"
    }, {
        "name": "Denmark",
        "code": "DK"
    }, {
        "name": "Djibouti",
        "code": "DJ"
    }, {
        "name": "Dominica",
        "code": "DM"
    }, {
        "name": "Dominican Republic",
        "code": "DO"
    }, {
        "name": "Ecuador",
        "code": "EC"
    }, {
        "name": "Egypt",
        "code": "EG"
    }, {
        "name": "El Salvador",
        "code": "SV"
    }, {
        "name": "Equatorial Guinea",
        "code": "GQ"
    }, {
        "name": "Eritrea",
        "code": "ER"
    }, {
        "name": "Estonia",
        "code": "EE"
    }, {
        "name": "Ethiopia",
        "code": "ET"
    }, {
        "name": "Falkland Islands (Malvinas)",
        "code": "FK"
    }, {
        "name": "Faroe Islands",
        "code": "FO"
    }, {
        "name": "Fiji",
        "code": "FJ"
    }, {
        "name": "Finland",
        "code": "FI"
    }, {
        "name": "France",
        "code": "FR"
    }, {
        "name": "French Guiana",
        "code": "GF"
    }, {
        "name": "French Polynesia",
        "code": "PF"
    }, {
        "name": "French Southern Territories",
        "code": "TF"
    }, {
        "name": "Gabon",
        "code": "GA"
    }, {
        "name": "Gambia",
        "code": "GM"
    }, {
        "name": "Georgia",
        "code": "GE"
    }, {
        "name": "Germany",
        "code": "DE"
    }, {
        "name": "Ghana",
        "code": "GH"
    }, {
        "name": "Gibraltar",
        "code": "GI"
    }, {
        "name": "Greece",
        "code": "GR"
    }, {
        "name": "Greenland",
        "code": "GL"
    }, {
        "name": "Grenada",
        "code": "GD"
    }, {
        "name": "Guadeloupe",
        "code": "GP"
    }, {
        "name": "Guam",
        "code": "GU"
    }, {
        "name": "Guatemala",
        "code": "GT"
    }, {
        "name": "Guernsey",
        "code": "GG"
    }, {
        "name": "Guinea",
        "code": "GN"
    }, {
        "name": "Guinea-Bissau",
        "code": "GW"
    }, {
        "name": "Guyana",
        "code": "GY"
    }, {
        "name": "Haiti",
        "code": "HT"
    }, {
        "name": "Heard Island and Mcdonald Islands",
        "code": "HM"
    }, {
        "name": "Holy See (Vatican City State)",
        "code": "VA"
    }, {
        "name": "Honduras",
        "code": "HN"
    }, {
        "name": "Hong Kong",
        "code": "HK"
    }, {
        "name": "Hungary",
        "code": "HU"
    }, {
        "name": "Iceland",
        "code": "IS"
    }, {
        "name": "India",
        "code": "IN"
    }, {
        "name": "Indonesia",
        "code": "ID"
    }, {
        "name": "Iran, Islamic Republic Of",
        "code": "IR"
    }, {
        "name": "Iraq",
        "code": "IQ"
    }, {
        "name": "Ireland",
        "code": "IE"
    }, {
        "name": "Isle of Man",
        "code": "IM"
    }, {
        "name": "Israel",
        "code": "IL"
    }, {
        "name": "Italy",
        "code": "IT"
    }, {
        "name": "Jamaica",
        "code": "JM"
    }, {
        "name": "Japan",
        "code": "JP"
    }, {
        "name": "Jersey",
        "code": "JE"
    }, {
        "name": "Jordan",
        "code": "JO"
    }, {
        "name": "Kazakhstan",
        "code": "KZ"
    }, {
        "name": "Kenya",
        "code": "KE"
    }, {
        "name": "Kiribati",
        "code": "KI"
    }, {
        "name": "Korea, Democratic People's Republic of",
        "code": "KP"
    }, {
        "name": "Korea, Republic of",
        "code": "KR"
    }, {
        "name": "Kuwait",
        "code": "KW"
    }, {
        "name": "Kyrgyzstan",
        "code": "KG"
    }, {
        "name": "Lao People's Democratic Republic",
        "code": "LA"
    }, {
        "name": "Latvia",
        "code": "LV"
    }, {
        "name": "Lebanon",
        "code": "LB"
    }, {
        "name": "Lesotho",
        "code": "LS"
    }, {
        "name": "Liberia",
        "code": "LR"
    }, {
        "name": "Libyan Arab Jamahiriya",
        "code": "LY"
    }, {
        "name": "Liechtenstein",
        "code": "LI"
    }, {
        "name": "Lithuania",
        "code": "LT"
    }, {
        "name": "Luxembourg",
        "code": "LU"
    }, {
        "name": "Macao",
        "code": "MO"
    }, {
        "name": "Macedonia, The Former Yugoslav Republic of",
        "code": "MK"
    }, {
        "name": "Madagascar",
        "code": "MG"
    }, {
        "name": "Malawi",
        "code": "MW"
    }, {
        "name": "Malaysia",
        "code": "MY"
    }, {
        "name": "Maldives",
        "code": "MV"
    }, {
        "name": "Mali",
        "code": "ML"
    }, {
        "name": "Malta",
        "code": "MT"
    }, {
        "name": "Marshall Islands",
        "code": "MH"
    }, {
        "name": "Martinique",
        "code": "MQ"
    }, {
        "name": "Mauritania",
        "code": "MR"
    }, {
        "name": "Mauritius",
        "code": "MU"
    }, {
        "name": "Mayotte",
        "code": "YT"
    }, {
        "name": "Mexico",
        "code": "MX"
    }, {
        "name": "Micronesia, Federated States of",
        "code": "FM"
    }, {
        "name": "Moldova, Republic of",
        "code": "MD"
    }, {
        "name": "Monaco",
        "code": "MC"
    }, {
        "name": "Mongolia",
        "code": "MN"
    }, {
        "name": "Montenegro",
        "code": "ME"
    }, {
        "name": "Montserrat",
        "code": "MS"
    }, {
        "name": "Morocco",
        "code": "MA"
    }, {
        "name": "Mozambique",
        "code": "MZ"
    }, {
        "name": "Myanmar",
        "code": "MM"
    }, {
        "name": "Namibia",
        "code": "NA"
    }, {
        "name": "Nauru",
        "code": "NR"
    }, {
        "name": "Nepal",
        "code": "NP"
    }, {
        "name": "Netherlands",
        "code": "NL"
    }, {
        "name": "Netherlands Antilles",
        "code": "AN"
    }, {
        "name": "New Caledonia",
        "code": "NC"
    }, {
        "name": "New Zealand",
        "code": "NZ"
    }, {
        "name": "Nicaragua",
        "code": "NI"
    }, {
        "name": "Niger",
        "code": "NE"
    }, {
        "name": "Nigeria",
        "code": "NG"
    }, {
        "name": "Niue",
        "code": "NU"
    }, {
        "name": "Norfolk Island",
        "code": "NF"
    }, {
        "name": "Northern Mariana Islands",
        "code": "MP"
    }, {
        "name": "Norway",
        "code": "NO"
    }, {
        "name": "Oman",
        "code": "OM"
    }, {
        "name": "Pakistan",
        "code": "PK"
    }, {
        "name": "Palau",
        "code": "PW"
    }, {
        "name": "Palestinian Territory, Occupied",
        "code": "PS"
    }, {
        "name": "Panama",
        "code": "PA"
    }, {
        "name": "Papua New Guinea",
        "code": "PG"
    }, {
        "name": "Paraguay",
        "code": "PY"
    }, {
        "name": "Peru",
        "code": "PE"
    }, {
        "name": "Philippines",
        "code": "PH"
    }, {
        "name": "Pitcairn",
        "code": "PN"
    }, {
        "name": "Poland",
        "code": "PL"
    }, {
        "name": "Portugal",
        "code": "PT"
    }, {
        "name": "Puerto Rico",
        "code": "PR"
    }, {
        "name": "Qatar",
        "code": "QA"
    }, {
        "name": "Reunion",
        "code": "RE"
    }, {
        "name": "Romania",
        "code": "RO"
    }, {
        "name": "Russian Federation",
        "code": "RU"
    }, {
        "name": "RWANDA",
        "code": "RW"
    }, {
        "name": "Saint Helena",
        "code": "SH"
    }, {
        "name": "Saint Kitts and Nevis",
        "code": "KN"
    }, {
        "name": "Saint Lucia",
        "code": "LC"
    }, {
        "name": "Saint Pierre and Miquelon",
        "code": "PM"
    }, {
        "name": "Saint Vincent and the Grenadines",
        "code": "VC"
    }, {
        "name": "Samoa",
        "code": "WS"
    }, {
        "name": "San Marino",
        "code": "SM"
    }, {
        "name": "Sao Tome and Principe",
        "code": "ST"
    }, {
        "name": "Saudi Arabia",
        "code": "SA"
    }, {
        "name": "Senegal",
        "code": "SN"
    }, {
        "name": "Serbia",
        "code": "RS"
    }, {
        "name": "Seychelles",
        "code": "SC"
    }, {
        "name": "Sierra Leone",
        "code": "SL"
    }, {
        "name": "Singapore",
        "code": "SG"
    }, {
        "name": "Slovakia",
        "code": "SK"
    }, {
        "name": "Slovenia",
        "code": "SI"
    }, {
        "name": "Solomon Islands",
        "code": "SB"
    }, {
        "name": "Somalia",
        "code": "SO"
    }, {
        "name": "South Africa",
        "code": "ZA"
    }, {
        "name": "South Georgia and the South Sandwich Islands",
        "code": "GS"
    }, {
        "name": "Spain",
        "code": "ES"
    }, {
        "name": "Sri Lanka",
        "code": "LK"
    }, {
        "name": "Sudan",
        "code": "SD"
    }, {
        "name": "Suriname",
        "code": "SR"
    }, {
        "name": "Svalbard and Jan Mayen",
        "code": "SJ"
    }, {
        "name": "Swaziland",
        "code": "SZ"
    }, {
        "name": "Sweden",
        "code": "SE"
    }, {
        "name": "Switzerland",
        "code": "CH"
    }, {
        "name": "Syrian Arab Republic",
        "code": "SY"
    }, {
        "name": "Taiwan, Province of China",
        "code": "TW"
    }, {
        "name": "Tajikistan",
        "code": "TJ"
    }, {
        "name": "Tanzania, United Republic of",
        "code": "TZ"
    }, {
        "name": "Thailand",
        "code": "TH"
    }, {
        "name": "Timor-Leste",
        "code": "TL"
    }, {
        "name": "Togo",
        "code": "TG"
    }, {
        "name": "Tokelau",
        "code": "TK"
    }, {
        "name": "Tonga",
        "code": "TO"
    }, {
        "name": "Trinidad and Tobago",
        "code": "TT"
    }, {
        "name": "Tunisia",
        "code": "TN"
    }, {
        "name": "Turkey",
        "code": "TR"
    }, {
        "name": "Turkmenistan",
        "code": "TM"
    }, {
        "name": "Turks and Caicos Islands",
        "code": "TC"
    }, {
        "name": "Tuvalu",
        "code": "TV"
    }, {
        "name": "Uganda",
        "code": "UG"
    }, {
        "name": "Ukraine",
        "code": "UA"
    }, {
        "name": "United Arab Emirates",
        "code": "AE"
    }, {
        "name": "United Kingdom",
        "code": "GB"
    }, {
        "name": "United States Minor Outlying Islands",
        "code": "UM"
    }, {
        "name": "Uruguay",
        "code": "UY"
    }, {
        "name": "Uzbekistan",
        "code": "UZ"
    }, {
        "name": "Vanuatu",
        "code": "VU"
    }, {
        "name": "Venezuela",
        "code": "VE"
    }, {
        "name": "Viet Nam",
        "code": "VN"
    }, {
        "name": "Virgin Islands, British",
        "code": "VG"
    }, {
        "name": "Virgin Islands, U.S.",
        "code": "VI"
    }, {
        "name": "Wallis and Futuna",
        "code": "WF"
    }, {
        "name": "Western Sahara",
        "code": "EH"
    }, {
        "name": "Yemen",
        "code": "YE"
    }, {
        "name": "Zambia",
        "code": "ZM"
    }, {
        "name": "Zimbabwe",
        "code": "ZW"
    }
]

const MAX_POLL_COUNT = 15;
const POLL_INTERVAL = 1000

class CheckoutForm extends React.Component {
    constructor(props) {
        super(props)

        let admin = window.user_detail.admin === 0
            ? 0
            : -1

        this.state = {
            name: this.props.user.name,
            street: '',
            street2: '',
            city: '',
            country: '',
            state: '',
            zip: '',
            stage: admin,
            error: null,
            promo: null,
            promo_invalid: 0,
            admin: admin
        }

        this.handleSubmit = this
            .handleSubmit
            .bind(this)
        this.handleChange = this
            .handleChange
            .bind(this)
        this.renderStage = this
            .renderStage
            .bind(this)
        this.promoChange = this
            .promoChange
            .bind(this)
        this.renderForm = this.renderForm.bind(this)
        this.handlePayment = this.handlePayment.bind(this)
    }

    componentDidMount() {
        if (this.state.stage === -1) {
            axios
                .get('/customer')
                .then(res => {
                    this.setState({
                        admin: (res.data * 1),
                        stage: 0
                    })
                })
                .catch(err => {
                    this.setState({admin: 0, stage: 0})
                })
        }
    }

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handlePayment(source=null) {
        this.setState({stage: 2})
        let body = {
            plan: this.props.selected,
        }
        if(source){
            body.source = source
        }
        if (typeof this.state.promo === 'string' && this.state.promo.length === 12 && !this.promo_invalid) {
            body.promo = this.state.promo
        }
        axios
            .post('/customer/subscription', body)
            .then(res => {
                let that = this
                if(source){
                    that.setState({stage: 3})
                    let pollCount = 0
                    let pollForSourceStatus = () => {
                        that
                            .props
                            .stripe
                            .retrieveSource({id: source.id, client_secret: source.client_secret})
                            .then((result) => {
                                // Depending on the Charge status, show your customer the relevant message.
                                var temp_source = result.source
                                if (temp_source.status === 'chargeable') {
                                    setTimeout(() => that.setState({stage: 4}), 5000)
                                } else if (temp_source.status === 'pending' && pollCount < MAX_POLL_COUNT) {
                                    // Try again in a second, if the Source is still `pending`:
                                    pollCount += 1;
                                    setTimeout(pollForSourceStatus, POLL_INTERVAL);
                                } else {
                                    that.setState({
                                        error: `Payment is deferred - You will receieve an email and will be 
                                        updated when the charge comes through`
                                    })
                                }
                            })
                    }
                    pollForSourceStatus()
                }else{
                    setTimeout(() => that.setState({stage: 4}), 5000)
                }
            })
            .catch(err => {
                console.log(err)
                let error = 'Payment Failed'
                if (err.response && err.response.data && err.response.data.message) {
                    console.log(err.response.data)
                    error = err.response.data.message
                }
                this.setState({error: error})
            })
    }

    handleSubmit = (e) => {
        // We don't want to let default form submission happen here, which would refresh
        // the page.
        e.preventDefault();
        this.setState({stage: 1})
        // Within the context of `Elements`, this call to createToken knows which
        // Element to tokenize, since there's only one in this group.
        this
            .props
            .stripe
            .createSource({
                type: 'card',
                owner: {
                    name: this.state.name,
                    email: this.props.user.email,
                    address: {
                        city: this.state.city,
                        country: this.state.country,
                        line1: this.state.street,
                        line2: this.state.street2,
                        state: this.state.state
                    }
                }
            })
            .then(({source}) => {
                this.handlePayment(source)
            })
            .catch(err => {
                console.log(err)
                this.setState({error: 'Error Creating Payment'})
            })
    };

    renderStage() {
        if (this.state.error) {
            return <div className="pt-3">
                <Alert>{this.state.error}</Alert>
                <Button
                    className="exit"
                    color="primary"
                    block
                    onClick={() => {
                    this.setState({error: null, stage: 0})
                }}>
                    <i className="far fa-chevron-left mr-2"/>Return
                </Button>
            </div>
        } else {
            let status
            switch (this.state.stage) {
                case - 1:
                    status = 'Checking Account'
                    break
                case 1:
                    status = 'Checking Payment'
                    break
                case 2:
                    status = 'Updating subscription'
                    break
                case 3:
                    status = 'Verifying Payment'
                    break
                case 4:
                    // TODO ACTUALLY UPDATE THE ACCOUNT WTF STRIPE
                    status = 'Updating Account'
                    break
                default:
                    return null
            }

            return <div
                className="super-center"
                style={{
                minHeight: 'inherit'
            }}>
                <div className="text-center">
                    <h5 className="pb-3">{status}</h5>
                    <h1><span className="loader"/></h1>
                </div>
            </div>
        }
    }

    promoChange(e) {
        let invalid = 1
        let value = e.target.value
        if (value.length === 12) {
            invalid = 2
            axios
                .get(`/customer/promo/${value}`)
                .then(success => {
                    let data = success.data
                    this
                        .props
                        .switchPlan(data.real_plan)
                    this.setState({price: data.price, period: data.period, promo_invalid: 0})
                })
                .catch(err => {
                    this.setState({promo_invalid: 1, price: undefined, period: undefined})
                })
        }
        this.setState({promo: value, promo_invalid: invalid, price: undefined, period: undefined})
    }

    renderForm() {
        const price = <div className="price">
            <span className="text-pricing">
                ${this.state.price || this.props.plan.price}
            </span>/{this.state.period || 'mo'}
        </div>

        if(this.state.admin > 0){
            if(this.props.selected > this.state.admin){
                return <React.Fragment>
                    {price}
                    <hr/>
                    <Button color="primary" block onClick={()=>this.handlePayment()}>
                        Upgrade Plan
                    </Button>
                </React.Fragment>
            }else{
                return <div className="pt-2 text-center">
                    <Alert color="warning">
                        This plan is not available
                    </Alert>
                </div>
            }
        }
        
        return <form onSubmit={this.handleSubmit}>
            {price}
            <div>
                {this.state.promo !== null && <React.Fragment>
                    <label>
                        Promotional Code
                    </label>
                    <Input
                        name="promo"
                        onChange={this.promoChange}
                        value={this.state.promo}
                        placeholder="XXXXXXXXXXXX"
                        maxLength={12}
                        className={cn({ 'is-invalid': this.state.promo_invalid})}
                    />
                    {!!this.state.promo_invalid &&
                        <div className="invalid-feedback">
                            {this.state.promo_invalid === 2
                                ? 'Checking Promo Code...'
                                : 'Invalid Promotional Code'
                            }
                        </div>
                    }
                </React.Fragment>}
                <label>
                    Billing Information
                </label>
                <div className="billing-info mb-3">
                    <Input
                        name="name"
                        placeholder="Full Name"
                        onChange={this.handleChange}
                        value={this.state.name}
                        maxLength={64}
                        required/>
                    <Input
                        name="street"
                        placeholder="Address Line 1"
                        onChange={this.handleChange}
                        value={this.state.street}
                        maxLength={128}
                        required/>
                    <Input
                        name="street2"
                        placeholder="Address Line 2"
                        onChange={this.handleChange}
                        value={this.state.street2}
                        maxLength={64}/>
                    <div className="d-flex">
                        <Input
                            type="select"
                            name="country"
                            placeholder="Country"
                            onChange={this.handleChange}
                            value={this.state.country}
                            className="mr-2"
                            required>
                            <option disabled value="">Country</option>
                            {countries.map((country, i) => <option key={i} value={country.code}>{country.name}</option>)}
                        </Input>
                        <Input
                            name="city"
                            placeholder="City"
                            onChange={this.handleChange}
                            value={this.state.city}
                            className="mr-2"
                            required/>
                        <Input
                            name="state"
                            placeholder="State/Province"
                            onChange={this.handleChange}
                            value={this.state.state}
                            className="mr-2"
                            required/>
                    </div>
                </div>
                <label>
                    Card details
                </label>
                <CardElement/>
            </div>
            <Button color="primary" className="mt-3" block>Confirm order</Button>
            <div className="text-center small mt-2">
                <span className="text-muted">All payments are secure and handled with</span>
                <a href="https://stripe.com" target="_blank" rel="noopener noreferrer">Stripe</a>
            </div>
        </form>
    }

    render() {
        // success
        if (this.state.stage === 4) {
            return <div className="payment-form pt-3">
                <p>Your Account has been Successfully Updated</p>
                <Alert color="success">
                    Please Log out and Sign In again
                </Alert>
                <Button onClick={this.props.logout} block>Logout</Button>
            </div>
        }

        if (this.state.admin === this.props.selected) {
            return <div className="payment-form pt-2 text-center">
                <Alert>Subscribed to this plan</Alert>
                <img className="w-75 mt-3" src="/business.svg" alt="plan"></img>
            </div>
        }

        return (
            <div className="payment-form">
                {this.renderStage()}
                <div className={cn({ 'd-none': this.state.stage !== 0 })}>
                    {this.renderForm()}
                </div>
            </div>
        );
    }
}

export default injectStripe(CheckoutForm);