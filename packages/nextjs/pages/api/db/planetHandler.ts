

import { NextApiRequest, NextApiResponse } from "next";
import { EncounterResultData, PilotData, PlanetData } from '~~/types/appTypes';
import { MongoClient } from 'mongodb'

const url = process.env.MONGODB_URI || 'mongodb://0.0.0.0:27017'
const client = new MongoClient(url);
await client.connect();
console.log('Connected successfully to server');
// Database Name
const dbName = 'mementoMori';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Use connect method to connect to the server
    const db = client.db(dbName); // Connect to the Database
    const planets = db.collection('planets'); // Access to 'players' collection
    // Access to 'players' collection
    //
    const inputPlayerData = req.body;


    // function to save player
    async function registerPilot(planetData: PlanetData) {
        // Save only if player id does not exist

        await planets.updateOne(
            { id: planetData.planetId },
            { $setOnInsert: planetData },
            { upsert: true }, // this creates new document if none match the filter
        );
    }

    registerPilot(inputPlayerData);

    // Get all players from collection
    res.json({ status: 'success', message: 'Players added to DB', body: inputPlayerData });


};

