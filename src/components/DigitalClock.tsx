import { useState, useEffect } from "react"
import { formatUtcTimestampToDate } from "../utils.ts"
import TimePicker from "./TimePicker.tsx"

type Props = {
    now: number
    isNow: boolean
    setIsNow: React.Dispatch<React.SetStateAction<boolean>>
    is24h: boolean
    refTimestamp: number
    setRefTimestamp: React.Dispatch<React.SetStateAction<number>>
    timezone: string
    utcOffset: number | null
    locations: string[]
}

const sizeMap: Record<number, string> = {
    1: "text-[1.55rem] md:text-[2rem] lg:text-[2.2rem] 2xl:text-[2.3rem]",
    2: "text-[1.35rem] md:text-[1.65rem] lg:text-[1.9rem] 2xl:text-[2.3rem]",
    3: "text-[1rem] md:text-[1.25rem] lg:text-[1.7rem] 2xl:text-[2rem] w-[9em] lg:w-[7.5em] 2xl:w-[9em]",
    4: "text-[1rem] sm:text-[1.2rem] md:text-[1.5rem] lg:text-[1.6rem] 2xl:text-[2rem] md:w-[9em] lg:w-[8em] 2xl:w-[9em]"
}  

const DigitalClock = ({
    now,
    isNow,
    setIsNow,
    is24h,
    refTimestamp,
    setRefTimestamp,
    timezone,
    utcOffset,
    locations,
}: Props) => {
    

    // state
 
    const [displayHours, setDisplayHours] = useState<string>("")
    const [displayMinutes, setDisplayMinutes] = useState<string>("")
    const [displaySeconds, setDisplaySeconds] = useState<string>("")
    const [displayPeriod, setDisplayPeriod] = useState<string>("")
    const [isEditing, setIsEditing] = useState<boolean>(false)

    // handlers

    const updateRefTime = () => {
        if (!isNow && utcOffset) {

            const manualDate      = new Date()
            const year     = manualDate.getUTCFullYear()
            const month    = manualDate.getUTCMonth()
            const day      = manualDate.getUTCDate()
            const h        = Number(displayHours)
            let h24        = h
            if (displayPeriod === "PM" && h !== 12) h24 = h + 12
            if (displayPeriod === "AM" && h === 12) h24 = 0

            const utcOffsetMs = utcOffset * 60 * 60 * 1000

            const rawUtcDate = new Date(Date.UTC(year, month, day, h24, Number(displayMinutes), Number(displaySeconds)))
            const convertedUtcTimestamp = rawUtcDate.getTime() - utcOffsetMs

            setRefTimestamp(convertedUtcTimestamp)            
        }
    }

    // useEffects

    useEffect(() => {
        if (!timezone) return 
        const timestamp = isNow ? now : refTimestamp
        const displayTime = formatUtcTimestampToDate(timestamp, timezone, is24h).toUpperCase()
        setDisplayHours(displayTime.slice(0, 2))
        setDisplayMinutes(displayTime.slice(3,5))
        setDisplaySeconds(displayTime.slice(6,8))
        setDisplayPeriod(displayTime.slice(9,11))
        
    }, [now, isNow, is24h, refTimestamp, timezone, utcOffset])

    useEffect(() => {
        if (!isNow && displayHours && displayMinutes && displaySeconds && (is24h || displayPeriod)) {
          updateRefTime()
        }
      }, [displayHours, displayMinutes, displaySeconds, displayPeriod])

    // element creating logic

    const hoursOptions = []
    const hours24Options = []
    const minutesOptions = []

    for (let i = 0; i < 12; i++) {
        const hour = (i + 1).toString().padStart(2, '0')
        hoursOptions.push(
         <option key={hour} value={hour}>
             {hour}
         </option>
        )
     }

    for (let i = 0; i < 24; i++) {
        const hour = (i).toString().padStart(2, '0')
        hours24Options.push(
         <option key={hour} value={hour}>
             {hour}
         </option>
        )
    }
 
    for (let i = 0; i < 60; i++) {
        const minute = (i).toString().padStart(2, '0')
        minutesOptions.push(
        <option key={minute} value={minute}>
            {minute}
        </option>
        )
    }

    // Tailwind classes

    const count = Math.min(locations.length, 8)
    const textSize = sizeMap[count] || sizeMap[8]
    
    return (
        <>
            <div 
                className={`
                    relative ${isEditing ? "z-103" : "z-0"}
                    flex items-center justify-center gap-2 w-[8em]
                    ${textSize} tracking-wider
                    bg-white/20 backdrop-blur-sm rounded-lg
                    shadow-inner shadow-blue-100
                    hover:scale-[1.05]
                    transition-all duration-300 ease-in-outs 
                    `}
                onClick={() => {
                    setIsNow(false)
                    setIsEditing(true)
                }}
            >
                <span className="inline-flex lg:py-[0.15em] tracking-wide cursor-pointer transition-[width] duration-300 ease-in-out">
                    {/* <span className="inline-flex space-x-1 items-baseline"> */}
                    <p className="whitespace-pre">{displayHours} : {displayMinutes}</p>
                    <p className="whitespace-pre"> : {displaySeconds}</p>
                    {!is24h && <p className="ml-3">{displayPeriod}</p>}
                </span>
            </div>
            {isEditing && (
            <div 
                className={`
                    fixed inset-0 z-110
                    flex items-center justify-center 
                    bg-white/20 backdrop-blur-sm
                    transition-opacity duration-300 ease-in-out
                `}
                onClick={(e) => {
                    e.stopPropagation()
                }}
            >
                <div 
                    className="w-[20em]"
                    onClick={(e) => e.stopPropagation()}
                >
                    <TimePicker 
                        is24h={is24h}
                        displayHours={displayHours}
                        setDisplayHours={setDisplayHours}
                        displayMinutes={displayMinutes}
                        setDisplayMinutes={setDisplayMinutes}
                        displayPeriod={displayPeriod}
                        setDisplayPeriod={setDisplayPeriod}
                        setDisplaySeconds={setDisplaySeconds}
                        setIsEditing={setIsEditing}
                        setIsNow={setIsNow}
                />
                </div>
            </div>
            )}
        </>
    )
}

export default DigitalClock