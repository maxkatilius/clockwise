import { useState } from 'react'

const TimePicker = () => {

    const [hour, setHour] = useState("12")
    const [minute, setMinute] = useState("00")
    const [meridiem, setMeridiem] = useState("AM")
    
    const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString())
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))



    return (
        <div><select></select>Hello!</div>
    )
}

export default TimePicker