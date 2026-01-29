import { GlobalConfig } from 'payload'

export const AttendanceRules: GlobalConfig = {
  slug: 'attendance-rules',
  label: { en: 'Attendance Rules', id: 'Aturan Absensi' },
  admin: {
    group: { en: 'Settings', id: 'Pengaturan' },
    description: {
      en: 'Configure attendance and punctuality rules',
      id: 'Atur aturan absensi dan ketepatan waktu',
    },
  },
  fields: [
    {
      name: 'maxLateMinutes',
      type: 'number',
      required: true,
      label: { en: 'Maximum Late Minutes (before marked Late)', id: 'Maks Menit Terlambat (sebelum ditandai Terlambat)' },
      defaultValue: 15,
      min: 5,
      max: 60,
      admin: {
        description: {
          en: 'Arrival after this many minutes marks attendance as "Late"',
          id: 'Kedatangan setelah menit ini akan ditandai sebagai "Terlambat"',
        },
      },
    },
    {
      name: 'graceMinutes',
      type: 'number',
      label: { en: 'Grace Period (minutes)', id: 'Masa Tenggang (menit)' },
      defaultValue: 5,
      min: 0,
      max: 30,
      admin: {
        description: {
          en: 'Minutes allowed before considered late (no deduction)',
          id: 'Menit yang diperbolehkan sebelum dianggap terlambat (tanpa potongan)',
        },
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'lateDeductionEnabled',
          type: 'checkbox',
          label: { en: 'Enable Late Deduction', id: 'Aktifkan Potongan Terlambat' },
          defaultValue: true,
        },
        {
          name: 'lateDeductionAmount',
          type: 'number',
          label: { en: 'Deduction per Late (minutes)', id: 'Potongan per Terlambat (menit)' },
          defaultValue: 15,
          min: 0,
          admin: {
            description: {
              en: 'Minutes deducted from pay for each late arrival',
              id: 'Menit yang dipotong dari gaji untuk setiap keterlambatan',
            },
            condition: (data) => data.lateDeductionEnabled,
          },
        },
      ],
    },
    {
      name: 'absentDeduction',
      type: 'select',
      required: true,
      label: { en: 'Absent Day Deduction', id: 'Potongan Hari Tidak Hadir' },
      defaultValue: 'full_day',
      options: [
        { label: 'Full Day Pay Deducted / Potong Gaji Seharian', value: 'full_day' },
        { label: 'Half Day Only / Setengah Hari Saja', value: 'half_day' },
        { label: 'No Deduction (Paid Leave) / Tanpa Potongan (Cuti Berbayar)', value: 'none' },
      ],
    },
    {
      name: 'autoMarkAbsent',
      type: 'checkbox',
      label: { en: 'Auto-mark as Absent', id: 'Otomatis Tandai Tidak Hadir' },
      defaultValue: false,
      admin: {
        description: {
          en: 'Automatically mark as absent if no clock-in by end of grace period',
          id: 'Otomatis tandai tidak hadir jika tidak clock-in setelah masa tenggang',
        },
      },
    },
  ],
}
