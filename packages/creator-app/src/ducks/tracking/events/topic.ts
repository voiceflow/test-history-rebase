import client from '@/client';

import { EventName } from '../constants';
import { createDiagramEvent, createProjectEvent, createVersionEventTracker } from '../utils';

export const trackTopicCreated = createVersionEventTracker((eventInfo) =>
  client.analytics.track(createProjectEvent(EventName.TOPIC_CREATED, eventInfo))
);

export const trackTopicDeleted = createVersionEventTracker((eventInfo) =>
  client.analytics.track(createProjectEvent(EventName.TOPIC_DELETED, eventInfo))
);

export const trackTopicConversion = createVersionEventTracker<{ diagramID: string }>((eventInfo) =>
  client.analytics.track(createDiagramEvent(EventName.TOPIC_CONVERSION, eventInfo))
);

export const trackSubtopicCreated = createVersionEventTracker<{ topicID: string }>(({ topicID, ...eventInfo }) =>
  client.analytics.track(createProjectEvent(EventName.TOPIC_CREATED, { ...eventInfo, topic_id: topicID }))
);

export const trackTopicMovedDomain = createVersionEventTracker<{ topicID: string; originDomain: string; destinationDomain: string }>(
  ({ topicID, originDomain, destinationDomain, ...eventInfo }) =>
    client.analytics.track(
      createProjectEvent(EventName.TOPIC_MOVED_DOMAIN, {
        ...eventInfo,
        topic_id: topicID,
        origin_domain: originDomain,
        destination_domain: destinationDomain,
      })
    )
);
