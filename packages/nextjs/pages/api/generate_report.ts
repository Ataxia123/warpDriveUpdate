import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";
import type { MetaScanData, NftData, PlanetData } from "~~/types/appTypes";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_AUTH_TOKEN,
});

async function generateInterplanetaryStatusReport(
  nftData: NftData,
  metaScanData: MetaScanData,
  planetData: PlanetData,
) {
  const messages: any[] = [
    {
      role: "system",
      content: `"You are ${nftData.Level}_${nftData.Power1}_${nftData.Power2}.
        and you are a member of the Alliance of the Infinite Universe.
        Your current location is: ${JSON.stringify(metaScanData.currentLocation)}. 
        Your current mission is: ${JSON.stringify(metaScanData.currentMissionBrief)}
        You are currently sending an Interplantary Status Report (IPR) through the 
        targetting computer of a ship in the AIU. you are in the midst 
        of your latest assignment and are sending a status
        report asking for assistance.
        
        Interpret the available data from your assistant and produce incoming 
        an IPR in JSON format. The mission report's objective is to set the 
        context and introduce the characters for this mission.
        
        The mission report must include the following information in JSON format:

        {
        missionId: string;
        location: {planet_name: string, coordinates: {x: number, y: number, z:number};
        characters: {faction1: [character1, character2, character3]};
        objective: string;
        status: string;
        surroundingsDescription: string;
        conflictDescription: string;
        metadata: {difficulty: number, EXPrewards: number, missionId: string}
        narrative: string;
        },
      `,
    },
    {
      role: "assistant",
      content: `
                    nftData: ${JSON.stringify(nftData)}
                    metaScanData: ${JSON.stringify(metaScanData)}
                    planetData: ${JSON.stringify(planetData)}
                    `,
    },
    {
      role: "user",
      content: `AIU UPLINK ESTABLISHED.
                GREETINGS, ${nftData.Level} 
                ${nftData.Power1} ${nftData.Power2}
                INITIATE IPR TRANSMISSION. 
       `,
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
    const { nftData, metaScanData, planetData } = req.body;
    try {
      const report = await generateInterplanetaryStatusReport(planetData, nftData, metaScanData);

      res.status(200).json({ report });
    } catch (error) {
      res.status(500).json({ error: "Error generating interplanetary status report." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
};
