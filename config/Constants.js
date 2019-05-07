exports.VALID_UTTERANCES = 'a-zA-Z\xC0-\xFF\u0100-\u017F\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\uFF00-\uFF9F\u4E00-\u9FAF\u3400-\u4DBF._\'\\- \\[\\]';

// exports.DEFAULT_INTENTS = [
//   {
//     "name": "AMAZON.CancelIntent",
//     "samples": []
//   },
//   {
//     "name": "AMAZON.HelpIntent",
//     "samples": []
//   },
//   {
//     "name": "AMAZON.StopIntent",
//     "samples": []
//   },
//   {
//     "name": "AMAZON.YesIntent",
//     "samples": []
//   },
//   {
//     "name": "AMAZON.NoIntent",
//     "samples": []
//   }
// ]

exports.INTERFACE_INTENTS = {
  AUDIO_PLAYER: [
    {
      name: 'AMAZON.ResumeIntent',
    },
    {
      name: 'AMAZON.PauseIntent',
    },
  ],
};

exports.BUILT_IN_INTENTS_ALEXA = [
  {
    name: 'AMAZON.AddAction<object@Book,targetCollection@ReadingList>',
    slots: [
      'targetCollection.owner.name',
      'object.inLanguage.type',
      'targetCollection.name',
      'targetCollection.audience.name',
      'object.genre',
      'object.partOfSeries.name',
      'object.type',
      'object.name',
      'object.audience.name',
      'object.sort',
      'object.author.name',
      'targetCollection.type',
    ],
  },
  {
    name: 'AMAZON.AddAction<object@BookSeries,targetCollection@ReadingList>',
    slots: [
      'targetCollection.owner.name',
      'object.name',
      'object.author.name',
      'targetCollection.type',
    ],
  },
  {
    name: 'AMAZON.ChooseAction<object@Book,sourceCollection@ReadingList>',
    slots: [
      'object.type',
      'object.select',
      'sourceCollection.type',
    ],
  },
  {
    name: 'AMAZON.ChooseAction<object@Book>',
    slots: [
      'object.type',
      'object.name',
      'object.select',
      'object.author.name',
    ],
  },
  {
    name: 'AMAZON.DeleteAction<object@Book,sourceCollection@ReadingList>',
    slots: [
      'object.owner.name',
      'object.version.type',
      'object.inLanguage.type',
      'object.select',
      'object.genre',
      'object.type',
      'object.name',
      'sourceCollection.owner.name',
      'sourceCollection.type',
      'sourceCollection.name',
      'object.sort',
      'object.translator.name',
      'object.author.name',
    ],
  },
  {
    name: 'AMAZON.DeleteAction<object@BookSeries,sourceCollection@ReadingList>',
    slots: [
      'object.type',
      'object.name',
      'sourceCollection.owner.name',
      'sourceCollection.type',
    ],
  },
  {
    name: 'AMAZON.PlaybackAction<object@Book>',
    slots: [
      'object.owner.name',
      'object.select',
      'object.contentSource',
      'object.partOfSeries.name',
      'object.type',
      'object.name',
      'object.bookNumber',
      'object.brand.type',
      'object.partOfBookSeries.name',
      'object.sort',
      'object.author.name',
    ],
  },
  {
    name: 'AMAZON.RateAction<object@Book>',
    slots: [
      'rating.ratingValueUnit',
      'object.select',
      'object.partOfSeries.name',
      'object.type',
      'object.name',
      'rating.ratingValue',
      'object.partOfSeries.type',
      'rating.bestRating',
    ],
  },
  {
    name: 'AMAZON.RestartAction<object@Book>',
    slots: [
      'object.owner.name',
      'object.type',
      'object.name',
      'object.select',
      'object.author.name',
    ],
  },
  {
    name: 'AMAZON.ResumeAction<object@Book>',
    slots: [
      'object.owner.name',
      'object.contentSource.owner.name',
      'object.contentSource',
      'object.type',
      'object.name',
      'object.bookNumber',
      'object.brand.type',
    ],
  },
  {
    name: 'AMAZON.SearchAction<object@Book>',
    slots: [
      'object.owner.name',
      'object.genre',
      'object.contentSource',
      'object.type',
      'object.name',
      'sourceCollection.owner.name',
      'object.sort',
      'object.author.name',
      'object.readBy.name',
    ],
  },
  {
    name: 'AMAZON.SearchAction<object@Book[datePublished]>',
    slots: [
      'object.datePublished.type',
      'object.type',
    ],
  },
  {
    name: 'AMAZON.SearchAction<object@Book[numberOfSections]>',
    slots: [
      'object.numberOfSections',
      'object.type',
      'object.hasPart.type',
      'object.numberOfSections.type',
    ],
  },
  {
    name: 'AMAZON.SearchAction<object@Book[position]>',
    slots: [
      'object.type',
    ],
  },
  {
    name: 'AMAZON.StopAction<object@Book>',
    slots: [
      'object.owner.name',
      'object.type',
      'object.name',
    ],
  },
  {
    name: 'AMAZON.SuspendAction<object@Book>',
    slots: [
      'object.owner.name',
      'object.type',
      'duration.name',
    ],
  },
  {
    name: 'AMAZON.ReadAction<object@Calendar>',
    slots: [
      'object.owner.name',
      'object.type',
    ],
  },
  {
    name: 'AMAZON.SearchAction<object@Calendar>',
    slots: [
      'object.owner.name',
      'object.startTime',
      'object.type',
      'object.event.type',
      'object.event.startDate',
    ],
  },
  {
    name: 'AMAZON.ChooseAction<object@ScreeningEvent[location]>',
    slots: [
      'object.location.name',
    ],
  },
  {
    name: 'AMAZON.ChooseAction<object@ScreeningEvent[workPresented]>',
    slots: [
      'object.spatialRelation',
      'object.workPresented.name',
      'object.location.name',
      'object.select',
      'object.location.type',
      'object.startDate',
      'object.type',
      'object.startTime',
      'object.workPresented.character.name',
      'object.workPresented.type',
    ],
  },
  {
    name: 'AMAZON.SearchAction<object@ScreeningEvent>',
    slots: [
      'object.spatialRelation',
      'object.workPresented.name',
      'object.location.name',
      'object.endTime',
      'object.location.type',
      'object.startDate',
      'object.type',
      'object.startTime',
      'object.workPresented.type',
    ],
  },
  {
    name: 'AMAZON.SearchAction<object@ScreeningEvent[location]>',
    slots: [
      'object.spatialRelation',
      'object.workPresented.name',
      'object.location.name',
      'object.location.type',
      'object.startDate',
      'object.workPresented',
      'object.workPresented.type',
    ],
  },
  {
    name: 'AMAZON.SearchAction<object@LocalBusiness>',
    slots: [
      'object.location.addressLocality.name',
      'object.spatialRelation',
      'object.location.name',
      'object.location.type',
      'object.type',
      'object.name',
      'object.aggregateRating',
      'object.toLocation.name',
      'object.fromLocation.type',
      'object.toLocation.addressRegion.name',
      'object.toLocation.addressLocality.name',
    ],
  },
  {
    name: 'AMAZON.SearchAction<object@LocalBusiness[openHours.closes]>',
    slots: [
      'object.location.addressLocality.name',
      'object.spatialRelation',
      'object.location.name',
      'object.openHours.closes',
      'object.type',
      'object.name',
      'object.location.streetAddress.name',
    ],
  },
  {
    name: 'AMAZON.SearchAction<object@LocalBusiness[openHours]>',
    slots: [
      'object.location.addressLocality.name',
      'object.spatialRelation',
      'object.location.name',
      'object.openHours.closes',
      'object.type',
      'object.name',
      'object.location.streetAddress.name',
      'object.location.addressRegion.name',
      'object.openHours.opens',
      'object.openHours.type',
    ],
  },
  {
    name: 'AMAZON.SearchAction<object@LocalBusiness[telephone]>',
    slots: [
      'object.location.addressLocality.name',
      'object.location.name',
      'object.department.telephone.type',
      'object.telephone.type',
      'object.name',
      'object.location.addressRegion.name',
      'object.department.type',
      'object.type',
    ],
  },
  {
    name: 'AMAZON.AddAction<object@MusicCreativeWork,targetCollection@MusicPlaylist>',
    slots: [
      'object.owner.name',
      'targetCollection.owner.name',
      'targetCollection.name',
      'object.byArtist.name',
      'object.type',
      'object.name',
      'object.performedIn.name',
      'object.sort',
      'targetCollection.type',
    ],
  },
  {
    name: 'AMAZON.ChooseAction<object@MusicCreativeWork,sourceCollection@MusicPlaylist>',
    slots: [
      'sourceCollection.type',
      'object.select',
      'object.byArtist.name',
      'object.genre',
      'object.type',
      'sourceCollection.owner.name',
      'sourceCollection.name',
    ],
  },
  {
    name: 'AMAZON.ChooseAction<object@MusicCreativeWork>',
    slots: [
      'object.type',
      'object.sort',
      'object.name',
      'object.genre',
      'object.byArtist.name',
    ],
  },
  {
    name: 'AMAZON.ChooseAction<object@MusicPlaylist>',
    slots: [
      'object.owner.name',
      'object.type',
      'object.name',
    ],
  },
  {
    name: 'AMAZON.CreateAction<object@MusicPlaylist,content@MusicCreativeWork>',
    slots: [
      'content.amount',
      'content.owner.name',
      'content.byArtist.name',
      'object.type',
      'content.type',
      'content.genre',
      'content.inLanguage.name',
    ],
  },
  {
    name: 'AMAZON.CreateAction<object@MusicPlaylist>',
    slots: [
      'object.type',
      'object.name',
    ],
  },
  {
    name: 'AMAZON.DeleteAction<object@MusicCreativeWork,sourceCollection@MusicPlaylist>',
    slots: [
      'sourceCollection.type',
      'object.select',
      'object.byArtist.name',
      'object.genre',
      'object.type',
      'sourceCollection.owner.name',
      'sourceCollection.name',
    ],
  },
  {
    name: 'AMAZON.DeleteAction<object@MusicCreativeWork>',
    slots: [
      'sourceCollection.type',
      'object.type',
      'object.genre',
      'object.byArtist.name',
      'sourceCollection.name',
    ],
  },
  {
    name: 'AMAZON.DeleteAction<object@MusicPlaylist,sourceCollection@Catalog>',
    slots: [
      'sourceCollection.owner.name',
      'object.type',
      'object.select',
      'sourceCollection.type',
    ],
  },
  {
    name: 'AMAZON.DeleteAction<object@MusicPlaylist>',
    slots: [
      'object.owner.name',
      'object.type',
      'object.name',
      'object.tracks.byArtist.name',
      'object.tracks.type',
      'object.dateCreated.type',
      'object.sort',
      'object.tracks.genre',
    ],
  },
  {
    name: 'AMAZON.LikeAction<object@Musician>',
    slots: [
      'object.userPreference.type',
      'object.type',
    ],
  },
  {
    name: 'AMAZON.PlaybackAction<object@MusicCreativeWork>',
    slots: [
      'object.owner.name',
      'object.select',
      'object.byArtist.name',
      'object.genre',
      'object.contentSource',
      'object.composer.name',
      'object.name',
      'object.era',
      'object.sort',
      'object.type',
    ],
  },
  {
    name: 'AMAZON.PlaybackAction<object@MusicPlaylist>',
    slots: [
      'object.owner.name',
      'object.type',
      'object.name',
      'mode.name',
    ],
  },
  {
    name: 'AMAZON.RepeatAction<object@MusicCreativeWork>',
    slots: [
      'object.type',
    ],
  },
  {
    name: 'AMAZON.ResumeAction<object@MusicCreativeWork>',
    slots: [
      'object.type',
    ],
  },
  {
    name: 'AMAZON.SearchAction<object@MusicCreativeWork>',
    slots: [
      'object.owner.name',
      'object.select',
      'object.genre',
      'object.byArtist.name',
      'object.contentSource',
      'object.type',
      'object.name',
      'object.byArtist',
      'object.contentSource.owner.name',
      'object.inAlbum.type',
      'object.inLanguage.name',
      'object.contentSource.type',
      'object.sort',
      'object.contentSource.name',
    ],
  },
  {
    name: 'AMAZON.SearchAction<object@MusicCreativeWork[byArtist]>',
    slots: [
      'object.byArtist.type',
    ],
  },
  {
    name: 'AMAZON.SearchAction<object@MusicGroup>',
    slots: [
      'object.name',
    ],
  },
  {
    name: 'AMAZON.SearchAction<object@MusicGroup[musicGroupMember]>',
    slots: [
      'object.type',
      'object.musicGroupMember.type',
    ],
  },
  {
    name: 'AMAZON.SearchAction<object@MusicPlaylist[tracks]>',
    slots: [
      'sourceCollection.type',
      'object.tracks.type',
    ],
  },
  {
    name: 'AMAZON.SearchAction<object@MusicRecording[byArtist.musicGroupMember]>',
    slots: [
      'object.byArtist.musicGroupMember.type',
    ],
  },
  {
    name: 'AMAZON.SearchAction<object@MusicRecording[byArtist]>',
    slots: [
      'object.type',
      'object.byArtist.type',
    ],
  },
  {
    name: 'AMAZON.SearchAction<object@MusicRecording[duration]>',
    slots: [
      'object.type',
      'object.duration.type',
    ],
  },
  {
    name: 'AMAZON.SearchAction<object@MusicRecording[inAlbum]>',
    slots: [
      'object.inAlbum.type',
      'object.type',
    ],
  },
  {
    name: 'AMAZON.SearchAction<object@MusicRecording[producer]>',
    slots: [
      'object.type',
      'object.producer.type',
    ],
  },
  {
    name: 'AMAZON.SearchAction<object@VideoCreativeWork[musicBy]>',
    slots: [
      'object.contains.type',
      'object.name',
    ],
  },
  {
    name: 'AMAZON.StartAction<object@MusicCreativeWork>',
    slots: [
      'object.type',
      'object.select',
    ],
  },
  {
    name: 'AMAZON.StopAction<object@MusicCreativeWork>',
    slots: [
      'object.type',
    ],
  },
  {
    name: 'AMAZON.SuspendAction<object@MusicCreativeWork>',
    slots: [
      'object.type',
    ],
  },
  {
    name: 'AMAZON.ChooseAction<object@VideoCreativeWork,sourceCollection@VideoPlaylist>',
    slots: [
      'sourceCollection',
      'sourceCollection.type',
      'object.name',
      'object.select',
    ],
  },
  {
    name: 'AMAZON.ChooseAction<object@VideoCreativeWork>',
    slots: [
      'object.character.name',
      'object.type',
      'object.select',
      'object.genre',
      'object.byArtist.name',
    ],
  },
  {
    name: 'AMAZON.CloseAction<object@VideoCreativeWork>',
    slots: [
      'object.owner.name',
      'object.type',
    ],
  },
  {
    name: 'AMAZON.DislikeAction<object@VideoCreativeWork>',
    slots: [
      'object.type',
      'object.name',
    ],
  },
  {
    name: 'AMAZON.ExitAction<object@VideoPlaylist>',
    slots: [
      'object.type',
      'object.name',
    ],
  },
  {
    name: 'AMAZON.LikeAction<object@VideoCreativeWork>',
    slots: [
      'object.type',
      'object.name',
    ],
  },
  {
    name: 'AMAZON.PlaybackAction<object@VideoCreativeWork>',
    slots: [
      'object.partOfSeries.name',
      'object.type',
      'object.name',
      'object.select',
    ],
  },
  {
    name: 'AMAZON.RateAction<object@VideoCreativeWork>',
    slots: [
      'rating.ratingValueUnit',
      'object.select',
      'object.type',
      'object.name',
      'rating.ratingValue',
      'rating.bestRating',
    ],
  },
  {
    name: 'AMAZON.RestartAction<object@VideoCreativeWork>',
    slots: [
      'object.type',
      'object.select',
    ],
  },
  {
    name: 'AMAZON.ResumeAction<object@VideoCreativeWork>',
    slots: [
      'object.owner.name',
      'object.type',
      'object.name',
    ],
  },
  {
    name: 'AMAZON.SearchAction<object@VideoCreativeWork,sourceCollection@VideoPlaylist>',
    slots: [
      'object.type',
      'object.name',
      'sourceCollection.owner.name',
      'sourceCollection.name',
    ],
  },
  {
    name: 'AMAZON.SearchAction<object@VideoCreativeWork>',
    slots: [
      'object.name',
      'object.startDate',
      'object.character.name',
      'object.partOfSeries.name',
      'object.actor.name',
      'object.actor.gender',
      'object.contentSource',
      'object.type',
      'object.personAssociatedWith.name',
      'object.contentRating.type',
      'object.about.type',
      'object.recordedAt.type',
      'object.owner.name',
      'object.inLanguage.type',
      'object.genre',
      'object.sentiment.type',
      'object.about.name',
      'object.director.name',
      'object.sort',
      'object.audience.type',
      'object.aggregatePopularity',
      'object.select',
      'object.partOfSeries.select',
      'object.actor.type',
      'sourceCollection.contentSource',
    ],
  },
  {
    name: 'AMAZON.SearchAction<object@VideoCreativeWork[actor]>',
    slots: [
      'object.type',
      'object.name',
      'object.actor.type',
    ],
  },
  {
    name: 'AMAZON.SearchAction<object@VideoCreativeWork[audience]>',
    slots: [
      'object.type',
      'object.audience.type',
      'object.name',
    ],
  },
  {
    name: 'AMAZON.SearchAction<object@VideoCreativeWork[contentRating]>',
    slots: [
      'object.name',
    ],
  },
  {
    name: 'AMAZON.SearchAction<object@VideoCreativeWork[dateReleased]>',
    slots: [
      'object.name',
    ],
  },
  {
    name: 'AMAZON.SearchAction<object@VideoCreativeWork[description]>',
    slots: [
      'object.name',
      'object.description.type',
    ],
  },
  {
    name: 'AMAZON.SearchAction<object@VideoCreativeWork[director]>',
    slots: [
      'object.type',
      'object.name',
    ],
  },
  {
    name: 'AMAZON.SearchAction<object@VideoCreativeWork[genre]>',
    slots: [
      'object.genre.type',
      'object.type',
    ],
  },
  {
    name: 'AMAZON.SearchAction<object@VideoCreativeWork[name]>',
    slots: [
      'object.type',
    ],
  },
  {
    name: 'AMAZON.StopAction<object@VideoCreativeWork>',
    slots: [
      'object.quantity',
      'object.type',
    ],
  },
  {
    name: 'AMAZON.SuspendAction<object@VideoCreativeWork>',
    slots: [
      'object.type',
      'duration.name',
    ],
  },
  {
    name: 'AMAZON.WatchAction<object@VideoCreativeWork>',
    slots: [
      'object.partOfSeries.type',
      'object.type',
      'object.select',
    ],
  },
  {
    name: 'AMAZON.SearchAction<object@WeatherForecast>',
    slots: [
      'object.location.addressLocality.name',
      'object.location.addressCountry.name',
      'object.weatherCondition.name',
      'object.startDate',
      'object.duration',
      'object.location.addressRegion.name',
      'object.startTime',
      'object.type',
    ],
  },
  {
    name: 'AMAZON.SearchAction<object@WeatherForecast[temperature]>',
    slots: [
      'object.location.addressLocality.name',
      'object.location.addressCountry.name',
      'object.weatherCondition.name',
      'object.startDate',
      'object.duration',
      'object.location.addressRegion.name',
      'object.startTime',
      'object.temperature.type',
      'object.type',
    ],
  },
  {
    name: 'AMAZON.SearchAction<object@WeatherForecast[weatherCondition]>',
    slots: [
      'object.location.addressLocality.name',
      'object.spatialRelation',
      'object.location.addressCountry.name',
      'object.weatherCondition.name',
      'object.startDate',
      'object.duration',
      'object.location.addressRegion.name',
      'object.startTime',
      'object.type',
    ],
  },
  {
    name: 'AMAZON.ActivateAction<object@PlaybackMode>',
    slots: [
      'object.name',
    ],
  },
  {
    name: 'AMAZON.AddAction<object@Event>',
    slots: [
      'object.owner.name',
      'targetCollection.owner.name',
      'object.startDate',
      'object.type',
      'object.name',
      'object.startTime',
      'object.attendee.name',
      'object.description.type',
      'targetCollection.type',
      'object.event.type',
    ],
  },
  {
    name: 'AMAZON.ChooseAction<object@CreativeWork>',
    slots: [
      'sourceCollection.type',
      'object.name',
    ],
  },
  {
    name: 'AMAZON.ChooseAction<object@Event>',
    slots: [
      'object.owner.name',
      'object.performer.name',
      'sourceCollection.type',
      'object.select',
      'object.startDate',
      'object.type',
      'object.name',
      'sourceCollection.owner.name',
      'object.location.addressRegion.name',
      'object.startTime',
      'object.attendee.name',
    ],
  },
  {
    name: 'AMAZON.CloseAction<object@CreativeWorkSection>',
    slots: [
      'object.type',
    ],
  },
  {
    name: 'AMAZON.CloseAction<object@Thing>',
    slots: [
      'object.quantity',
      'object.location.name',
    ],
  },
  {
    name: 'AMAZON.CreateAction<object@ReadingList>',
    slots: [
      'object.name',
    ],
  },
  {
    name: 'AMAZON.DeactivateAction<object@PlaybackMode>',
    slots: [
      'object.name',
    ],
  },
  {
    name: 'AMAZON.DeactivateAction<object@Thing>',
    slots: [
      'object.quantity',
    ],
  },
  {
    name: 'AMAZON.DeleteAction<object@Event>',
    slots: [
      'object.owner.name',
      'sourceCollection.type',
      'object.select',
      'object.startDate',
      'object.type',
      'object.name',
      'sourceCollection.owner.name',
      'object.startTime',
    ],
  },
  {
    name: 'AMAZON.DeleteAction<object@ReadingList>',
    slots: [
      'object.owner.name',
      'object.itemListElement',
      'object.name',
      'object.sort',
    ],
  },
  {
    name: 'AMAZON.DeleteAction<object@Thing>',
    slots: [
      'amount.quantity',
      'sourceCollection.owner.name',
      'sourceCollection.type',
    ],
  },
  {
    name: 'AMAZON.ExitAction<object@Episode>',
    slots: [
      'object.type',
      'object.isPartOfTVSeries.name',
    ],
  },
  {
    name: 'AMAZON.IgnoreAction<object@Thing>',
    slots: [

    ],
  },
  {
    name: 'AMAZON.MuteAction<object@Thing>',
    slots: [

    ],
  },
  {
    name: 'AMAZON.PlaybackAction<object@CreativeWorkSection>',
    slots: [
      'object.type',
      'object.select',
    ],
  },
  {
    name: 'AMAZON.PlaybackAction<object@Episode>',
    slots: [
      'object.select',
      'object.hasPart',
      'object.partOfSeries.name',
      'object.type',
      'object.name',
      'object.partOfSeries.type',
      'object.quantity',
      'object.partOfTVSeries.name',
      'object.sort',
    ],
  },
  {
    name: 'AMAZON.PlaybackAction<object@TVSeason>',
    slots: [
      'object.partOfTVSeries.name',
      'object.type',
      'object.select',
    ],
  },
  {
    name: 'AMAZON.PlaybackAction<object@TVSeries>',
    slots: [
      'object.name',
    ],
  },
  {
    name: 'AMAZON.ReplaceAction<object@Event>',
    slots: [
      'object.owner.name',
      'replaceThis.startDate',
      'replaceWith.startTime',
      'replaceThis.name.type',
      'object.startDate',
      'object.namee',
      'object.type',
      'object.name',
      'replaceWith.startDate',
      'replaceThis.location.type',
      'replaceWith.location.streetAddress.name',
      'replaceThis.startTime',
      'object.attendee.name',
      'replaceThis.startTime.type',
      'replaceWith.duration',
      'target.startDate',
      'replaceWith.name',
      'object.sort',
      'replaceWith.location.name',
      'replaceThis.duration',
      'replaceThis.startDate.type',
    ],
  },
  {
    name: 'AMAZON.RestartAction<object@CreativeWorkSection>',
    slots: [
      'object.type',
      'object.select',
      'object.sectionNumber',
    ],
  },
  {
    name: 'AMAZON.ResumeAction<object@CreativeWorkSection>',
    slots: [
      'object.type',
      'object.sectionNumber',
    ],
  },
  {
    name: 'AMAZON.ResumeAction<object@TVSeries>',
    slots: [
      'object.type',
      'object.name',
    ],
  },
  {
    name: 'AMAZON.SearchAction<object@Actor>',
    slots: [
      'object.type',
    ],
  },
  {
    name: 'AMAZON.SearchAction<object@CreativeWork>',
    slots: [
      'object.name',
    ],
  },
  {
    name: 'AMAZON.SearchAction<object@CreativeWork[name]>',
    slots: [
      'object.type',
      'object.name',
    ],
  },
  {
    name: 'AMAZON.SearchAction<object@CreativeWorkSection>',
    slots: [
      'object.type',
    ],
  },
  {
    name: 'AMAZON.SearchAction<object@CreativeWorkSection[name]>',
    slots: [
      'object.type',
    ],
  },
  {
    name: 'AMAZON.SearchAction<object@Episode>',
    slots: [
      'object.partOfTVSeries.name',
      'object.type',
      'object.partOfSeason.type',
      'object.isPartOf.seasonNumber',
      'object.episode.type',
      'object.sort',
    ],
  },
  {
    name: 'AMAZON.SearchAction<object@Episode[description]>',
    slots: [
      'object.datePublished',
      'object.type',
    ],
  },
  {
    name: 'AMAZON.SearchAction<object@Event>',
    slots: [
      'object.owner.name',
      'sourceCollection.type',
      'object.select',
      'object.startDate',
      'object.eventStatus.type',
      'object.startTime',
      'object.type',
    ],
  },
  {
    name: 'AMAZON.SearchAction<object@Event[eventStatus]>',
    slots: [
      'object.owner.name',
      'object.startTime',
      'object.eventStatus.type',
      'object.select',
      'object.type',
    ],
  },
  {
    name: 'AMAZON.SearchAction<object@Event[location]>',
    slots: [
      'object.owner.name',
      'object.type',
      'object.name',
      'object.startDate',
    ],
  },
  {
    name: 'AMAZON.SearchAction<object@Event[startDate]>',
    slots: [
      'object.owner.name',
      'object.location.name',
      'object.select',
      'object.location.type',
      'object.startDate',
      'object.type',
      'object.name',
      'object.attendee.name',
    ],
  },
  {
    name: 'AMAZON.SearchAction<object@Singer>',
    slots: [
      'object.type',
    ],
  },
  {
    name: 'AMAZON.StartAction<object@CreativeWorkSection>',
    slots: [
      'object.type',
      'object.select',
    ],
  },
  {
    name: 'AMAZON.SuspendAction<object@CreativeWorkSection>',
    slots: [
      'object.type',
    ],
  },
  {
    name: 'AMAZON.SuspendAction<object@Episode>',
    slots: [
      'object.type',
    ],
  },
  {
    name: 'AMAZON.WatchAction<object@Episode>',
    slots: [
      'object.partOfTVSeries.name',
      'object.type',
      'object.select',
    ],
  },
  {
    name: 'AMAZON.CancelIntent',
    slots: [

    ],
  },
  {
    name: 'AMAZON.FallbackIntent',
    slots: [

    ],
  },
  {
    name: 'AMAZON.HelpIntent',
    slots: [

    ],
  },
  {
    name: 'AMAZON.LoopOffIntent',
    slots: [

    ],
  },
  {
    name: 'AMAZON.LoopOnIntent',
    slots: [

    ],
  },
  {
    name: 'AMAZON.MoreIntent',
    slots: [

    ],
  },
  {
    name: 'AMAZON.NavigateHomeIntent',
    slots: [

    ],
  },
  {
    name: 'AMAZON.NavigateSettingsIntent',
    slots: [

    ],
  },
  {
    name: 'AMAZON.NextIntent',
    slots: [

    ],
  },
  {
    name: 'AMAZON.NoIntent',
    slots: [

    ],
  },
  {
    name: 'AMAZON.PageDownIntent',
    slots: [

    ],
  },
  {
    name: 'AMAZON.PageUpIntent',
    slots: [

    ],
  },
  {
    name: 'AMAZON.PauseIntent',
    slots: [

    ],
  },
  {
    name: 'AMAZON.PreviousIntent',
    slots: [

    ],
  },
  {
    name: 'AMAZON.RepeatIntent',
    slots: [

    ],
  },
  {
    name: 'AMAZON.ResumeIntent',
    slots: [

    ],
  },
  {
    name: 'AMAZON.ScrollDownIntent',
    slots: [

    ],
  },
  {
    name: 'AMAZON.ScrollLeftIntent',
    slots: [

    ],
  },
  {
    name: 'AMAZON.ScrollRightIntent',
    slots: [

    ],
  },
  {
    name: 'AMAZON.ScrollUpIntent',
    slots: [

    ],
  },
  {
    name: 'AMAZON.SelectIntent',
    slots: [
      'Anaphor',
      'ListPosition',
      'PositionRelation',
      'VisualModeTrigger',
    ],
  },
  {
    name: 'AMAZON.ShuffleOffIntent',
    slots: [

    ],
  },
  {
    name: 'AMAZON.ShuffleOnIntent',
    slots: [

    ],
  },
  {
    name: 'AMAZON.StartOverIntent',
    slots: [

    ],
  },
  {
    name: 'AMAZON.StopIntent',
    slots: [

    ],
  },
  {
    name: 'AMAZON.YesIntent',
    slots: [

    ],
  },
];

