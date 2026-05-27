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


  
}
