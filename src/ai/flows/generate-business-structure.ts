'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a business organizational structure.
 *
 * - generateBusinessStructure - A function that generates a business structure.
 * - GenerateBusinessStructureInput - The input type for the generateBusinessStructure function.
 * - GenerateBusinessStructureOutput - The return type for the generateBusinessStructure function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBusinessStructureInputSchema = z.object({
  opportunityName: z.string().describe('The name of the business opportunity.'),
  opportunityDescription: z.string().describe('A detailed description of the business opportunity.'),
});
export type GenerateBusinessStructureInput = z.infer<typeof GenerateBusinessStructureInputSchema>;

const DepartmentSchema = z.object({
    name: z.string().describe('The name of the department.'),
    function: z.string().describe('The primary function and responsibilities of the department.'),
    aiIntegration: z.string().describe('How AI can be used to automate and enhance this department\'s operations.'),
});

const GenerateBusinessStructureOutputSchema = z.object({
    commander: z.string().describe('A description of the central commander or leadership role responsible for overall strategy and vision.'),
    aiCore: z.string().describe('A description of the AI-core base, the central AI system that integrates with all departments.'),
    departments: z.array(DepartmentSchema).describe('An array of departments that form the AI-powered agency foundation.'),
});
export type GenerateBusinessStructureOutput = z.infer<typeof GenerateBusinessStructureOutputSchema>;

export async function generateBusinessStructure(
  input: GenerateBusinessStructureInput
): Promise<GenerateBusinessStructureOutput> {
  return generateBusinessStructureFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBusinessStructurePrompt',
  input: {schema: GenerateBusinessStructureInputSchema},
  output: {schema: GenerateBusinessStructureOutputSchema},
  prompt: `You are an expert in organizational design and AI-driven business automation. For the given business opportunity, design an organizational structure for an AI-powered agency.

Business Opportunity Name: {{{opportunityName}}}
Business Opportunity Description: {{{opportunityDescription}}}

The structure should include:
1.  A "Multi-Layered Commander": The central leadership/strategic function.
2.  An "AI-Core Base": A central AI system that manages and automates tasks across the organization.
3.  "AI-Powered Departments": A foundation of departments whose functions are heavily automated and managed by the AI-Core. For each department, describe its function and how AI will be integrated.

The goal is to create a structure that automates task completion, ensures delivery perfection, and is designed to achieve financial goals through efficient, automated workflows.
`,
});

const generateBusinessStructureFlow = ai.defineFlow(
  {
    name: 'generateBusinessStructureFlow',
    inputSchema: GenerateBusinessStructureInputSchema,
    outputSchema: GenerateBusinessStructureOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
