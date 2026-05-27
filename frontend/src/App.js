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


  /* TIME TO RENDER. 
  Everything below is quasi-HTML/JS script to allow
  React to compile it into the DOM components 
  in the browser that these React components would 
  actually look like!*/
  return (
    // Outer wrapper div with some basic inline styles for layout
    <div style={{ fontFamily: "sans-serif", padding: "2rem", maxWidth: 1100, margin: "0 auto" }}>
      <h1>🌍 World Happiness Report</h1>

      {/* ── Controls ── */}
      {/* Flexbox row containing all three controls side by side */}
      <div style={{ display: "flex", gap: "2rem", marginBottom: "2rem", flexWrap: "wrap" }}>

        {/* Year slider */}
        <div>
          <label><strong>Year: {year}</strong></label><br />
          {/* Range input = the slider. min/max come from the filters API response.
              Math.min/max spread the years array to find the lowest and highest year.
              onChange fires every time the slider moves, updating the year state,
              which triggers the useEffect above to fetch new data automatically */}
          <input
            type="range"
            min={Math.min(...filters.years)}
            max={Math.max(...filters.years)}
            step={1}
            value={year}
            onChange={e => setYear(Number(e.target.value))}
          />
        </div>

        {/* Region dropdown */}
        <div>
          <label><strong>Region</strong></label><br />
          {/* select is an HTML dropdown. value is controlled by React state.
              onChange updates region state which triggers a new API fetch.
              The first option is blank = all regions (no filter applied) */}
          <select value={region} onChange={e => setRegion(e.target.value)}>
            <option value="">All regions</option>
            {/* Map over regions array from /api/filters to generate options dynamically.
                key is required by React to efficiently track list items */}
            {filters.regions.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Metric dropdown */}
        <div>
          <label><strong>Metric</strong></label><br />
          {/* Same pattern as region dropdown but hardcoded since metrics
              are fixed columns in our database, not dynamic */}
          <select value={metric} onChange={e => setMetric(e.target.value)}>
            <option value="happiness_score">Happiness Score</option>
            <option value="gdp_per_capita">GDP per Capita</option>
            <option value="social_support">Social Support</option>
            <option value="life_expectancy">Life Expectancy</option>
            <option value="freedom">Freedom</option>
            <option value="corruption">Corruption</option>
            <option value="generosity">Generosity</option>
          </select>
        </div>
      </div>

      {/* ── Chart ── */}
      {/* Ternary operator — if loading show text, otherwise show chart.
          This is React's way of conditional rendering */}
      {loading ? <p>Loading...</p> : (
        // ResponsiveContainer makes the chart fill 100% of available width
        // height={500} sets a fixed pixel height
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 120 }}>

            {/* Background grid lines — strokeDasharray makes them dashed */}
            <CartesianGrid strokeDasharray="3 3" />

            {/* X axis uses country name as the label.
                angle={-45} rotates labels so they don't overlap.
                textAnchor="end" aligns rotated text correctly.
                interval={0} forces every label to show, not just some */}
            <XAxis
              dataKey="country"
              angle={-45}
              textAnchor="end"
              interval={0}
              tick={{ fontSize: 11 }}
            />

            {/* Y axis — recharts figures out the scale automatically from the data */}
            <YAxis />

            {/* Tooltip popup on hover — formatter cleans up the metric name
                by replacing underscores with spaces for display */}
            <Tooltip
              formatter={(value, name) => [value, metric.replace(/_/g, " ")]}
              labelFormatter={label => `Country: ${label}`}
            />

            {/* Bar tells recharts to use the "value" field from each data object
                as the bar height — "value" is what our API returns for the metric */}
            <Bar dataKey="value">
              {/* Cell lets us color each bar individually.
                  We look up the country's region in REGION_COLORS,
                  falling back to a default purple if region not found */}
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={REGION_COLORS[entry.region] || "#8884d8"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      {/* ── Legend ── */}
      {/* Manually built legend — loops over REGION_COLORS entries to show
          a colored square next to each region name */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "1rem" }}>
        {Object.entries(REGION_COLORS).map(([r, color]) => (
          // Each legend item is a flex row with a colored square and text
          <div key={r} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            {/* The colored square — just a div with background color */}
            <div style={{ width: 14, height: 14, background: color, borderRadius: 2 }} />
            <span style={{ fontSize: 12 }}>{r}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
