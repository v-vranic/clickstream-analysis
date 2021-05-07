Practical part

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Applications:

event-producer - Java Spring Boot application

Description: 

Application reads data from file and sends to Apache Kafka topic at random intervals. Apache Druid is configured to read data from Kafka topic. This application is used to simulate clickstream from file.

event-producer-web-app - Angular application

Description:

Web Shop client application that sends clickstream events using Divolte Collector tracker tag. Clickstream events are collected by Divolte Collector and sent to Apache Kafka topic. Apache Druid is configured to read data from Kafka topic.

Data from Kafka stream is ingested into Apache Druid database. Apache Superset is afterwards used for querying and visualizing data from Druid.

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Technologies used: 

[Apache Druid](https://druid.apache.org) - Version: 0.20.0

[Apache Kafka](https://kafka.apache.org) - Version: 2.7.0

[Divolte Collector](https://divolte.io) - Version: 0.9.0

[Angular](https://angular.io) - Version: 11.2.4

[Spring](https://spring.io) - Version: 2.4.3

[Apache Superset](https://superset.apache.org) - Version: 1.0.1
  
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Clickstream event used in project is based on structure of the event from dataset referenced below. Dataset was used to provide sample data for analysis. 

Source of dataset:

https://www.kaggle.com/mkechinov/ecommerce-behavior-data-from-multi-category-store

https://rees46.com

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
