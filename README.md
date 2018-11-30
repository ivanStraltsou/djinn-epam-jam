# djinn-epam-jam
EPAM Systems engineering jam

## Sensor setup
https://djinnsensor.com/ configured and pointed to custom GCP cloud function HTTP endpoint

## Cognitive test
```shell
# node.js 8+, npm 6+
npm install
npm start
```

http://localhost:9000 - hosts cognitive test

http://localhost:9000/map - hosts office map example

http://localhost:9000/analytics - custom 3D based on elasticsearch indexes (ELK is required)

`./conf/dev.json` contains app configurations

## GCP
https://github.com/ivanStraltsou/djinn-epam-jam/tree/develop/gcloud - cloud functions test and ELK compose.yml

PubSub topics hardcoded in `./conf/dev.json`
