import React, { useState, useEffect, useRef } from 'react'
export default (initState) => {
    const [data, setData] = useState(initState)
    const dataRef = useRef(data)
    useEffect(() => {
        dataRef.current = data
    }, [data])
    return [data, setData, dataRef]
}