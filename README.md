## Repro setup:

firebase init
npm init
npm install --save-dev typescript @types/node
npx tsc --init
add `"build": "tsc"` to package.json
  "runQueriesAgainstEmulator": "ts-node src/index.ts"

ADd tsconfig:

  "include": ["src"],
  "exclude": ["node_modules"]
Ensure firebase.json includes databases and indexes


## To run
firebase emulators:start --project=ctfirestoreindexes

npm run build

npm run runQueriesAgainstEmulator

curl http://127.0.0.1:8080/emulator/v1/projects/ctfirestoreindexes:indexUsage?database=projects/ctfirestoreindexes/databases/\(default\)

## Returns the following indexes:
{
  "reports": [{
    "index": {
      "name": "projects/ctfirestoreindexes/databases/(default)/collectionGroups/cities/indexes/_",
      "queryScope": "COLLECTION",
      "fields": [{
        "fieldPath": "name",
        "order": "ASCENDING"
      }, {
        "fieldPath": "state",
        "order": "ASCENDING"
      }, {
        "fieldPath": "__name__",
        "order": "ASCENDING"
      }]
    },
    "numQueries": "6"
  }, {
    "index": {
      "name": "projects/ctfirestoreindexes/databases/(default)/collectionGroups/cities/indexes/_",
      "queryScope": "COLLECTION",
      "fields": [{
        "fieldPath": "state",
        "order": "ASCENDING"
      }, {
        "fieldPath": "population",
        "order": "ASCENDING"
      }, {
        "fieldPath": "__name__",
        "order": "ASCENDING"
      }]
    },
    "numQueries": "2"
  }]
}

## to get already-deployed indexes:
firebase firestore:indexes

## to deploy new indexes:
firebase deploy --only firestore:indexes

## Transform emulator json to firestore.indexes.json in combine_indexes.ts
As a proof of concept run

curl http://127.0.0.1:8080/emulator/v1/projects/ctfirestoreindexes:indexUsage?database=projects/ctfirestoreindexes/databases/\(default\) > emulator_index_dump.json
npm run convertTofirestoreIndexesJson

This will print out the new json file. Some additional work is required to replace firestore.indexes.json with the new json.

## Transform notes in combine_indexes.ts
removes __name__
convert "name" to "collectionGroup" by taking the collection ID
flatten reports.index
delete numQueries