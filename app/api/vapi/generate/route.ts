import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/FireBase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

export async function POST(request: Request) {
  const { type, role, level, techstack, amount, userid } = await request.json();

  try {
    // 1. Generate questions using Gemini
    const { text: questionsText } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
      `,
    });
console.log(questionsText);

    let parsedQuestions: string[] = [];

    // 2. Try to parse response safely
    try {
      parsedQuestions = JSON.parse(questionsText.trim());
      if (!Array.isArray(parsedQuestions)) throw new Error("Parsed result is not an array");
    } catch (parseErr : any) {
      console.error("Failed to parse questions. Raw output:", parseErr);
      return Response.json(
        { success: false, message: "AI response not in expected format", raw: questionsText },
        { status: 400 }
      );
    }

    // 3. Construct interview object
    const interview = {
      role,
      type,
      level,
      techstack: techstack.split(",").map((t:any)  => t.trim()),
      questions: parsedQuestions,
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    console.log("Final interview object to save:", interview);

    // 4. Save to Firestore
    try {
      await db.collection("interviews").add(interview);
      console.log("Interview saved successfully");
    } catch (firestoreErr) {
      console.error("Failed to save to Firestore:", firestoreErr);
      return Response.json({ success: false, message: "Failed to save to database" }, { status: 500 });
    }

    return Response.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("Unexpected error in POST handler:", error);
    return Response.json({ success: false, error: error }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}
