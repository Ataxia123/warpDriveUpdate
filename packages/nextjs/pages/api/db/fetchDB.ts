import { MongoClient } from 'mongodb'
import axios from "axios";

import { NextApiRequest, NextApiResponse } from "next";

const url = process.env.MONGODB_URI || 'mongodb://0.0.0.0:27017'
const client = new MongoClient(url);
// Database Name
const dbName = 'mementoMori';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    await client.connect();

    console.log('Connected successfully to server');
    try {
        const db = client.db(dbName); // Connect to the Database
        const collection = db.collection('players'); // Access to 'players' collection
        // Access to 'players' collection
        const itemCollection = db.collection('items'); // 
        const respectsCollection = db.collection('respects')
        const respectsTally = db.collection('respectsTally');

        const items = await itemCollection.find({}).toArray();
        const players = await collection.find({}).toArray();
        const respects = await respectsCollection.find({}).toArray();
        const respectsTallies = await respectsTally.find({}).toArray();

        // Get all players from collection
        res.status(200).json({ db: { items: items, players: players, respectsTallies: respectsTallies, respects: respects } }); // Response to MongoClient
    } catch (error: any) {
        res.status(500).json({ message: error.message }); // Response to MongoClient
    }
};


