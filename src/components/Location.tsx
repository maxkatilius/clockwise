import { useState, useEffect, useRef } from "react"
import { formatTimezoneString, capitaliseString } from "../utils"
import { SEARCH_KEYS } from "../data/citiesSearchKeys"
import { useTypeahead } from "../hooks/useTypeahead"

type Props = {
    idx: number 
    searchKey: string
    locations: string[]
    setLocations: React.Dispatch<React.SetStateAction<string[]>>
    utcOffset: number | null
}

const sizeMap: Record<number, string> = {
    1: "text-[1.6rem]/2 md:text-[2.2rem]/6 lg:text-[2.5rem]/6 xl:text-[2.7rem]/8 2xl:text-[2.9rem]/10",
    2: "text-[1.35rem]/1 md:text-[1.75rem]/4 lg:text-[1.9rem]/10 xl:text-[2rem]/8 2xl:text-[2.7rem]/8",
    3: "text-[1.15rem]/2 md:text-[1.4rem]/4 lg:text-[1.7rem]/6 2xl:text-[2rem]/6",
    4: "text-[1rem]/2 sm:text-[1.3rem]/2 md:text-[1.55rem]/4 lg:text-[1.8rem]/4 2xl:text-[2.1rem]/6"
} 

const utcSizeMap: Record<number, string> = {
    1: "text-[1.45rem] md:text-[1.9rem] lg:text-[2.1rem] 2xl:text-[2.2rem]",
    2: "text-[1.15rem] md:text-[1.45rem] lg:text-[1.7rem] 2xl:text-[2.2rem]",
    3: "text-[1rem] md:text-[1.15rem] lg:text-[1.5rem] 2xl:text-[1.7rem]",
    4: "text-[0.85rem] sm:text-[1rem] md:text-[1.3rem] lg:text-[1.7rem] 2xl:text-[1.6rem]"
}

const Location = ({ idx, utcOffset, searchKey, locations, setLocations }: Props) => {

    // state
    const [city, setCity] = useState<string | null>(null)
    const [country, setCountry] = useState<string | null>(null)
    const [editing, setEditing] = useState(false)
    const [query, setQuery] = useState("")
    const [highlightedIndex, setHighlightedIndex] = useState<number>(0)
    const inputRef = useRef<HTMLInputElement>(null)

    // helper logic 
    const matches = useTypeahead(SEARCH_KEYS, query)

    const chooseSearchKey = (key: string) => {
        setLocations((prev) => {
            const updated = [...prev]
            updated[idx] = key
            return updated
        })
        setEditing(false)
        setQuery("")
    }

    // useEffects
    // Split city and country for display
    useEffect(() => {
            const [c, cn] = searchKey.split(", ")
            setCity(capitaliseString(c))
            setCountry(capitaliseString(cn))
    }, [searchKey])

    // Focus the input on edit mode
    useEffect(() => {
        if (editing) inputRef.current?.focus()
    }, [editing])

    // reset focused dropdown to top when user is editing
    useEffect(() => {
        setHighlightedIndex(0)
    }, [query, editing])

    // Tailwind classes
    const count = Math.min(locations.length, 8)
    const textSize = sizeMap[count] || sizeMap[8]
    const utcTextSize = utcSizeMap[count] || sizeMap[8]
    const sharedFieldClass = `
        relative
        w-full px-[0.8em] py-2
        font-[600] ${textSize} text-center
        rounded-xl truncate
        leading-none`

    // Display mode
    return (
        <div
            className={`
                ${locations.length === 4 || locations.length === 1 ?  "sm:w-auto sm:px-2 2xl:w-full 2xl:px-0" : ""}
                w-full
                flex flex-col justify-center items-center gap-1
                tracking-wide
            `}
        >
        <div className="relative w-full h-[2.4rem] flex justify-center items-center">
        {editing ? (
            <div className="relative w-full">
                <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Escape" || (e.key === "Enter" && matches.length === 0)) {
                            setEditing(false)
                            setQuery("")
                        }
                        if (e.key === "ArrowDown") {
                            e.preventDefault()
                            setHighlightedIndex((prev) =>
                                prev < matches.length - 1 ? prev + 1 : 0
                            )
                        }
                        if (e.key === "ArrowUp") {
                            e.preventDefault()
                            setHighlightedIndex((prev) =>
                                prev > 0 ? prev - 1 : matches.length - 1
                            )
                        }
                        if (e.key === "Enter" && matches.length > 0) {
                            e.preventDefault()
                            chooseSearchKey(matches[highlightedIndex])
                        }
                    }}
                    onBlur={() => {
                        setTimeout(() => {
                            setEditing(false)
                            setQuery("")
                        }, 100)
                    }}
                    placeholder="Search for a city..."
                    className={`${sharedFieldClass} bg-white focus:ring-0`}
                />
                {matches.length > 0 && (
                    <ul className="absolute top-full left-0 z-10 w-full overflow-y-auto bg-white border rounded-lg shadow-lg max-h-60">
                        {matches.map((key, idx) => {
                            const [c, cn] = key.split(", ")
                            const isActive = idx === highlightedIndex
                            return (
                                <li
                                    key={key}
                                    className={`cursor-pointer px-3 py-2 ${isActive ? "bg-pink-200" : "hover:bg-purple-100"}`}
                                    onMouseEnter={() => setHighlightedIndex(idx)}
                                    onClick={() => chooseSearchKey(key)}
                                >
                                    {capitaliseString(c)}, {capitaliseString(cn)}
                                </li>
                            )
                        })}
                    </ul>
                )}
            </div>
        ) : ( 
            <button
                onClick={() => setEditing(true)}
                className={`${sharedFieldClass} bg-transparent hover:cursor-pointer hover:scale-[1.05] hover:bg-white/20 transition-all duration-400 ease-in-out`}>
                {city}, {country}
            </button>
        )}
        </div>
            <span className={`font-[500] ${utcTextSize}`}>
                {utcOffset !== null ? formatTimezoneString(utcOffset) : "..."}
            </span>
        </div>
    )
}

export default Location
