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
<!-- 
1. Datasets. 
2. Quality of the data it contains 
3. how much preprocessing require for VIZ
-->

[Earth Surface Temperature:](https://www.kaggle.com/berkeleyearth/climate-change-earth-surface-temperature-data) This dataset contains land and ocean temperature since 1750 by different scales (eg. country, state, major city etc).

[Impact of Countries on Global Warming:](https://www.kaggle.com/catamount11/who-is-resposible-for-global-warming) This dataset contains the amount of CO2 emissions of each country from 1960 to 2018 and some meta data of each country (eg. location, income etc).

[Global Food & Agriculture Statistics:](https://www.kaggle.com/unitednations/global-food-agriculture-statistics) This dataset contains agriculture data (eg. crops, fertilizer, forest, land etc.) for 200 countries and more than 200 primary products.

[Urbanization:](https://ourworldindata.org/urbanization) This dataset contains urbanization related data of each country, for example, share of populations living in urban areas, GDP per capita and employment in agriculture.


[Deforestation:](http://www.fao.org/faostat/en/?#data/GF) This dataset contains data from Food and Agriculture Organization of the United Nations about the area of forest land per country and net CO2 emission/removal from Forest Land.


[Threatened species](https://stats.oecd.org/viewhtml.aspx?datasetcode=WILD_LIFE&lang=en) This dataset contains information about number of species in danger with respect to country and degree of danger.

### 2.2 Problematic

#### Background
Since the dawn of the Industrial Revolution in the 19th centry, the average temperatry of the Earth has [increased more than 1.0 Celsius](https://earthobservatory.nasa.gov/world-of-change/decadaltemp.php). However, in recent years, global warming and climate change have been the subject of a great deal of political controversy, especially in the U.S. The U.S. president, Trump, has critisizes in his twitter that the global warming is "[a hoax](https://twitter.com/realDonaldTrump/status/427226424987385856)", "[fictional](https://twitter.com/realDonaldTrump/status/509436043368873984)", and even "[bullshit](https://twitter.com/realDonaldTrump/status/418542137899491328)". 

Is global warming real? What are its causes and consequences? Especially, **what are the impacts on lives?**

#### Motivation
<!-- 
1. What am I trying to show with my VIZ
2. overview for the project, motivation, target audience.
 -->

While the world is overwhelmed with the COVID-19 pandemic, the Earth is still warming and many lifes are suffering from the heating planet. A recent news reports that the anarctica has hitted the highest temperature on record of 18.3C in February 2020. Climate zone for lifes now is shrinking.

To keep within the climate zone for survival, most species on this planet, including plants, will have to migrate[](https://wwf.panda.org/our_work/wildlife/problems/climate_change/). However, many species will not be able to redistribute themselves fast enough, i.e. these species may well become extinct. 

Human beings are no exception. Global warming could lead to extrem climates and wethers, such as ozone depletion, El Niño, increased danger of wildland fires, global spread of infectious diseases, drought and flood, which would seriously affect food-producing system and humanitariarism.

In this project, we would like to visualize the reasons for global warming and its effects to species and human beings so that to appeal more concern from general public to this global challenge. 


### 2.3 Exploratory Data Analysis
<!-- Pre-processing of the data set you chose: basic statistics + insights about the data -->

<!-- Your big sis adds this: we can show size, data/tuples, classes/columns, max 2 figures per dataset max., -->

The dataset for the **deforestation** has 50'562 rows in total. The dataset is well prepared, after a simple cleaning, we only needs to extract useful information from it. For each of the 237 countries, it shows the forest land area and the corresponding implied emission factor for CO2 from 1990 to 2017. This dataset give us information about how the forest land area evoluate during 28 years and how many CO2 it emits or absorbs.

![Here is an example plot of the given data, I let my big bros decide to use it or not](https://i.imgur.com/Nuc3iZO.png)


The dataset for **threatened species** has 3'385 rows in total. We extract from the raw data the following information: 
- Category: the degree of danger of the species (e.g. endangered, critically endangered, etc.)
- Class: e.g. mammals, birds, etc.
- Country: 40 countries in total
- Unit: either the value is a number or a percentage
- Value: the actual number or percentage 

### 2.4 Related work

<!-- 
- What others have already done with the data?
- Why is your approach original?
- What source of inspiration do you take? Visualizations that you found on other websites or magazines (might be unrelated to your data).
-->




## Milestone 2 (Friday 1st May, 5pm)

**10% of the final grade**




## Milestone 3 (Thursday 28th May, 5pm)

**80% of the final grade**