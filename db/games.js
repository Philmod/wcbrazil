var games = [ 
  { group: 'A',
    teams: [ 'Brazil', 'Croatia' ],
    score: [ 0, 0 ],
    time: new Date(2014, 5, 12, 13, 0, 0)
  },
  { group: 'A',
    teams: [ 'Mexico', 'Cameroon' ],
    score: [ 0, 0 ],
    time: new Date(2014, 5, 13, 9, 0, 0)
  },
  { group: 'A',
    teams: [ 'Brazil', 'Mexico' ],
    score: [ 0, 0 ],
    time: new Date(2014, 5, 17, 12, 0, 0)
  },
  { group: 'A',
    teams: [ 'Cameroon', 'Croatia' ],
    score: [ 0, 0 ],
    time: new Date(2014, 5, 18, 15, 0, 0)
  },
  { group: 'A',
    teams: [ 'Cameroon', 'Brazil' ],
    score: [ 0, 0 ],
    time: new Date(2014, 5, 23, 13, 0, 0)
  },
  { group: 'A',
    teams: [ 'Croatia', 'Mexico' ],
    score: [ 0, 0 ],
    time: new Date(2014, 5, 23, 13, 0, 0)
  },
  { group: 'B',
    teams: [ 'Spain', 'Netherlands' ],
    score: [ 0, 0 ],
    time: new Date(2014, 5, 13, 12, 0, 0)
  },
  { group: 'B',
    teams: [ 'Chile', 'Australia' ],
    score: [ 0, 0 ],
    time: new Date(2014, 5, 13, 15, 0, 0)
  },
  { group: 'B',
    teams: [ 'Australia', 'Netherlands' ],
    score: [ 0, 0 ],
    time: new Date(2014, 5, 18, 9, 0, 0)
  },
  { group: 'B',
    teams: [ 'Spain', 'Chile' ],
    score: [ 0, 0 ],
    time: new Date(2014, 5, 18, 12, 0, 0)
  },
  { group: 'B',
    teams: [ 'Australia', 'Spain' ],
    score: [ 0, 0 ],
    time: new Date(2014, 5, 23, 9, 0, 0)
  },
  { group: 'B',
    teams: [ 'Netherlands', 'Chile' ],
    score: [ 0, 0 ],
    time: new Date(2014, 5, 23, 9, 0, 0)
  },
  { group: 'C',
    teams: [ 'Colombia', 'Greece' ],
    score: [ 0, 0 ],
    time: new Date(2014, 5, 14, 9, 0, 0)
  },
  { group: 'C',
    teams: [ 'Ivory Coast', 'Japan' ],
    score: [ 0, 0 ],
    time: new Date(2014, 5, 15, 18, 0, 0)
  },
  { group: 'C',
    teams: [ 'Colombia', 'Ivory Coast' ],
    score: [ 0, 0 ],
    time: new Date(2014, 5, 19, 9, 0, 0)
  },
  { group: 'C',
    teams: [ 'Japan', 'Greece' ],
    score: [ 0, 0 ],
    time: new Date(2014, 5, 19, 15, 0, 0)
  },
  { group: 'C',
    teams: [ 'Greece', 'Ivory Coast' ],
    score: [ 0, 0 ],
    time: new Date(2014, 5, 24, 13, 0, 0)
  },
  { group: 'C',
    teams: [ 'Japan', 'Colombia' ],
    score: [ 0, 0 ],
    time: new Date(2014, 5, 24, 13, 0, 0)
  },
  { group: 'D',
    teams: [ 'Uruguay', 'Costa Rica' ],
    score: [ 0, 0 ],
    time: new Date(2014, 5, 14, 12, 0, 0)
  },
  { group: 'D',
    teams: [ 'England', 'Italy' ],
    score: [ 0, 0 ],
    time: new Date(2014, 5, 14, 15, 0, 0)
  },
  { group: 'D',
    teams: [ 'Uruguay', 'England' ],
    score: [ 0, 0 ],
    time: new Date(2014, 5, 19, 12, 0, 0)
  },
  { group: 'D',
    teams: [ 'Italy', 'Costa Rica' ],
    score: [ 0, 0 ],
    time: new Date(2014, 5, 20, 9, 0, 0)
  },
  { group: 'D',
    teams: [ 'Costa Rica', 'England' ],
    score: [ 0, 0 ],
    time: new Date(2014, 5, 24, 9, 0, 0)
  },
  { group: 'D',
    teams: [ 'Italy', 'Uruguay' ],
    score: [ 0, 0 ],
    time: new Date(2014, 5, 24, 9, 0, 0)
  },
  { group: 'E',
    teams: [ 'Switzerland', 'Ecuador' ],
    score: [ 0, 0 ],
    time: new Date(2014, 5, 15, 9, 0, 0)
  },
  { group: 'E',
    teams: [ 'France', 'Honduras' ],
    score: [ 0, 0 ],
    time: new Date(2014, 5, 15, 12, 0, 0)
  },
  { group: 'E',
    teams: [ 'Switzerland', 'France' ],
    score: [ 0, 0 ],
    time: new Date(2014, 5, 20, 12, 0, 0)
  },
  { group: 'E',
    teams: [ 'Honduras', 'Ecuador' ],
    score: [ 0, 0 ],
    time: new Date(2014, 5, 20, 15, 0, 0)
  },
  { group: 'E',
    teams: [ 'Ecuador', 'France' ],
    score: [ 0, 0 ],
    time: new Date(2014, 5, 25, 13, 0, 0)
  },
  { group: 'E',
    teams: [ 'Honduras', 'Switzerland' ],
    score: [ 0, 0 ],
    time: new Date(2014, 5, 25, 13, 0, 0)
  },
  { group: 'F',
    teams: [ 'Argentina', 'Bosnia-Herzegovina' ],
    score: [ 0, 0 ],
    time: new Date(2014, 5, 15, 15, 0, 0)
  },
  { group: 'F',
    teams: [ 'Iran', 'Nigeria' ],
    score: [ 0, 0 ],
    time: new Date(2014, 5, 16, 12, 0, 0)
  },
  { group: 'F',
    teams: [ 'Argentina', 'Iran' ],
    score: [ 0, 0 ],
    time: new Date(2014, 5, 21, 9, 0, 0)
  },
  { group: 'F',
    teams: [ 'Nigeria', 'Bosnia-Herzegovina' ],
    score: [ 0, 0 ],
    time: new Date(2014, 5, 21, 15, 0, 0)
  },
  { group: 'F',
    teams: [ 'Bosnia-Herzegovina', 'Iran' ],
    score: [ 0, 0 ],
    time: new Date(2014, 5, 25, 9, 0, 0)
  },
  { group: 'F',
    teams: [ 'Nigeria', 'Argentina' ],
    score: [ 0, 0 ],
    time: new Date(2014, 5, 25, 9, 0, 0)
  },
  { group: 'G',
    teams: [ 'Germany', 'Portugal' ],
    score: [ 0, 0 ],
    time: new Date(2014, 5, 16, 9, 0, 0)
  },
  { group: 'G',
    teams: [ 'Ghana', 'USA' ],
    score: [ 0, 0 ],
    time: new Date(2014, 5, 16, 15, 0, 0)
  },
  { group: 'G',
    teams: [ 'Germany', 'Ghana' ],
    score: [ 0, 0 ],
    time: new Date(2014, 5, 21, 12, 0, 0)
  },
  { group: 'G',
    teams: [ 'USA', 'Portugal' ],
    score: [ 0, 0 ],
    time: new Date(2014, 5, 22, 15, 0, 0)
  },
  { group: 'G',
    teams: [ 'Portugal', 'Ghana' ],
    score: [ 0, 0 ],
    time: new Date(2014, 5, 26, 9, 0, 0)
  },
  { group: 'G',
    teams: [ 'USA', 'Germany' ],
    score: [ 0, 0 ],
    time: new Date(2014, 5, 26, 9, 0, 0)
  },
  { group: 'H',
    teams: [ 'Belgium', 'Algeria' ],
    score: [ 0, 0 ],
    time: new Date(2014, 5, 17, 9, 0, 0)
  },
  { group: 'H',
    teams: [ 'Russia', 'South Korea' ],
    score: [ 0, 0 ],
    time: new Date(2014, 5, 17, 15, 0, 0)
  },
  { group: 'H',
    teams: [ 'Belgium', 'Russia' ],
    score: [ 0, 0 ],
    time: new Date(2014, 5, 22, 9, 0, 0)
  },
  { group: 'H',
    teams: [ 'South Korea', 'Algeria' ],
    score: [ 0, 0 ],
    time: new Date(2014, 5, 22, 12, 0, 0)
  },
  { group: 'H',
    teams: [ 'Algeria', 'Russia' ],
    score: [ 0, 0 ],
    time: new Date(2014, 5, 26, 13, 0, 0)
  },
  { group: 'H',
    teams: [ 'South Korea', 'Belgium' ],
    score: [ 0, 0 ],
    time: new Date(2014, 5, 26, 13, 0, 0)
  } 
]

console.log(JSON.stringify(games));
