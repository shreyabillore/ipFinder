import './App.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Map } from 'leaflet';
import { useEffect, useState } from 'react'
import axios from 'axios';
import {Card} from 'react-bootstrap'
import { DateTime } from "luxon";




function App() {

  const [ipData, setIpData] = useState()
  const [userLat,setLatPosition] = useState()
  const [userLong,setLongPosition] = useState()
  const [status,setStatus] = useState()
  const [countryData,setCountryData] = useState([])
  const [userDate,setUserDate] = useState();
  const [userTime,setUserTime] = useState();

  const position = [51.505, -0.09]
  const url = `https://geo.ipify.org/api/v2/country?apiKey=${process.env.REACT_APP_GEO_KEY}`

  useEffect(() => ipDataLoad(), [])

  const ipDataLoad = async () => {
    const response = await axios.get(url);
    console.log(response.data.ip)
    if (response.ok) {
     setIpData(response.data.ip)
      
    }
    else {
      console.error("Problem: " + response.error)
      setIpData(response.data.ip)
      console.log(response.data)
    }
  }


useEffect(() => geoLocationData(), [ipData])



const geoLocationData = async() => {
  const API_KEY = process.env.REACT_APP_API_KEY;
  console.log(API_KEY)
  const geoLocationUrl =`https://api.freegeoip.app/json/${ipData}?apikey=${process.env.REACT_APP_API_KEY}`;
const responseGeodata = await axios.get(geoLocationUrl)
  console.log(responseGeodata.data) 
  setCountryData(responseGeodata.data)
  console.log('data is',countryData)
  let dateTime = DateTime.local().setZone(countryData.time_zone);
  setUserDate(dateTime.toFormat("LLL dd, yyyy"));
  setUserTime(dateTime.toFormat("h:mm a"));
}

  useEffect(()=> userPositionfinder(),[])
  
  const userPositionfinder = () => {
    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by your browser');
    } else {
      setStatus('Locating...');
      navigator.geolocation.getCurrentPosition((position) => {
        // setStatus(null);
        setLatPosition(position.coords.latitude);
        console.log(userLat);
        setLongPosition(position.coords.longitude);
        console.log(userLong);
      }, () => {
        console.log('Unable to retrieve your location');
      });
    }
  }  


  return (
    <div className="App">
    <h1>My Ip Address</h1>
   <div className="grid-container"> 
   <div className='item1' id="mapid">
{     userLong ?
    <MapContainer center={[userLat,userLong]} zoom={13} scrollWheelZoom={false}>
    <TileLayer
      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Marker position={[userLat,userLong]}>
      <Popup>
      You Logged in on : {userDate} !! <br /> Your Local Time is : {userTime} <br/>
      You are located at {countryData.city}, {countryData.country_name}
      </Popup>
    </Marker>
  </MapContainer>
    : <div>{status}</div> }
   </div>
<Card style={{ width:'25rem',height:'50rem',padding:'0px'}}>
<Card.Img variant="top" src={`https://www.countryflags.io/${countryData.country_code}/flat/64.png`}  style={{ width: '5rem' }} />
  <Card.Body style={{fontSize:'15px',fontWeight:'bold', display:'flex',flexDirection:'column',alignItems:'flex-start'}}>
  <Card.Text>{ipData ?`My IP is ${ipData} !!` : status}</Card.Text>
    <Card.Text>City : {countryData.city}</Card.Text>
    <Card.Text>Region : {countryData.region_name}</Card.Text>
    <Card.Text>Country Code : {countryData.country_code}</Card.Text>
    <Card.Text>Zip Code : {countryData.zip_code}</Card.Text>
  </Card.Body>
</Card>

   </div>
  </div>
  );
}

export default App;


