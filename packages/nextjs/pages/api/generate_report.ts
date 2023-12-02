import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";
import type { Metadata } from "~~/types/appTypes";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_AUTH_TOKEN,
});

async function generateInterplanetaryStatusReport(metadata: Metadata, alienMessage: string) {
  const messages: any[] = [
    {
      role: "system",
      content: `"You are ${metadata.Level}_${metadata.Power1}_${metadata.Power2}.
        Your attributes are: Side ${metadata.Side}, Alignment ${metadata.Alignment1}_${metadata.Alignment2},
        and you are a member of the Alliance of the Infinite Universe.sending a report
        through the targetting computer of a ship in the Alliance. you are in the midst 
        of your latest assignment and are sending a status report asking for assistance.
        Interpret the current Situation Scan 
        ${JSON.stringify(metadata.healthAndStatus)}
        ${JSON.stringify(metadata.abilities)}
        ${JSON.stringify(metadata.equipment)}
        ${JSON.stringify(metadata.funFact)} and produce incoming Interplanetary Mission Report in JSON format. 
        The mission report's objective is to set the context and introduce the characters for this mission.
        The mission report must include the following information:
        1) The location of the mission. "location": {"planet_name" coordinates: "x,y,z"}
        2) The characters involved in the mission. "characters": {faction1:["character1", "character2", "character3"]}
        3) The objective of the mission. "objective": "objective_description"
        4) The mission's status report. "status": "status_report_narrative"
        5) The current scenario description. "scenario": "scenario_description" 
        6) the mission metadata: difficulty level, rewards, and other information. "metadata": {"difficulty": "difficulty_level", "rewards": "rewards_description", "other": "other_information"}`,
    },
    {
      role: "user",
      content: `"Location Scan Results Recieved: ${alienMessage}. 
        Awaiting Interplanetary Status Report from 
        ${metadata.Level}${metadata.Power1}
        ${metadata.Power2}${metadata.Alignment1}
        ${metadata.Alignment2}${metadata.Side}."`,
    },
  ];

  const stream = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    messages: messages,
  });

  const rawOutput = stream.choices[0].message.content;

  return rawOutput?.trim();
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { scanningResult, alienMessage, metadata } = req.body;
    try {
      const report = await generateInterplanetaryStatusReport(metadata, alienMessage);

      res.status(200).json({ report });
    } catch (error) {
      res.status(500).json({ error: "Error generating interplanetary status report." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
};
