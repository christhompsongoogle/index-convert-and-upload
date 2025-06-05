"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
/**
 * Converts index data from a local dump format to the firestore.indexes.json format and adds it.
 *
 * @param firestoreIndexesJson The existing firestore.indexes.json object.
 * @param localIndexDump The local index dump object.
 * @returns The updated firestore.indexes.json object.
 */
function convertAndAddIndexes(firestoreIndexesJson, localIndexDump) {
    localIndexDump.reports.forEach((report) => {
        const collectionGroupMatch = report.index.name.match(/collectionGroups\/([^/]+)/);
        if (!collectionGroupMatch) {
            return;
        }
        const newIndex = {
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
const firestoreIndexesJson = {
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
const localIndexDump = JSON.parse((0, fs_1.readFileSync)('emulator_index_dump.json', 'utf8'));
const updatedFirestoreIndexes = convertAndAddIndexes(firestoreIndexesJson, localIndexDump);
console.log(JSON.stringify(updatedFirestoreIndexes, null, 2));
