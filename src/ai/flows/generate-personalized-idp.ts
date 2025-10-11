'use server';

/**
 * @fileOverview A flow that generates a personalized Individual Development Plan (IDP) for an employee.
 *
 * - generatePersonalizedIdp - A function that generates a personalized IDP.
 * - GeneratePersonalizedIdpInput - The input type for the generatePersonalizedIdp function.
 * - GeneratePersonalizedIdpOutput - The return type for the generatePersonalizedIdp function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedIdpInputSchema = z.object({
  employeeRole: z.string().describe('The current role of the employee.'),
  performanceData: z.string().describe('The performance data of the employee.'),
  careerAspirations: z.string().describe('The career aspirations of the employee.'),
  managerFeedback: z.string().describe('The feedback from the employee\'s manager.'),
  skillGapAnalysis: z.string().describe('The skill gap analysis of the employee.'),
});
export type GeneratePersonalizedIdpInput = z.infer<typeof GeneratePersonalizedIdpInputSchema>;

const GeneratePersonalizedIdpOutputSchema = z.object({
  idp: z.string().describe('The generated personalized Individual Development Plan.'),
});
export type GeneratePersonalizedIdpOutput = z.infer<typeof GeneratePersonalizedIdpOutputSchema>;

export async function generatePersonalizedIdp(input: GeneratePersonalizedIdpInput): Promise<GeneratePersonalizedIdpOutput> {
  return generatePersonalizedIdpFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedIdpPrompt',
  input: {schema: GeneratePersonalizedIdpInputSchema},
  output: {schema: GeneratePersonalizedIdpOutputSchema},
  prompt: `You are an AI assistant specialized in generating personalized Individual Development Plans (IDPs) for employees.

  Based on the employee's role, performance data, career aspirations, manager feedback, and skill gap analysis, generate a comprehensive and actionable IDP.

  Employee Role: {{{employeeRole}}}
  Performance Data: {{{performanceData}}}
  Career Aspirations: {{{careerAspirations}}}
  Manager Feedback: {{{managerFeedback}}}
  Skill Gap Analysis: {{{skillGapAnalysis}}}

  Consider all the provided information to create an IDP that focuses on the most relevant skills and goals for the employee's development.
  The IDP should include specific development activities, timelines, and measurable outcomes.

  Ensure the IDP is well-structured, clear, and easy to follow.
  Make the output have a title of "Individual Development Plan" and bolded fields for each section.
  Make sure the information in each section comes from the input data provided.

  Output the complete IDP.
  `,
});

const generatePersonalizedIdpFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedIdpFlow',
    inputSchema: GeneratePersonalizedIdpInputSchema,
    outputSchema: GeneratePersonalizedIdpOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
