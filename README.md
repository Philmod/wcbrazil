russia2018
==========

Single page to see the last scores of the World Cup 2018, realtime comments, and scores of the bets.

## Prerequisites
- MongoDB
- Redis

## Installation
```
$ npm install
```

## Start server
```
$ node .
```

## Add finales
- Add the round games into `gamesFinalesX.json`, without forgetting the property `finales: X`.
- For the bets, make a csv file using http://www.convertcsv.com/csv-to-json.htm
- Add the bets into `betsFinalesX.json`, without forgetting the property `finales: X`.
- Uncomment the lines for the games and bets in db/load_data
- `npm run load-data`
