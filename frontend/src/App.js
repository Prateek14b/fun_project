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
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Page header */}
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🌍 World Happiness Report</h1>
        <p className="text-gray-500 mb-8">Explore happiness metrics across countries and regions from 2015–2019</p>

        {/* ── Controls card ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-wrap gap-8">

            {/* Year slider */}
            <div className="flex-1 min-w-48">
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Year: <span className="text-blue-600">{year}</span>
              </label>
              <input
                type="range"
                min={Math.min(...filters.years)}
                max={Math.max(...filters.years)}
                step={1}
                value={year}
                onChange={e => setYear(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{Math.min(...filters.years)}</span>
                <span>{Math.max(...filters.years)}</span>
              </div>
            </div>

            {/* Region dropdown */}
            <div className="flex-1 min-w-48">
              <label className="block text-sm font-semibold text-gray-600 mb-2">Region</label>
              <select
                value={region}
                onChange={e => setRegion(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">All regions</option>
                {filters.regions.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Metric dropdown */}
            <div className="flex-1 min-w-48">
              <label className="block text-sm font-semibold text-gray-600 mb-2">Metric</label>
              <select
                value={metric}
                onChange={e => setMetric(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
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
        </div>

        {/* ── Chart card ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          {loading ? (
            <div className="flex items-center justify-center h-96 text-gray-400">
              <p className="text-lg">Loading...</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={500}>
              <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 120 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="country"
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                />
                <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
                  formatter={(value) => [value, metric.replace(/_/g, " ")]}
                  labelFormatter={label => `Country: ${label}`}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
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
        </div>

        {/* ── Legend card ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm font-semibold text-gray-600 mb-4">Regions</p>
          <div className="flex flex-wrap gap-4">
            {Object.entries(REGION_COLORS).map(([r, color]) => (
              <div key={r} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm flex-shrink-0"
                  style={{ background: color }}
                />
                <span className="text-xs text-gray-600">{r}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