exports.DEFAULT_INTENTS = {
  // English (AU,CA,US,UK,IN)
  en: {
    defaults: [{
      name: 'AMAZON.CancelIntent',
      samples: ['cancel'],
    },
    {
      name: 'AMAZON.HelpIntent',
      samples: ['help'],
    },
    {
      name: 'AMAZON.StopIntent',
      samples: ['stop'],
    },
    {
      name: 'AMAZON.YesIntent',
      samples: ['yes', 'yea', 'ok', 'okay', 'yup', 'ya', 'sure'],
      keep: ['yes'],
    },
    {
      name: 'AMAZON.NoIntent',
      samples: ['no', 'nope', 'nay', 'nah', 'no way', 'negative'],
    },
    ],
    built_ins: [
      {
        name: 'AMAZON.RepeatIntent',
        samples: ['repeat', 'again', 'say again'],
      },
    ],
  },
  // French (CA,FR)
  fr: {
    defaults: [{
      name: 'AMAZON.CancelIntent',
      samples: ['annuler', 'annule'],
    },
    {
      name: 'AMAZON.HelpIntent',
      samples: ['aidez-moi', 'aider', 'aide', 'aide moi', 'assistance', 'j\'ai besoin d\'aide', 'je ne comprends pas'],
    },
    {
      name: 'AMAZON.StopIntent',
      samples: ['s\'arrêter', 'arrêter', 'arrête', 'stop', 'fin', 'cesser', 'mettre fin', 'stopper', 'mettre un terme', 'interrompre'],
    },
    {
      name: 'AMAZON.YesIntent',
      samples: ['oui', 'yep', 'ok', 'bien sûr', 'ouais', 'ouaip', 'exactement', 'correct', 'okay', 'd\'accord'],
      keep: ['oui'],
    },
    {
      name: 'AMAZON.NoIntent',
      samples: ['non', 'nan', 'absolument pas', 'hors de question', 'bien sûr que non'],
    },
    ],
    built_ins: [
      {
        name: 'AMAZON.RepeatIntent',
        samples: ['repeat', 'est-ce que tu peux répéter', 'répète', 'tu peux répéter', 'dis-le à nouveau', 'tu peux le redire', 'redire ça', 'répéter ça'],
      },
    ],
  },
  // Japanese (JA)
  ja: {
    defaults: [{
      name: 'AMAZON.CancelIntent',
      samples: ['取り消す', 'キャンセル', '取り消し', '取消'],
    },
    {
      name: 'AMAZON.HelpIntent',
      samples: ['助ける', '手伝う', 'アシスト', '裏付ける', '手助け', '手伝い', '救済', '応援', '助', '手伝', '救い', '力添え', '扶助', '加勢', '援護', '佐', '介添え'],
    },
    {
      name: 'AMAZON.StopIntent',
      samples: ['止める', '立ち止まる', '止む', '打ち切る', '停める', '留める', '阻む', '途絶える', '句切る', '停まる', 'ストップ', '終止', '停留', '止まること'],
    },
    {
      name: 'AMAZON.YesIntent',
      samples: ['yes', 'はい', 'ええ', 'そうです'],
      keep: ['はい'],
    },
    {
      name: 'AMAZON.NoIntent',
      samples: ['no', 'いいえ', 'そうだはない', 'いやそれどころか', 'ノン', '否', '否や'],
    },
    ],
    built_ins: [
      {
        name: 'AMAZON.RepeatIntent',
        samples: ['repeat', '繰り返す', '引き返す', '折れ返る', '返す'],
      },
    ],
  },
  // Italian (IT)
  it: {
    defaults: [{
      name: 'AMAZON.CancelIntent',
      samples: ['cancellare', 'annullare', 'disdire', 'sopprimere', 'rescindre', 'chiudere', 'abrogare', 'obliterare'],
    },
    {
      name: 'AMAZON.HelpIntent',
      samples: ['la assistenza', 'il aiuto', 'il soccorso', 'lo manforte', 'la persona di servizio', 'aiutare', 'fare a meno di', 'contribuire a', 'assistere', 'servire'],
    },
    {
      name: 'AMAZON.StopIntent',
      samples: ['la fermata', 'il fermo', 'lo stop', 'la sosta', 'la tappa', 'fermare', 'interrompere', 'smettere', 'fermarsi', 'arrestare', 'cessare', 'sostare', 'finire', 'stoppare', 'fare una fermata'],
    },
    {
      name: 'AMAZON.YesIntent',
      samples: ['yes', 'si', 'certo'],
      keep: ['si'],
    },
    {
      name: 'AMAZON.NoIntent',
      samples: ['il no', 'no', 'il rifiuto', 'la negazione', 'nessuno'],
    },
    ],
    built_ins: [
      {
        name: 'AMAZON.RepeatIntent',
        samples: ['repeat', '繰り返す', '引き返す', '折れ返る', '返す'],
      },
    ],
  },
  // Spanish (ES,MX)
  es: {
    defaults: [{
      name: 'AMAZON.CancelIntent',
      samples: ['cancelar', 'anular', 'suprimir', 'abolir', 'dar anulación', 'realizar anulación', 'hacer anulación', 'hacer dar anulación', 'noun la cancelación', 'la anulación'],
    },
    {
      name: 'AMAZON.HelpIntent',
      samples: ['la ayuda', 'el favor', 'ei auxilio', 'el socorro', 'el empleado', 'la criada', 'ayudar', 'servir', 'auxiliar', 'socorrer'],
    },
    {
      name: 'AMAZON.StopIntent',
      samples: ['detener', 'dejar', 'parar', 'suspender', 'cesar', 'pararse', 'terminar', 'de alto'],
    },
    {
      name: 'AMAZON.YesIntent',
      samples: ['yes', 'si', 'sí', 'decir si'],
      keep: ['sí'],
    },
    {
      name: 'AMAZON.NoIntent',
      samples: ['no', 'ninguno', 'imposible', 'prohibido', 'la negativa', 'el voto negativo', 'el voto en contra'],
    },
    ],
    built_ins: [
      {
        name: 'AMAZON.RepeatIntent',
        samples: ['repeat', 'repetir', 'repetirse', 'reiterar', 'recitar', 'volver a dar'],
      },
    ],
  },
  // German (DE)
  de: {
    defaults: [
      {
        name: 'AMAZON.CancelIntent',
        samples: ['stornieren', 'aufheben', 'kündigen', 'annullieren', 'beenden', 'absagen', 'abbestellen', 'abmelden', 'auflösen', 'zurücknehmen'],
      },
      {
        name: 'AMAZON.HelpIntent',
        samples: ['die hilfe', 'der beistand', 'die aushilfe', 'helfen', 'beitragen', 'behilflich sein', 'hilfe leisten'],
      },
      {
        name: 'AMAZON.StopIntent',
        samples: ['der stopp', 'der anschlag', 'die haltestelle', 'der registerzug', 'stoppen', 'aufhören', 'beenden', 'anhalten', 'halten', 'verhindern', 'aufhalten', 'unterbrechen', 'abbrechen', 'unterbinden', 'einstellen', 'abbestellen', 'absetzen'],
      },
      {
        name: 'AMAZON.YesIntent',
        samples: ['yes', 'ja', 'doch', 'jawohl'],
        keep: ['ja'],
      },
      {
        name: 'AMAZON.NoIntent',
        samples: ['no', 'nein', 'kein', 'nicht'],
      },
    ],
    built_ins: [
      {
        name: 'AMAZON.RepeatIntent',
        samples: ['repeat', 'wiederholen', 'wiedergeben', 'repetieren', 'weitersagen'],
      },
    ],
  },
  // Portuguese (PT)
  pt: {
    defaults: [
      {
        name: 'AMAZON.CancelIntent',
        samples: ['cancelar', 'anular', 'suspender'],
      },
      {
        name: 'AMAZON.HelpIntent',
        samples: ['ajudar', 'socorrer', 'auxiliar'],
      },
      {
        name: 'AMAZON.StopIntent',
        samples: ['parar', 'terminar', 'impedir', 'fazer parar'],
      },
      {
        name: 'AMAZON.YesIntent',
        samples: ['yes', 'sim', 'o sim', 'dizer sim'],
        keep: ['sim'],
      },
      {
        name: 'AMAZON.NoIntent',
        samples: ['no', 'não', 'negativa'],
      },
    ],
    built_ins: [
      {
        name: 'AMAZON.RepeatIntent',
        samples: ['repeat', 'repetir', 'reiterar', 'refazer', 'amiudar', 'recitar de cor'],
      },
    ],
  },
};

exports.CATCH_ALL_INTENT = {
  name: 'VoiceFlowIntent',
  samples: [
    'voice flow',
    'voiceflow',
  ],
};
