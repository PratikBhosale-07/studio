'use server';

/**
 * @fileOverview A flow that extracts details from a resume PDF.
 *
 * - extractResumeDetails - A function that extracts details from a resume.
 * - ExtractResumeDetailsInput - The input type for the extractResumeDetails function.
 * - ExtractResumeDetailsOutput - The return type for the extractResumeDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractResumeDetailsInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "A PDF resume, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:application/pdf;base64,<encoded_data>'."
    ),
});
export type ExtractResumeDetailsInput = z.infer<typeof ExtractResumeDetailsInputSchema>;

const ExtractResumeDetailsOutputSchema = z.object({
    careerGoal: z.string().describe("The primary career goal or objective stated or inferred from the resume."),
    summary: z.string().describe("A brief summary for a development plan based on the resume's content."),
    currentSkills: z.string().describe("A comma-separated list of the candidate's current skills."),
    skillsToDevelop: z.string().describe("A comma-separated list of skills the candidate should focus on developing."),
    experienceSummary: z.string().describe("A summary of the candidate's professional experience."),
});
export type ExtractResumeDetailsOutput = z.infer<typeof ExtractResumeDetailsOutputSchema>;

export async function extractResumeDetails(input: ExtractResumeDetailsInput): Promise<ExtractResumeDetailsOutput> {
  return extractResumeDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractResumeDetailsPrompt',
  input: {schema: ExtractResumeDetailsInputSchema},
  output: {schema: ExtractResumeDetailsOutputSchema},
  prompt: `You are an AI assistant specialized in analyzing resumes to create Individual Development Plans (IDPs).

  Based on the provided resume, extract the following information:
  - A primary career goal. Infer this from the summary, experience, and skills if not explicitly stated.
  - A brief summary for a development plan based on the skills and experience.
  - A comma-separated list of the candidate's current skills.
  - A comma-separated list of skills to develop for their career goal.
  - A summary of their professional experience.

  Resume (PDF): {{media url=resumeDataUri}}

  Extract the information and return it in the specified format.
  `,
});

const extractResumeDetailsFlow = ai.defineFlow(
  {
    name: 'extractResumeDetailsFlow',
    inputSchema: ExtractResumeDetailsInputSchema,
    outputSchema: ExtractResumeDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
