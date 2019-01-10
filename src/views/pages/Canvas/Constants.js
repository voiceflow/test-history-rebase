// Regex'd from https://developer.amazon.com/docs/custom-skills/slot-type-reference.html#availability

const SLOT_TYPES_UNIVERSAL = [
  "AMAZON.DATE",
  "AMAZON.DURATION",
  "AMAZON.FOUR_DIGIT_NUMBER",
  "AMAZON.NUMBER",
  "AMAZON.TIME",
  "AMAZON.SearchQuery"
]

const SLOT_TYPES_US = [
    "CUSTOM",
    "AMAZON.Ordinal",
    "AMAZON.PhoneNumber",
    "AMAZON.US_CITY",
    "AMAZON.Actor",
    "AMAZON.AdministrativeArea",
    "AMAZON.AggregateRating",
    "AMAZON.Airline",
    "AMAZON.Airport",
    "AMAZON.Anaphor",
    "AMAZON.Animal",
    "AMAZON.Artist",
    "AMAZON.AT_CITY",
    "AMAZON.AT_REGION",
    "AMAZON.Athlete",
    "AMAZON.Author",
    "AMAZON.Book",
    "AMAZON.BookSeries",
    "AMAZON.BroadcastChannel",
    "AMAZON.CivicStructure",
    "AMAZON.Color",
    "AMAZON.Comic",
    "AMAZON.Corporation",
    "AMAZON.Country",
    "AMAZON.CreativeWorkType",
    "AMAZON.DayOfWeek",
    "AMAZON.DE_CITY",
    "AMAZON.DE_FIRST_NAME",
    "AMAZON.DE_REGION",
    "AMAZON.Dessert",
    "AMAZON.DeviceType",
    "AMAZON.Director",
    "AMAZON.Drink",
    "AMAZON.EducationalOrganization",
    "AMAZON.EUROPE_CITY",
    "AMAZON.EventType",
    "AMAZON.Festival",
    "AMAZON.FictionalCharacter",
    "AMAZON.FinancialService",
    "AMAZON.Food",
    "AMAZON.FoodEstablishment",
    "AMAZON.Game",
    "AMAZON.GB_CITY",
    "AMAZON.GB_FIRST_NAME",
    "AMAZON.GB_REGION",
    "AMAZON.Genre",
    "AMAZON.Landform",
    "AMAZON.LandmarksOrHistoricalBuildings",
    "AMAZON.Language",
    "AMAZON.LocalBusiness",
    "AMAZON.LocalBusinessType",
    "AMAZON.MedicalOrganization",
    "AMAZON.Month",
    "AMAZON.Movie",
    "AMAZON.MovieSeries",
    "AMAZON.MovieTheater",
    "AMAZON.MusicAlbum",
    "AMAZON.MusicCreativeWorkType",
    "AMAZON.MusicEvent",
    "AMAZON.MusicGroup",
    "AMAZON.Musician",
    "AMAZON.MusicPlaylist",
    "AMAZON.MusicRecording",
    "AMAZON.MusicVenue",
    "AMAZON.MusicVideo",
    "AMAZON.Organization",
    "AMAZON.Person",
    "AMAZON.PostalAddress",
    "AMAZON.Professional",
    "AMAZON.ProfessionalType",
    "AMAZON.RadioChannel",
    "AMAZON.RelativePosition",
    "AMAZON.Residence",
    "AMAZON.Room",
    "AMAZON.ScreeningEvent",
    "AMAZON.Service",
    "AMAZON.SocialMediaPlatform",
    "AMAZON.SoftwareApplication",
    "AMAZON.SoftwareGame",
    "AMAZON.Sport",
    "AMAZON.SportsEvent",
    "AMAZON.SportsTeam",
    "AMAZON.StreetAddress",
    "AMAZON.StreetName",
    "AMAZON.TelevisionChannel",
    "AMAZON.TVEpisode",
    "AMAZON.TVSeason",
    "AMAZON.TVSeries",
    "AMAZON.US_FIRST_NAME",
    "AMAZON.US_STATE",
    "AMAZON.VideoGame",
    "AMAZON.VisualModeTrigger",
    "AMAZON.WeatherCondition",
    "AMAZON.WrittenCreativeWorkType",
 ]


