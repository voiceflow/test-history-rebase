import * as utils from '../../utils';
import { createDividerMenuItemOption } from '../NestedMenu';

export interface Country {
  value: string;
  divider?: boolean;
  booster: number;
  alternative: string;
  searchAlternative: string;
  searchValue: string;
}

const COUNTRIES = [
  {
    value: 'United States',
    alternative: 'US USA United States of America',
    booster: 3.5,
  },
  createDividerMenuItemOption('divider'),
  { value: 'Afghanistan', alternative: 'AF افغانستان' },
  { value: 'Aland Islands', alternative: 'AX Aaland Aland', booster: 0.5 },
  { value: 'Albania', alternative: 'AL' },
  { value: 'Algeria', alternative: 'DZ الجزائر' },
  { value: 'American Samoa', alternative: 'AS', booster: 0.5 },
  { value: 'Andorra', alternative: 'AD', booster: 0.5 },
  { value: 'Angola', alternative: 'AO' },
  { value: 'Anguilla', alternative: 'AI', booster: 0.5 },
  { value: 'Antarctica', alternative: 'AQ', booster: 0.5 },
  { value: 'Antigua and Barbuda', alternative: 'AG', booster: 0.5 },
  { value: 'Argentina', alternative: 'AR' },
  { value: 'Armenia', alternative: 'AM Հայաստան' },
  { value: 'Aruba', alternative: 'AW', booster: 0.5 },
  { value: 'Australia', alternative: 'AU', booster: 1.5 },
  { value: 'Austria', alternative: 'AT Österreich Osterreich Oesterreich ' },
  { value: 'Azerbaijan', alternative: 'AZ' },
  { value: 'Bahamas', alternative: 'BS' },
  { value: 'Bahrain', alternative: 'BH البحرين' },
  { value: 'Bangladesh', alternative: 'BD বাংলাদেশ', booster: 2 },
  { value: 'Barbados', alternative: 'BB' },
  { value: 'Belarus', alternative: 'BY Беларусь' },
  {
    value: 'Belgium',
    alternative: 'BE België Belgie Belgien Belgique',
    booster: 1.5,
  },
  { value: 'Belize', alternative: 'BZ' },
  { value: 'Benin', alternative: 'BJ' },
  { value: 'Bermuda', alternative: 'BM', booster: 0.5 },
  { value: 'Bhutan', alternative: 'BT भूटान' },
  { value: 'Bolivia', alternative: 'BO' },
  { value: 'Bonaire, Saint Eustatius and Saba', alternative: 'BQ' },
  {
    value: 'Bosnia and Herzegovina',
    alternative: 'BA BiH Bosna i Hercegovina Босна и Херцеговина',
  },
  { value: 'Botswana', alternative: 'BW' },
  { value: 'Bouvet Island', alternative: 'BV' },
  { value: 'Brazil', alternative: 'BR Brasil', booster: 2 },
  { value: 'British Indian Ocean Territory', alternative: 'IO' },
  { value: 'British Virgin Islands', alternative: 'VG', booster: 0.5 },
  { value: 'Brunei', alternative: 'BN' },
  { value: 'Bulgaria', alternative: 'BG България' },
  { value: 'Burkina Faso', alternative: 'BF' },
  { value: 'Burundi', alternative: 'BI' },
  { value: 'Cambodia', alternative: 'KH កម្ពុជា' },
  { value: 'Cameroon', alternative: 'CM' },
  { value: 'Canada', alternative: 'CA', booster: 2.5 },
  { value: 'Cape Verde', alternative: 'CV Cabo' },
  { value: 'Cayman Islands', alternative: 'KY', booster: 0.5 },
  { value: 'Central African Republic', alternative: 'CF' },
  { value: 'Chad', alternative: 'TD تشاد‎ Tchad' },
  { value: 'Chile', alternative: 'CL' },
  {
    value: 'China',
    alternative: 'CN Zhongguo Zhonghua Peoples Republic 中国/中华',
    booster: 3.5,
  },
  { value: 'Christmas Island', alternative: 'CX', booster: 0.5 },
  { value: 'Cocos Islands', alternative: 'CC', booster: 0.5 },
  { value: 'Colombia', alternative: 'CO' },
  { value: 'Comoros', alternative: 'KM جزر القمر' },
  { value: 'Cook Islands', alternative: 'CK', booster: 0.5 },
  { value: 'Costa Rica', alternative: 'CR' },
  { value: 'Croatia', alternative: 'HR Hrvatska' },
  { value: 'Cuba', alternative: 'CU' },
  { value: 'Curacao', alternative: 'CW' },
  { value: 'Cyprus', alternative: 'CY Κύπρος Kýpros Kıbrıs' },
  { value: 'Czech Republic', alternative: 'CZ Česká Ceska' },
  {
    value: 'Democratic Republic of the Congo',
    alternative: 'CD Congo-Brazzaville Repubilika ya Kongo',
  },
  { value: 'Denmark', alternative: 'DK Danmark', booster: 1.5 },
  { value: 'Djibouti', alternative: 'DJ جيبوتي‎ Jabuuti Gabuuti' },
  { value: 'Dominica', alternative: 'DM Dominique', booster: 0.5 },
  { value: 'Dominican Republic', alternative: 'DO' },
  { value: 'East Timor', alternative: 'TL' },
  { value: 'Ecuador', alternative: 'EC' },
  { value: 'Egypt', alternative: 'EG', booster: 1.5 },
  { value: 'El Salvador', alternative: 'SV' },
  { value: 'Equatorial Guinea', alternative: 'GQ' },
  { value: 'Eritrea', alternative: 'ER إرتريا ኤርትራ' },
  { value: 'Estonia', alternative: 'EE Eesti' },
  { value: 'Ethiopia', alternative: 'ET ኢትዮጵያ' },
  { value: 'Falkland Islands', alternative: 'FK', booster: 0.5 },
  { value: 'Faroe Islands', alternative: 'FO Føroyar Færøerne', booster: 0.5 },
  { value: 'Fiji', alternative: 'FJ Viti फ़िजी' },
  { value: 'Finland', alternative: 'FI Suomi' },
  { value: 'France', alternative: 'FR République française', booster: 2.5 },
  { value: 'French Guiana', alternative: 'GF' },
  { value: 'French Polynesia', alternative: 'PF Polynésie française' },
  { value: 'French Southern Territories', alternative: 'TF' },
  { value: 'Gabon', alternative: 'GA République Gabonaise' },
  { value: 'Gambia', alternative: 'GM' },
  { value: 'Georgia', alternative: 'GE საქართველო' },
  {
    value: 'Germany',
    alternative: 'DE Bundesrepublik Deutschland',
    booster: 3,
  },
  { value: 'Ghana', alternative: 'GH' },
  { value: 'Gibraltar', alternative: 'GI', booster: 0.5 },
  { value: 'Greece', alternative: 'GR Ελλάδα', booster: 1.5 },
  { value: 'Greenland', alternative: 'GL grønland', booster: 0.5 },
  { value: 'Grenada', alternative: 'GD' },
  { value: 'Guadeloupe', alternative: 'GP' },
  { value: 'Guam', alternative: 'GU' },
  { value: 'Guatemala', alternative: 'GT' },
  { value: 'Guernsey', alternative: 'GG', booster: 0.5 },
  { value: 'Guinea', alternative: 'GN' },
  { value: 'Guinea-Bissau', alternative: 'GW' },
  { value: 'Guyana', alternative: 'GY' },
  { value: 'Haiti', alternative: 'HT' },
  { value: 'Heard Island and McDonald Islands', alternative: 'HM' },
  { value: 'Honduras', alternative: 'HN' },
  { value: 'Hong Kong', alternative: 'HK 香港' },
  { value: 'Hungary', alternative: 'HU Magyarország' },
  { value: 'Iceland', alternative: 'IS Island' },
  { value: 'India', alternative: 'IN भारत गणराज्य Hindustan', booster: 3 },
  { value: 'Indonesia', alternative: 'ID', booster: 2 },
  { value: 'Iran', alternative: 'IR ایران' },
  { value: 'Iraq', alternative: 'IQ العراق‎' },
  { value: 'Ireland', alternative: 'IE Éire', booster: 1.2 },
  { value: 'Isle of Man', alternative: 'IM', booster: 0.5 },
  { value: 'Israel', alternative: 'IL إسرائيل ישראל' },
  { value: 'Italy', alternative: 'IT Italia', booster: 2 },
  { value: 'Ivory Coast', alternative: 'CI Cote dIvoire' },
  { value: 'Jamaica', alternative: 'JM' },
  { value: 'Japan', alternative: 'JP Nippon Nihon 日本', booster: 2.5 },
  { value: 'Jersey', alternative: 'JE', booster: 0.5 },
  { value: 'Jordan', alternative: 'JO الأردن' },
  { value: 'Kazakhstan', alternative: 'KZ Қазақстан Казахстан' },
  { value: 'Kenya', alternative: 'KE' },
  { value: 'Kiribati', alternative: 'KI' },
  { value: 'Kosovo', alternative: 'XK' },
  { value: 'Kuwait', alternative: 'KW الكويت' },
  { value: 'Kyrgyzstan', alternative: 'KG Кыргызстан' },
  { value: 'Laos', alternative: 'LA' },
  { value: 'Latvia', alternative: 'LV Latvija' },
  { value: 'Lebanon', alternative: 'LB لبنان' },
  { value: 'Lesotho', alternative: 'LS' },
  { value: 'Liberia', alternative: 'LR' },
  { value: 'Libya', alternative: 'Libyan Arab Jamahiriya LY ليبيا' },
  { value: 'Liechtenstein', alternative: 'LI' },
  { value: 'Lithuania', alternative: 'LT Lietuva' },
  { value: 'Luxembourg', alternative: 'LU' },
  { value: 'Macao', alternative: 'MO' },
  { value: 'Macedonia', alternative: 'MK Македонија' },
  { value: 'Madagascar', alternative: 'MG Madagasikara' },
  { value: 'Malawi', alternative: 'MW' },
  { value: 'Malaysia', alternative: 'MY' },
  { value: 'Maldives', alternative: 'MV' },
  { value: 'Mali', alternative: 'ML' },
  { value: 'Malta', alternative: 'MT' },
  { value: 'Marshall Islands', alternative: 'MH', booster: 0.5 },
  { value: 'Martinique', alternative: 'MQ' },
  { value: 'Mauritania', alternative: 'MR الموريتانية' },
  { value: 'Mauritius', alternative: 'MU' },
  { value: 'Mayotte', alternative: 'YT' },
  { value: 'Mexico', alternative: 'MX Mexicanos', booster: 1.5 },
  { value: 'Micronesia', alternative: 'FM' },
  { value: 'Moldova', alternative: 'MD' },
  { value: 'Monaco', alternative: 'MC' },
  { value: 'Mongolia', alternative: 'MN Mongγol ulus Монгол улс' },
  { value: 'Montenegro', alternative: 'ME' },
  { value: 'Montserrat', alternative: 'MS', booster: 0.5 },
  { value: 'Morocco', alternative: 'MA المغرب' },
  { value: 'Mozambique', alternative: 'MZ Moçambique' },
  { value: 'Myanmar', alternative: 'MM' },
  { value: 'Namibia', alternative: 'NA Namibië' },
  { value: 'Nauru', alternative: 'NR Naoero', booster: 0.5 },
  { value: 'Nepal', alternative: 'NP नेपाल' },
  { value: 'Netherlands', alternative: 'NL Holland Nederland', booster: 1.5 },
  { value: 'New Caledonia', alternative: 'NC', booster: 0.5 },
  { value: 'New Zealand', alternative: 'NZ Aotearoa' },
  { value: 'Nicaragua', alternative: 'NI' },
  { value: 'Niger', alternative: 'NE Nijar' },
  { value: 'Nigeria', alternative: 'NG Nijeriya Naíjíríà', booster: 1.5 },
  { value: 'Niue', alternative: 'NU', booster: 0.5 },
  { value: 'Norfolk Island', alternative: 'NF', booster: 0.5 },
  { value: 'North Korea', alternative: 'KP North Korea' },
  { value: 'Northern Mariana Islands', alternative: 'MP', booster: 0.5 },
  { value: 'Norway', alternative: 'NO Norge Noreg', booster: 1.5 },
  { value: 'Oman', alternative: 'OM عمان' },
  { value: 'Pakistan', alternative: 'PK پاکستان', booster: 2 },
  { value: 'Palau', alternative: 'PW', booster: 0.5 },
  { value: 'Palestinian Territory', alternative: 'PS فلسطين' },
  { value: 'Panama', alternative: 'PA' },
  { value: 'Papua New Guinea', alternative: 'PG' },
  { value: 'Paraguay', alternative: 'PY' },
  { value: 'Peru', alternative: 'PE' },
  { value: 'Philippines', alternative: 'PH Pilipinas', booster: 1.5 },
  { value: 'Pitcairn', alternative: 'PN', booster: 0.5 },
  { value: 'Poland', alternative: 'PL Polska', booster: 1.25 },
  { value: 'Portugal', alternative: 'PT Portuguesa', booster: 1.5 },
  { value: 'Puerto Rico', alternative: 'PR' },
  { value: 'Qatar', alternative: 'QA قطر' },
  { value: 'Republic of the Congo', alternative: 'CG' },
  { value: 'Reunion', alternative: 'RE Reunion' },
  { value: 'Romania', alternative: 'RO Rumania Roumania România' },
  {
    value: 'Russia',
    alternative: 'RU Rossiya Российская Россия',
    booster: 2.5,
  },
  { value: 'Rwanda', alternative: 'RW' },
  { value: 'Saint Barthelemy', alternative: 'BL St. Barthelemy' },
  { value: 'Saint Helena', alternative: 'SH St.' },
  { value: 'Saint Kitts and Nevis', alternative: 'KN St.' },
  { value: 'Saint Lucia', alternative: 'LC St.' },
  { value: 'Saint Martin', alternative: 'MF St.' },
  { value: 'Saint Pierre and Miquelon', alternative: 'PM St.' },
  { value: 'Saint Vincent and the Grenadines', alternative: 'VC St.' },
  { value: 'Samoa', alternative: 'WS' },
  { value: 'San Marino', alternative: 'SM RSM Repubblica' },
  { value: 'Sao Tome and Principe', alternative: 'ST' },
  { value: 'Saudi Arabia', alternative: 'SA السعودية' },
  { value: 'Senegal', alternative: 'SN Sénégal' },
  { value: 'Serbia', alternative: 'RS Србија Srbija' },
  { value: 'Seychelles', alternative: 'SC', booster: 0.5 },
  { value: 'Sierra Leone', alternative: 'SL' },
  {
    value: 'Singapore',
    alternative: 'SG Singapura  சிங்கப்பூர் குடியரசு 新加坡共和国',
  },
  { value: 'Sint Maarten', alternative: 'SX' },
  { value: 'Slovakia', alternative: 'SK Slovenská Slovensko' },
  { value: 'Slovenia', alternative: 'SI Slovenija' },
  { value: 'Solomon Islands', alternative: 'SB' },
  { value: 'Somalia', alternative: 'SO الصومال' },
  { value: 'South Africa', alternative: 'ZA RSA Suid-Afrika' },
  { value: 'South Georgia and the South Sandwich Islands', alternative: 'GS' },
  { value: 'South Korea', alternative: 'KR South Korea', booster: 1.5 },
  { value: 'South Sudan', alternative: 'SS' },
  { value: 'Spain', alternative: 'ES España', booster: 2 },
  { value: 'Sri Lanka', alternative: 'LK ශ්‍රී ලංකා இலங்கை Ceylon' },
  { value: 'Sudan', alternative: 'SD السودان' },
  { value: 'Suriname', alternative: 'SR शर्नम् Sarnam Sranangron' },
  { value: 'Svalbard and Jan Mayen', alternative: 'SJ', booster: 0.5 },
  { value: 'Swaziland', alternative: 'SZ weSwatini Swatini Ngwane' },
  { value: 'Sweden', alternative: 'SE Sverige', booster: 1.5 },
  {
    value: 'Switzerland',
    alternative: 'CH Swiss Confederation Schweiz Suisse Svizzera Svizra',
    booster: 1.5,
  },
  { value: 'Syria', alternative: 'SY Syria سورية' },
  { value: 'Taiwan', alternative: 'TW 台灣 臺灣' },
  { value: 'Tajikistan', alternative: 'TJ Тоҷикистон Toçikiston' },
  { value: 'Tanzania', alternative: 'TZ' },
  { value: 'Thailand', alternative: 'TH ประเทศไทย Prathet Thai' },
  { value: 'Togo', alternative: 'TG Togolese' },
  { value: 'Tokelau', alternative: 'TK', booster: 0.5 },
  { value: 'Tonga', alternative: 'TO' },
  { value: 'Trinidad and Tobago', alternative: 'TT' },
  { value: 'Tunisia', alternative: 'TN تونس' },
  { value: 'Turkey', alternative: 'TR Türkiye Turkiye' },
  { value: 'Turkmenistan', alternative: 'TM Türkmenistan' },
  { value: 'Turks and Caicos Islands', alternative: 'TC', booster: 0.5 },
  { value: 'Tuvalu', alternative: 'TV', booster: 0.5 },
  { value: 'Uganda', alternative: 'UG' },
  { value: 'Ukraine', alternative: 'UA Ukrayina Україна' },
  {
    value: 'United Kingdom',
    alternative: 'GB Great Britain England UK Wales Scotland Northern Ireland',
    booster: 2.5,
  },
  { value: 'United States Minor Outlying Islands', alternative: 'UM' },
  { value: 'United Arab Emirates', alternative: 'AE UAE الإمارات' },
  { value: 'Uruguay', alternative: 'UY' },
  { value: 'Uzbekistan', alternative: "UZ Ўзбекистон O'zbekstan O‘zbekiston" },
  { value: 'U.S. Virgin Islands', alternative: 'VI', booster: 0.5 },
  { value: 'Vanuatu', alternative: 'VU' },
  { value: 'Vatican', alternative: 'VA', booster: 0.5 },
  { value: 'Venezuela', alternative: 'VE' },
  { value: 'Vietnam', alternative: 'VN Việt Nam', booster: 1.5 },
  { value: 'Wallis and Futuna', alternative: 'WF', booster: 0.5 },
  { value: 'Western Sahara', alternative: 'EH لصحراء الغربية' },
  { value: 'Yemen', alternative: 'YE اليمن' },
  { value: 'Zambia', alternative: 'ZM' },
  { value: 'Zimbabwe', alternative: 'ZW' },
].map((country) => {
  if ('menuItemProps' in country) return country;

  const searchValue = utils.stripAccents(country.value ?? '').toLowerCase();
  const searchAlternative = utils.stripAccents(country.alternative ?? '').toLowerCase();

  return {
    ...country,
    alternative: country.alternative ?? '',
    label: country.value,
    searchValue,
    searchAlternative,
    booster: country.booster ?? 0.1,
  };
});

export default COUNTRIES;
