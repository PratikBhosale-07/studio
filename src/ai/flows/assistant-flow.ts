'use server';

/**
 * @fileOverview A conversational AI assistant for the TalentFlow application.
 *
 * - assistantFlow - A function that provides answers to user questions.
 * - AssistantFlowInput - The input type for the assistantFlow function.
 * - AssistantFlowOutput - The return type for the assistantFlow function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssistantFlowInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.array(z.object({
        text: z.string()
    }))
  })).describe('The conversation history.'),
  prompt: z.string().describe('The user\'s latest message.'),
});
export type AssistantFlowInput = z.infer<typeof AssistantFlowInputSchema>;

const AssistantFlowOutputSchema = z.object({
  response: z.string().describe('The AI\'s response.'),
});
export type AssistantFlowOutput = z.infer<typeof AssistantFlowOutputSchema>;


export async function assistantFlow(input: AssistantFlowInput): Promise<AssistantFlowOutput> {

  const { response } = await ai.generate({
    history: input.history,
    prompt: `You are a helpful AI assistant for an application called "TalentFlow AI".
    Your purpose is to answer questions about the application and its features.
    The application helps with employee career growth, Individual Development Plans (IDPs), and skill tracking.
    Be friendly and concise.

    User question: ${input.prompt}`,
    output: {
      schema: AssistantFlowOutputSchema,
    },
  });

  return response.output!;
}
