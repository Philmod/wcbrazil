// db.dropDatabase();

//db.games.drop();
db.games.ensureIndex({ time: 1 });
db.games.ensureIndex({ teams: 1 });
