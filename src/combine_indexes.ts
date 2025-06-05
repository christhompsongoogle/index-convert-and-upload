import { readFileSync } from 'fs';

interface FirestoreIndexes {
  indexes: Index[];
  fieldOverrides: any[];
}

interface Index {
  collectionGroup: string;
  queryScope: string;
  fields: Field[];
}

interface Field {
  fieldPath: string;
  order: string;
}

interface IndexDump {
  reports: Report[];
}

interface Report {
  index: DumpIndex;
  numQueries: string;
}

interface DumpIndex {
  name: string;
  queryScope: string;
  fields: DumpField[];
}

interface DumpField {
  fieldPath: string;
  order: string;
}

/**
 * Converts index data from a local dump format to the firestore.indexes.json format and adds it.
 *
 * @param firestoreIndexesJson The existing firestore.indexes.json object.
 * @param localIndexDump The local index dump object.
 * @returns The updated firestore.indexes.json object.
 */
function convertAndAddIndexes(
  firestoreIndexesJson: FirestoreIndexes,
  localIndexDump: IndexDump
): FirestoreIndexes {
  localIndexDump.reports.forEach((report) => {
    const collectionGroupMatch = report.index.name.match(
      /collectionGroups\/([^/]+)/
    );
    if (!collectionGroupMatch) {
      return;
    }

    const newIndex: Index = {
      collectionGroup: collectionGroupMatch[1],
      queryScope: report.index.queryScope,
      fields: report.index.fields
        .filter((field) => field.fieldPath !== "__name__")
        .map((field) => ({
          fieldPath: field.fieldPath,
          order: field.order,
        })),
    };

    firestoreIndexesJson.indexes.push(newIndex);
  });

  return firestoreIndexesJson;
}

// Example Usage:

const firestoreIndexesJson: FirestoreIndexes = {
  indexes: [
    {
      collectionGroup: "cities",
      queryScope: "COLLECTION",
      fields: [
        {
          fieldPath: "state",
          order: "ASCENDING",
        },
        {
          fieldPath: "name",
          order: "ASCENDING",
        },
      ],
    },
  ],
  fieldOverrides: [],
};

const localIndexDump: IndexDump = JSON.parse(readFileSync('emulator_index_dump.json', 'utf8'));

const updatedFirestoreIndexes = convertAndAddIndexes(
  firestoreIndexesJson,
  localIndexDump
);

console.log(JSON.stringify(updatedFirestoreIndexes, null, 2));