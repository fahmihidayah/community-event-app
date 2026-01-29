import { GlobalConfig } from 'payload'

export const WorkingHours: GlobalConfig = {
  slug: 'working-hours',
  label: { en: 'Working Hours', id: 'Jam Kerja' },
  admin: {
    group: { en: 'Settings', id: 'Pengaturan' },
    description: {
      en: 'Global working hours and custom daily rules',
      id: 'Jam kerja global dan aturan khusus per hari',
    },
  },
  fields: [
    // DEFAULT GLOBAL TIME
    {
      name: 'defaultSchedule',
      type: 'group',
      label: { en: 'Default Schedule', id: 'Jadwal Default' },
      fields: [
        {
          name: 'startTime',
          type: 'text',
          required: true,
          defaultValue: '07:00',
          label: { en: 'Start Time', id: 'Jam Masuk' },
        },
        {
          name: 'endTime',
          type: 'text',
          required: true,
          defaultValue: '16:00',
          label: { en: 'End Time', id: 'Jam Pulang' },
        },
      ],
    },

    // PER DAY OVERRIDE
    {
      name: 'customRules',
      type: 'array',
      label: { en: 'Custom Daily Rules', id: 'Aturan Khusus Harian' },
      fields: [
        {
          name: 'day',
          type: 'select',
          required: true,
          label: { en: 'Day', id: 'Hari' },
          options: [
            { label: 'Monday / Senin', value: 'monday' },
            { label: 'Tuesday / Selasa', value: 'tuesday' },
            { label: 'Wednesday / Rabu', value: 'wednesday' },
            { label: 'Thursday / Kamis', value: 'thursday' },
            { label: 'Friday / Jumat', value: 'friday' },
            { label: 'Saturday / Sabtu', value: 'saturday' },
            { label: 'Sunday / Minggu', value: 'sunday' },
          ],
        },
        {
          name: 'isWorkingDay',
          type: 'checkbox',
          defaultValue: true,
          label: { en: 'Working Day', id: 'Hari Kerja' },
        },
        {
          name: 'startTime',
          type: 'text',
          defaultValue: '07:00',
          label: { en: 'Start Time', id: 'Jam Masuk' },
        },
        {
          name: 'endTime',
          type: 'text',
          defaultValue: '16:00',
          label: { en: 'End Time', id: 'Jam Pulang' },
        },
      ],
    },
  ],
}
