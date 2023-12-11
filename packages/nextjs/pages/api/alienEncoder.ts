// /pages/api/generateAlienLanguage.ts
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import type { shipStatusReport } from "~~/types/appTypes";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_AUTH_TOKEN,
});

async function generateAlienLanguage(shipStatusReport?: shipStatusReport) {
  const messages: any[] = [
    {
      role: "system",
      content: `"You are the targetting computer of a ship in 
            the Alliance of the Infinite Universe. 
            Systems are operational and you are ready to begin the mission. 


            You need to need to triangulate the ship's location and provide the following report.
 Shipstatusreport = {
 shipState: {
    shipid: string;
    pilot: string;
    inventory: { fuel: number; supplies: number; cargo: { name: string; units: number; } };
    navigationdata: {

        location: { x: number; y: number; z: number };
        sectorid: string;
        nearestplanetid: string;
        navigationnotes: string,
    },
},
 planetData: {
    planetid: string;
    locationcoordinates: { x: number; y: number; z: number };
    scan: {
        locationName: string;
        enviromental_analysis: string;
        historical_facts: string[];
        known_entities: string[];
        navigationNotes: string;
        descriptiveText: string;
        controlledBy: boolean | null;
    },
};
    descriptiveText: string,
}
.


        Return the report in JSON format using your creativity."`,
    },
    {
      role: "assistant",
      content: `"MetaScanning [TIP: AIU SCANNERS ALWAYS RETURN SOME USEFUL INFORMATION]
EXISTING RESULT: ${shipStatusReport ? shipStatusReport : "NO PREV DATA GENERATE NEW REPORT"}
"`,
    },
    {
      role: "user",
      content: `"Incoming Transmissiong from AIU Operator.
   
                CREDENTIALS VALIDATED ${shipStatusReport?.shipState.pilot}
                Begin target location."`,
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

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { shipStatusReport } = req.body;
    try {
      const newShipStatus = await generateAlienLanguage(shipStatusReport);

      res.status(200).json({ newShipStatus });
    } catch (error) {
      res.status(500).json({ error: "Error generating alien language." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
};