const SLOT_TYPES_AU = [
  "CUSTOM",
  "AMAZON.Actor",
  "AMAZON.Airline",
  "AMAZON.Airport",
  "AMAZON.Animal",
  "AMAZON.Author",
  "AMAZON.Book",
  "AMAZON.City",
  "AMAZON.Color",
  "AMAZON.Corporation",
  "AMAZON.Country",
  "AMAZON.CreativeWorkType",
  "AMAZON.DayOfWeek",
  "AMAZON.FirstName",
  "AMAZON.Food",
  "AMAZON.Genre",
  "AMAZON.Language",
  "AMAZON.Month",
  "AMAZON.Movie",
  "AMAZON.Person",
  "AMAZON.Region",
  "AMAZON.Room",
  "AMAZON.Sport",
  "AMAZON.StreetName",
  "AMAZON.VideoGame",
]

const SLOT_TYPES_CA = [
  "CUSTOM",
  "AMAZON.Actor",
  "AMAZON.Airline",
  "AMAZON.Airport",
  "AMAZON.Animal",
  "AMAZON.AT_CITY",
  "AMAZON.AT_REGION",
  "AMAZON.City",
  "AMAZON.Color",
  "AMAZON.Corporation",
  "AMAZON.Country",
  "AMAZON.CreativeWorkType",
  "AMAZON.DayOfWeek",
  "AMAZON.DE_CITY",
  "AMAZON.DE_FIST_NAME",
  "AMAZON.DE_REGION",
  "AMAZON.EUROPE_CITY",
  "AMAZON.FirstName",
  "AMAZON.Food",
  "AMAZON.GB_CITY",
  "AMAZON.GB_FIRST_NAME",
  "AMAZON.GB_REGION",
  "AMAZON.Genre",
  "AMAZON.Language",
  "AMAZON.LocalBusiness",
  "AMAZON.Month",
  "AMAZON.Movie",
  "AMAZON.Person",
  "AMAZON.Region",
  "AMAZON.Room",
  "AMAZON.StreetName",
  "AMAZON.US_CITY",
  "AMAZON.US_FIRST_NAME",
  "AMAZON.US_STATE",
  "AMAZON.VideoGame",
]

const SLOT_TYPES_IN = [
  "CUSTOM",
  "AMAZON.Actor",
  "AMAZON.Airline",
  "AMAZON.Airport",
  "AMAZON.Animal",
  "AMAZON.Artist",
  "AMAZON.Author",
  "AMAZON.City",
  "AMAZON.Color",
  "AMAZON.Corporation",
  "AMAZON.Country",
  "AMAZON.CreativeWorkType",
  "AMAZON.DayOfWeek",
  "AMAZON.FirstName",
  "AMAZON.Food",
  "AMAZON.Genre",
  "AMAZON.Language",
  "AMAZON.Month",
  "AMAZON.Person",
  "AMAZON.Region",
  "AMAZON.Room",
  "AMAZON.Sport",
  "AMAZON.VideoGame",
]

const SLOT_TYPES_UK = [
  "CUSTOM",
  "AMAZON.Actor",
  "AMAZON.Airline",
  "AMAZON.Airport",
  "AMAZON.Animal",
  "AMAZON.AT_CITY",
  "AMAZON.AT_REGION",
  "AMAZON.Book",
  "AMAZON.City",
  "AMAZON.Color",
  "AMAZON.Corporation",
  "AMAZON.Country",
  "AMAZON.CreativeWorkType",
  "AMAZON.DayOfWeek",
  "AMAZON.DE_CITY",
  "AMAZON.DE_FIRST_NAME",
  "AMAZON.DE_REGION",
  "AMAZON.EUROPE_CITY",
  "AMAZON.FirstName",
  "AMAZON.Food",
  "AMAZON.GB_CITY",
  "AMAZON.GB_FIRST_NAME",
  "AMAZON.GB_REGION",
  "AMAZON.Genre",
  "AMAZON.Language",
  "AMAZON.Month",
  "AMAZON.Movie",
  "AMAZON.Person",
  "AMAZON.Region",
  "AMAZON.Room",
  "AMAZON.Sport",
  "AMAZON.StreetName",
  "AMAZON.US_CITY",
  "AMAZON.US_FIRST_NAME",
  "AMAZON.US_STATE",
  "AMAZON.VideoGame",
]

