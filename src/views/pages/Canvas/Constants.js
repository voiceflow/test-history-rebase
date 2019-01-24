// Regex'd from https://developer.amazon.com/docs/custom-skills/slot-type-reference.html#availability

const LOCALES = {
  US: "en-US",
  AU: "en-AU",
  CA: "en-CA",
  IN: "en-IN",
  GB: "en-GB",
  CA_fr: "fr-CA",
  FR: "fr-FR",
  DE: "de-DE",
  IT: "it-IT",
  JP: "ja-JP",
  ES: "es-ES",
  MX: "es-MX",
}

const L = LOCALES

const SLOT_TYPES = [{
    label: 'Custom',
    intent: {
      alexa: null,
      google: null
    },
    locales: {
      alexa: null,
      google: null
    }
  },
  {
    label: 'Date',
    intent: {
      alexa: 'AMAZON.DATE',
      google: '$org.schema.type.Date'
    },
    locales: {
      alexa: null,
      google: null
    }
  },
  {
    label: 'Number',
    intent: {
      alexa: 'AMAZON.NUMBER',
      google: '$org.schema.type.Number'
    },
    locales: {
      alexa: null,
      google: null
    }
  },
  {
    label: 'Time',
    intent: {
      alexa: 'AMAZON.TIME',
      google: '$org.schema.type.Time'
    },
    locales: {
      alexa: null,
      google: null
    }
  },
  {
    label: 'DayOfWeek',
    intent: {
      alexa: 'AMAZON.DayOfWeek',
      google: '$org.schema.type.DayOfWeek'
    },
    locales: {
      alexa: [L.US, L.AU, L.CA, L.IN, L.GB, L.CA_fr, L.FR, L.DE, L.IT, L.ES, L.MX],
      google: null
    }
  },
  {
    label: 'Color',
    intent: {
      alexa: 'AMAZON.Color',
      google: '$org.schema.type.Color'
    },
    locales: {
      alexa: [L.US, L.AU, L.CA, L.IN, L.GB, L.CA_fr, L.FR, L.DE, L.IT, L.ES, L.MX],
      google: null
    }
  },
  {
    label: 'Organization',
    intent: {
      alexa: 'AMAZON.Organization',
      google: '$org.schema.type.Organization'
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'Person',
    intent: {
      alexa: 'AMAZON.Person',
      google: '$org.schema.type.Person'
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'Book',
    intent: {
      alexa: 'AMAZON.Book',
      google: '$org.schema.type.Book'
    },
    locales: {
      alexa: [L.US, L.AU, L.GB],
      google: null
    }
  },
  {
    label: 'Movie',
    intent: {
      alexa: 'AMAZON.Movie',
      google: '$org.schema.type.Movie'
    },
    locales: {
      alexa: [L.US, L.AU, L.CA, L.GB, L.FR, L.DE],
      google: null
    }
  },
  {
    label: 'TVSeries',
    intent: {
      alexa: 'AMAZON.TVSeries',
      google: '$org.schema.type.TVSeries'
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'MusicAlbum',
    intent: {
      alexa: 'AMAZON.MusicAlbum',
      google: '$org.schema.type.MusicAlbum'
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'MusicRecording',
    intent: {
      alexa: 'AMAZON.MusicRecording',
      google: '$org.schema.type.MusicRecording'
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'PhoneNumber',
    intent: {
      alexa: 'AMAZON.PhoneNumber',
      google: '$org.schema.type.PhoneNumber'
    },
    locales: {
      alexa: [L.US, L.JP],
      google: null
    }
  },
  {
    label: 'Distance',
    intent: {
      alexa: null,
      google: '$org.schema.type.Distance'
    },
    locales: {
      alexa: null,
      google: null
    }
  },
  {
    label: 'Temperature',
    intent: {
      alexa: null,
      google: '$org.schema.type.Temperature'
    },
    locales: {
      alexa: null,
      google: null
    }
  },
  {
    label: 'Place',
    intent: {
      alexa: null,
      google: '$org.schema.type.Place'
    },
    locales: {
      alexa: null,
      google: null
    }
  },
  {
    label: 'Product',
    intent: {
      alexa: null,
      google: '$org.schema.type.Product'
    },
    locales: {
      alexa: null,
      google: null
    }
  },
  {
    label: 'YesNo',
    intent: {
      alexa: null,
      google: '$org.schema.type.YesNo'
    },
    locales: {
      alexa: null,
      google: null
    }
  },
  {
    label: 'URL',
    intent: {
      alexa: null,
      google: '$org.schema.type.URL'
    },
    locales: {
      alexa: null,
      google: null
    }
  },
  {
    label: 'Email',
    intent: {
      alexa: null,
      google: '$org.schema.type.Email'
    },
    locales: {
      alexa: null,
      google: null
    }
  },
  {
    label: 'Text',
    intent: {
      alexa: null,
      google: '$org.schema.type.Text'
    },
    locales: {
      alexa: null,
      google: null
    }
  },
  {
    label: 'Currency',
    intent: {
      alexa: null,
      google: '$org.schema.type.priceCurrency'
    },
    locales: {
      alexa: null,
      google: null
    }
  },
  {
    label: 'Cuisine',
    intent: {
      alexa: null,
      google: '$org.schema.type.servesCuisine'
    },
    locales: {
      alexa: null,
      google: null
    }
  },
  {
    label: 'Duration',
    intent: {
      alexa: 'AMAZON.DURATION',
      google: null
    },
    locales: {
      alexa: null,
      google: null
    }
  },
  {
    label: 'FourDigitNumber',
    intent: {
      alexa: 'AMAZON.FOUR_DIGIT_NUMBER',
      google: null
    },
    locales: {
      alexa: null,
      google: null
    }
  },
  {
    label: 'SearchQuery',
    intent: {
      alexa: 'AMAZON.SearchQuery',
      google: null
    },
    locales: {
      alexa: null,
      google: null
    }
  },
  {
    label: 'SearchQuery',
    intent: {
      alexa: 'AMAZON.SearchQuery',
      google: null
    },
    locales: {
      alexa: null,
      google: null
    }
  },
  {
    label: 'Ordinal',
    intent: {
      alexa: 'AMAZON.Ordinal',
      google: null
    },
    locales: {
      alexa: [L.US, L.JP],
      google: null
    }
  },
  {
    label: 'US_CITY',
    intent: {
      alexa: 'AMAZON.US_CITY',
      google: null
    },
    locales: {
      alexa: [L.US, L.CA, L.GB, L.DE],
      google: null
    }
  },
  {
    label: 'Actor',
    intent: {
      alexa: 'AMAZON.Actor',
      google: null
    },
    locales: {
      alexa: [L.US, L.AU, L.CA, L.IN, L.GB, L.CA_fr, L.FR, L.DE, L.IT, L.ES, L.MX],
      google: null
    }
  },
  {
    label: 'AdministrativeArea',
    intent: {
      alexa: 'AMAZON.AdministrativeArea',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'AggregateRating',
    intent: {
      alexa: 'AMAZON.AggregateRating',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'Airline',
    intent: {
      alexa: 'AMAZON.Airline',
      google: null
    },
    locales: {
      alexa: [L.US, L.AU, L.CA, L.IN, L.GB, L.CA_fr, L.FR, L.DE, L.IT, L.ES, L.MX],
      google: null
    }
  },
  {
    label: 'Airport',
    intent: {
      alexa: 'AMAZON.Airport',
      google: null
    },
    locales: {
      alexa: [L.US, L.AU, L.CA, L.IN, L.GB, L.CA_fr, L.FR, L.DE, L.IT, L.ES, L.MX],
      google: null
    }
  },
  {
    label: 'Anaphor',
    intent: {
      alexa: 'AMAZON.Anaphor',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'Animal',
    intent: {
      alexa: 'AMAZON.Animal',
      google: null
    },
    locales: {
      alexa: [L.US, L.AU, L.CA, L.IN, L.GB, L.CA_fr, L.FR, L.DE, L.IT, L.ES, L.MX],
      google: null
    }
  },
  {
    label: 'Artist',
    intent: {
      alexa: 'AMAZON.Artist',
      google: null
    },
    locales: {
      alexa: [L.US, L.IN, L.FR, L.DE],
      google: null
    }
  },
  {
    label: 'AT_CITY',
    intent: {
      alexa: 'AMAZON.AT_CITY',
      google: null
    },
    locales: {
      alexa: [L.US, L.CA, L.GB, L.DE],
      google: null
    }
  },
  {
    label: 'AT_REGION',
    intent: {
      alexa: 'AMAZON.AT_REGION',
      google: null
    },
    locales: {
      alexa: [L.US, L.CA, L.GB, L.DE],
      google: null
    }
  },
  {
    label: 'Athlete',
    intent: {
      alexa: 'AMAZON.Athlete',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'Author',
    intent: {
      alexa: 'AMAZON.Author',
      google: null
    },
    locales: {
      alexa: [L.US, L.AU, L.IN],
      google: null
    }
  },
  {
    label: 'BookSeries',
    intent: {
      alexa: 'AMAZON.BookSeries',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'BroadcastChannel',
    intent: {
      alexa: 'AMAZON.BroadcastChannel',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'CivicStructure',
    intent: {
      alexa: 'AMAZON.CivicStructure',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'Comic',
    intent: {
      alexa: 'AMAZON.Comic',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'Corporation',
    intent: {
      alexa: 'AMAZON.Corporation',
      google: null
    },
    locales: {
      alexa: [L.US, L.AU, L.CA, L.IN, L.GB, L.DE],
      google: null
    }
  },
  {
    label: 'Country',
    intent: {
      alexa: 'AMAZON.Country',
      google: null
    },
    locales: {
      alexa: [L.US, L.AU, L.CA, L.IN, L.GB, L.CA_fr, L.FR, L.DE, L.IT, L.ES, L.MX],
      google: null
    }
  },
  {
    label: 'CreativeWorkType',
    intent: {
      alexa: 'AMAZON.CreativeWorkType',
      google: null
    },
    locales: {
      alexa: [L.US, L.AU, L.CA, L.IN, L.GB, L.CA_fr, L.FR, L.DE, L.IT, L.ES, L.MX],
      google: null
    }
  },
  {
    label: 'DE_CITY',
    intent: {
      alexa: 'AMAZON.DE_CITY',
      google: null
    },
    locales: {
      alexa: [L.US, L.CA, L.GB, L.DE],
      google: null
    }
  },
  {
    label: 'DE_FIRST_NAME',
    intent: {
      alexa: 'AMAZON.DE_FIRST_NAME',
      google: null
    },
    locales: {
      alexa: [L.US, L.GB, L.DE],
      google: null
    }
  },
  {
    label: 'DE_REGION',
    intent: {
      alexa: 'AMAZON.DE_REGION',
      google: null
    },
    locales: {
      alexa: [L.US, L.CA, L.GB, L.DE],
      google: null
    }
  },
  {
    label: 'Dessert',
    intent: {
      alexa: 'AMAZON.Dessert',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'DeviceType',
    intent: {
      alexa: 'AMAZON.DeviceType',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'Director',
    intent: {
      alexa: 'AMAZON.Director',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'Drink',
    intent: {
      alexa: 'AMAZON.Drink',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'EducationalOrganization',
    intent: {
      alexa: 'AMAZON.EducationalOrganization',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'EUROPE_CITY',
    intent: {
      alexa: 'AMAZON.EUROPE_CITY',
      google: null
    },
    locales: {
      alexa: [L.US, L.CA, L.GB, L.DE],
      google: null
    }
  },
  {
    label: 'EventType',
    intent: {
      alexa: 'AMAZON.EventType',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'Festival',
    intent: {
      alexa: 'AMAZON.Festival',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'FictionalCharacter',
    intent: {
      alexa: 'AMAZON.FictionalCharacter',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'FinancialService',
    intent: {
      alexa: 'AMAZON.FinancialService',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'Food',
    intent: {
      alexa: 'AMAZON.Food',
      google: null
    },
    locales: {
      alexa: [L.US, L.AU, L.CA, L.IN, L.GB, L.FR, L.DE, L.IT, L.ES, L.MX],
      google: null
    }
  },
  {
    label: 'FoodEstablishment',
    intent: {
      alexa: 'AMAZON.FoodEstablishment',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'Game',
    intent: {
      alexa: 'AMAZON.Game',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'GB_CITY',
    intent: {
      alexa: 'AMAZON.GB_CITY',
      google: null
    },
    locales: {
      alexa: [L.US, L.CA, L.GB, L.DE],
      google: null
    }
  },
  {
    label: 'GB_FIRST_NAME',
    intent: {
      alexa: 'AMAZON.GB_FIRST_NAME',
      google: null
    },
    locales: {
      alexa: [L.US, L.CA, L.GB, L.DE],
      google: null
    }
  },
  {
    label: 'GB_REGION',
    intent: {
      alexa: 'AMAZON.GB_REGION',
      google: null
    },
    locales: {
      alexa: [L.US, L.CA, L.GB, L.DE],
      google: null
    }
  },
  {
    label: 'Genre',
    intent: {
      alexa: 'AMAZON.Genre',
      google: null
    },
    locales: {
      alexa: [L.US, L.AU, L.CA, L.IN, L.GB, L.CA_fr, L.FR, L.DE, L.IT, L.ES, L.MX],
      google: null
    }
  },
  {
    label: 'Landform',
    intent: {
      alexa: 'AMAZON.Landform',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'LandmarksOrHistoricalBuildings',
    intent: {
      alexa: 'AMAZON.LandmarksOrHistoricalBuildings',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'Language',
    intent: {
      alexa: 'AMAZON.Language',
      google: null
    },
    locales: {
      alexa: [L.US, L.AU, L.CA, L.IN, L.GB, L.CA_fr, L.FR, L.DE, L.IT, L.ES, L.MX],
      google: null
    }
  },
  {
    label: 'LocalBusiness',
    intent: {
      alexa: 'AMAZON.LocalBusiness',
      google: null
    },
    locales: {
      alexa: [L.US, L.CA],
      google: null
    }
  },
  {
    label: 'LocalBusinessType',
    intent: {
      alexa: 'AMAZON.LocalBusinessType',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'MedicalOrganization',
    intent: {
      alexa: 'AMAZON.MedicalOrganization',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'Month',
    intent: {
      alexa: 'AMAZON.Month',
      google: null
    },
    locales: {
      alexa: [L.US, L.AU, L.CA, L.IN, L.GB, L.CA_fr, L.FR, L.DE, L.IT, L.ES, L.MX],
      google: null
    }
  },
  {
    label: 'MovieSeries',
    intent: {
      alexa: 'AMAZON.MovieSeries',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'MovieTheater',
    intent: {
      alexa: 'AMAZON.MovieTheater',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'MusicCreativeWorkType',
    intent: {
      alexa: 'AMAZON.MusicCreativeWorkType',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'MusicEvent',
    intent: {
      alexa: 'AMAZON.MusicEvent',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'MusicGroup',
    intent: {
      alexa: 'AMAZON.MusicGroup',
      google: null
    },
    locales: {
      alexa: [L.US, L.FR],
      google: null
    }
  },
  {
    label: 'Musician',
    intent: {
      alexa: 'AMAZON.Musician',
      google: null
    },
    locales: {
      alexa: [L.US, L.FR],
      google: null
    }
  },
  {
    label: 'MusicPlaylist',
    intent: {
      alexa: 'AMAZON.MusicPlaylist',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'MusicVenue',
    intent: {
      alexa: 'AMAZON.MusicVenue',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'MusicVideo',
    intent: {
      alexa: 'AMAZON.MusicVideo',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'PostalAddress',
    intent: {
      alexa: 'AMAZON.PostalAddress',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'Professional',
    intent: {
      alexa: 'AMAZON.Professional',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'ProfessionalType',
    intent: {
      alexa: 'AMAZON.ProfessionalType',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'RadioChannel',
    intent: {
      alexa: 'AMAZON.RadioChannel',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'RelativePosition',
    intent: {
      alexa: 'AMAZON.RelativePosition',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'Residence',
    intent: {
      alexa: 'AMAZON.Residence',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'Room',
    intent: {
      alexa: 'AMAZON.Room',
      google: null
    },
    locales: {
      alexa: [L.US, L.AU, L.CA, L.IN, L.GB, L.CA_fr, L.FR, L.DE, L.IT, L.ES, L.MX],
      google: null
    }
  },
  {
    label: 'ScreeningEvent',
    intent: {
      alexa: 'AMAZON.ScreeningEvent',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'Service',
    intent: {
      alexa: 'AMAZON.Service',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'SocialMediaPlatform',
    intent: {
      alexa: 'AMAZON.SocialMediaPlatform',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'SoftwareApplication',
    intent: {
      alexa: 'AMAZON.SoftwareApplication',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'SoftwareGame',
    intent: {
      alexa: 'AMAZON.SoftwareGame',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'Sport',
    intent: {
      alexa: 'AMAZON.Sport',
      google: null
    },
    locales: {
      alexa: [L.US, L.AU, L.IN, L.GB, L.CA_fr, L.FR, L.DE, L.IT, L.ES, L.MX],
      google: null
    }
  },
  {
    label: 'SportsEvent',
    intent: {
      alexa: 'AMAZON.SportsEvent',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'SportsTeam',
    intent: {
      alexa: 'AMAZON.SportsTeam',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'StreetAddress',
    intent: {
      alexa: 'AMAZON.StreetAddress',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'StreetName',
    intent: {
      alexa: 'AMAZON.StreetName',
      google: null
    },
    locales: {
      alexa: [L.US, L.AU, L.CA, L.GB, L.CA_fr, L.FR, L.DE, L.IT, L.ES, L.MX],
      google: null
    }
  },
  {
    label: 'TelevisionChannel',
    intent: {
      alexa: 'AMAZON.TelevisionChannel',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'TVEpisode',
    intent: {
      alexa: 'AMAZON.TVEpisode',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'TVSeason',
    intent: {
      alexa: 'AMAZON.TVSeason',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'US_FIRST_NAME',
    intent: {
      alexa: 'AMAZON.US_FIRST_NAME',
      google: null
    },
    locales: {
      alexa: [L.US, L.CA, L.GB, L.DE],
      google: null
    }
  },
  {
    label: 'US_STATE',
    intent: {
      alexa: 'AMAZON.US_STATE',
      google: null
    },
    locales: {
      alexa: [L.US, L.CA, L.GB, L.DE],
      google: null
    }
  },
  {
    label: 'VideoGame',
    intent: {
      alexa: 'AMAZON.VideoGame',
      google: null
    },
    locales: {
      alexa: [L.US, L.AU, L.CA, L.IN, L.GB, L.CA_fr, L.FR, L.DE, L.IT, L.ES, L.MX],
      google: null
    }
  },
  {
    label: 'VisualModeTrigger',
    intent: {
      alexa: 'AMAZON.VisualModeTrigger',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'WeatherCondition',
    intent: {
      alexa: 'AMAZON.WeatherCondition',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'WrittenCreativeWorkType',
    intent: {
      alexa: 'AMAZON.WrittenCreativeWorkType',
      google: null
    },
    locales: {
      alexa: [L.US],
      google: null
    }
  },
  {
    label: 'City',
    intent: {
      alexa: 'AMAZON.City',
      google: null
    },
    locales: {
      alexa: [L.AU, L.CA, L.IN, L.GB, L.CA_fr, L.FR, L.DE, L.IT, L.ES, L.MX],
      google: null
    }
  },
  {
    label: 'FirstName',
    intent: {
      alexa: 'AMAZON.FirstName',
      google: null
    },
    locales: {
      alexa: [L.AU, L.CA, L.IN, L.GB, L.CA_fr, L.FR, L.DE, L.IT, L.ES, L.MX],
      google: null
    }
  },
  {
    label: 'Region',
    intent: {
      alexa: 'AMAZON.Region',
      google: null
    },
    locales: {
      alexa: [L.AU, L.CA, L.IN, L.GB, L.CA_fr, L.FR, L.DE, L.IT, L.ES, L.MX],
      google: null
    }
  },
  {
    label: 'DE_FIST_NAME',
    intent: {
      alexa: 'AMAZON.DE_FIST_NAME',
      google: null
    },
    locales: {
      alexa: [L.CA],
      google: null
    }
  }
]

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
    name: "AMAZON.CancelIntent",
    slots: [

    ]
  },
  {
    name: "AMAZON.FallbackIntent",
    slots: [

    ]
  },
  {
    name: "AMAZON.HelpIntent",
    slots: [

    ]
  },
  {
    name: "AMAZON.LoopOffIntent",
    slots: [

    ]
  },
  {
    name: "AMAZON.LoopOnIntent",
    slots: [

    ]
  },
  {
    name: "AMAZON.MoreIntent",
    slots: [

    ]
  },
  {
    name: "AMAZON.NavigateHomeIntent",
    slots: [

    ]
  },
  {
    name: "AMAZON.NavigateSettingsIntent",
    slots: [

    ]
  },
  {
    name: "AMAZON.NextIntent",
    slots: [

    ]
  },
  {
    name: "AMAZON.NoIntent",
    slots: [

    ]
  },
  {
    name: "AMAZON.PageDownIntent",
    slots: [

    ]
  },
  {
    name: "AMAZON.PageUpIntent",
    slots: [

    ]
  },
  {
    name: "AMAZON.PauseIntent",
    slots: [

    ]
  },
  {
    name: "AMAZON.PreviousIntent",
    slots: [

    ]
  },
  {
    name: "AMAZON.RepeatIntent",
    slots: [

    ]
  },
  {
    name: "AMAZON.ResumeIntent",
    slots: [

    ]
  },
  {
    name: "AMAZON.ScrollDownIntent",
    slots: [

    ]
  },
  {
    name: "AMAZON.ScrollLeftIntent",
    slots: [

    ]
  },
  {
    name: "AMAZON.ScrollRightIntent",
    slots: [

    ]
  },
  {
    name: "AMAZON.ScrollUpIntent",
    slots: [

    ]
  },
  {
    name: "AMAZON.SelectIntent",
    slots: [
      "Anaphor",
      "ListPosition",
      "PositionRelation",
      "VisualModeTrigger"
    ]
  },
  {
    name: "AMAZON.ShuffleOffIntent",
    slots: [

    ]
  },
  {
    name: "AMAZON.ShuffleOnIntent",
    slots: [

    ]
  },
  {
    name: "AMAZON.StartOverIntent",
    slots: [

    ]
  },
  {
    name: "AMAZON.StopIntent",
    slots: [

    ]
  },
  {
    name: "AMAZON.YesIntent",
    slots: [

    ]
  }
]

exports.SLOT_TYPES = SLOT_TYPES;

const VOICES = [{
    label: 'Default',
    options: [{
      value: 'Alexa',
      label: 'Alexa'
    }]
  },
  {
    label: 'English US',
    options: [{
        value: 'Ivy',
        label: 'Ivy'
      },
      {
        value: 'Joanna',
        label: 'Joanna'
      },
      {
        value: 'Joey',
        label: 'Joey'
      },
      {
        value: 'Justin',
        label: 'Justin'
      },
      {
        value: 'Kendra',
        label: 'Kendra'
      },
      {
        value: 'Kimberly',
        label: 'Kimberly'
      },
      {
        value: 'Matthew',
        label: 'Matthew'
      },
      {
        value: 'Salli',
        label: 'Salli'
      },
    ]
  },
  {
    label: 'English AU',
    options: [{
        value: 'Nicole',
        label: 'Nicole'
      },
      {
        value: 'Russell',
        label: 'Russell'
      },
    ]
  },
  {
    label: 'English GB',
    options: [{
        value: 'Amy',
        label: 'Amy'
      },
      {
        value: 'Brian',
        label: 'Brian'
      },
      {
        value: 'Emma',
        label: 'Emma'
      }
    ]
  },
  {
    label: 'English IN',
    options: [{
        value: 'Aditi',
        label: 'Aditi'
      },
      {
        value: 'Raveena',
        label: 'Raveena'
      },
    ]
  },
  {
    label: 'German',
    options: [{
        value: 'Hans',
        label: 'Hans'
      },
      {
        value: 'Marlene',
        label: 'Marlene'
      },
      {
        value: 'Vicki',
        label: 'Vicki'
      },
    ]
  },
  {
    label: 'Spanish',
    options: [{
        value: 'Conchita',
        label: 'Conchita'
      },
      {
        value: 'Enrique',
        label: 'Enrique'
      },
    ]
  },
  {
    label: 'Italian',
    options: [{
        value: 'Carla',
        label: 'Carla'
      },
      {
        value: 'Giorgio',
        label: 'Giorgio'
      },
    ]
  },
  {
    label: 'Japanese',
    options: [{
        value: 'Mizuki',
        label: 'Mizuki'
      },
      {
        value: 'Takumi',
        label: 'Takumi'
      },
    ]
  },
  {
    label: 'French',
    options: [{
        value: 'Celine',
        label: 'Celine'
      },
      {
        value: 'Lea',
        label: 'Lea'
      },
      {
        value: 'Mathieu',
        label: 'Mathieu'
      },
    ]
  }
]

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
  'command'
]

const BUILT_IN_INTENTS_GOOGLE = [{
    name: 'actions.intent.GET_FORTUNE',
    slots: []
  },
  {
    name: 'actions.intent.GET_HOROSCOPE',
    slots: []
  },
  {
    name: 'actions.intent.GET_JOKE',
    slots: []
  },
  {
    name: 'actions.intent.GET_QUOTATION',
    slots: []
  },
  {
    name: 'actions.intent.GET_CREDIT_SCORE',
    slots: []
  },
  {
    name: 'actions.intent.GET_CRYPTOCURRENCY_PRICE',
    slots: []
  },
  {
    name: 'actions.intent.PLAY_GAME',
    slots: []
  },
  {
    name: 'actions.intent.CHECK_WATERSPORTS_CONDITIONS',
    slots: []
  },
  {
    name: 'actions.intent.GET_SPORTS_SCHEDULE',
    slots: []
  },
  {
    name: 'actions.intent.GET_SPORTS_HIGHLIGHTS',
    slots: []
  },
  {
    name: 'actions.intent.CHECK_SPORTS_SCORES',
    slots: []
  },
  {
    name: 'actions.intent.CHECK_SPORTS_STATS',
    slots: []
  },
  {
    name: 'actions.intent.CHECK_AIR_QUALITY',
    slots: []
  },
  {
    name: 'actions.intent.CHECK_WATER_CONDITIONS',
    slots: []
  },
  {
    name: 'actions.intent.START_CALMING_ACTIVITY',
    slots: []
  }
]

exports.VOICES = VOICES
exports.BUILT_IN_INTENTS_ALEXA = BUILT_IN_INTENTS_ALEXA;
exports.BUILT_IN_INTENTS_GOOGLE = BUILT_IN_INTENTS_GOOGLE;
exports.ALLOWED_GOOGLE_BLOCKS = ALLOWED_GOOGLE_BLOCKS;