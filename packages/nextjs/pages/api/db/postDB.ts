import { MongoClient } from 'mongodb'
import axios from "axios";

import { NextApiRequest, NextApiResponse } from "next";

const url = process.env.MONGODB_URI || 'mongodb://0.0.0.0:27017'
const client = new MongoClient(url);
await client.connect();
console.log('Connected successfully to server');
// Database Name
const dbName = 'mementoMori';


export const databaseHandler = async (req: NextApiRequest, res: NextApiResponse) => {

    try {
        const db = client.db(dbName); // Connect to the Database
        const collection = db.collection('players'); // Access to 'players' collection
        // Access to 'players' collection
        const pilotCollection = db.collection('players'); // 
        const planetCollection = db.collection('planets')
        const shipsCollection = db.collection('ships');
        const missionCollection = db.collection('missions');
        const encounterCollection = db.collection('encounters');

        const quipuxCollection = db.collection('quipuxs');

        const pilots = await pilotCollection.find({}).toArray();
        const ships = await shipsCollection.find({}).toArray();
        const missions = await missionCollection.find({}).toArray();
        const encounters = await encounterCollection.find({}).toArray();
        const quipux = await quipuxCollection.find({}).toArray();
        const planets = await planetCollection.find({}).toArray();

        // Get all players from collection
        res.status(200).json({ pilots, ships, missions, encounters, quipux, planets }); // Response to MongoClient
    } catch (error: any) {
        res.status(500).json({ message: error.message }); // Response to MongoClient
    }
};


