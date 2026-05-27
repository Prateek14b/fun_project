import { useState, useEffect} from "react"; //these are React hooks. 
import axios from "axios" //axios is a library for making HTTP requests -- cleaner than raw fetch()
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts"

const API = "http://localhost:8000"; //URL for fastAPI backend; all API calls' endpoints point to this.

/* map each region name to a hex color, and store the
mapping in a lookup dict for looking up later.*/
const REGION_COLORS = {
  "Western Europe": "#4e79a7",
  "North America": "#f28e2b",
  "Australia and New Zealand": "#59a14f",
  "Latin America and Caribbean": "#e15759",
  "Eastern Asia": "#76b7b2",
  "Southeastern Asia": "#edc948",
  "Central and Eastern Europe": "#b07aa1",
  "Middle East and Northern Africa": "#ff9da7",
  "Sub-Saharan Africa": "#9c755f",
  "Southern Asia": "#bab0ac",
};

/* this is the function that returns the entire webpage,
and takes care of re-rendering changes and sending API calls.*/
export default function App() {
  const [filters, setFilters] = useState({ years: [], regions: []});
  // useState is a commonly used React hook, to define behavior of a component.
  const [year, setYear] = useState(2019);

  const [region, setRegion] = useState(""); //empty string means all regions

  const [metric, setMetric] = useState("happiness_score");

  const [data, setData] = useState([]); //chart data retruned from /api/stats query -- basically an array of country objects.

  const [loading, setLoading] = useState(false); //used to show "Loading..." text


  /*useEffect(function, [dependencies]) runs function whenever
  dependencies change -- aka when the setter function for those dependency components are called. */
  
  // here, we set up API calls to the FastAPI middleware as the functions and the react components as dependencies. 
  //So, for instance, we want to obtain the initial default filter/dropdown values, we would do a get API call to the FastAPI middleware as defined in our main.py.
  useEffect(() => { 
    axios.get(`${API}/api/filters`).then(res => { //if u notice, this get() function includes the URL in header as API 
      setFilters(res.data);
    });
  }, []) //dependency list is an EMPTY ARRAY, which denotes this function has no dependencies and only needs to run once on first render/first page load.


  //now it is time to implement useEffect again, but
  //for the actual chart data by listening to dependencies
  //of the states defined above

  useEffect(() => {
    setLoading(true); //to show "Loading..." while our API request is in flight.

    axios.get(`${API}/api/stats`, {
      params: {year, region: region || undefined, metric} //we also define what parameters we want to filter over and GET().
      //the params get parsed by FastAPI into its function parameters automatically.
      // region || undefined means if region is empty string, don't send it at all
      // so the API returns all regions instead of filtering.
    })
    .then(res => setData(res.data.data))
    .finally(() => setLoading(false));
  }, [year, region, metric]); //here, dependencies are any of year, region, or metric. if any of these values change, this API call fires and webpage is re-rendered to reflect the updated states!

  
}
