import { GlobalConfig } from 'payload'

export const DaycareInfo: GlobalConfig = {
  slug: 'daycare-info',
  label: { en: 'Daycare Information', id: 'Informasi Daycare' },
  admin: {
    group: { en: 'Settings', id: 'Pengaturan' },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: { en: 'Daycare Name', id: 'Nama Daycare' },
    },
    {
      name: 'address',
      type: 'textarea',
      label: { en: 'Address', id: 'Alamat' },
    },
    {
      name: 'phone',
      type: 'text',
      label: { en: 'Phone Number', id: 'Nomor Telepon' },
    },
    {
      name: 'email',
      type: 'email',
      label: { en: 'Email', id: 'Email' },
    },
    {
      name: 'capacity',
      type: 'number',
      label: { en: 'Maximum Child Capacity', id: 'Kapasitas Maksimal Anak' },
      defaultValue: 20,
    },
    {
      name: 'licenseNumber',
      type: 'text',
      label: { en: 'License Number', id: 'Nomor Izin' },
    },
  ],
}
