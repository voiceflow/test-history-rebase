// Regex'd from https://developer.amazon.com/docs/custom-skills/slot-type-reference.html#availability

const LOCALES = {
  US: 'en-US',
  AU: 'en-AU',
  CA: 'en-CA',
  IN: 'en-IN',
  GB: 'en-GB',
  CA_fr: 'fr-CA',
  FR: 'fr-FR',
  DE: 'de-DE',
  IT: 'it-IT',
  JP: 'ja-JP',
  ES: 'es-ES',
  MX: 'es-MX',
  BR: 'pt-BR',
};

const GOOGLE_LOCALES = {
  HK: 'zh-HK',
  CN: 'zh-CN',
  TW: 'zh-TW',
  DA: 'da',
  NL: 'nl',
  EN: 'en',
  FR: 'fr',
  DE: 'de',
  HI: 'hi',
  ID: 'id',
  IT: 'it',
  JA: 'ja',
  KO: 'ko',
  NO: 'no',
  PL: 'pl',
  PT: 'pt',
  BR: 'pt-BR',
  RU: 'ru',
  ES: 'es',
  SV: 'sv',
  TH: 'th',
  TR: 'tr',
  UK: 'uk',
};

const L = LOCALES;
const GL = GOOGLE_LOCALES;

const SLOT_TYPES = [
  {
    label: 'Custom',
    type: {
      alexa: null,
      google: null,
    },
    locales: {
      alexa: null,
      google: null,
    },
  },
  {
    label: 'Date',
    type: {
      alexa: 'AMAZON.DATE',
      google: '@sys.date',
    },
    locales: {
      alexa: null,
      google: [
        GL.HK,
        GL.CN,
        GL.TW,
        GL.DA,
        GL.NL,
        GL.EN,
        GL.FR,
        GL.DE,
        GL.HI,
        GL.ID,
        GL.IT,
        GL.JA,
        GL.KO,
        GL.NO,
        GL.PL,
        GL.PT,
        GL.BR,
        GL.RU,
        GL.ES,
        GL.SV,
        GL.TH,
        GL.TR,
        GL.UK,
      ],
    },
  },
  {
    label: 'Number',
    type: {
      alexa: 'AMAZON.NUMBER',
      google: '@sys.number',
    },
    locales: {
      alexa: null,
      google: [
        GL.HK,
        GL.CN,
        GL.TW,
        GL.DA,
        GL.NL,
        GL.EN,
        GL.FR,
        GL.DE,
        GL.HI,
        GL.ID,
        GL.IT,
        GL.JA,
        GL.KO,
        GL.NO,
        GL.PL,
        GL.PT,
        GL.BR,
        GL.RU,
        GL.ES,
        GL.SV,
        GL.TH,
        GL.TR,
        GL.UK,
      ],
    },
  },
  {
    label: 'Time',
    type: {
      alexa: 'AMAZON.TIME',
      google: '@sys.time',
    },
    locales: {
      alexa: null,
      google: [
        GL.HK,
        GL.CN,
        GL.TW,
        GL.DA,
        GL.NL,
        GL.EN,
        GL.FR,
        GL.DE,
        GL.HI,
        GL.ID,
        GL.IT,
        GL.JA,
        GL.KO,
        GL.NO,
        GL.PL,
        GL.PT,
        GL.BR,
        GL.RU,
        GL.ES,
        GL.SV,
        GL.TH,
        GL.TR,
        GL.UK,
      ],
    },
  },
  {
    label: 'DayOfWeek',
    type: {
      alexa: 'AMAZON.DayOfWeek',
      google: null,
    },
    locales: {
      alexa: [L.US, L.AU, L.CA, L.IN, L.GB, L.CA_fr, L.FR, L.DE, L.IT, L.ES, L.MX],
      google: null,
    },
  },
  {
    label: 'Color',
    type: {
      alexa: 'AMAZON.Color',
      google: '@sys.color',
    },
    locales: {
      alexa: [L.US, L.AU, L.CA, L.IN, L.GB, L.CA_fr, L.FR, L.DE, L.IT, L.ES, L.MX],
      google: [
        GL.HK,
        GL.CN,
        GL.TW,
        GL.DA,
        GL.NL,
        GL.EN,
        GL.FR,
        GL.DE,
        GL.HI,
        GL.ID,
        GL.IT,
        GL.JA,
        GL.KO,
        GL.NO,
        GL.PL,
        GL.BR,
        GL.RU,
        GL.ES,
        GL.SV,
        GL.TH,
        GL.TR,
      ],
    },
  },
  {
    label: 'Organization',
    type: {
      alexa: 'AMAZON.Organization',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'Person',
    type: {
      alexa: 'AMAZON.Person',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'Book',
    type: {
      alexa: 'AMAZON.Book',
      google: null,
    },
    locales: {
      alexa: [L.US, L.AU, L.GB],
      google: null,
    },
  },
  {
    label: 'Movie',
    type: {
      alexa: 'AMAZON.Movie',
      google: null,
    },
    locales: {
      alexa: [L.US, L.AU, L.CA, L.GB, L.FR, L.DE],
      google: null,
    },
  },
  {
    label: 'TVSeries',
    type: {
      alexa: 'AMAZON.TVSeries',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'MusicAlbum',
    type: {
      alexa: 'AMAZON.MusicAlbum',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'MusicRecording',
    type: {
      alexa: 'AMAZON.MusicRecording',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'PhoneNumber',
    type: {
      alexa: 'AMAZON.PhoneNumber',
      google: '@sys.phone-number',
    },
    locales: {
      alexa: [L.US, L.JP],
      google: [GL.HK, GL.CN, GL.TW, GL.NL, GL.EN, GL.FR, GL.DE, GL.IT, GL.JA, GL.PT, GL.BR, GL.RU, GL.ES, GL.UK],
    },
  },
  {
    label: 'Duration',
    type: {
      alexa: 'AMAZON.DURATION',
      google: '@sys.duration',
    },
    locales: {
      alexa: null,
      google: [GL.HK, GL.CN, GL.TW, GL.EN, GL.FR, GL.DE, GL.IT, GL.JA, GL.RU, GL.ES],
    },
  },
  {
    label: 'FourDigitNumber',
    type: {
      alexa: 'AMAZON.FOUR_DIGIT_NUMBER',
      google: null,
    },
    locales: {
      alexa: null,
      google: null,
    },
  },
  {
    label: 'SearchQuery',
    type: {
      alexa: 'AMAZON.SearchQuery',
      google: null,
    },
    locales: {
      alexa: null,
      google: null,
    },
  },
  {
    label: 'Ordinal',
    type: {
      alexa: 'AMAZON.Ordinal',
      google: '@sys.ordinal',
    },
    locales: {
      alexa: [L.US, L.JP],
      google: [GL.DA, GL.NL, GL.EN, GL.HI, GL.ID, GL.KO, GL.NO, GL.PL, GL.BR, GL.SV, GL.TH, GL.TR],
    },
  },
  {
    label: 'US_CITY',
    type: {
      alexa: 'AMAZON.US_CITY',
      google: null,
    },
    locales: {
      alexa: [L.US, L.CA, L.GB, L.DE],
      google: null,
    },
  },
  {
    label: 'Actor',
    type: {
      alexa: 'AMAZON.Actor',
      google: null,
    },
    locales: {
      alexa: [L.US, L.AU, L.CA, L.IN, L.GB, L.CA_fr, L.FR, L.DE, L.IT, L.ES, L.MX],
      google: null,
    },
  },
  {
    label: 'AdministrativeArea',
    type: {
      alexa: 'AMAZON.AdministrativeArea',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'AggregateRating',
    type: {
      alexa: 'AMAZON.AggregateRating',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'Airline',
    type: {
      alexa: 'AMAZON.Airline',
      google: null,
    },
    locales: {
      alexa: [L.US, L.AU, L.CA, L.IN, L.GB, L.CA_fr, L.FR, L.DE, L.IT, L.ES, L.MX],
      google: null,
    },
  },
  {
    label: 'Airport',
    type: {
      alexa: 'AMAZON.Airport',
      google: '@sys.airport',
    },
    locales: {
      alexa: [L.US, L.AU, L.CA, L.IN, L.GB, L.CA_fr, L.FR, L.DE, L.IT, L.ES, L.MX],
      google: [GL.EN],
    },
  },
  {
    label: 'Anaphor',
    type: {
      alexa: 'AMAZON.Anaphor',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'Animal',
    type: {
      alexa: 'AMAZON.Animal',
      google: null,
    },
    locales: {
      alexa: [L.US, L.AU, L.CA, L.IN, L.GB, L.CA_fr, L.FR, L.DE, L.IT, L.ES, L.MX],
      google: null,
    },
  },
  {
    label: 'Artist',
    type: {
      alexa: 'AMAZON.Artist',
      google: '@sys.music-artist',
    },
    locales: {
      alexa: [L.US, L.IN, L.FR, L.DE],
      google: [
        GL.HK,
        GL.CN,
        GL.TW,
        GL.DA,
        GL.NL,
        GL.EN,
        GL.FR,
        GL.DE,
        GL.HI,
        GL.ID,
        GL.IT,
        GL.JA,
        GL.KO,
        GL.NO,
        GL.PL,
        GL.BR,
        GL.RU,
        GL.ES,
        GL.SV,
        GL.TH,
        GL.TR,
      ],
    },
  },
  {
    label: 'AT_CITY',
    type: {
      alexa: 'AMAZON.AT_CITY',
      google: null,
    },
    locales: {
      alexa: [L.US, L.CA, L.GB, L.DE],
      google: null,
    },
  },
  {
    label: 'AT_REGION',
    type: {
      alexa: 'AMAZON.AT_REGION',
      google: null,
    },
    locales: {
      alexa: [L.US, L.CA, L.GB, L.DE],
      google: null,
    },
  },
  {
    label: 'Athlete',
    type: {
      alexa: 'AMAZON.Athlete',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'Author',
    type: {
      alexa: 'AMAZON.Author',
      google: null,
    },
    locales: {
      alexa: [L.US, L.AU, L.IN],
      google: null,
    },
  },
  {
    label: 'BookSeries',
    type: {
      alexa: 'AMAZON.BookSeries',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'BroadcastChannel',
    type: {
      alexa: 'AMAZON.BroadcastChannel',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'CivicStructure',
    type: {
      alexa: 'AMAZON.CivicStructure',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'Comic',
    type: {
      alexa: 'AMAZON.Comic',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'Corporation',
    type: {
      alexa: 'AMAZON.Corporation',
      google: null,
    },
    locales: {
      alexa: [L.US, L.AU, L.CA, L.IN, L.GB, L.DE],
      google: null,
    },
  },
  {
    label: 'Country',
    type: {
      alexa: 'AMAZON.Country',
      google: '@sys.geo-country',
    },
    locales: {
      alexa: [L.US, L.AU, L.CA, L.IN, L.GB, L.CA_fr, L.FR, L.DE, L.IT, L.ES, L.MX],
      google: [
        GL.HK,
        GL.CN,
        GL.TW,
        GL.DA,
        GL.NL,
        GL.EN,
        GL.FR,
        GL.DE,
        GL.HI,
        GL.ID,
        GL.IT,
        GL.JA,
        GL.KO,
        GL.NO,
        GL.PL,
        GL.PT,
        GL.BR,
        GL.RU,
        GL.ES,
        GL.SV,
        GL.TH,
        GL.TR,
      ],
    },
  },
  {
    label: 'CreativeWorkType',
    type: {
      alexa: 'AMAZON.CreativeWorkType',
      google: null,
    },
    locales: {
      alexa: [L.US, L.AU, L.CA, L.IN, L.GB, L.CA_fr, L.FR, L.DE, L.IT, L.ES, L.MX],
      google: null,
    },
  },
  {
    label: 'DE_CITY',
    type: {
      alexa: 'AMAZON.DE_CITY',
      google: null,
    },
    locales: {
      alexa: [L.US, L.CA, L.GB, L.DE],
      google: null,
    },
  },
  {
    label: 'DE_FIRST_NAME',
    type: {
      alexa: 'AMAZON.DE_FIRST_NAME',
      google: null,
    },
    locales: {
      alexa: [L.US, L.GB, L.DE],
      google: null,
    },
  },
  {
    label: 'DE_REGION',
    type: {
      alexa: 'AMAZON.DE_REGION',
      google: null,
    },
    locales: {
      alexa: [L.US, L.CA, L.GB, L.DE],
      google: null,
    },
  },
  {
    label: 'Dessert',
    type: {
      alexa: 'AMAZON.Dessert',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'DeviceType',
    type: {
      alexa: 'AMAZON.DeviceType',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'Director',
    type: {
      alexa: 'AMAZON.Director',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'Drink',
    type: {
      alexa: 'AMAZON.Drink',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'EducationalOrganization',
    type: {
      alexa: 'AMAZON.EducationalOrganization',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'EUROPE_CITY',
    type: {
      alexa: 'AMAZON.EUROPE_CITY',
      google: null,
    },
    locales: {
      alexa: [L.US, L.CA, L.GB, L.DE],
      google: null,
    },
  },
  {
    label: 'EventType',
    type: {
      alexa: 'AMAZON.EventType',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'Festival',
    type: {
      alexa: 'AMAZON.Festival',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'FictionalCharacter',
    type: {
      alexa: 'AMAZON.FictionalCharacter',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'FinancialService',
    type: {
      alexa: 'AMAZON.FinancialService',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'Food',
    type: {
      alexa: 'AMAZON.Food',
      google: null,
    },
    locales: {
      alexa: [L.US, L.AU, L.CA, L.IN, L.GB, L.FR, L.DE, L.IT, L.ES, L.MX],
      google: null,
    },
  },
  {
    label: 'FoodEstablishment',
    type: {
      alexa: 'AMAZON.FoodEstablishment',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'Game',
    type: {
      alexa: 'AMAZON.Game',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'GB_CITY',
    type: {
      alexa: 'AMAZON.GB_CITY',
      google: null,
    },
    locales: {
      alexa: [L.US, L.CA, L.GB, L.DE],
      google: null,
    },
  },
  {
    label: 'GB_FIRST_NAME',
    type: {
      alexa: 'AMAZON.GB_FIRST_NAME',
      google: null,
    },
    locales: {
      alexa: [L.US, L.CA, L.GB, L.DE],
      google: null,
    },
  },
  {
    label: 'GB_REGION',
    type: {
      alexa: 'AMAZON.GB_REGION',
      google: null,
    },
    locales: {
      alexa: [L.US, L.CA, L.GB, L.DE],
      google: null,
    },
  },
  {
    label: 'Genre',
    type: {
      alexa: 'AMAZON.Genre',
      google: null,
    },
    locales: {
      alexa: [L.US, L.AU, L.CA, L.IN, L.GB, L.CA_fr, L.FR, L.DE, L.IT, L.ES, L.MX],
      google: null,
    },
  },
  {
    label: 'Landform',
    type: {
      alexa: 'AMAZON.Landform',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'LandmarksOrHistoricalBuildings',
    type: {
      alexa: 'AMAZON.LandmarksOrHistoricalBuildings',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'Language',
    type: {
      alexa: 'AMAZON.Language',
      google: '@sys.language',
    },
    locales: {
      alexa: [L.US, L.AU, L.CA, L.IN, L.GB, L.CA_fr, L.FR, L.DE, L.IT, L.ES, L.MX],
      google: [
        GL.HK,
        GL.CN,
        GL.TW,
        GL.DA,
        GL.NL,
        GL.EN,
        GL.FR,
        GL.DE,
        GL.HI,
        GL.ID,
        GL.IT,
        GL.JA,
        GL.KO,
        GL.NO,
        GL.PL,
        GL.PT,
        GL.BR,
        GL.RU,
        GL.ES,
        GL.SV,
        GL.TH,
        GL.TR,
      ],
    },
  },
  {
    label: 'LocalBusiness',
    type: {
      alexa: 'AMAZON.LocalBusiness',
      google: null,
    },
    locales: {
      alexa: [L.US, L.CA],
      google: null,
    },
  },
  {
    label: 'LocalBusinessType',
    type: {
      alexa: 'AMAZON.LocalBusinessType',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'MedicalOrganization',
    type: {
      alexa: 'AMAZON.MedicalOrganization',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'Month',
    type: {
      alexa: 'AMAZON.Month',
      google: null,
    },
    locales: {
      alexa: [L.US, L.AU, L.CA, L.IN, L.GB, L.CA_fr, L.FR, L.DE, L.IT, L.ES, L.MX],
      google: null,
    },
  },
  {
    label: 'MovieSeries',
    type: {
      alexa: 'AMAZON.MovieSeries',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'MovieTheater',
    type: {
      alexa: 'AMAZON.MovieTheater',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'MusicCreativeWorkType',
    type: {
      alexa: 'AMAZON.MusicCreativeWorkType',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'MusicEvent',
    type: {
      alexa: 'AMAZON.MusicEvent',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'MusicGroup',
    type: {
      alexa: 'AMAZON.MusicGroup',
      google: null,
    },
    locales: {
      alexa: [L.US, L.FR],
      google: null,
    },
  },
  {
    label: 'Musician',
    type: {
      alexa: 'AMAZON.Musician',
      google: null,
    },
    locales: {
      alexa: [L.US, L.FR],
      google: null,
    },
  },
  {
    label: 'MusicPlaylist',
    type: {
      alexa: 'AMAZON.MusicPlaylist',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'MusicVenue',
    type: {
      alexa: 'AMAZON.MusicVenue',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'MusicVideo',
    type: {
      alexa: 'AMAZON.MusicVideo',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'PostalAddress',
    type: {
      alexa: 'AMAZON.PostalAddress',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'Professional',
    type: {
      alexa: 'AMAZON.Professional',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'ProfessionalType',
    type: {
      alexa: 'AMAZON.ProfessionalType',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'RadioChannel',
    type: {
      alexa: 'AMAZON.RadioChannel',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'RelativePosition',
    type: {
      alexa: 'AMAZON.RelativePosition',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'Residence',
    type: {
      alexa: 'AMAZON.Residence',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'Room',
    type: {
      alexa: 'AMAZON.Room',
      google: null,
    },
    locales: {
      alexa: [L.US, L.AU, L.CA, L.IN, L.GB, L.CA_fr, L.FR, L.DE, L.IT, L.ES, L.MX],
      google: null,
    },
  },
  {
    label: 'ScreeningEvent',
    type: {
      alexa: 'AMAZON.ScreeningEvent',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'Service',
    type: {
      alexa: 'AMAZON.Service',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'SocialMediaPlatform',
    type: {
      alexa: 'AMAZON.SocialMediaPlatform',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'SoftwareApplication',
    type: {
      alexa: 'AMAZON.SoftwareApplication',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'SoftwareGame',
    type: {
      alexa: 'AMAZON.SoftwareGame',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'Sport',
    type: {
      alexa: 'AMAZON.Sport',
      google: null,
    },
    locales: {
      alexa: [L.US, L.AU, L.IN, L.GB, L.CA_fr, L.FR, L.DE, L.IT, L.ES, L.MX],
      google: null,
    },
  },
  {
    label: 'SportsEvent',
    type: {
      alexa: 'AMAZON.SportsEvent',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'SportsTeam',
    type: {
      alexa: 'AMAZON.SportsTeam',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'StreetAddress',
    type: {
      alexa: 'AMAZON.StreetAddress',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'StreetName',
    type: {
      alexa: 'AMAZON.StreetName',
      google: null,
    },
    locales: {
      alexa: [L.US, L.AU, L.CA, L.GB, L.CA_fr, L.FR, L.DE, L.IT, L.ES, L.MX],
      google: null,
    },
  },
  {
    label: 'TelevisionChannel',
    type: {
      alexa: 'AMAZON.TelevisionChannel',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'TVEpisode',
    type: {
      alexa: 'AMAZON.TVEpisode',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'TVSeason',
    type: {
      alexa: 'AMAZON.TVSeason',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'US_FIRST_NAME',
    type: {
      alexa: 'AMAZON.US_FIRST_NAME',
      google: null,
    },
    locales: {
      alexa: [L.US, L.CA, L.GB, L.DE],
      google: null,
    },
  },
  {
    label: 'US_STATE',
    type: {
      alexa: 'AMAZON.US_STATE',
      google: null,
    },
    locales: {
      alexa: [L.US, L.CA, L.GB, L.DE],
      google: null,
    },
  },
  {
    label: 'VideoGame',
    type: {
      alexa: 'AMAZON.VideoGame',
      google: null,
    },
    locales: {
      alexa: [L.US, L.AU, L.CA, L.IN, L.GB, L.CA_fr, L.FR, L.DE, L.IT, L.ES, L.MX],
      google: null,
    },
  },
  {
    label: 'VisualModeTrigger',
    type: {
      alexa: 'AMAZON.VisualModeTrigger',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'WeatherCondition',
    type: {
      alexa: 'AMAZON.WeatherCondition',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'WrittenCreativeWorkType',
    type: {
      alexa: 'AMAZON.WrittenCreativeWorkType',
      google: null,
    },
    locales: {
      alexa: [L.US],
      google: null,
    },
  },
  {
    label: 'City',
    type: {
      alexa: 'AMAZON.City',
      google: null,
    },
    locales: {
      alexa: [L.AU, L.CA, L.IN, L.GB, L.CA_fr, L.FR, L.DE, L.IT, L.ES, L.MX, L.BR],
      google: null,
    },
  },
  {
    label: 'FirstName',
    type: {
      alexa: 'AMAZON.FirstName',
      google: null,
    },
    locales: {
      alexa: [L.AU, L.CA, L.IN, L.GB, L.CA_fr, L.FR, L.DE, L.IT, L.ES, L.MX, L.BR],
      google: null,
    },
  },
  {
    label: 'Region',
    type: {
      alexa: 'AMAZON.Region',
      google: null,
    },
    locales: {
      alexa: [L.AU, L.CA, L.IN, L.GB, L.CA_fr, L.FR, L.DE, L.IT, L.ES, L.MX, L.BR],
      google: null,
    },
  },
  {
    label: 'Date Time',
    type: {
      alexa: null,
      google: '@sys.date-time',
    },
    locales: {
      alexa: null,
      google: [
        GL.HK,
        GL.CN,
        GL.TW,
        GL.DA,
        GL.NL,
        GL.EN,
        GL.FR,
        GL.DE,
        GL.HI,
        GL.ID,
        GL.IT,
        GL.JA,
        GL.KO,
        GL.NO,
        GL.PL,
        GL.PT,
        GL.BR,
        GL.RU,
        GL.ES,
        GL.SV,
        GL.TH,
        GL.TR,
        GL.UK,
      ],
    },
  },
  {
    label: 'Date Period',
    type: {
      alexa: null,
      google: '@sys.date-period',
    },
    locales: {
      alexa: null,
      google: [
        GL.HK,
        GL.CN,
        GL.TW,
        GL.DA,
        GL.NL,
        GL.EN,
        GL.FR,
        GL.DE,
        GL.HI,
        GL.ID,
        GL.IT,
        GL.JA,
        GL.KO,
        GL.NO,
        GL.PL,
        GL.PT,
        GL.BR,
        GL.RU,
        GL.ES,
        GL.SV,
        GL.TH,
        GL.TR,
        GL.UK,
      ],
    },
  },
  {
    label: 'Time Period',
    type: {
      alexa: null,
      google: '@sys.time-period',
    },
    locales: {
      alexa: null,
      google: [
        GL.HK,
        GL.CN,
        GL.TW,
        GL.DA,
        GL.NL,
        GL.EN,
        GL.FR,
        GL.DE,
        GL.HI,
        GL.ID,
        GL.IT,
        GL.JA,
        GL.KO,
        GL.NO,
        GL.PL,
        GL.PT,
        GL.BR,
        GL.RU,
        GL.ES,
        GL.SV,
        GL.TH,
        GL.TR,
        GL.UK,
      ],
    },
  },
  {
    label: 'Flight Number',
    type: {
      alexa: null,
      google: '@sys.flight-number',
    },
    locales: {
      alexa: null,
      google: [GL.HK, GL.CN, GL.TW, GL.NL, GL.EN, GL.FR, GL.DE, GL.IT, GL.JA, GL.KO, GL.PT, GL.BR, GL.RU, GL.ES, GL.UK],
    },
  },
  {
    label: 'Unit Currency',
    type: {
      alexa: null,
      google: '@sys.unit-currency',
    },
    locales: {
      alexa: null,
      google: [
        GL.HK,
        GL.CN,
        GL.TW,
        GL.DA,
        GL.NL,
        GL.EN,
        GL.FR,
        GL.DE,
        GL.HI,
        GL.ID,
        GL.IT,
        GL.JA,
        GL.KO,
        GL.NO,
        GL.PL,
        GL.BR,
        GL.RU,
        GL.ES,
        GL.SV,
        GL.TH,
        GL.TR,
      ],
    },
  },
  {
    label: 'Percentage',
    type: {
      alexa: null,
      google: '@sys.percentage',
    },
    locales: {
      alexa: null,
      google: [GL.HK, GL.CN, GL.TW, GL.EN, GL.FR, GL.DE, GL.IT, GL.RU, GL.ES],
    },
  },
  {
    label: 'Age',
    type: {
      alexa: null,
      google: '@sys.age',
    },
    locales: {
      alexa: null,
      google: [GL.HK, GL.CN, GL.TW, GL.EN, GL.FR, GL.IT],
    },
  },
  {
    label: 'Currency Name',
    type: {
      alexa: null,
      google: '@sys.currency-name',
    },
    locales: {
      alexa: null,
      google: [
        GL.HK,
        GL.CN,
        GL.TW,
        GL.DA,
        GL.NL,
        GL.EN,
        GL.FR,
        GL.DE,
        GL.HI,
        GL.ID,
        GL.IT,
        GL.JA,
        GL.KO,
        GL.NO,
        GL.PL,
        GL.BR,
        GL.RU,
        GL.ES,
        GL.SV,
        GL.TH,
        GL.TR,
      ],
    },
  },
  {
    label: 'Zip Code',
    type: {
      alexa: null,
      google: '@sys.zip-code',
    },
    locales: {
      alexa: null,
      google: [
        GL.HK,
        GL.CN,
        GL.TW,
        GL.DA,
        GL.NL,
        GL.EN,
        GL.FR,
        GL.DE,
        GL.HI,
        GL.ID,
        GL.IT,
        GL.JA,
        GL.KO,
        GL.NO,
        GL.PL,
        GL.PT,
        GL.BR,
        GL.RU,
        GL.ES,
        GL.SV,
        GL.TH,
        GL.TR,
      ],
    },
  },
  {
    label: 'Geo Capital',
    type: {
      alexa: null,
      google: '@sys.geo-capital',
    },
    locales: {
      alexa: null,
      google: [GL.HK, GL.CN, GL.TW, GL.DA, GL.NL, GL.EN, GL.HI, GL.ID, GL.KO, GL.NO, GL.PL, GL.BR, GL.RU, GL.ES, GL.SV, GL.TH, GL.TR],
    },
  },
  {
    label: 'Geo City',
    type: {
      alexa: null,
      google: '@sys.geo-city',
    },
    locales: {
      alexa: null,
      google: [
        GL.HK,
        GL.CN,
        GL.TW,
        GL.DA,
        GL.NL,
        GL.EN,
        GL.FR,
        GL.DE,
        GL.HI,
        GL.ID,
        GL.IT,
        GL.JA,
        GL.KO,
        GL.NO,
        GL.PL,
        GL.PT,
        GL.BR,
        GL.RU,
        GL.ES,
        GL.SV,
        GL.TH,
        GL.TR,
      ],
    },
  },
  {
    label: 'Location',
    type: {
      alexa: null,
      google: '@sys.location',
    },
    locales: {
      alexa: null,
      google: [GL.HK, GL.CN, GL.TW, GL.EN, GL.FR, GL.DE, GL.IT, GL.JA, GL.PT, GL.BR, GL.RU, GL.ES],
    },
  },
  {
    label: 'Email',
    type: {
      alexa: null,
      google: '@sys.email',
    },
    locales: {
      alexa: null,
      google: [GL.HK, GL.CN, GL.TW, GL.NL, GL.EN, GL.FR, GL.DE, GL.IT, GL.JA, GL.PT, GL.BR, GL.RU, GL.ES, GL.UK],
    },
  },
  {
    label: 'Given Name',
    type: {
      alexa: null,
      google: '@sys.given-name',
    },
    locales: {
      alexa: null,
      google: [
        GL.HK,
        GL.CN,
        GL.TW,
        GL.DA,
        GL.NL,
        GL.EN,
        GL.FR,
        GL.DE,
        GL.HI,
        GL.ID,
        GL.IT,
        GL.JA,
        GL.KO,
        GL.NO,
        GL.PL,
        GL.BR,
        GL.RU,
        GL.ES,
        GL.SV,
        GL.TH,
        GL.TR,
      ],
    },
  },
  {
    label: 'Last Name',
    type: {
      alexa: null,
      google: '@sys.last-name',
    },
    locales: {
      alexa: null,
      google: [
        GL.HK,
        GL.CN,
        GL.TW,
        GL.DA,
        GL.NL,
        GL.EN,
        GL.FR,
        GL.DE,
        GL.HI,
        GL.ID,
        GL.IT,
        GL.JA,
        GL.KO,
        GL.NO,
        GL.PL,
        GL.BR,
        GL.RU,
        GL.ES,
        GL.SV,
        GL.TH,
        GL.TR,
      ],
    },
  },
  {
    label: 'Any',
    type: {
      alexa: null,
      google: '@sys.any',
    },
    locales: {
      alexa: null,
      google: [
        GL.HK,
        GL.CN,
        GL.TW,
        GL.DA,
        GL.NL,
        GL.EN,
        GL.FR,
        GL.DE,
        GL.HI,
        GL.ID,
        GL.IT,
        GL.JA,
        GL.KO,
        GL.NO,
        GL.PL,
        GL.PT,
        GL.BR,
        GL.RU,
        GL.ES,
        GL.SV,
        GL.TH,
        GL.TR,
        GL.UK,
      ],
    },
  },
  {
    label: 'Url',
    type: {
      alexa: null,
      google: '@sys.url',
    },
    locales: {
      alexa: null,
      google: [GL.HK, GL.CN, GL.TW, GL.NL, GL.EN, GL.FR, GL.DE, GL.IT, GL.JA, GL.KO, GL.PT, GL.BR, GL.RU, GL.ES, GL.UK],
    },
  },
  {
    label: 'Address',
    type: {
      alexa: null,
      google: '@sys.address',
    },
    locales: {
      alexa: null,
      google: [GL.CN, GL.EN, GL.FR, GL.DE, GL.IT, GL.JA, GL.RU, GL.ES],
    },
  },
  {
    label: 'Cardinal',
    type: {
      alexa: null,
      google: '@sys.cardinal',
    },
    locales: {
      alexa: null,
      google: [GL.DA, GL.NL, GL.EN, GL.HI, GL.ID, GL.KO, GL.NO, GL.PL, GL.BR, GL.SV, GL.TH, GL.TR],
    },
  },
  {
    label: 'Number Integer',
    type: {
      alexa: null,
      google: '@sys.number-integer',
    },
    locales: {
      alexa: null,
      google: [GL.DA, GL.NL, GL.EN, GL.HI, GL.ID, GL.KO, GL.NO, GL.PL, GL.BR, GL.SV, GL.TH, GL.TR],
    },
  },
  {
    label: 'Unit Area',
    type: {
      alexa: null,
      google: '@sys.unit-area',
    },
    locales: {
      alexa: null,
      google: [GL.DA, GL.NL, GL.EN, GL.HI, GL.ID, GL.KO, GL.NO, GL.PL, GL.BR, GL.SV, GL.TH, GL.TR],
    },
  },
  {
    label: 'Unit Length',
    type: {
      alexa: null,
      google: '@sys.unit-length',
    },
    locales: {
      alexa: null,
      google: [GL.DA, GL.NL, GL.EN, GL.FR, GL.HI, GL.ID, GL.KO, GL.NO, GL.PL, GL.BR, GL.SV, GL.TH, GL.TR],
    },
  },
  {
    label: 'Unit Speed',
    type: {
      alexa: null,
      google: '@sys.unit-speed',
    },
    locales: {
      alexa: null,
      google: [GL.DA, GL.NL, GL.EN, GL.HI, GL.ID, GL.KO, GL.NO, GL.PL, GL.BR, GL.SV, GL.TH, GL.TR],
    },
  },
  {
    label: 'Unit Volume',
    type: {
      alexa: null,
      google: '@sys.unit-volume',
    },
    locales: {
      alexa: null,
      google: [GL.DA, GL.NL, GL.EN, GL.DE, GL.HI, GL.ID, GL.KO, GL.NO, GL.PL, GL.BR, GL.SV, GL.TH, GL.TR],
    },
  },
  {
    label: 'Unit Weight',
    type: {
      alexa: null,
      google: '@sys.unit-weight',
    },
    locales: {
      alexa: null,
      google: [GL.DA, GL.NL, GL.EN, GL.DE, GL.HI, GL.ID, GL.KO, GL.NO, GL.PL, GL.BR, GL.SV, GL.TH, GL.TR],
    },
  },
  {
    label: 'Unit Information',
    type: {
      alexa: null,
      google: '@sys.unit-information',
    },
    locales: {
      alexa: null,
      google: [GL.DA, GL.NL, GL.EN, GL.HI, GL.ID, GL.KO, GL.NO, GL.PL, GL.BR, GL.SV, GL.TH, GL.TR],
    },
  },
  {
    label: 'Temperature',
    type: {
      alexa: null,
      google: '@sys.temperature',
    },
    locales: {
      alexa: null,
      google: [GL.DA, GL.NL, GL.EN, GL.HI, GL.ID, GL.KO, GL.NO, GL.PL, GL.BR, GL.SV, GL.TH, GL.TR],
    },
  },
  {
    label: 'Unit Area Name',
    type: {
      alexa: null,
      google: '@sys.unit-area-name',
    },
    locales: {
      alexa: null,
      google: [GL.DA, GL.NL, GL.EN, GL.HI, GL.ID, GL.KO, GL.NO, GL.PL, GL.BR, GL.SV, GL.TH, GL.TR],
    },
  },
  {
    label: 'Unit Length Name',
    type: {
      alexa: null,
      google: '@sys.unit-length-name',
    },
    locales: {
      alexa: null,
      google: [GL.DA, GL.NL, GL.EN, GL.HI, GL.ID, GL.KO, GL.NO, GL.PL, GL.BR, GL.SV, GL.TH, GL.TR],
    },
  },
  {
    label: 'Unit Speed Name',
    type: {
      alexa: null,
      google: '@sys.unit-speed-name',
    },
    locales: {
      alexa: null,
      google: [GL.DA, GL.NL, GL.EN, GL.HI, GL.ID, GL.KO, GL.NO, GL.PL, GL.BR, GL.SV, GL.TH, GL.TR],
    },
  },
  {
    label: 'Unit Volume Name',
    type: {
      alexa: null,
      google: '@sys.unit-volume-name',
    },
    locales: {
      alexa: null,
      google: [GL.DA, GL.NL, GL.EN, GL.HI, GL.ID, GL.KO, GL.NO, GL.PL, GL.BR, GL.SV, GL.TH, GL.TR],
    },
  },
  {
    label: 'Unit Weight Name',
    type: {
      alexa: null,
      google: '@sys.unit-weight-name',
    },
    locales: {
      alexa: null,
      google: [GL.DA, GL.NL, GL.EN, GL.HI, GL.ID, GL.KO, GL.NO, GL.PL, GL.BR, GL.SV, GL.TH, GL.TR],
    },
  },
  {
    label: 'Unit Information Name',
    type: {
      alexa: null,
      google: '@sys.unit-information-name',
    },
    locales: {
      alexa: null,
      google: [GL.DA, GL.NL, GL.EN, GL.HI, GL.ID, GL.KO, GL.NO, GL.PL, GL.BR, GL.SV, GL.TH, GL.TR],
    },
  },
  {
    label: 'Geo State',
    type: {
      alexa: null,
      google: '@sys.geo-state',
    },
    locales: {
      alexa: null,
      google: [GL.DA, GL.NL, GL.EN, GL.FR, GL.HI, GL.ID, GL.KO, GL.NO, GL.PL, GL.BR, GL.ES, GL.SV, GL.TH, GL.TR],
    },
  },
  {
    label: 'Music Genre',
    type: {
      alexa: null,
      google: '@sys.music-genre',
    },
    locales: {
      alexa: null,
      google: [GL.DA, GL.NL, GL.EN, GL.HI, GL.ID, GL.KO, GL.NO, GL.PL, GL.BR, GL.ES, GL.SV, GL.TH, GL.TR],
    },
  },
  {
    label: 'Number Sequence',
    type: {
      alexa: null,
      google: '@sys.number-sequence',
    },
    locales: {
      alexa: null,
      google: [GL.EN],
    },
  },
  {
    label: 'Geo Country Code',
    type: {
      alexa: null,
      google: '@sys.geo-country-code',
    },
    locales: {
      alexa: null,
      google: [GL.EN],
    },
  },
  {
    label: 'Place Attraction',
    type: {
      alexa: null,
      google: '@sys.place-attraction',
    },
    locales: {
      alexa: null,
      google: [GL.EN, GL.FR, GL.JA],
    },
  },
  {
    label: 'Patronymic Name',
    type: {
      alexa: null,
      google: '@sys.patronymic-name',
    },
    locales: {
      alexa: null,
      google: [GL.RU],
    },
  },
];

const BUILT_IN_INTENTS_ALEXA = [
  // { name: "AMAZON.AddAction<object@Book,targetCollection@ReadingList>",
  //   slots: [
  //     "targetCollection.owner.name",
  //     "object.inLanguage.type",
  //     "targetCollection.name",
  //     "targetCollection.audience.name",
  //     "object.genre",
  //     "object.partOfSeries.name",
  //     "object.type",
  //     "object.name",
  //     "object.audience.name",
  //     "object.sort",
  //     "object.author.name",
  //     "targetCollection.type",
  //   ]
  // },
  // { name: "AMAZON.AddAction<object@BookSeries,targetCollection@ReadingList>",
  //   slots: [
  //     "targetCollection.owner.name",
  //     "object.name",
  //     "object.author.name",
  //     "targetCollection.type",
  //   ]
  // },
  // { name: "AMAZON.ChooseAction<object@Book,sourceCollection@ReadingList>",
  //   slots: [
  //     "object.type",
  //     "object.select",
  //     "sourceCollection.type",
  //   ]
  // },
  // { name: "AMAZON.ChooseAction<object@Book>",
  //   slots: [
  //     "object.type",
  //     "object.name",
  //     "object.select",
  //     "object.author.name",
  //   ]
  // },
  // { name: "AMAZON.DeleteAction<object@Book,sourceCollection@ReadingList>",
  //   slots: [
  //     "object.owner.name",
  //     "object.version.type",
  //     "object.inLanguage.type",
  //     "object.select",
  //     "object.genre",
  //     "object.type",
  //     "object.name",
  //     "sourceCollection.owner.name",
  //     "sourceCollection.type",
  //     "sourceCollection.name",
  //     "object.sort",
  //     "object.translator.name",
  //     "object.author.name",
  //   ]
  // },
  // { name: "AMAZON.DeleteAction<object@BookSeries,sourceCollection@ReadingList>",
  //   slots: [
  //     "object.type",
  //     "object.name",
  //     "sourceCollection.owner.name",
  //     "sourceCollection.type",
  //   ]
  // },
  // { name: "AMAZON.PlaybackAction<object@Book>",
  //   slots: [
  //     "object.owner.name",
  //     "object.select",
  //     "object.contentSource",
  //     "object.partOfSeries.name",
  //     "object.type",
  //     "object.name",
  //     "object.bookNumber",
  //     "object.brand.type",
  //     "object.partOfBookSeries.name",
  //     "object.sort",
  //     "object.author.name",
  //   ]
  // },
  // { name: "AMAZON.RateAction<object@Book>",
  //   slots: [
  //     "rating.ratingValueUnit",
  //     "object.select",
  //     "object.partOfSeries.name",
  //     "object.type",
  //     "object.name",
  //     "rating.ratingValue",
  //     "object.partOfSeries.type",
  //     "rating.bestRating",
  //   ]
  // },
  // { name: "AMAZON.RestartAction<object@Book>",
  //   slots: [
  //     "object.owner.name",
  //     "object.type",
  //     "object.name",
  //     "object.select",
  //     "object.author.name",
  //   ]
  // },
  // { name: "AMAZON.ResumeAction<object@Book>",
  //   slots: [
  //     "object.owner.name",
  //     "object.contentSource.owner.name",
  //     "object.contentSource",
  //     "object.type",
  //     "object.name",
  //     "object.bookNumber",
  //     "object.brand.type",
  //   ]
  // },
  // { name: "AMAZON.SearchAction<object@Book>",
  //   slots: [
  //     "object.owner.name",
  //     "object.genre",
  //     "object.contentSource",
  //     "object.type",
  //     "object.name",
  //     "sourceCollection.owner.name",
  //     "object.sort",
  //     "object.author.name",
  //     "object.readBy.name",
  //   ]
  // },
  // { name: "AMAZON.SearchAction<object@Book[datePublished]>",
  //   slots: [
  //     "object.datePublished.type",
  //     "object.type",
  //   ]
  // },
  // { name: "AMAZON.SearchAction<object@Book[numberOfSections]>",
  //   slots: [
  //     "object.numberOfSections",
  //     "object.type",
  //     "object.hasPart.type",
  //     "object.numberOfSections.type",
  //   ]
  // },
  // { name: "AMAZON.SearchAction<object@Book[position]>",
  //   slots: [
  //     "object.type"
  //   ]
  // },
  // { name: "AMAZON.StopAction<object@Book>",
  //   slots: [
  //     "object.owner.name",
  //     "object.type",
  //     "object.name",
  //   ]
  // },
  // { name: "AMAZON.SuspendAction<object@Book>",
  //   slots: [
  //     "object.owner.name",
  //     "object.type",
  //     "duration.name",
  //   ]
  // },
  // { name: "AMAZON.ReadAction<object@Calendar>",
  //   slots: [
  //     "object.owner.name",
  //     "object.type",
  //   ]
  // },
  // { name: "AMAZON.SearchAction<object@Calendar>",
  //   slots: [
  //     "object.owner.name",
  //     "object.startTime",
  //     "object.type",
  //     "object.event.type",
  //     "object.event.startDate",
  //   ]
  // },
  // { name: "AMAZON.ChooseAction<object@ScreeningEvent[location]>",
  //   slots: [
  //     "object.location.name"
  //   ]
  // },
  // { name: "AMAZON.ChooseAction<object@ScreeningEvent[workPresented]>",
  //   slots: [
  //     "object.spatialRelation",
  //     "object.workPresented.name",
  //     "object.location.name",
  //     "object.select",
  //     "object.location.type",
  //     "object.startDate",
  //     "object.type",
  //     "object.startTime",
  //     "object.workPresented.character.name",
  //     "object.workPresented.type",
  //   ]
  // },
  // { name: "AMAZON.SearchAction<object@ScreeningEvent>",
  //   slots: [
  //     "object.spatialRelation",
  //     "object.workPresented.name",
  //     "object.location.name",
  //     "object.endTime",
  //     "object.location.type",
  //     "object.startDate",
  //     "object.type",
  //     "object.startTime",
  //     "object.workPresented.type",
  //   ]
  // },
  // { name: "AMAZON.SearchAction<object@ScreeningEvent[location]>",
  //   slots: [
  //     "object.spatialRelation",
  //     "object.workPresented.name",
  //     "object.location.name",
  //     "object.location.type",
  //     "object.startDate",
  //     "object.workPresented",
  //     "object.workPresented.type",
  //   ]
  // },
  // { name: "AMAZON.SearchAction<object@LocalBusiness>",
  //   slots: [
  //     "object.location.addressLocality.name",
  //     "object.spatialRelation",
  //     "object.location.name",
  //     "object.location.type",
  //     "object.type",
  //     "object.name",
  //     "object.aggregateRating",
  //     "object.toLocation.name",
  //     "object.fromLocation.type",
  //     "object.toLocation.addressRegion.name",
  //     "object.toLocation.addressLocality.name",
  //   ]
  // },
  // { name: "AMAZON.SearchAction<object@LocalBusiness[openHours.closes]>",
  //   slots: [
  //     "object.location.addressLocality.name",
  //     "object.spatialRelation",
  //     "object.location.name",
  //     "object.openHours.closes",
  //     "object.type",
  //     "object.name",
  //     "object.location.streetAddress.name",
  //   ]
  // },
  // { name: "AMAZON.SearchAction<object@LocalBusiness[openHours]>",
  //   slots: [
  //     "object.location.addressLocality.name",
  //     "object.spatialRelation",
  //     "object.location.name",
  //     "object.openHours.closes",
  //     "object.type",
  //     "object.name",
  //     "object.location.streetAddress.name",
  //     "object.location.addressRegion.name",
  //     "object.openHours.opens",
  //     "object.openHours.type",
  //   ]
  // },
  // { name: "AMAZON.SearchAction<object@LocalBusiness[telephone]>",
  //   slots: [
  //     "object.location.addressLocality.name",
  //     "object.location.name",
  //     "object.department.telephone.type",
  //     "object.telephone.type",
  //     "object.name",
  //     "object.location.addressRegion.name",
  //     "object.department.type",
  //     "object.type",
  //   ]
  // },
  // { name: "AMAZON.AddAction<object@MusicCreativeWork,targetCollection@MusicPlaylist>",
  //   slots: [
  //     "object.owner.name",
  //     "targetCollection.owner.name",
  //     "targetCollection.name",
  //     "object.byArtist.name",
  //     "object.type",
  //     "object.name",
  //     "object.performedIn.name",
  //     "object.sort",
  //     "targetCollection.type",
  //   ]
  // },
  // { name: "AMAZON.ChooseAction<object@MusicCreativeWork,sourceCollection@MusicPlaylist>",
  //   slots: [
  //     "sourceCollection.type",
  //     "object.select",
  //     "object.byArtist.name",
  //     "object.genre",
  //     "object.type",
  //     "sourceCollection.owner.name",
  //     "sourceCollection.name",
  //   ]
  // },
  // { name: "AMAZON.ChooseAction<object@MusicCreativeWork>",
  //   slots: [
  //     "object.type",
  //     "object.sort",
  //     "object.name",
  //     "object.genre",
  //     "object.byArtist.name",
  //   ]
  // },
  // { name: "AMAZON.ChooseAction<object@MusicPlaylist>",
  //   slots: [
  //     "object.owner.name",
  //     "object.type",
  //     "object.name",
  //   ]
  // },
  // { name: "AMAZON.CreateAction<object@MusicPlaylist,content@MusicCreativeWork>",
  //   slots: [
  //     "content.amount",
  //     "content.owner.name",
  //     "content.byArtist.name",
  //     "object.type",
  //     "content.type",
  //     "content.genre",
  //     "content.inLanguage.name",
  //   ]
  // },
  // { name: "AMAZON.CreateAction<object@MusicPlaylist>",
  //   slots: [
  //     "object.type",
  //     "object.name",
  //   ]
  // },
  // { name: "AMAZON.DeleteAction<object@MusicCreativeWork,sourceCollection@MusicPlaylist>",
  //   slots: [
  //     "sourceCollection.type",
  //     "object.select",
  //     "object.byArtist.name",
  //     "object.genre",
  //     "object.type",
  //     "sourceCollection.owner.name",
  //     "sourceCollection.name",
  //   ]
  // },
  // { name: "AMAZON.DeleteAction<object@MusicCreativeWork>",
  //   slots: [
  //     "sourceCollection.type",
  //     "object.type",
  //     "object.genre",
  //     "object.byArtist.name",
  //     "sourceCollection.name",
  //   ]
  // },
  // { name: "AMAZON.DeleteAction<object@MusicPlaylist,sourceCollection@Catalog>",
  //   slots: [
  //     "sourceCollection.owner.name",
  //     "object.type",
  //     "object.select",
  //     "sourceCollection.type",
  //   ]
  // },
  // { name: "AMAZON.DeleteAction<object@MusicPlaylist>",
  //   slots: [
  //     "object.owner.name",
  //     "object.type",
  //     "object.name",
  //     "object.tracks.byArtist.name",
  //     "object.tracks.type",
  //     "object.dateCreated.type",
  //     "object.sort",
  //     "object.tracks.genre",
  //   ]
  // },
  // { name: "AMAZON.LikeAction<object@Musician>",
  //   slots: [
  //     "object.userPreference.type",
  //     "object.type",
  //   ]
  // },
  // { name: "AMAZON.PlaybackAction<object@MusicCreativeWork>",
  //   slots: [
  //     "object.owner.name",
  //     "object.select",
  //     "object.byArtist.name",
  //     "object.genre",
  //     "object.contentSource",
  //     "object.composer.name",
  //     "object.name",
  //     "object.era",
  //     "object.sort",
  //     "object.type",
  //   ]
  // },
  // { name: "AMAZON.PlaybackAction<object@MusicPlaylist>",
  //   slots: [
  //     "object.owner.name",
  //     "object.type",
  //     "object.name",
  //     "mode.name",
  //   ]
  // },
  // { name: "AMAZON.RepeatAction<object@MusicCreativeWork>",
  //   slots: [
  //     "object.type"
  //   ]
  // },
  // { name: "AMAZON.ResumeAction<object@MusicCreativeWork>",
  //   slots: [
  //     "object.type"
  //   ]
  // },
  // { name: "AMAZON.SearchAction<object@MusicCreativeWork>",
  //   slots: [
  //     "object.owner.name",
  //     "object.select",
  //     "object.genre",
  //     "object.byArtist.name",
  //     "object.contentSource",
  //     "object.type",
  //     "object.name",
  //     "object.byArtist",
  //     "object.contentSource.owner.name",
  //     "object.inAlbum.type",
  //     "object.inLanguage.name",
  //     "object.contentSource.type",
  //     "object.sort",
  //     "object.contentSource.name",
  //   ]
  // },
  // { name: "AMAZON.SearchAction<object@MusicCreativeWork[byArtist]>",
  //   slots: [
  //     "object.byArtist.type"
  //   ]
  // },
  // { name: "AMAZON.SearchAction<object@MusicGroup>",
  //   slots: [
  //     "object.name"
  //   ]
  // },
  // { name: "AMAZON.SearchAction<object@MusicGroup[musicGroupMember]>",
  //   slots: [
  //     "object.type",
  //     "object.musicGroupMember.type",
  //   ]
  // },
  // { name: "AMAZON.SearchAction<object@MusicPlaylist[tracks]>",
  //   slots: [
  //     "sourceCollection.type",
  //     "object.tracks.type",
  //   ]
  // },
  // { name: "AMAZON.SearchAction<object@MusicRecording[byArtist.musicGroupMember]>",
  //   slots: [
  //     "object.byArtist.musicGroupMember.type"
  //   ]
  // },
  // { name: "AMAZON.SearchAction<object@MusicRecording[byArtist]>",
  //   slots: [
  //     "object.type",
  //     "object.byArtist.type",
  //   ]
  // },
  // { name: "AMAZON.SearchAction<object@MusicRecording[duration]>",
  //   slots: [
  //     "object.type",
  //     "object.duration.type",
  //   ]
  // },
  // { name: "AMAZON.SearchAction<object@MusicRecording[inAlbum]>",
  //   slots: [
  //     "object.inAlbum.type",
  //     "object.type",
  //   ]
  // },
  // { name: "AMAZON.SearchAction<object@MusicRecording[producer]>",
  //   slots: [
  //     "object.type",
  //     "object.producer.type",
  //   ]
  // },
  // { name: "AMAZON.SearchAction<object@VideoCreativeWork[musicBy]>",
  //   slots: [
  //     "object.contains.type",
  //     "object.name",
  //   ]
  // },
  // { name: "AMAZON.StartAction<object@MusicCreativeWork>",
  //   slots: [
  //     "object.type",
  //     "object.select",
  //   ]
  // },
  // { name: "AMAZON.StopAction<object@MusicCreativeWork>",
  //   slots: [
  //     "object.type"
  //   ]
  // },
  // { name: "AMAZON.SuspendAction<object@MusicCreativeWork>",
  //   slots: [
  //     "object.type"
  //   ]
  // },
  // { name: "AMAZON.ChooseAction<object@VideoCreativeWork,sourceCollection@VideoPlaylist>",
  //   slots: [
  //     "sourceCollection",
  //     "sourceCollection.type",
  //     "object.name",
  //     "object.select",
  //   ]
  // },
  // { name: "AMAZON.ChooseAction<object@VideoCreativeWork>",
  //   slots: [
  //     "object.character.name",
  //     "object.type",
  //     "object.select",
  //     "object.genre",
  //     "object.byArtist.name",
  //   ]
  // },
  // { name: "AMAZON.CloseAction<object@VideoCreativeWork>",
  //   slots: [
  //     "object.owner.name",
  //     "object.type",
  //   ]
  // },
  // { name: "AMAZON.DislikeAction<object@VideoCreativeWork>",
  //   slots: [
  //     "object.type",
  //     "object.name",
  //   ]
  // },
  // { name: "AMAZON.ExitAction<object@VideoPlaylist>",
  //   slots: [
  //     "object.type",
  //     "object.name",
  //   ]
  // },
  // { name: "AMAZON.LikeAction<object@VideoCreativeWork>",
  //   slots: [
  //     "object.type",
  //     "object.name",
  //   ]
  // },
  // { name: "AMAZON.PlaybackAction<object@VideoCreativeWork>",
  //   slots: [
  //     "object.partOfSeries.name",
  //     "object.type",
  //     "object.name",
  //     "object.select",
  //   ]
  // },
  // { name: "AMAZON.RateAction<object@VideoCreativeWork>",
  //   slots: [
  //     "rating.ratingValueUnit",
  //     "object.select",
  //     "object.type",
  //     "object.name",
  //     "rating.ratingValue",
  //     "rating.bestRating",
  //   ]
  // },
  // { name: "AMAZON.RestartAction<object@VideoCreativeWork>",
  //   slots: [
  //     "object.type",
  //     "object.select",
  //   ]
  // },
  // { name: "AMAZON.ResumeAction<object@VideoCreativeWork>",
  //   slots: [
  //     "object.owner.name",
  //     "object.type",
  //     "object.name",
  //   ]
  // },
  // { name: "AMAZON.SearchAction<object@VideoCreativeWork,sourceCollection@VideoPlaylist>",
  //   slots: [
  //     "object.type",
  //     "object.name",
  //     "sourceCollection.owner.name",
  //     "sourceCollection.name",
  //   ]
  // },
  // { name: "AMAZON.SearchAction<object@VideoCreativeWork>",
  //   slots: [
  //     "object.name",
  //     "object.startDate",
  //     "object.character.name",
  //     "object.partOfSeries.name",
  //     "object.actor.name",
  //     "object.actor.gender",
  //     "object.contentSource",
  //     "object.type",
  //     "object.personAssociatedWith.name",
  //     "object.contentRating.type",
  //     "object.about.type",
  //     "object.recordedAt.type",
  //     "object.owner.name",
  //     "object.inLanguage.type",
  //     "object.genre",
  //     "object.sentiment.type",
  //     "object.about.name",
  //     "object.director.name",
  //     "object.sort",
  //     "object.audience.type",
  //     "object.aggregatePopularity",
  //     "object.select",
  //     "object.partOfSeries.select",
  //     "object.actor.type",
  //     "sourceCollection.contentSource",
  //   ]
  // },
  // { name: "AMAZON.SearchAction<object@VideoCreativeWork[actor]>",
  //   slots: [
  //     "object.type",
  //     "object.name",
  //     "object.actor.type",
  //   ]
  // },
  // { name: "AMAZON.SearchAction<object@VideoCreativeWork[audience]>",
  //   slots: [
  //     "object.type",
  //     "object.audience.type",
  //     "object.name",
  //   ]
  // },
  // { name: "AMAZON.SearchAction<object@VideoCreativeWork[contentRating]>",
  //   slots: [
  //     "object.name"
  //   ]
  // },
  // { name: "AMAZON.SearchAction<object@VideoCreativeWork[dateReleased]>",
  //   slots: [
  //     "object.name"
  //   ]
  // },
  // { name: "AMAZON.SearchAction<object@VideoCreativeWork[description]>",
  //   slots: [
  //     "object.name",
  //     "object.description.type",
  //   ]
  // },
  // { name: "AMAZON.SearchAction<object@VideoCreativeWork[director]>",
  //   slots: [
  //     "object.type",
  //     "object.name",
  //   ]
  // },
  // { name: "AMAZON.SearchAction<object@VideoCreativeWork[genre]>",
  //   slots: [
  //     "object.genre.type",
  //     "object.type",
  //   ]
  // },
  // { name: "AMAZON.SearchAction<object@VideoCreativeWork[name]>",
  //   slots: [
  //     "object.type"
  //   ]
  // },
  // { name: "AMAZON.StopAction<object@VideoCreativeWork>",
  //   slots: [
  //     "object.quantity",
  //     "object.type",
  //   ]
  // },
  // { name: "AMAZON.SuspendAction<object@VideoCreativeWork>",
  //   slots: [
  //     "object.type",
  //     "duration.name",
  //   ]
  // },
  // { name: "AMAZON.WatchAction<object@VideoCreativeWork>",
  //   slots: [
  //     "object.partOfSeries.type",
  //     "object.type",
  //     "object.select",
  //   ]
  // },
  // { name: "AMAZON.SearchAction<object@WeatherForecast>",
  //   slots: [
  //     "object.location.addressLocality.name",
  //     "object.location.addressCountry.name",
  //     "object.weatherCondition.name",
  //     "object.startDate",
  //     "object.duration",
  //     "object.location.addressRegion.name",
  //     "object.startTime",
  //     "object.type",
  //   ]
  // },
  // { name: "AMAZON.SearchAction<object@WeatherForecast[temperature]>",
  //   slots: [
  //     "object.location.addressLocality.name",
  //     "object.location.addressCountry.name",
  //     "object.weatherCondition.name",
  //     "object.startDate",
  //     "object.duration",
  //     "object.location.addressRegion.name",
  //     "object.startTime",
  //     "object.temperature.type",
  //     "object.type",
  //   ]
  // },
  // { name: "AMAZON.SearchAction<object@WeatherForecast[weatherCondition]>",
  //   slots: [
  //     "object.location.addressLocality.name",
  //     "object.spatialRelation",
  //     "object.location.addressCountry.name",
  //     "object.weatherCondition.name",
  //     "object.startDate",
  //     "object.duration",
  //     "object.location.addressRegion.name",
  //     "object.startTime",
  //     "object.type",
  //   ]
  // },
  // { name: "AMAZON.ActivateAction<object@PlaybackMode>",
  //   slots: [
  //     "object.name"
  //   ]
  // },
  // { name: "AMAZON.AddAction<object@Event>",
  //   slots: [
  //     "object.owner.name",
  //     "targetCollection.owner.name",
  //     "object.startDate",
  //     "object.type",
  //     "object.name",
  //     "object.startTime",
  //     "object.attendee.name",
  //     "object.description.type",
  //     "targetCollection.type",
  //     "object.event.type",
  //   ]
  // },
  // { name: "AMAZON.ChooseAction<object@CreativeWork>",
  //   slots: [
  //     "sourceCollection.type",
  //     "object.name",
  //   ]
  // },
  // { name: "AMAZON.ChooseAction<object@Event>",
  //   slots: [
  //     "object.owner.name",
  //     "object.performer.name",
  //     "sourceCollection.type",
  //     "object.select",
  //     "object.startDate",
  //     "object.type",
  //     "object.name",
  //     "sourceCollection.owner.name",
  //     "object.location.addressRegion.name",
  //     "object.startTime",
  //     "object.attendee.name",
  //   ]
  // },
  // { name: "AMAZON.CloseAction<object@CreativeWorkSection>",
  //   slots: [
  //     "object.type"
  //   ]
  // },
  // { name: "AMAZON.CloseAction<object@Thing>",
  //   slots: [
  //     "object.quantity",
  //     "object.location.name",
  //   ]
  // },
  // { name: "AMAZON.CreateAction<object@ReadingList>",
  //   slots: [
  //     "object.name"
  //   ]
  // },
  // { name: "AMAZON.DeactivateAction<object@PlaybackMode>",
  //   slots: [
  //     "object.name"
  //   ]
  // },
  // { name: "AMAZON.DeactivateAction<object@Thing>",
  //   slots: [
  //     "object.quantity"
  //   ]
  // },
  // { name: "AMAZON.DeleteAction<object@Event>",
  //   slots: [
  //     "object.owner.name",
  //     "sourceCollection.type",
  //     "object.select",
  //     "object.startDate",
  //     "object.type",
  //     "object.name",
  //     "sourceCollection.owner.name",
  //     "object.startTime",
  //   ]
  // },
  // { name: "AMAZON.DeleteAction<object@ReadingList>",
  //   slots: [
  //     "object.owner.name",
  //     "object.itemListElement",
  //     "object.name",
  //     "object.sort",
  //   ]
  // },
  // { name: "AMAZON.DeleteAction<object@Thing>",
  //   slots: [
  //     "amount.quantity",
  //     "sourceCollection.owner.name",
  //     "sourceCollection.type",
  //   ]
  // },
  // { name: "AMAZON.ExitAction<object@Episode>",
  //   slots: [
  //     "object.type",
  //     "object.isPartOfTVSeries.name",
  //   ]
  // },
  // { name: "AMAZON.IgnoreAction<object@Thing>",
  //   slots: [

  //   ]
  // },
  // { name: "AMAZON.MuteAction<object@Thing>",
  //   slots: [

  //   ]
  // },
  // { name: "AMAZON.PlaybackAction<object@CreativeWorkSection>",
  //   slots: [
  //     "object.type",
  //     "object.select",
  //   ]
  // },
  // { name: "AMAZON.PlaybackAction<object@Episode>",
  //   slots: [
  //     "object.select",
  //     "object.hasPart",
  //     "object.partOfSeries.name",
  //     "object.type",
  //     "object.name",
  //     "object.partOfSeries.type",
  //     "object.quantity",
  //     "object.partOfTVSeries.name",
  //     "object.sort",
  //   ]
  // },
  // { name: "AMAZON.PlaybackAction<object@TVSeason>",
  //   slots: [
  //     "object.partOfTVSeries.name",
  //     "object.type",
  //     "object.select",
  //   ]
  // },
  // { name: "AMAZON.PlaybackAction<object@TVSeries>",
  //   slots: [
  //     "object.name"
  //   ]
  // },
  // { name: "AMAZON.ReplaceAction<object@Event>",
  //   slots: [
  //     "object.owner.name",
  //     "replaceThis.startDate",
  //     "replaceWith.startTime",
  //     "replaceThis.name.type",
  //     "object.startDate",
  //     "object.namee",
  //     "object.type",
  //     "object.name",
  //     "replaceWith.startDate",
  //     "replaceThis.location.type",
  //     "replaceWith.location.streetAddress.name",
  //     "replaceThis.startTime",
  //     "object.attendee.name",
  //     "replaceThis.startTime.type",
  //     "replaceWith.duration",
  //     "target.startDate",
  //     "replaceWith.name",
  //     "object.sort",
  //     "replaceWith.location.name",
  //     "replaceThis.duration",
  //     "replaceThis.startDate.type",
  //   ]
  // },
  // { name: "AMAZON.RestartAction<object@CreativeWorkSection>",
  //   slots: [
  //     "object.type",
  //     "object.select",
  //     "object.sectionNumber",
  //   ]
  // },
  // { name: "AMAZON.ResumeAction<object@CreativeWorkSection>",
  //   slots: [
  //     "object.type",
  //     "object.sectionNumber",
  //   ]
  // },
  // { name: "AMAZON.ResumeAction<object@TVSeries>",
  //   slots: [
  //     "object.type",
  //     "object.name",
  //   ]
  // },
  // { name: "AMAZON.SearchAction<object@Actor>",
  //   slots: [
  //     "object.type"
  //   ]
  // },
  // { name: "AMAZON.SearchAction<object@CreativeWork>",
  //   slots: [
  //     "object.name"
  //   ]
  // },
  // { name: "AMAZON.SearchAction<object@CreativeWork[name]>",
  //   slots: [
  //     "object.type",
  //     "object.name",
  //   ]
  // },
  // { name: "AMAZON.SearchAction<object@CreativeWorkSection>",
  //   slots: [
  //     "object.type"
  //   ]
  // },
  // { name: "AMAZON.SearchAction<object@CreativeWorkSection[name]>",
  //   slots: [
  //     "object.type"
  //   ]
  // },
  // { name: "AMAZON.SearchAction<object@Episode>",
  //   slots: [
  //     "object.partOfTVSeries.name",
  //     "object.type",
  //     "object.partOfSeason.type",
  //     "object.isPartOf.seasonNumber",
  //     "object.episode.type",
  //     "object.sort",
  //   ]
  // },
  // { name: "AMAZON.SearchAction<object@Episode[description]>",
  //   slots: [
  //     "object.datePublished",
  //     "object.type",
  //   ]
  // },
  // { name: "AMAZON.SearchAction<object@Event>",
  //   slots: [
  //     "object.owner.name",
  //     "sourceCollection.type",
  //     "object.select",
  //     "object.startDate",
  //     "object.eventStatus.type",
  //     "object.startTime",
  //     "object.type",
  //   ]
  // },
  // { name: "AMAZON.SearchAction<object@Event[eventStatus]>",
  //   slots: [
  //     "object.owner.name",
  //     "object.startTime",
  //     "object.eventStatus.type",
  //     "object.select",
  //     "object.type",
  //   ]
  // },
  // { name: "AMAZON.SearchAction<object@Event[location]>",
  //   slots: [
  //     "object.owner.name",
  //     "object.type",
  //     "object.name",
  //     "object.startDate",
  //   ]
  // },
  // { name: "AMAZON.SearchAction<object@Event[startDate]>",
  //   slots: [
  //     "object.owner.name",
  //     "object.location.name",
  //     "object.select",
  //     "object.location.type",
  //     "object.startDate",
  //     "object.type",
  //     "object.name",
  //     "object.attendee.name",
  //   ]
  // },
  // { name: "AMAZON.SearchAction<object@Singer>",
  //   slots: [
  //     "object.type"
  //   ]
  // },
  // { name: "AMAZON.StartAction<object@CreativeWorkSection>",
  //   slots: [
  //     "object.type",
  //     "object.select",
  //   ]
  // },
  // { name: "AMAZON.SuspendAction<object@CreativeWorkSection>",
  //   slots: [
  //     "object.type"
  //   ]
  // },
  // { name: "AMAZON.SuspendAction<object@Episode>",
  //   slots: [
  //     "object.type"
  //   ]
  // },
  // { name: "AMAZON.WatchAction<object@Episode>",
  //   slots: [
  //     "object.partOfTVSeries.name",
  //     "object.type",
  //     "object.select",
  //   ]
  // },
  {
    name: 'AMAZON.CancelIntent',
    slots: [],
  },
  {
    name: 'AMAZON.FallbackIntent',
    slots: [],
  },
  {
    name: 'AMAZON.HelpIntent',
    slots: [],
  },
  {
    name: 'AMAZON.LoopOffIntent',
    slots: [],
  },
  {
    name: 'AMAZON.LoopOnIntent',
    slots: [],
  },
  {
    name: 'AMAZON.MoreIntent',
    slots: [],
  },
  {
    name: 'AMAZON.NavigateHomeIntent',
    slots: [],
  },
  {
    name: 'AMAZON.NavigateSettingsIntent',
    slots: [],
  },
  {
    name: 'AMAZON.NextIntent',
    slots: [],
  },
  {
    name: 'AMAZON.NoIntent',
    slots: [],
  },
  {
    name: 'AMAZON.PageDownIntent',
    slots: [],
  },
  {
    name: 'AMAZON.PageUpIntent',
    slots: [],
  },
  {
    name: 'AMAZON.PauseIntent',
    slots: [],
  },
  {
    name: 'AMAZON.PreviousIntent',
    slots: [],
  },
  {
    name: 'AMAZON.RepeatIntent',
    slots: [],
  },
  {
    name: 'AMAZON.ResumeIntent',
    slots: [],
  },
  {
    name: 'AMAZON.ScrollDownIntent',
    slots: [],
  },
  {
    name: 'AMAZON.ScrollLeftIntent',
    slots: [],
  },
  {
    name: 'AMAZON.ScrollRightIntent',
    slots: [],
  },
  {
    name: 'AMAZON.ScrollUpIntent',
    slots: [],
  },
  {
    name: 'AMAZON.SelectIntent',
    slots: ['Anaphor', 'ListPosition', 'PositionRelation', 'VisualModeTrigger'],
  },
  {
    name: 'AMAZON.ShuffleOffIntent',
    slots: [],
  },
  {
    name: 'AMAZON.ShuffleOnIntent',
    slots: [],
  },
  {
    name: 'AMAZON.StartOverIntent',
    slots: [],
  },
  {
    name: 'AMAZON.StopIntent',
    slots: [],
  },
  {
    name: 'AMAZON.YesIntent',
    slots: [],
  },
];

const VOICES = [
  {
    label: 'Default',
    options: [
      {
        value: 'Alexa',
        label: 'Alexa',
      },
    ],
  },
  {
    label: 'English US',
    options: [
      {
        value: 'Ivy',
        label: 'Ivy',
      },
      {
        value: 'Joanna',
        label: 'Joanna',
      },
      {
        value: 'Joey',
        label: 'Joey',
      },
      {
        value: 'Justin',
        label: 'Justin',
      },
      {
        value: 'Kendra',
        label: 'Kendra',
      },
      {
        value: 'Kimberly',
        label: 'Kimberly',
      },
      {
        value: 'Matthew',
        label: 'Matthew',
      },
      {
        value: 'Salli',
        label: 'Salli',
      },
    ],
  },
  {
    label: 'English AU',
    options: [
      {
        value: 'Nicole',
        label: 'Nicole',
      },
      {
        value: 'Russell',
        label: 'Russell',
      },
    ],
  },
  {
    label: 'English GB',
    options: [
      {
        value: 'Amy',
        label: 'Amy',
      },
      {
        value: 'Brian',
        label: 'Brian',
      },
      {
        value: 'Emma',
        label: 'Emma',
      },
    ],
  },
  {
    label: 'English IN',
    options: [
      {
        value: 'Aditi',
        label: 'Aditi',
      },
      {
        value: 'Raveena',
        label: 'Raveena',
      },
    ],
  },
  {
    label: 'German',
    options: [
      {
        value: 'Hans',
        label: 'Hans',
      },
      {
        value: 'Marlene',
        label: 'Marlene',
      },
      {
        value: 'Vicki',
        label: 'Vicki',
      },
    ],
  },
  {
    label: 'Spanish',
    options: [
      {
        value: 'Conchita',
        label: 'Conchita',
      },
      {
        value: 'Enrique',
        label: 'Enrique',
      },
    ],
  },
  {
    label: 'Italian',
    options: [
      {
        value: 'Carla',
        label: 'Carla',
      },
      {
        value: 'Giorgio',
        label: 'Giorgio',
      },
    ],
  },
  {
    label: 'Japanese',
    options: [
      {
        value: 'Mizuki',
        label: 'Mizuki',
      },
      {
        value: 'Takumi',
        label: 'Takumi',
      },
    ],
  },
  {
    label: 'French',
    options: [
      {
        value: 'Celine',
        label: 'Celine',
      },
      {
        value: 'Lea',
        label: 'Lea',
      },
      {
        value: 'Mathieu',
        label: 'Mathieu',
      },
    ],
  },
  {
    label: 'Portuguese BR',
    options: [
      {
        value: 'Vitoria',
        label: 'Vitoria',
      },
      {
        value: 'Ricardo',
        label: 'Ricardo',
      },
    ],
  },
];

const ALLOWED_GOOGLE_BLOCKS = [
  'choice',
  'speak',
  'start',
  'if',
  'set',
  'capture',
  'random',
  'api',
  'flow',
  'comment',
  'card',
  'mail',
  'story',
  'exit',
  'interaction',
  'intent',
  'command',
  'code',
  'god',
  'integrations',
  'stream',
];

// const BUILT_IN_INTENTS_GOOGLE = [{
//   name: 'actions.intent.PLAY_GAME',
//   slots: []
// }, {
//   name: 'actions.intent.RESERVE_TAXI',
//   slots: []
// }, {
//   name: 'actions.intent.HEAR_JOKE',
//   slots: []
// }, {
//   name: 'actions.intent.HEAR_QUOTE',
//   slots: []
// }, {
//   name: 'actions.intent.HEAR_FACT',
//   slots: []
// }, {
//   name: 'actions.intent.TAKE_QUIZ',
//   slots: []
// }, {
//   name: 'actions.intent.GET_FORTUNE',
//   slots: []
// }, {
//   name: 'actions.intent.GET_HOROSCOPE',
//   slots: []
// }, {
//   name: 'actions.intent.GET_JOKE',
//   slots: []
// }, {
//   name: 'actions.intent.GET_QUOTATION',
//   slots: []
// }, {
//   name: 'actions.intent.GET_CREDIT_SCORE',
//   slots: []
// }, {
//   name: 'actions.intent.GET_CRYPTOCURRENCY_PRICE',
//   slots: []
// }, {
//   name: 'actions.intent.CHECK_WATERSPORTS_CONDITIONS',
//   slots: []
// }, {
//   name: 'actions.intent.CHECK_AIR_QUALITY',
//   slots: []
// }, {
//   name: 'actions.intent.CHECK_WATER_CONDITIONS',
//   slots: []
// }, {
//   name: 'actions.intent.START_CALMING_ACTIVITY',
//   slots: []
// }]
const BUILT_IN_INTENTS_GOOGLE = [];

exports.SLOT_TYPES = SLOT_TYPES;
exports.PLATFORMS = ['alexa', 'google'];
exports.VOICES = VOICES;
exports.BUILT_IN_INTENTS_ALEXA = BUILT_IN_INTENTS_ALEXA;
exports.BUILT_IN_INTENTS_GOOGLE = BUILT_IN_INTENTS_GOOGLE;
exports.ALLOWED_GOOGLE_BLOCKS = ALLOWED_GOOGLE_BLOCKS;
exports.GOOGLE_LOCALES = GOOGLE_LOCALES;
