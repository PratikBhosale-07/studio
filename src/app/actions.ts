
'use server';

import {
  generatePersonalizedIdp,
  GeneratePersonalizedIdpInput,
} from '@/ai/flows/generate-personalized-idp';
import { z } from 'zod';

const IdpSchema = z.object({
  employeeRole: z.string().min(3, { message: 'Role must be at least 3 characters.' }),
  performanceData: z.string().min(10, { message: 'Performance data must be at least 10 characters.' }),
  careerAspirations: z.string().min(10, { message: 'Career aspirations must be at least 10 characters.' }),
  managerFeedback: z.string().optional(),
  skillGapAnalysis: z.string().optional(),
});

type State = {
  success: boolean;
  message: string;
  data?: { idp: string };
};

export async function handleGenerateIdp(prevState: State, formData: FormData): Promise<State> {
  const rawFormData: GeneratePersonalizedIdpInput = {
    employeeRole: formData.get('employeeRole') as string,
    performanceData: formData.get('performanceData') as string,
    careerAspirations: formData.get('careerAspirations') as string,
    managerFeedback: (formData.get('managerFeedback') as string) || 'N/A',
    skillGapAnalysis: (formData.get('skillGapAnalysis') as string) || 'N/A',
  };

  const validatedFields = IdpSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.errors.map((e) => e.message).join(', '),
    };
  }

  try {
    const result = await generatePersonalizedIdp(validatedFields.data);
    if (result && result.idp) {
      return { success: true, message: 'IDP generated successfully.', data: result };
    }
    return { success: false, message: 'Failed to generate IDP from AI model.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'An unexpected error occurred. Please try again.' };
  }
}
