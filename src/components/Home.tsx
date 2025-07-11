import { useState, useEffect } from "react"
import { getRandomCity, getClosestCityData } from "../utils"
import ClockCard from "./ClockCard"

const Home = () => {
  
  // state
  const [now, setNow] = useState<number>(Date.now())
  const [isNow, setIsNow] = useState<boolean>(true)
  const [refTimestamp, setRefTimestamp] = useState<number>(Date.now())
  const [is24h, setIs24h] = useState<boolean>(false)
  const [locations, setLocations] = useState<string[]>(["melbourne, australia", "london, united kingdom"])
  const [locationGranted, setLocationGranted] = useState<boolean>(false)
  const [userCity, setUserCity] = useState<string | null>(null)
  const [showIntroModal, setShowIntroModal] = useState(true)

  // useEffects

  // If now === true, update now in state every second to Unix time
  useEffect(() => {
    if (!isNow) return
    const interval = setInterval(() => {
      setNow(Date.now())
      setRefTimestamp(Date.now())
    }, 1000)

    return () => clearInterval(interval)

  }, [isNow])

  // Ask user for location permissions and if access is granted, update first clock to be in the user's city
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationGranted(true)
  
        const userCityData = getClosestCityData(position.coords.latitude, position.coords.longitude)
        const userCity = userCityData.searchKey
        setUserCity(userCity)
  
        setLocations((prevLocations) => {
          const newLocations = [...prevLocations]
          newLocations[0] = userCity       
          return newLocations 
        })
      },
      (error) => {
        setLocationGranted(false)
        console.error(`Geolocation error ${error.code}: ${error.message}`)
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 60000,
      }
    )
  }, [])

  // ensure how-to pop up modal only appears once per browser session
  useEffect(() => {
    if (!sessionStorage.getItem("introShown")) {
      setShowIntroModal(true)
      sessionStorage.setItem("introShown", "true")
    }
  }, [])
  
  // Tailwind classes

  const buttonClass = `
    flex justify-center items-center
    px-[0.3em] pb-[0.2em] py-[0.15em] md:py-[0.25em] rounded-xl
    bg-blue-400 shadow-sm shadow-blue-600
    font-bold text-center tracking-wider
    cursor-pointer
    hover:bg-blue-500 
    focus:ring-2 focus:outline-none focus:ring-blue-500 
    transition-colors duration-300 ease-in-out
    disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-sky-500 
  `
  const MAX = 4
  const MIN = 1
  const atMax = locations.length >= MAX
  const atMin = locations.length <= MIN

  const gridClass = (() => {
    switch (locations.length) {
      case 1:
        return "grid-cols-1 lg:grid-cols-1"
      case 2:
        return "grid-cols-1 lg:grid-cols-2"
      case 3:
        return "grid-cols-1 lg:grid-cols-3"
      case 4:
        return "grid-cols-2 lg:grid-cols-4"
      default:
        return "grid-cols-1"
  }
  })()

  return (
    <main className="
      grow flex flex-col flex-1
      w-full px-[1.5em] lg:px-[2em] lg:py-[0.5em] overflow-y-auto
    ">
      {showIntroModal && (
        <div className="fixed inset-0 bg-transparent bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-101">
          <div className="flex flex-col gap-4 py-8 px-10 bg-white rounded-xl shadow-lg w-[80%] sm:w-[60%] md:w-[50%] lg:w-[30%] xl:w-[25%] text-gray-800">
            <h2 className="text-center text-3xl font-bold mb-2">Welcome!</h2>
            <p className="mb-4">Tap the city name to change location, and tap the time to set a custom time.</p>
            <button
              className={`
                flex justify-center items-center
                rounded-xl py-2 px-4 mx-auto
                bg-blue-400 shadow-sm shadow-blue-600
                font-bold text-center text-white tracking-wider
                cursor-pointer
                hover:bg-blue-500 
                focus:ring-2 focus:outline-none focus:ring-blue-500 
                transition-colors duration-300 ease-in-out
                disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-sky-500 `}
              onClick={() => setShowIntroModal(false)}
            >
              Got it!
            </button>
          </div>
        </div>
      )}
      <div className="
        btns-container
        flex justify-between w-full 
        pb-[0.6em] pt-[0.8em] md:pt-[1em] lg:pt-[1.2em]
        ">
        <div className="
          add-minus-btns
          flex gap-[0.7em] md:gap-[0.8em] xl:gap-[1.2em]
          text-[1.3rem] md:text-[2rem]
        ">
          <button
            disabled={atMax}
            className={`${buttonClass} w-[2.3em] md:w-[3em]`}
            onClick={() => {
              if (atMax) return
              setLocations(prev => [...prev, getRandomCity()])
            }}
          >
            +
          </button>
          <button
            disabled={atMin}
            className={`${buttonClass} w-[2.3em] md:w-[3em]`}
            onClick={() => {
              if (atMin) return
              setLocations((prev => prev.slice(0, -1)))
            }}
          >
            -
          </button>
          </div>
          <div className="
            control-btns
            w-3/5 
            flex justify-end gap-[1em] md:gap-[1.2em] lg:gap-[1.5em] xl:gap-[2em]
            text-[0.9rem] md:text-[1.25rem] lg:text-[1.4rem]
          ">
            <button 
              className={`${buttonClass} w-[5em] md:w-[7em]`}
              onClick={() => setIsNow(!isNow)}
            >
              {isNow ? "PAUSE" : "NOW"}
            </button>
            <button
              className={`${buttonClass} w-[5em] md:w-[7em] whitespace-nowrap`}
              onClick={() => setIs24h(!is24h)}
            >
              {is24h ? "AM / PM" : "24H"}
            </button>
        </div>
      </div>
      <div className="grow flex items-center">
        <div className={`
          clockCardsContainer
          w-full py-[0.5em]
          grid ${gridClass} auto-rows-max justify-items-center 
          ${locations.length === 4 ? "gap-[1em] md:gap-[2em] lg:gap-[0.5em] lg:pb-[1.4em]" : locations.length === 3 ? "gap-[1.25em] md:gap-[1em] lg:gap-[1.8em] xl:gap-[2em]" : "gap-[1.2em] md:gap-[2em]"}
        `}>
          {locations.map((searchKey, idx)=> (
            <ClockCard
              key={idx}
              idx={idx}
              now={now}
              isNow={isNow}
              setIsNow={setIsNow}
              is24h={is24h}
              refTimestamp={refTimestamp}
              setRefTimestamp={setRefTimestamp}
              locations={locations}
              setLocations={setLocations}
              locationGranted={locationGranted}
              searchKey={searchKey}
              userCity={userCity}
            />
          ))}
        </div>
      </div>
    </main>
  )
}

export default Home