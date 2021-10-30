import axios from "axios";
import React from "react";
import { useEffect, useState } from "react/cjs/react.development";

export default function CountryCode(props)
{
    const [codedata,setCodeData] = useState([])
    useEffect(() => Code(),[])

    const Code = async() => {
        const response = await axios.get('https://flagcdn.com/en/codes.json')
        setCodeData(response.data)
        console.log(codedata)
    }
    return(
        
    )

}