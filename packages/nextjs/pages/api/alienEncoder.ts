// /pages/api/generateAlienLanguage.ts
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import type { Metadata } from "~~/types/appTypes";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_AUTH_TOKEN,
});

async function generateAlienLanguage(metadata: Metadata) {
  const messages: any[] = [
    {
      role: "system",
      content: `"You are the targetting computer of a ship in the Alliance of the Infinite Universe. 
        You have just recieved a transmission from the following coordinates:
        ${metadata.currentLocation}.
        You need to need to triangulate the following information and issue a report 
        scan  with the following fields: 
         {
            locationCoordinates: ${metadata.currentLocation}.
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
        };
        Use the Message information to come up with the report  in JSON format using your creativity."`,
    },
    {
      role: "user",
      content: `"Incoming Transmissiong from
 ${metadata.Level} ${metadata.Power1} ${metadata.Power2} ${metadata.Power3}.
Scanning ${metadata} Results Recieved. Begin scanning target location."`,
    },
  ];

  const stream = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    messages: messages,
    response_format: { type: "json_object" },
  });

  const rawOutput = stream.choices[0].message.content;
  const openAIResponse = rawOutput?.trim();
  return openAIResponse;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { englishMessage, metadata } = req.body;
    try {
      const alienMessage = await generateAlienLanguage(metadata);

      res.status(200).json({ alienMessage });
    } catch (error) {
      res.status(500).json({ error: "Error generating alien language." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
};
