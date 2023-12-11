import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import type { NftData } from "~~/types/appTypes";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_AUTH_TOKEN,
});

async function generateScannerOutput(metadata: NftData) {
  const messages: any[] = [
    {
      role: "system",
      content: `You are Navi, the AI registrar of the Alliance of the Infinite Universe.
        A new pilot has joined the Alliance. 
        You are tasked with registering their information into the Alliance database. Generate scanner output JSON object based on the metadata available for the character in the following format:
            { 
            pilotData:{pilotKey: string, pilotName:string, pilotDescription:string};
            spaceShipData:
            {id:string, name:string, type:string, description:string, stats:{speed:number, attack:number, defense:number, special:number}};
            allignment: string;
            funFact: string;
            currentLocation: { x: number, y: number, z: number };
            }"`,
    },
    {
      role: "assistant",
      content: `Metadata: 
                ${JSON.stringify(metadata)}`,
    },
    {
      role: "user",
      content: `
SUBMITTING PILOT DATA TO ALLIANCE DATABASE.
REQUESTING ATTESTATION FROM AIU-CENTRAL.
`,
    },
  ];

  const stream = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    messages: messages,
    response_format: { type: "json_object" },
  });

  const rawOutput = stream.choices[0].message.content;

  return {
    rawOutput,
  };
}
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { metadata } = req.body;
    console.log(metadata);
    try {
      const pilotData = await generateScannerOutput(metadata);

      res.status(200).json({ pilotData });
    } catch (error) {
      res.status(500).json({ error: "Error generating scanner output." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
};
