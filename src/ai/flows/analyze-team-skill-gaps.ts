'use server';
/**
 * @fileOverview Analyzes skill gaps within a team and provides recommendations for addressing them.
 *
 * - analyzeTeamSkillGaps - A function that handles the analysis of team skill gaps.
 * - AnalyzeTeamSkillGapsInput - The input type for the analyzeTeamSkillGaps function.
 * - AnalyzeTeamSkillGapsOutput - The return type for the analyzeTeamSkillGaps function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeTeamSkillGapsInputSchema = z.object({
  teamDescription: z.string().describe('A description of the team, its members, and their current skill sets.'),
  futureGoals: z.string().describe('The future goals and challenges of the team.'),
});
export type AnalyzeTeamSkillGapsInput = z.infer<typeof AnalyzeTeamSkillGapsInputSchema>;

const AnalyzeTeamSkillGapsOutputSchema = z.object({
  skillGaps: z.string().describe('The identified skill gaps within the team.'),
  recommendations: z.string().describe('Recommendations for addressing the skill gaps through training or development plans.'),
});
export type AnalyzeTeamSkillGapsOutput = z.infer<typeof AnalyzeTeamSkillGapsOutputSchema>;

export async function analyzeTeamSkillGaps(input: AnalyzeTeamSkillGapsInput): Promise<AnalyzeTeamSkillGapsOutput> {
  return analyzeTeamSkillGapsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeTeamSkillGapsPrompt',
  input: {schema: AnalyzeTeamSkillGapsInputSchema},
  output: {schema: AnalyzeTeamSkillGapsOutputSchema},
  prompt: `You are a team management expert. Analyze the provided team description and future goals to identify skill gaps and suggest recommendations.

Team Description: {{{teamDescription}}}
Future Goals: {{{futureGoals}}}

Skill Gaps:
{{{skillGaps}}}

Recommendations:
{{{recommendations}}}`,
});

const analyzeTeamSkillGapsFlow = ai.defineFlow(
  {
    name: 'analyzeTeamSkillGapsFlow',
    inputSchema: AnalyzeTeamSkillGapsInputSchema,
    outputSchema: AnalyzeTeamSkillGapsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
