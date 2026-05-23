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


