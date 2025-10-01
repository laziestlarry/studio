'use server';

/**
 * @fileOverview An AI agent that generates structured chart data from a financial forecast string.
 *
 * - generateChartData - A function that generates chart data.
 * - GenerateChartDataInput - The input type for the generateChartData function.
 * - GenerateChartDataOutput - The return type for the generateChartData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateChartDataInputSchema = z.object({
  financialForecasts: z.string().describe('A string containing financial forecast information, including revenue projections.'),
});
export type GenerateChartDataInput = z.infer<typeof GenerateChartDataInputSchema>;

const MonthlyDataSchema = z.object({
    month: z.string().describe('The month abbreviation (e.g., "Jan", "Feb").'),
    revenue: z.number().describe('The projected revenue for that month in whole dollars.'),
});

const GenerateChartDataOutputSchema = z.object({
    chartData: z.array(MonthlyDataSchema).describe('An array of the first 12 months of revenue projection data.'),
});
export type GenerateChartDataOutput = z.infer<typeof GenerateChartDataOutputSchema>;

export async function generateChartData(
  input: GenerateChartDataInput
): Promise<GenerateChartDataOutput> {
  return generateChartDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateChartDataPrompt',
  input: {schema: GenerateChartDataInputSchema},
  output: {schema: GenerateChartDataOutputSchema},
  prompt: `You are an expert financial data analyst. Your task is to parse a text-based financial forecast and extract a structured array of projected revenue data for the first 12 months. The output must be clean, structured JSON suitable for charting.

Financial Forecast Text: {{{financialForecasts}}}

Instructions:
1. Identify the projected monthly revenue for the first 12 months of operation.
2. For each month, use a three-letter abbreviation (e.g., "Jan", "Feb", "Mar").
3. The revenue should be a whole number, representing the total projected revenue in dollars for that month.
4. Return an array of 12 objects, where each object contains a 'month' and a 'revenue' key.
`,
});

const generateChartDataFlow = ai.defineFlow(
  {
    name: 'generateChartDataFlow',
    inputSchema: GenerateChartDataInputSchema,
    outputSchema: GenerateChartDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
