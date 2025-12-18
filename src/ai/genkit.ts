import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI({
      models: {
        'gemini-1.5-flash-latest': {
          generation: {
            apiVersion: 'v1beta',
          },
        },
      },
    }),
  ],
});
