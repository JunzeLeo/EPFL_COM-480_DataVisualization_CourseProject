# Project of Data Visualization (COM-480)

| Student's name | SCIPER |
| -------------- | ------ |
| Yusi Zou       | 257232 |
| Junze Li       | 293498 |
| Zhantao Deng   | 294208 |

[Milestone 1](#milestone-1-friday-3rd-april-5pm) • [Milestone 2](#milestone-2-friday-1st-may-5pm) • [Milestone 3](#milestone-3-thursday-28th-may-5pm)

## Milestone 1 (Friday 3rd April, 5pm)

**10% of the final grade**

### 2.1 Dataset

[**Earth Surface Temperature**:](https://www.kaggle.com/berkeleyearth/climate-change-earth-surface-temperature-data) This dataset contains the average temperature of major cities since 1849 in CSV format. Some of the temperature data before the 1940s is missing due to the lack of weather stations and we could focus on the temperature variation in recent years.

[**Impact of Countries on Global Warming**:](https://www.kaggle.com/catamount11/who-is-resposible-for-global-warming) This dataset contains the amount of CO2 emissions of each country from 1960 to 2018 (2014 actually) and some metadata of each country (e.g. location, income, etc.). The data is well-prepared in CSV format. 

[**Global Food & Agriculture Statistics**:](https://www.kaggle.com/unitednations/global-food-agriculture-statistics) This dataset contains agriculture data (e.g. crops, fertilizer, forest, land, etc.) for 200 countries and more than 200 primary products in CSV format. Although this dataset provides very rich information, it results in a bit higher workload for data preprocessing. We will first decide what we could like to visualize and extract that information.

[**Urbanization**:](https://ourworldindata.org/urbanization) This dataset contains urbanization related factors of each country, for example, the share of populations living in urban areas, GDP per capita and employment rate in agriculture. The data is well-prepared in CSV format but these factors have different time range.


[**Deforestation**:](http://www.fao.org/faostat/en/?#data/GF) This dataset is in CSV format and contains data from the Food and Agriculture Organization of the United Nations about the area of forest land per country and net CO2 emission/removal from Forest Land. It is clean and we only need to remove some unrelated columns for use.


[**Threatened species:**](https://stats.oecd.org/viewhtml.aspx?datasetcode=WILD_LIFE&lang=en) This dataset is in CSV format and contains information about the number of species in danger with respect to the  country and their degree of danger. It does not have information for every country (only 40), but having the important ones, like Australia, should be enough for us. The dataset is clean and we will need to extract useful columns. 

### 2.2 Problematic

#### Background
Since the dawn of the Industrial Revolution in the 19th century, the average temperature of the Earth has [increased more than 1.0 Celsius](https://earthobservatory.nasa.gov/world-of-change/decadaltemp.php). However, in recent years, global warming and climate change have been the subject of a great deal of political controversy, especially in the U.S.. The U.S. president, Trump, has criticized in his twitter that the global warming is "[a hoax](https://twitter.com/realDonaldTrump/status/427226424987385856)", "[fictional](https://twitter.com/realDonaldTrump/status/509436043368873984)", and even "[bullshit](https://twitter.com/realDonaldTrump/status/418542137899491328)". 

Is global warming real? What are its causes and consequences? Especially, **what are the impacts on lives?**

#### Motivation

While the world is overwhelmed with the COVID-19 pandemic, the earth is still warming and many lives are suffering from the heating planet. A recent news reports that Antarctica has hit the highest temperature on record of 18.3C in February 2020. The climate zone for lives now is shrinking.

To keep within the climate zone for survival, most species on this planet, including plants, will have to migrate[](https://wwf.panda.org/our_work/wildlife/problems/climate_change/). However, many species will not be able to redistribute themselves fast enough, i.e. these species may well become extinct. 

Human beings are no exception. Global warming could lead to extreme climates and the weather, such as ozone depletion, El Niño, increased danger of wildland fires, the global spread of infectious diseases, drought and flood, which would seriously affect the food-producing system and humanitarianism.

In this project, we would like to visualize the factors related to global warming and its effects on species and human beings so that to appeal more concern from the general public to this global challenge. 


### 2.3 Exploratory Data Analysis

#### 1. Global temperature and CO2 emission
As the most direct view of Global warming, we collect data of the **earth surface temperature** which has 239'176 rows in total, corresponding to monthly temperature since 1849.

For **CO2 emission**, we have data of 263 countries and areas around the world, from 1960 to 2014. Countries and areas are classified according to their location and Income. The CO2 emissions are computed as metric tons per capita. 

As a very important factor of CO2 emission and absorption, **deforestation** data will be included in our visualization. After data cleaning, our deforestation data have 237 countries, including data from 1990 to 2017. This gives us information about how the forest land area evolves for 28 years.

#### 2. Food and agriculture
The dataset for **food and agriculture** contains 5 main CSV files, including data for crops, fertilizers, forest, land and production indices. All the 5 files have similar structures. For each country and area, it provides the value of harvest area, yield, production quantity, etc. of different crops for every year between 1990 to 2007.

#### 3. Urbanization
The date for the **urbanization** phenomenon contains the following aspects:

- *Urban & Rural Population Proportion*: the share of population living in urban and rural areas from 1960 to 2017 of 261 countries.
- *Urbanization vs. GDP*: the GDP per capita of 310 different countries from 1960 to 2016.
- *Urbanization vs. Employment in Agriculture*: the share of the population employed in agriculture of 287 different countries from 1991 to 2017.

#### 4. Threatened species
The data for **threatened species** has 3'385 rows and has columns including *category* as the degree of danger of the species, *class* (e.g. mammals, birds, etc.), *unit* (number or percentage) and *value*.

### 2.4 Related work

Global warming has been already widely discussed in recent years, especially its causes and consequences. However, it is difficult to just blame global warming and let it be 100% responsible for everything, and some politicians use this argument to underestimate the impact of global warming. 

In this project, we want to show how global warming is related to the commonly believed causes and consequences, not trying to conclude the causations but to show the correlations. Especially, we want to show to the general public how global warming is related to the living conditions for all the live beings on the planet, and it is up to them to believe how important is this problem.

We have found in [this website](https://ourworldindata.org/urbanization) some beautiful examples of visualization, for example, using a world map, shows several dimension of information within one graph by using the x and y-axis, colors, the size of the data points, etc. Colors are one of the most important factors in visualization, so we have also found [this website](https://colorhunt.co/) with color panels that might be useful. 



## Milestone 2 (Friday 1st May, 5pm)

**10% of the final grade**

[Report](milestone2_report.pdf)


## Milestone 3 (Thursday 28th May, 5pm)

**80% of the final grade**

We build a [website]( https://com-480-data-visualization.github.io/com-480-project-zalda/ ) for our project. We encourage the user to interact with mouse by clicking or placing the mouse at a certain position.

To have a better idea of the navigation of our website, you can watch a demo [video](https://youtu.be/OimlEKNZVxs).

We have also written a [process book](processBook.pdf) to describe the path we took to obtain the final result.

