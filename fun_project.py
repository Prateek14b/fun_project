import pandas as pd

def load_2015(path):
    df = pd.read_csv(path)
    df.rename(columns={
        "Country": "country",
        "Region": "region",
        "Happiness Rank": "happiness_rank",
        "Happiness Score": "happiness_score",
        "Economy (GDP per Capita)": "gdp_per_capita",
        "Family": "social_support",
        "Health (Life Expectancy)": "life_expectancy",
        "Freedom": "freedom",
        "Trust (Government Corruption)": "corruption",
        "Generosity": "generosity",
   })
    df = df[["country", "region", "happiness_rank", "happiness_score", "gdp_per_capita", "social_support", "life_expectancy", "freedom", "corruption", "generosity"]]
    return df

def load_2016(path):
    df = pd.read_csv(path)
    df.rename(columns={
        "Country": "country",
        "Region": "region",
        "Happiness Rank": "happiness_rank",
        "Happiness Score": "happiness_score",
        "Economy (GDP per Capita)": "gdp_per_capita",
        "Family": "social_support",
        "Health (Life Expectancy)": "life_expectancy",
        "Freedom": "freedom",
        "Trust (Government Corruption)": "corruption",
        "Generosity": "generosity",
   })
    df = df[["country", "region", "happiness_rank", "happiness_score", "gdp_per_capita", "social_support", "life_expectancy", "freedom", "corruption", "generosity"]]
    return df

def load_2017(path):
    df = pd.read_csv(path)
    df.rename(columns={
                "Country":                       "country",
        "Happiness.Rank":                "happiness_rank",
        "Happiness.Score":               "happiness_score",
        "Economy..GDP.per.Capita.":      "gdp_per_capita",
        "Family":                        "social_support",
        "Health..Life.Expectancy.":      "life_expectancy",
        "Freedom":                       "freedom",
        "Trust..Government.Corruption.": "corruption",
        "Generosity":                    "generosity",
    })
    df = df[["country","happiness_rank","happiness_score",
        "gdp_per_capita","social_support","life_expectancy",
        "freedom","corruption","generosity"]]
    
def load_2018(path):
    df = pd.read_csv(path)
    df.rename(columns= {
        "Country or region":             "country",
        "Overall rank":                  "happiness_rank",
        "Score":                         "happiness_score",
        "GDP per capita":                "gdp_per_capita",
        "Social support":                "social_support",
        "Healthy life expectancy":       "life_expectancy",
        "Freedom to make life choices":  "freedom",
        "Perceptions of corruption":     "corruption",
        "Generosity":                    "generosity",
    })
    df = df[["country","happiness_rank","happiness_score",
        "gdp_per_capita","social_support","life_expectancy",
        "freedom","corruption","generosity"]]

def load_2019(path):
    df = pd.read_csv(path)
    df.rename(columns={
        "Country or region":             "country",
        "Overall rank":                  "happiness_rank",
        "Score":                         "happiness_score",
        "GDP per capita":                "gdp_per_capita",
        "Social support":                "social_support",
        "Healthy life expectancy":       "life_expectancy",
        "Freedom to make life choices":  "freedom",
        "Perceptions of corruption":     "corruption",
        "Generosity":                    "generosity",
    })
    df = df[["country","happiness_rank","happiness_score",
        "gdp_per_capita","social_support","life_expectancy",
        "freedom","corruption","generosity"]]

#1 ----- created functions for csv -> dataframes for each year! ------


combined = { #combined dataframes into a quasi-dictionary for convenience.
    "2015": load_2015("~/archive (1)/2015.csv"),
    "2016": load_2016("~/archive (1)/2016.csv"),
    "2017": load_2017("~/archive (1)/2017.csv"),
    "2018": load_2018("~/archive (1)/2018.csv"),
    "2019": load_2019("~/archive (1)/2019.csv")
}

for year, df in combined.items():
    df.insert(0, "year", year) #we insert a new column for each year's dataframe in column position 1, and fill out all rows/records under that column with 1 value: the corresponding year in question!

#2 ----- combined dataframes and inserted year column so the combining makes more sense!--------

master = pd.concat(combined.values(),ignore_index=True)

#3 ------ now we actually concatenated the dataframes INTO ONE BIG DATAFRAME. The .concat() function allows us to stack dataframes on top of each other vertically! -------


#now it's time to fix a major inconsistency: 'no region' column from 2017 onwards, but they exist for 2015 & 2016!
region_lookup = ( pd.concat(combined[2015]["country", "region"], combined[2016]["country", "region"], ignore_index=True).dropna().set_index("country")["region"].to_dict() )

'''here, we combined 2015 and 2016 dfs into one, only took the country and region columns that are relevant for filling the new "region" column's values we will insert into master df. then we reset index from 0,1,2.. to country so we can easily look up. finally, we convert into dictionary for even faster lookup!'''

master["region"] = master.apply(lambda row: row["region"] if pd.notna(row.get("region")) else region_lookup.get(row["country"]), axis=1 )

''' now we insert a new "region" column into the master df, and fill out values for that column based on lookup results from the region_lookup df'''

#4 ----- now we inserted a 'regions' column into master df, populating its value for every row based on looking up from 2015 and 2016 regions! ------

''' now we still have a few minor fixes to make. for example, we could strip() all string column values so theres more consistency.
Plus we could round up all numeric values to 3 dp for readability. 
Finally, we can sort the master df further -- based on happiness rank (within the alr sorted year indexes!)'''

#this selects string columns only and strips whitespace.
for col in master.select_dtypes(include="object").columns:
    master[col] = master[col].str.strip()
#this selected numeric columns only and rounds them to 3 dp. coerce just catched any error non-numeric values like alpha or alphanumeric and converts them into NaN (pandas' version of NULL vals) so we can catch these later and drop them using dropna()
for col in master.select_dtypes(include="number").columns:
    master[col]= pd.to_numeric(master[col], errors="coerce").round(3)

master["happiness_rank"] = master["happiness_rank"].astype("Int64")
master = master.dropna(subset=["country", "happiness_score"]) #dropping NA values for country and happiness rank columns.
master = master.sort_values(["year", "happiness_rank"]).reset_index(drop=True) #sorting based on happiness rank within years, and resetting index values after cus this is convention.

#5 ----- DID CLEANUP (rounding numericals to 3 dp, strip() on string column values, etc.) ------

 
print(f"Total rows: {len(master)}")
print(f"Years: {sorted(master['year'].unique())}")
print(f"Regions: {sorted(master['region'].dropna().unique())}")
print(f"\nSample:\n{master.head(10).to_string()}")
print(f"\nMissing values:\n{master.isnull().sum()}")

#6 ---- PRINT PREVIEW -----