const SLOT_TYPES_FR_CA = [
  "CUSTOM",
  "AMAZON.Actor",
  "AMAZON.Airline",
  "AMAZON.Airport",
  "AMAZON.Animal",
  "AMAZON.City",
  "AMAZON.Color",
  "AMAZON.Country",
  "AMAZON.CreativeWorkType",
  "AMAZON.DayOfWeek",
  "AMAZON.FirstName",
  "AMAZON.Genre",
  "AMAZON.Language",
  "AMAZON.Month",
  "AMAZON.Person",
  "AMAZON.Region",
  "AMAZON.Room",
  "AMAZON.Sport",
  "AMAZON.StreetName",
  "AMAZON.VideoGame",
]

const SLOT_TYPES_FR = [
  "CUSTOM",
  "AMAZON.Actor",
  "AMAZON.Airline",
  "AMAZON.Airport",
  "AMAZON.Animal",
  "AMAZON.Artist",
  "AMAZON.City",
  "AMAZON.Color",
  "AMAZON.Country",
  "AMAZON.CreativeWorkType",
  "AMAZON.DayOfWeek",
  "AMAZON.FirstName",
  "AMAZON.Food",
  "AMAZON.Genre",
  "AMAZON.Language",
  "AMAZON.Month",
  "AMAZON.Movie",
  "AMAZON.MusicGroup",
  "AMAZON.Musician",
  "AMAZON.Person",
  "AMAZON.Region",
  "AMAZON.Room",
  "AMAZON.Sport",
  "AMAZON.StreetName",
  "AMAZON.VideoGame",
]

const SLOT_TYPES_DE = [
  "CUSTOM",
  "AMAZON.Actor",
  "AMAZON.Airline",
  "AMAZON.Airport",
  "AMAZON.Animal",
  "AMAZON.Artist",
  "AMAZON.AT_CITY",
  "AMAZON.AT_REGION",
  "AMAZON.City",
  "AMAZON.Color",
  "AMAZON.Corporation",
  "AMAZON.Country",
  "AMAZON.CreativeWorkType",
  "AMAZON.DayOfWeek",
  "AMAZON.DE_CITY",
  "AMAZON.DE_FIRST_NAME",
  "AMAZON.DE_REGION",
  "AMAZON.EUROPE_CITY",
  "AMAZON.FirstName",
  "AMAZON.Food",
  "AMAZON.GB_CITY",
  "AMAZON.GB_FIRST_NAME",
  "AMAZON.GB_REGION",
  "AMAZON.Genre",
  "AMAZON.Language",
  "AMAZON.Month",
  "AMAZON.Movie",
  "AMAZON.Person",
  "AMAZON.Region",
  "AMAZON.Room",
  "AMAZON.Sport",
  "AMAZON.StreetName",
  "AMAZON.US_CITY",
  "AMAZON.US_FIRST_NAME",
  "AMAZON.US_STATE",
  "AMAZON.VideoGame",
]

const SLOT_TYPES_IT = [
  "CUSTOM",
  "AMAZON.Actor",
  "AMAZON.Airline",
  "AMAZON.Airport",
  "AMAZON.Animal",
  "AMAZON.City",
  "AMAZON.Color",
  "AMAZON.Country",
  "AMAZON.CreativeWorkType",
  "AMAZON.DayOfWeek",
  "AMAZON.FirstName",
  "AMAZON.Food",
  "AMAZON.Genre",
  "AMAZON.Language",
  "AMAZON.Month",
  "AMAZON.Person",
  "AMAZON.Region",
  "AMAZON.Room",
  "AMAZON.Sport",
  "AMAZON.StreetName",
  "AMAZON.VideoGame",
]

