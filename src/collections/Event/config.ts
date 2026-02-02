import { CollectionConfig } from 'payload'
import { downloadPresentParticipantCsv, getAllParticipants, getParticipantCount } from './endpoints'

export const Event: CollectionConfig = {
  slug: 'event',
  admin: {
    useAsTitle: 'name',
    group: 'Content',
  },
  endpoints: [
    {
      method: 'get',
      path: '/:id/participants',
      handler: getAllParticipants,
    },
    {
      method: 'get',
      path: '/:id/participants/:status',
      handler: getParticipantCount,
    },
    {
      method : 'get',
      path : '/:id/participants/download',
      handler : downloadPresentParticipantCsv
    }
  ],
  fields: [
    {
      name: 'id',
      type: 'text',
      defaultValue: () => crypto.randomUUID(),
      admin: {
        hidden: true,
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'location',
      type: 'text',
    },
  ],
}
