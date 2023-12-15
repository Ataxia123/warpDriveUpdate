

import { MongoClient } from 'mongodb'
import axios from "axios";

import { NextApiRequest, NextApiResponse } from "next";
import { Quipux } from '~~/types/appTypes';

const url = process.env.MONGODB_URI || 'mongodb://0.0.0.0:27017'
const client = new MongoClient(url);
await client.connect();
console.log('Connected successfully to server');
// Database Name
const dbName = 'mementoMori';

export default async function quipuxHandler(req: NextApiRequest, res: NextApiResponse) {
    // Use connect method to connect to the server
    const db = client.db(dbName); // Connect to the Database
    const respects = db.collection('quipux'); // Access to 'players' collection
    // Access to 'players' collection


    const inputPlayerData = req.body;


    // function to save player
    async function registerQuipux(quipuxData: Quipux) {
        // Save only if player id does not exist

        await respects.updateOne(
            { id: quipuxData.quipuxId, },
            { $setOnInsert: quipuxData },
            { upsert: true }, // this creates new document if none match the filter
        );


    }
    registerQuipux(inputPlayerData);
    // Get all players from collection
    res.json({ status: 'success', message: 'Players added to DB', body: inputPlayerData });


};