const SLOT_TYPES_JP = [
  "CUSTOM",
  "AMAZON.Ordinal",
  "AMAZON.PhoneNumber"
]

const SLOT_TYPES_ES = [
  "CUSTOM",
  "AMAZON.Actor",
  "AMAZON.Airline",
  "AMAZON.Airport",
  "AMAZON.Animal",
  "AMAZON.City",
  "AMAZON.Color",
  "AMAZON.Country",
  "AMAZON.CreativeWorkType",
  "AMAZON.DayOfWeek",
  "AMAZON.FirstName",
  "AMAZON.Food",
  "AMAZON.Genre",
  "AMAZON.Language",
  "AMAZON.Month",
  "AMAZON.Person",
  "AMAZON.Region",
  "AMAZON.Room",
  "AMAZON.Sport",
  "AMAZON.StreetName",
  "AMAZON.VideoGame",
]

const SLOT_TYPES_MX = [
  "CUSTOM",
  "AMAZON.Actor",
  "AMAZON.Airline",
  "AMAZON.Airport",
  "AMAZON.Animal",
  "AMAZON.City",
  "AMAZON.Color",
  "AMAZON.Country",
  "AMAZON.CreativeWorkType",
  "AMAZON.DayOfWeek",
  "AMAZON.FirstName",
  "AMAZON.Food",
  "AMAZON.Genre",
  "AMAZON.Language",
  "AMAZON.Month",
  "AMAZON.Person",
  "AMAZON.Region",
  "AMAZON.Room",
  "AMAZON.Sport",
  "AMAZON.StreetName",
  "AMAZON.VideoGame",
]

const SLOT_TYPES_MAP = {
  "en-US": SLOT_TYPES_US,
  "en-AU": SLOT_TYPES_AU,
  "en-CA": SLOT_TYPES_CA,
  "en-IN": SLOT_TYPES_IN,
  "en-GB": SLOT_TYPES_UK,
  "fr-CA": SLOT_TYPES_FR_CA,
  "fr-FR": SLOT_TYPES_FR,
  "de-DE": SLOT_TYPES_DE,
  "it-IT": SLOT_TYPES_IT,
  "ja-JP": SLOT_TYPES_JP,
  "es-ES": SLOT_TYPES_ES,
  "es-MX": SLOT_TYPES_MX,
}

 const BUILT_IN_INTENTS = [
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
    { name: "AMAZON.CancelIntent",
      slots: [

      ]
    },
    { name: "AMAZON.FallbackIntent",
      slots: [

      ]
    },
    { name: "AMAZON.HelpIntent",
      slots: [

      ]
    },
    { name: "AMAZON.LoopOffIntent",
      slots: [

      ]
    },
    { name: "AMAZON.LoopOnIntent",
      slots: [

      ]
    },
    { name: "AMAZON.MoreIntent",
      slots: [

      ]
    },
    { name: "AMAZON.NavigateHomeIntent",
      slots: [

      ]
    },
    { name: "AMAZON.NavigateSettingsIntent",
      slots: [

      ]
    },
    { name: "AMAZON.NextIntent",
      slots: [

      ]
    },
    { name: "AMAZON.NoIntent",
      slots: [

      ]
    },
    { name: "AMAZON.PageDownIntent",
      slots: [

      ]
    },
    { name: "AMAZON.PageUpIntent",
      slots: [

      ]
    },
    { name: "AMAZON.PauseIntent",
      slots: [

      ]
    },
    { name: "AMAZON.PreviousIntent",
      slots: [

      ]
    },
    { name: "AMAZON.RepeatIntent",
      slots: [

      ]
    },
    { name: "AMAZON.ResumeIntent",
      slots: [

      ]
    },
    { name: "AMAZON.ScrollDownIntent",
      slots: [

      ]
    },
    { name: "AMAZON.ScrollLeftIntent",
      slots: [

      ]
    },
    { name: "AMAZON.ScrollRightIntent",
      slots: [

      ]
    },
    { name: "AMAZON.ScrollUpIntent",
      slots: [

      ]
    },
    { name: "AMAZON.SelectIntent",
      slots: [
        "Anaphor",
        "ListPosition",
        "PositionRelation",
        "VisualModeTrigger"
      ]
    },
    { name: "AMAZON.ShuffleOffIntent",
      slots: [

      ]
    },
    { name: "AMAZON.ShuffleOnIntent",
      slots: [

      ]
    },
    { name: "AMAZON.StartOverIntent",
      slots: [

      ]
    },
    { name: "AMAZON.StopIntent",
      slots: [

      ]
    },
    { name: "AMAZON.YesIntent",
      slots: [

      ]
    }
]

