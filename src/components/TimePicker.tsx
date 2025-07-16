import { useState, useEffect } from "react"
import {
  WheelPicker,
  WheelPickerWrapper,
  type WheelPickerOption,
} from "@ncdai/react-wheel-picker"

type Props = {
  is24h: boolean
  displayHours: string
  setDisplayHours: React.Dispatch<React.SetStateAction<string>>
  displayMinutes: string
  setDisplayMinutes: React.Dispatch<React.SetStateAction<string>>
  displayPeriod: string
  setDisplayPeriod: React.Dispatch<React.SetStateAction<string>>
  setDisplaySeconds: React.Dispatch<React.SetStateAction<string>>
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
  setIsNow: React.Dispatch<React.SetStateAction<boolean>>
}

export default function TimePicker({
  is24h,
  displayHours,
  setDisplayHours,
  displayMinutes,
  setDisplayMinutes,
  displayPeriod,
  setDisplayPeriod,
  setDisplaySeconds,
  setIsEditing,
  setIsNow
}: Props) {

    const [tempHours, setTempHours] = useState(displayHours)
    const [tempMinutes, setTempMinutes] = useState(displayMinutes)
    const [tempPeriod, setTempPeriod] = useState(displayPeriod)

    useEffect(() => {
        if (displayHours !== tempHours) setTempHours(displayHours)
        if (displayMinutes !== tempMinutes) setTempMinutes(displayMinutes)
        if (displayPeriod !== tempPeriod) setTempPeriod(displayPeriod)
    }, [displayHours, displayMinutes, displayPeriod])


    const handleOk = () => {
        setDisplayHours(tempHours)
        setDisplayMinutes(tempMinutes)
        setDisplayPeriod(tempPeriod)
        setDisplaySeconds("00")
        setIsEditing(false)
    }

    const handleCancel = () => {
        setIsEditing(false)
        setIsNow(true)
    }

    const hoursOptions: WheelPickerOption[] = []
    const hours24Options: WheelPickerOption[] = []
    const minutesOptions: WheelPickerOption[] = []
    const periodOptions: WheelPickerOption[] = [
    { label: "AM", value: "AM" },
    { label: "PM", value: "PM" },
    ]

    for (let i = 0; i < 12; i++) {
    const hour = String(i + 1).padStart(2, "0")
    hoursOptions.push({ label: hour, value: hour })
    }
    for (let i = 0; i < 24; i++) {
    const hour = String(i).padStart(2, "0")
    hours24Options.push({ label: hour, value: hour })
    }
    for (let i = 0; i < 60; i++) {
    const minute = String(i).padStart(2, "0")
    minutesOptions.push({ label: minute, value: minute })
    }

    // choose a per‑item height and pass it in:
    const itemHeight = 40  // px
    const visibleCount = 10

    return (
        <WheelPickerWrapper className="flex items-center gap-2 bg-slate-50 border border-zinc-200 rounded-md shadow-md w-[8em] px-2">
            <WheelPicker
                options={is24h ? hours24Options : hoursOptions}
                value={tempHours}
                onValueChange={setTempHours}
                visibleCount={visibleCount}
                optionItemHeight={itemHeight}
                dragSensitivity={5}
                infinite
                classNames={{
                optionItem: "text-zinc-400",
                highlightWrapper: `bg-slate-100 text-slate-800 h-[${itemHeight}px] w-[4rem]`,
                }}
            />
            <WheelPicker
                options={minutesOptions}
                value={tempMinutes}
                onValueChange={setTempMinutes}
                visibleCount={visibleCount}
                optionItemHeight={itemHeight}
                dragSensitivity={5}
                infinite
                classNames={{
                optionItem: "text-zinc-400",
                highlightWrapper: `bg-slate-100 text-slate-800 h-[${itemHeight}px] w-[4rem]`,
                }}
            />
            {!is24h && (
                <WheelPicker
                options={periodOptions}
                value={tempPeriod}
                onValueChange={setTempPeriod}
                visibleCount={visibleCount}
                optionItemHeight={itemHeight}
                dragSensitivity={3}
                classNames={{
                    optionItem: "text-zinc-400",
                    highlightWrapper: `bg-slate-100 text-slate-800 h-[${itemHeight}px] w-[4rem]`,
                }}
                />
            )}
            <div className="flex flex-col justify-center items-center gap-2">
                <button
                    onClick={handleOk}
                    className="w-full py-2 px-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                >
                    OK
                </button>
                <button
                    onClick={handleCancel}
                    className="w-full py-2 px-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 text-sm"
                >
                    Cancel
                </button>
            </div>
        </WheelPickerWrapper>
    )
}
