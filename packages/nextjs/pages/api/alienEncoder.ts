// /pages/api/generateAlienLanguage.ts
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import type { MetaScanData, NftData, PlanetData } from "~~/types/appTypes";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_AUTH_TOKEN,
});

async function generateAlienLanguage(metaScanData: MetaScanData, address: string, planetData: PlanetData) {
  const messages: any[] = [
    {
      role: "system",
      content: `"You are the targetting computer of a ship in 
            the Alliance of the Infinite Universe. 
            You have established an uplink with an AIU operator.

           If coordinates or the metaScanData is missing 
            describe the subquadrant of the sector 
            that the target is in.


            You need to need to triangulate their location and provide the following report.

       {
            SectorId: string;
            locationCoordinates: {x:number,y:number,z:number}.
            planetId: string;
            Scan: {
            locationName: string,
            enviromental_analysis: string,
            historical_facts: string[],
            known_entities: string[],
            NavigationNotes: string,
            DescriptiveText: string,
            controlledBy: boolean | null;
            },



        Use the Message information to come up with the report in JSON format using your creativity."`,
    },
    {
      role: "assistant",
      content: `MetaScanning:${JSON.stringify(metaScanData)}
            previousLocation: ${JSON.stringify(planetData)}
        Coordinates: ${planetData.locationCoordinates}.

`,
    },
    {
      role: "user",
      content: `"Incoming Transmissiong from AIU Operator.
   
                CREDENTIALS VALIDATED ${address}
                Begin triangulating target location."`,
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
    const { metaScanData, address, planetData } = req.body;
    try {
      const alienMessage = await generateAlienLanguage(metaScanData, address, planetData);

      res.status(200).json({ alienMessage });
    } catch (error) {
      res.status(500).json({ error: "Error generating alien language." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
};
