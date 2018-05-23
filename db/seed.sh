#!/bin/bash
# usage: db/seed.sh localhost russia2018_localhost dbport dbuser dbpwd 

DIR="$( cd "$( dirname "$0" )" && pwd )"

DBHOST=$1
DBNAME=$2
DBPORT=$3
DBUSER=$4
DBPWD=$5

if [ -z $1 ] 
then
  DBHOST="localhost"
fi
  
if [ -z $2 ] 
then
  DBNAME="russia2018_localhost"
fi

 echo "Running mongo_seed.js with db $DBHOST/$DBNAME"
 mongo $DBHOST/$DBNAME $DIR/mongo_seed.js

# echo "Restoring database with content"
#mongorestore -d $DBNAME $DIR/dump/$DBNAME

CMD="mongoimport --host $DBHOST --upsert -d $DBNAME -c sourcesv5"

if [ $3 ]
then
  CMD="$CMD --port $DBPORT"
fi

if [ $4 ]
then
  CMD="$CMD -u $DBUSER -p $DBPWD"
fi

echo "Running command $CMD"
