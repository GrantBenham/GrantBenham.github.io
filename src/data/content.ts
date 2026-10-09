import { z } from 'zod';
import publicationData from './publications.json';
import presentationData from './presentations.json';
import softwareData from './software.json';
import alumniData from './alumni.json';

const year = z.number().int().min(1900).max(2100);
const localAsset = z.string().regex(/^\/(images|presentations|posters)\/[A-Za-z0-9/_ .-]+$/);
const nullableLink = z.url().refine(s => s.startsWith('https://'), 'Links must use HTTPS').nullable();
const publicationSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/), year, authors: z.string().min(1), title: z.string().min(1),
  citation: z.string().min(1), doi: z.string().regex(/^10\.\d{4,9}\/\S+$/).nullable(),
  type: z.enum(['Journal article', 'Book chapter', 'Other scholarly publication']),
  topics: z.array(z.string()), featured: z.boolean(), status: z.literal('published'),
  source: z.string(), reviewNote: z.string().nullable(),
});
const presentationSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/), year, month: z.string(), authors: z.string().min(1),
  title: z.string().min(1), conference: z.string().min(1), citation: z.string().min(1),
  format: z.enum(['Poster', 'Paper', 'Symposium']), topics: z.array(z.string()),
  pdf: localAsset.refine(p => p.endsWith('.pdf')).nullable(),
  thumbnail: localAsset.nullable(), status: z.literal('presented'), source: z.string(),
});
const softwareSchema = z.object({
  id: z.string(), name: z.string(), category: z.string(), description: z.string(),
  repository: nullableLink, documentation: nullableLink, application: nullableLink,
  source: z.string(), reviewNote: z.string().nullable(),
});
const alumniSchema = z.object({
  id: z.string(), name: z.string().min(1), years: z.string().nullable(),
  photo: localAsset.nullable(), photoAlt: z.string().nullable(),
  linkedin: nullableLink.refine(link => link === null || (new URL(link).hostname === 'www.linkedin.com' && new URL(link).pathname.startsWith('/in/')), 'Expected a LinkedIn profile URL'),
  description: z.string().nullable(), source: z.string(),
});
export type Publication = z.infer<typeof publicationSchema>;
export type Presentation = z.infer<typeof presentationSchema>;
export const publications = z.array(publicationSchema).parse(publicationData).sort((a,b) => b.year-a.year);
export const presentations = z.array(presentationSchema).parse(presentationData).sort((a,b) => b.year-a.year);
export const software = z.array(softwareSchema).parse(softwareData);
export const alumni = z.array(alumniSchema).parse(alumniData);
for (const entries of [publications, presentations, software, alumni]) {
  if (new Set(entries.map(e => e.id)).size !== entries.length) throw new Error('Content IDs must be unique within each archive.');
}
