
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import type { NftData } from "~~/types/appTypes";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_AUTH_TOKEN,
});

async function generateScannerOutput(metadata: any, capName: string) {
    const messages: any[] = [
        {
            role: "system",
            content: `You are Navi, an AI registrar for the Alliance of the
            Infinite Universe. You recieve beacon signals transmitting reports from 
            Entities of the Alliance. Fill out the JSON structure provided.
             Use your creativity to  complete the format with interesting data.
           

        {        
        beaconData: Location;
        heroCodex:{
            heroId: string;
            shipId: string;
            questBrief: string;
            stats: Stats;
            abilities: string[];
            inventory: Item[];
            powerLevel: number;
            funFact: string;
            locationBeacon0: Location;
        
        };
`
            ,
        },
        {
            role: "assistant",
            content: `


 type Location = {
    locationId: string;
    coordinates: [
        x: number,
        y: number,
        z: number,
    ];
    locationName: string;
    locationFunFact: string;
    nearestLocationId: string;
    navigationNotes: string;
    imageUrl: string;
}

type Item = {
    itemId: string;
    weight: number;
    rarity: string;
    aiUseAnalysis: string;
    creditValue: number;
}`,
        },
        {
            role: "user",
            content: `
SUBMITTING PILOT DATA TO ALLIANCE DATABASE.
REQUESTING ATTESTATION FROM AIU-CENTRAL.
Triangulate the data for the heroCodex entry of the following captain: ${capName} 

          


`,
        },
    ];

    const stream = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-1106",
        messages: messages,
        response_format: { type: "json_object" },
        temperature: 1.5,
    });

    const rawOutput = stream.choices[0].message.content;
    const openAIResponse = rawOutput?.trim();
    return openAIResponse;
}
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { nftQuery, capName } = req.body;
        console.log(nftQuery, capName, req.body);
        try {
            const beacon = await generateScannerOutput(nftQuery, capName);

            res.status(200).json(beacon);
        } catch (error) {
            res.status(500).json({ error: "Error generating scanner output." });
        }
    } else {
        res.status(405).json({ error: "Method not allowed." });
    }
};


