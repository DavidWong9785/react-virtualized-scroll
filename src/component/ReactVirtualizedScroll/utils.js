import React, { useState, useEffect, useRef } from 'react'
export const useStateAndRef = (data) => {
    const [data, setData] = useState(data)
    const dataRef = useRef(data)
    useEffect(() => {
        dataRef.current = data
    }, [data])
    return [data, setData, dataRef]
}