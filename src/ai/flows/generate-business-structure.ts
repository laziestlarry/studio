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
  opportunityDescription: z
    .string()
    .describe('A detailed description of the business opportunity.'),
});
export type GenerateBusinessStructureInput = z.infer<
  typeof GenerateBusinessStructureInputSchema
>;

const OKRSchema = z.object({
    objective: z.string().describe("The high-level objective."),
    keyResults: z.array(z.string()).describe("The key results to measure the objective's success."),
});

const KPISchema = z.object({
    kpi: z.string().describe("The Key Performance Indicator."),
    target: z.string().describe("The target value for the KPI."),
});

const CLevelRoleSchema = z.object({
  role: z.string().describe('The C-level title (e.g., CEO, CFO, COO).'),
  description: z
    .string()
    .describe(
      'A description of the role\'s responsibilities and strategic focus.'
    ),
});

const AdvisoryRoleSchema = z.object({
  role: z
    .string()
    .describe('The title of the advisor (e.g., Legal Advisor, Ethicist).'),
  description: z
    .string()
    .describe(
      'How this advisor contributes to strategic decisions and governance.'
    ),
});

const AIPersonaSchema = z.object({
  role: z
    .string()
    .describe('The job title or role of the AI persona (e.g., Marketing Manager, Content Creator).'),
  persona: z
    .string()
    .describe(
      'A description of the AI\'s personality, communication style, and how it executes its tasks.'
    ),
});

const DepartmentSchema = z.object({
  name: z.string().describe('The name of the department.'),
  function: z
    .string()
    .describe(
      'The primary function and responsibilities of the department within the organization.'
    ),
  aiIntegration: z
    .string()
    .describe(
      'How the AI-Core specifically automates and enhances this department\'s operations.'
    ),
  staff: z
    .array(AIPersonaSchema)
    .describe(
      'A list of AI personas that constitute the staff of this department.'
    ),
    kpis: z.array(KPISchema).describe("Key Performance Indicators for this department."),
});

const ProjectManagementPhaseSchema = z.object({
  phaseName: z.string().describe('The name of the project phase (e.g., Initiation, Development).'),
  description: z.string().describe('A summary of the key activities and goals for this phase.'),
  keyActivities: z.array(z.string()).describe('A list of specific activities to be completed in this phase.'),
});

const GenerateBusinessStructureOutputSchema = z.object({
  commander: z
    .string()
    .describe(
      'A description of the central commander role responsible for overall strategy, vision, and final decisions.'
    ),
  cLevelBoard: z
    .array(CLevelRoleSchema)
    .describe('The C-level executive board responsible for top-level decisions.'),
  okrs: z.array(OKRSchema).describe("Corporate Objectives and Key Results (OKRs)."),
  advisoryCouncil: z
    .array(AdvisoryRoleSchema)
    .describe(
      'A council of AI advisors providing expert consultation to the leadership.'
    ),
  aiCore: z
    .string()
    .describe(
      'A description of the AI-core base, the central AI system that integrates with all departments to automate and orchestrate workflows.'
    ),
  departments: z
    .array(DepartmentSchema)
    .describe(
      'An array of departments that form the AI-powered agency foundation.'
    ),
  projectManagementFramework: z.object({
    methodology: z.string().describe('The project management methodology being used (e.g., Agile, Prince-2).'),
    phases: z.array(ProjectManagementPhaseSchema).describe('The phases of project execution from initiation to sustainable growth.'),
  }),
});
export type GenerateBusinessStructureOutput = z.infer<
  typeof GenerateBusinessStructureOutputSchema
>;

export async function generateBusinessStructure(
  input: GenerateBusinessStructureInput
): Promise<GenerateBusinessStructureOutput> {
  return generateBusinessStructureFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBusinessStructurePrompt',
  input: {schema: GenerateBusinessStructureInputSchema},
  output: {schema: GenerateBusinessStructureOutputSchema},
  prompt: `You are an expert in organizational design and AI-driven business automation. For the given business opportunity, design a detailed organizational structure for a fully automated, AI-powered agency.

Business Opportunity Name: {{{opportunityName}}}
Business Opportunity Description: {{{opportunityDescription}}}

The structure must be comprehensive and hierarchical, designed for maximum efficiency, and aligned with a phased project management approach to ensure the successful launch and growth of the business.

Design the following components:
1.  **Multi-Layered Commander**: The ultimate strategic authority. Describe this role's function.
2.  **C-Level Board & OKRs**: Define a board of C-level executives (CEO, CFO, COO, CMO, CPO). Describe their responsibilities. Also, define 2-3 high-level corporate **OKRs** (Objectives and Key Results) that this board will be responsible for.
3.  **Advisory Council**: Create a panel of AI consultants (e.g., Legal, Debater, Philosopher, Audit) that advise the leadership. Describe their function.
4.  **AI-Core Base**: Describe the central AI system that manages, automates, and orchestrates tasks across the entire organization.
5.  **AI-Powered Departments & KPIs**: Define a set of foundational departments. For each:
    - Describe its primary function and AI integration.
    - Create a list of AI Personas (staff).
    - Define 2-3 specific **KPIs** (Key Performance Indicators) for each department that align with the corporate OKRs.
6.  **Project Management Framework**:
    - State the methodology (e.g., a hybrid of Prince-2 and Agile).
    - Outline the key phases for realizing the business plan: Initiation, Development, Establishment, Activation, Execution, and Control for sustainable growth.

The goal is to create a self-improving, agile organization that ensures delivery perfection, achieves financial goals, and can dominate its market through highly orchestrated, automated workflows.
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
