import { config } from 'dotenv';
config();

import '@/ai/flows/generate-personalized-idp.ts';
import '@/ai/flows/analyze-team-skill-gaps.ts';
import '@/ai/flows/assistant-flow.ts';
import '@/ai/flows/extract-resume-details.ts';
