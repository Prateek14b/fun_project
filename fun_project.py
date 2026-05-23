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


