import { GlobalConfig } from 'payload'

export const SalarySettings: GlobalConfig = {
  slug: 'salary-settings',
  label: { en: 'Salary & Payroll Settings', id: 'Pengaturan Gaji & Penggajian' },
  admin: {
    group: { en: 'Settings', id: 'Pengaturan' },
    description: {
      en: 'Global payroll rules and default salary components',
      id: 'Aturan global payroll dan komponen gaji default',
    },
  },
  fields: [
    // ===========================
    // Salary Calculation Mode
    // ===========================
    {
      name: 'salaryCalculation',
      type: 'select',
      required: true,
      label: { en: 'Salary Calculation Method', id: 'Metode Perhitungan Gaji' },
      defaultValue: 'hourly',
      options: [
        { label: 'Hourly Rate / Per Jam', value: 'hourly' },
        { label: 'Monthly Fixed Salary / Bulanan', value: 'monthly' },
      ],
    },

    // ===========================
    // EARNINGS CONFIG
    // ===========================
    {
      type: 'tabs',
      // label: { en: 'Earnings Settings', id: 'Pengaturan Penambah Gaji' },
      tabs: [
        {
          label: { en: 'Earning Settings', id: 'Pengaturan Penambah Gaji' },
          name: 'earningsTab',
          fields: [
            {
              name: 'dailyAllowances',
              type: 'array',
              label: { en: 'Daily Allowances', id: 'Tunjangan Harian' },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  label: { en: 'Allowance Name', id: 'Nama Tunjangan' },
                },
                {
                  name: 'amount',
                  type: 'number',
                  required: true,
                  label: { en: 'Amount per Day', id: 'Nominal per Hari' },
                },
                {
                  name: 'active',
                  type: 'checkbox',
                  defaultValue: true,
                  label: { en: 'Active', id: 'Aktif' },
                },
              ],
            },

            // Overtime Rules
            {
              name: 'overtime',
              type: 'group',
              label: { en: 'Overtime Rules', id: 'Aturan Lembur' },
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: true,
                  label: { en: 'Enable Overtime', id: 'Aktifkan Lembur' },
                },
                {
                  name: 'defaultOvertimeRule',
                  type: 'group',
                  label: { en: 'Default Overtime Rule', id: 'Aturan Lembur Default' },
                  fields: [
                    {
                      name: 'calculationType',
                      type: 'select',
                      required: true,
                      defaultValue: 'multiplier',
                      dbName: 'calc_type',
                      options: [
                        { label: 'Multiplier / Pengali', value: 'multiplier' },
                        { label: 'Percentage / Persentase', value: 'percentage' },
                        { label: 'Fixed Amount / Nominal Tetap', value: 'fixed' },
                      ],
                      label: { en: 'Calculation Type', id: 'Tipe Perhitungan' },
                    },
                    {
                      name: 'multiplier',
                      type: 'number',
                      defaultValue: 1.5,
                      min: 1,
                      max: 5,
                      label: { en: 'Multiplier', id: 'Pengali' },
                      admin: {
                        description: {
                          en: 'Used when type is Multiplier',
                          id: 'Digunakan ketika tipe adalah Pengali',
                        },
                        condition: (_data, siblingData) =>
                          siblingData?.calculationType === 'multiplier',
                      },
                    },
                    {
                      name: 'percentage',
                      type: 'number',
                      defaultValue: 50,
                      min: 0,
                      max: 500,
                      label: { en: 'Percentage (%)', id: 'Persentase (%)' },
                      admin: {
                        description: {
                          en: 'Used when type is Percentage',
                          id: 'Digunakan ketika tipe adalah Persentase',
                        },
                        condition: (_data, siblingData) =>
                          siblingData?.calculationType === 'percentage',
                      },
                    },
                    {
                      name: 'rateType',
                      type: 'select',
                      defaultValue: 'per_hour',
                      dbName: 'rate_type',
                      options: [
                        { label: 'Per Hour / Per Jam', value: 'per_hour' },
                        { label: 'Per Minute / Per Menit', value: 'per_minute' },
                      ],
                      label: { en: 'Rate Type', id: 'Tipe Tarif' },
                      admin: {
                        description: {
                          en: 'Used when type is Fixed Amount',
                          id: 'Digunakan ketika tipe adalah Nominal Tetap',
                        },
                        condition: (_data, siblingData) => siblingData?.calculationType === 'fixed',
                      },
                    },
                    {
                      name: 'fixedAmount',
                      type: 'number',
                      defaultValue: 10000,
                      min: 0,
                      label: { en: 'Fixed Amount (IDR)', id: 'Nominal Tetap (IDR)' },
                      admin: {
                        description: {
                          en: 'Used when type is Fixed Amount',
                          id: 'Digunakan ketika tipe adalah Nominal Tetap',
                        },
                        condition: (_data, siblingData) => siblingData?.calculationType === 'fixed',
                      },
                    },
                  ],
                },
                {
                  name: 'specialDayRules',
                  type: 'array',
                  label: { en: 'Special Day Overtime Rules', id: 'Aturan Hari Khusus' },
                  dbName: 'ot_special_rules',
                  fields: [
                    {
                      name: 'dayType',
                      type: 'select',
                      dbName: 'day_type',
                      options: [
                        { label: 'Weekend', value: 'weekend' },
                        { label: 'Holiday', value: 'holiday' },
                      ],
                      label: { en: 'Day Type', id: 'Jenis Hari' },
                    },
                    {
                      name: 'calculationType',
                      type: 'select',
                      required: true,
                      defaultValue: 'multiplier',
                      dbName: 'calc_type',
                      options: [
                        { label: 'Multiplier / Pengali', value: 'multiplier' },
                        { label: 'Percentage / Persentase', value: 'percentage' },
                        { label: 'Fixed Amount / Nominal Tetap', value: 'fixed' },
                      ],
                      label: { en: 'Calculation Type', id: 'Tipe Perhitungan' },
                    },
                    {
                      name: 'multiplier',
                      type: 'number',
                      defaultValue: 2,
                      min: 1,
                      max: 5,
                      label: { en: 'Multiplier', id: 'Pengali' },
                      admin: {
                        description: {
                          en: 'Used when type is Multiplier',
                          id: 'Digunakan ketika tipe adalah Pengali',
                        },
                        condition: (_data, siblingData) =>
                          siblingData?.calculationType === 'multiplier',
                      },
                    },
                    {
                      name: 'percentage',
                      type: 'number',
                      defaultValue: 100,
                      min: 0,
                      max: 500,
                      label: { en: 'Percentage (%)', id: 'Persentase (%)' },
                      admin: {
                        description: {
                          en: 'Used when type is Percentage',
                          id: 'Digunakan ketika tipe adalah Persentase',
                        },
                        condition: (_data, siblingData) =>
                          siblingData?.calculationType === 'percentage',
                      },
                    },
                    {
                      name: 'rateType',
                      type: 'select',
                      defaultValue: 'per_hour',
                      dbName: 'rate_type',
                      options: [
                        { label: 'Per Hour / Per Jam', value: 'per_hour' },
                        { label: 'Per Minute / Per Menit', value: 'per_minute' },
                      ],
                      label: { en: 'Rate Type', id: 'Tipe Tarif' },
                      admin: {
                        description: {
                          en: 'Used when type is Fixed Amount',
                          id: 'Digunakan ketika tipe adalah Nominal Tetap',
                        },
                        condition: (_data, siblingData) => siblingData?.calculationType === 'fixed',
                      },
                    },
                    {
                      name: 'fixedAmount',
                      type: 'number',
                      defaultValue: 15000,
                      min: 0,
                      label: { en: 'Fixed Amount (IDR)', id: 'Nominal Tetap (IDR)' },
                      admin: {
                        description: {
                          en: 'Used when type is Fixed Amount',
                          id: 'Digunakan ketika tipe adalah Nominal Tetap',
                        },
                        condition: (_data, siblingData) => siblingData?.calculationType === 'fixed',
                      },
                    },
                  ],
                },
              ],
            },

            // Incentives / Bonus Types
            {
              name: 'incentives',
              type: 'array',
              label: { en: 'Incentive Types', id: 'Jenis Insentif' },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  label: { en: 'Incentive Name', id: 'Nama Insentif' },
                },
                {
                  name: 'calculationType',
                  type: 'select',
                  required: true,
                  dbName: 'calc_type',
                  defaultValue: 'fixed',
                  label: { en: 'Calculation Type', id: 'Tipe Perhitungan' },
                  options: [
                    { label: 'Fixed Amount / Nominal Tetap', value: 'fixed' },
                    { label: 'Per Hour / Per Jam', value: 'per_hour' },
                    { label: 'Per Day / Per Hari', value: 'per_day' },
                    { label: 'Per Month / Per Bulan', value: 'per_month' },
                    { label: 'Percentage of Salary (%)', value: 'percentage_salary' },
                  ],
                },
                {
                  name: 'defaultAmount',
                  type: 'number',
                  label: { en: 'Default Amount', id: 'Nominal Default' },
                },
                {
                  name: 'active',
                  type: 'checkbox',
                  defaultValue: true,
                },
              ],
            },
          ],
        },
        {
          label: { en: 'Deduction Settings', id: 'Pengaturan Potongan Gaji' },
          name: 'deductionsTabs',
          fields: [
            {
              name: 'tax',
              type: 'group',
              label: { en: 'Tax Settings', id: 'Pengaturan Pajak' },
              fields: [
                {
                  name: 'defaultRate',
                  type: 'number',
                  defaultValue: 10,
                  min: 0,
                  max: 50,
                  label: { en: 'Default Tax Rate (%)', id: 'Tarif Pajak Default (%)' },
                },
              ],
            },

            // Late Penalty
            {
              name: 'latePenalty',
              type: 'group',
              label: { en: 'Late Penalty', id: 'Potongan Terlambat' },
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: true,
                },
                {
                  name: 'amountPerMinute',
                  type: 'number',
                  defaultValue: 1000,
                  label: { en: 'Amount per Minute', id: 'Nominal per Menit' },
                },
              ],
            },

            // Absence Deduction
            {
              name: 'absencePenalty',
              type: 'group',
              label: { en: 'Absence Deduction', id: 'Potongan Tidak Masuk' },
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: true,
                },
                {
                  name: 'amountPerDay',
                  type: 'number',
                  label: { en: 'Amount per Day', id: 'Nominal per Hari' },
                },
              ],
            },

            // Benefits (BPJS, Insurance)
            {
              name: 'benefits',
              type: 'array',
              label: { en: 'Benefit Deductions', id: 'Potongan Benefit' },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  label: { en: 'Benefit Name', id: 'Nama Benefit' },
                },
                {
                  name: 'calculationType',
                  type: 'select',
                  required: true,
                  dbName: 'calc_type',
                  defaultValue: 'fixed',
                  label: { en: 'Calculation Type', id: 'Tipe Perhitungan' },
                  options: [
                    { label: 'Fixed Amount / Nominal Tetap', value: 'fixed' },
                    { label: 'Per Hour / Per Jam', value: 'per_hour' },
                    { label: 'Per Day / Per Hari', value: 'per_day' },
                    { label: 'Per Month / Per Bulan', value: 'per_month' },
                    { label: 'Percentage of Salary (%)', value: 'percentage_salary' },
                  ],
                },

                {
                  name: 'amount',
                  type: 'number',
                  label: { en: 'Amount', id: 'Nominal' },
                },

                {
                  name: 'active',
                  type: 'checkbox',
                  defaultValue: true,
                },
              ],
            },
          ],
        },
      ],
    },

    // ===========================
    // DEDUCTIONS CONFIG
    // ===========================
  ],
}