exports.SLOT_TYPES_MAP = SLOT_TYPES_MAP;
exports.SLOT_TYPES_US = SLOT_TYPES_US;
exports.SLOT_TYPES_AU = SLOT_TYPES_AU;
exports.SLOT_TYPES_CA = SLOT_TYPES_CA;
exports.SLOT_TYPES_IN = SLOT_TYPES_IN;
exports.SLOT_TYPES_UK = SLOT_TYPES_UK;
exports.SLOT_TYPES_FR_CA = SLOT_TYPES_FR_CA;
exports.SLOT_TYPES_FR = SLOT_TYPES_FR;
exports.SLOT_TYPES_DE = SLOT_TYPES_DE;
exports.SLOT_TYPES_IT = SLOT_TYPES_IT;
exports.SLOT_TYPES_JP = SLOT_TYPES_JP;
exports.SLOT_TYPES_ES = SLOT_TYPES_ES;
exports.SLOT_TYPES_MX = SLOT_TYPES_MX;
exports.SLOT_TYPES_UNIVERSAL = SLOT_TYPES_UNIVERSAL;

const VOICES = [
  {
      label: 'Default',
      options: [
          {value: 'Alexa', label: 'Alexa'}
      ]
  },
  {
      label: 'English US',
      options: [
          {value: 'Ivy', label: 'Ivy'},
          {value: 'Joanna', label: 'Joanna'},
          {value: 'Joey', label: 'Joey'},
          {value: 'Justin', label: 'Justin'},
          {value: 'Kendra', label: 'Kendra'},
          {value: 'Kimberly', label: 'Kimberly'},
          {value: 'Matthew', label: 'Matthew'},
          {value: 'Salli', label: 'Salli'},
      ]
  },
  {
      label: 'English AU',
      options: [
          {value: 'Nicole', label: 'Nicole'},
          {value: 'Russell', label: 'Russell'},
      ]
  },
    {
      label: 'English GB',
      options: [
          {value: 'Amy', label: 'Amy'},
          {value: 'Brian', label: 'Brian'},
          {value: 'Emma', label: 'Emma'}
      ]
  },
  {
      label: 'English IN',
      options: [
          {value: 'Aditi', label: 'Aditi'},
          {value: 'Raveena', label: 'Raveena'},
      ]
  },
  {
      label: 'German',
      options: [
          {value: 'Hans', label: 'Hans'},
          {value: 'Marlene', label: 'Marlene'},
          {value: 'Vicki', label: 'Vicki'},
      ]
  },
  {
      label: 'Spanish',
      options: [
          {value: 'Conchita', label: 'Conchita'},
          {value: 'Enrique', label: 'Enrique'},
      ]
  },
  {
      label: 'Italian',
      options: [
          {value: 'Carla', label: 'Carla'},
          {value: 'Giorgio', label: 'Giorgio'},
      ]
  },
  {
      label: 'Japanese',
      options: [
          {value: 'Mizuki', label: 'Mizuki'},
          {value: 'Takumi', label: 'Takumi'},
      ]
  },
  {
      label: 'French',
      options: [
          {value: 'Celine', label: 'Celine'},
          {value: 'Lea', label: 'Lea'},
          {value: 'Mathieu', label: 'Mathieu'},
      ]
  }
]

exports.VOICES = VOICES
exports.BUILT_IN_INTENTS = BUILT_IN_INTENTS;
