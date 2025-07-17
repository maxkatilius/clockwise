import { useState, useEffect } from "react"
import { IoIosClose } from "react-icons/io"
import { IoHomeSharp } from "react-icons/io5"
import { FaSpinner } from "react-icons/fa"

import { getCityData, getClosestCityData } from "../utils"

import AnalogClock from "./AnalogClock"
import DigitalClock from "./DigitalClock"
import Location from "./Location"

type Props = {
  idx: number
  now: number
  isNow: boolean
  setIsNow: React.Dispatch<React.SetStateAction<boolean>>
  is24h: boolean
  refTimestamp: number
  setRefTimestamp: React.Dispatch<React.SetStateAction<number>>
  locations: string[]
  setLocations: React.Dispatch<React.SetStateAction<string[]>>
  locationGranted: boolean
  searchKey: string
  userCity: string | null
}

const ClockCard = ({
  idx,
  now,
  isNow,
  setIsNow,
  is24h,
  refTimestamp,
  setRefTimestamp,
  locations,
  setLocations,
  locationGranted,
  searchKey,
  userCity
}: Props) => {

  // state
  
  const [utcOffset, setUtcOffset] = useState<number | null>(null)
  const [timezone, setTimezone] = useState<string>("")
  const [loadingLocation, setLoadingLocation] = useState(false)

  // useEffects

  useEffect(() => {
    const cityData = getCityData(searchKey)

    if (cityData) {
      setUtcOffset(cityData.utcOffset)
      setTimezone(cityData.timezone)
    } else {
      setUtcOffset(null)
      setTimezone("")
    }
  }, [searchKey])

  const isUserLocation = userCity === searchKey

  return (
    <div className={`
      clockCard
      relative 
      w-full max-w-[30em] p-2 py-4 xl:py-6 xl:px-0 2xl:py-8
      ${locations.length === 1 ? "lg:max-w-[28em] xl:max-w-[30em] 2xl:max-w-[34em]" : locations.length === 2 ? "sm:max-w-[24em] lg:max-w-[45%] xl:max-w-[45%]" : locations.length === 3 ? "sm:max-w-[20em] lg:max-w-[30%]" : "md:max-w-[95%] lg:max-w-[100%] 2xl:max-w-[22%]" }
      bg-gradient-to-br from-sky-200 to-blue-400 rounded-xl shadow-md shadow-blue-300 
    `}>
      <div 
        className={`
          closeIcon
          absolute z-100 right-[0.05em] top-[-0.05em]
          text-[2em] md:text-[2em] opacity-20 text-black ${locations.length === 1 ? "cursor-not-allowed": "cursor-pointer"}  
          hover:scale-[1.1] hover:text-red-700 hover:opacity-100 transition-all duration-500 ease-in-out
        `}
        onClick={()=> {
          if (locations.length !== 1) setLocations((prev)=>{
            const updated = [...prev]
            updated.splice(idx, 1)
            return updated
          })
        }}
        >
        <IoIosClose />
      </div>
      { locationGranted && (
        <div 
        className={`
          homeIcon
          absolute z-100 bottom-[0.4em] left-[0.5em]
          text-[0.9rem] md:text-[1.2rem] cursor-pointer 
          ${isUserLocation ? "opacity-90" : "opacity-20"}
          hover:scale-[1.1] hover:text-blue-900 hover:opacity-100 transition-all duration-500 ease-in-out
        `}
        onClick={() => {
          setLoadingLocation(true)
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userCityData = getClosestCityData(position.coords.latitude, position.coords.longitude)
              const userCity = userCityData.searchKey
              setLocations((prev) => {
                const updated = [...prev]
                updated[idx] = userCity
                return updated
              })
              setLoadingLocation(false)
            },
            (error) => {
              console.error("Failed to get location on Home icon click", error)
              setLoadingLocation(false)
            },
            {
              enableHighAccuracy: false,
              timeout: 5000,
              maximumAge: 60000,
            }
          )
        }}
        >
          {loadingLocation ? (
            <FaSpinner className="animate-spin text-blue-900 h-5 w-5" />
          ) : (
            <IoHomeSharp />
          )}
        </div> 
      )}
      {timezone.length > 0 && typeof utcOffset === "number" ? (
        <section className={`
          h-full
          flex flex-col items-center 2xl:gap-[2em] ${locations.length === 4 ? "justify-between gap-[0.5em]" : locations.length === 3 ? "gap-[0.5em] md:gap-[0.6em]" : "gap-[1.2em] lg:gap-[1em]"}
        `}>
          <Location
            idx={idx}
            utcOffset={utcOffset}
            searchKey={searchKey}
            locations={locations}
            setLocations={setLocations}
          />
          <AnalogClock
            now={now}
            isNow={isNow}
            refTimestamp={refTimestamp}
            timezone={timezone}
            locations={locations}
          />
          <DigitalClock 
            now={now}
            isNow={isNow}
            setIsNow={setIsNow}
            is24h={is24h}
            refTimestamp={refTimestamp}
            setRefTimestamp={setRefTimestamp}
            timezone={timezone}
            utcOffset={utcOffset}
            locations={locations}
          />
        </section>
      ) : (
        <p>Loading timezone info...</p>
      )}
    </div>
  )
}

export default ClockCard