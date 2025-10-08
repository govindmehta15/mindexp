'use server';
/**
 * @fileOverview An AI agent to summarize community posts and comments for moderation purposes.
 *
 * - summarizeCommunityPost - A function that summarizes community posts and comments, highlighting potential issues and user information.
 * - SummarizeCommunityPostInput - The input type for the summarizeCommunityPost function.
 * - SummarizeCommunityPostOutput - The return type for the summarizeCommunityPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeCommunityPostInputSchema = z.object({
  postContent: z
    .string()
    .describe('The content of the community post to be summarized.'),
  moderationPolicy: z.string().describe(
    'The moderation policy to be followed when summarizing the post. '
  ),
  includeUserInfo: z
    .boolean()
    .describe(
      'A boolean flag indicating whether user identities and/or university affiliation can/should be incorporated into summaries.'
    ),
});

export type SummarizeCommunityPostInput = z.infer<
  typeof SummarizeCommunityPostInputSchema
>;

const SummarizeCommunityPostOutputSchema = z.object({
  summary: z.string().describe('The summarized content of the community post.'),
  potentialIssues: z
    .string()
    .describe(
      'Any potential issues identified in the post, based on the moderation policy.'
    ),
  interventionRequired: z
    .boolean()
    .describe(
      'A boolean flag indicating whether intervention is required based on the moderation rules.'
    ),
});

export type SummarizeCommunityPostOutput = z.infer<
  typeof SummarizeCommunityPostOutputSchema
>;

export async function summarizeCommunityPost(
  input: SummarizeCommunityPostInput
): Promise<SummarizeCommunityPostOutput> {
  return summarizeCommunityPostFlow(input);
}

const summarizeCommunityPostPrompt = ai.definePrompt({
  name: 'summarizeCommunityPostPrompt',
  input: {schema: SummarizeCommunityPostInputSchema},
  output: {schema: SummarizeCommunityPostOutputSchema},
  prompt: `You are an AI assistant helping to moderate a community forum.
  Your task is to summarize community posts and comments, highlighting potential issues and user information based on the provided moderation policies.

  Moderation Policy: {{{moderationPolicy}}}
  Include User Info: {{{includeUserInfo}}}
  Post Content: {{{postContent}}}

  Summary Guidelines:
  - Condense the post content into a concise summary.
  - Identify any potential violations of the moderation policy.
  - Determine if intervention is required based on the moderation rules.
  - Only incorporate user identities and/or university affiliation if the 'Include User Info' flag is true and it aligns with the moderation policy.

  Output Format:
  - summary: A brief summary of the post content.
  - potentialIssues: A description of any potential issues identified in the post.
  - interventionRequired: A boolean value indicating whether intervention is required.
  `,
});

const summarizeCommunityPostFlow = ai.defineFlow(
  {
    name: 'summarizeCommunityPostFlow',
    inputSchema: SummarizeCommunityPostInputSchema,
    outputSchema: SummarizeCommunityPostOutputSchema,
  },
  async input => {
    const {output} = await summarizeCommunityPostPrompt(input);
    return output!;
  }
);
