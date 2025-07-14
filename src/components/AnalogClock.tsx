import Clock from "react-clock"
import "react-clock/dist/Clock.css"

import { formatUtcTimestampToDate } from "../utils"

type Props = {
  now: number
  isNow: boolean
  refTimestamp: number
  timezone: string
  locations: string[]
}

const sizeMap: Record<number, string> = {
  1: "w-46 h-46 md:w-62 md:h-62 lg:w-66 lg:h-66 2xl:w-72 2xl:h-72",
  2: "w-30 h-30 md:w-48 md:h-48 lg:w-50 lg:h-50 2xl:w-70 2xl:h-70",
  3: "w-22 h-22 md:w-30 md:h-30 lg:w-42 lg:h-42 2xl:w-60 2xl:h-60",
  4: "w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36"
}

const AnalogClock = ( {now, isNow, refTimestamp, timezone, locations}: Props) => {

  let clockDate
  if (timezone) {
    clockDate = formatUtcTimestampToDate(isNow ? now : refTimestamp, timezone)
  }

  const count = Math.min(locations.length, 8);
  const clockSize = sizeMap[count] || sizeMap[8];

  return (
    <div className={`
      self-center ${clockSize} 
      bg-slate-100 shadow-lg shadow-slate-400
      rounded-[50%] 
    `}>
      <Clock
        className="w-full h-full react-clock"
        value={clockDate}
      />
    </div>
  )
}

export default AnalogClock