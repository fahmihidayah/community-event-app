'use client'
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
dayjs.extend(weekday)

export default function CalendarGrid({ date }: { date: Date }) {
  const current = dayjs(date)
  const daysInMonth = current.daysInMonth()

  // Hari pertama dalam bulan (0 = Sunday, 1 = Monday, dst)
  const firstDayOfMonth = current.startOf('month').day()

  return (
    <div className="grid grid-cols-7 gap-2">
      {/* Padding kosong sebelum tanggal 1 */}
      {Array.from({ length: firstDayOfMonth }).map((_, i) => (
        <div key={`empty-${i}`} />
      ))}

      {/* Render tanggal */}
      {Array.from({ length: daysInMonth }).map((_, index) => {
        const day = index + 1
        const fullDate = current.date(day)
        const isToday = fullDate.isSame(dayjs(), 'day')

        return (
          <div
            key={day}
            className={`flex w-full h-20 items-center justify-center  border 
              ${isToday ? 'bg-blue-500 text-white' : 'border-gray-300'}`}
          >
            {day}
          </div>
        )
      })}
    </div>
  )
}
