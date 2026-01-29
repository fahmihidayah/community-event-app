import { CollectionConfig } from 'payload'

export const Participant: CollectionConfig = {
  slug: 'participant',
  admin: {
    useAsTitle: 'fullName',
    group: 'Content',
  },
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
      name: 'fullName',
      type: 'text',
      required: true,
    },
    {
      name: 'phoneNumber',
      type: 'text',
    },
    {
      name: 'address',
      type: 'textarea',
    },
    {
      name: 'age',
      type: 'number',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'job',
      type: 'text',
    },

    {
      name: 'event',
      type: 'relationship',
      relationTo: 'event',
      required: true,
    },
    {
      name: 'attendanceStatus',
      type: 'select',
      options: [
        {
          label: 'Hadir',
          value: 'present',
        },
        {
          label: 'Tidak Hadir',
          value: 'absent',
        },
        {
          label: 'Izin',
          value: 'excused',
        },
      ],
      defaultValue: 'absent',
      required: true,
      admin: {
        description: 'Status kehadiran peserta untuk event ini.',
      },
    },
    {
      name: 'attendanceDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'registrationDate',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
}
