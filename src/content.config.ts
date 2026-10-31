import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

export const serviceCategories = [
  "فردی",
  "خانواده‌درمانی",
  "زوج‌درمانی",
  "کودک و نوجوان",
  "گروه‌درمانی",
  "ارزیابی و تست",
  "آموزش و کارگاه",
] as const;

const services = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/services" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    seoDescription: z.string().optional(),
    category: z.enum(serviceCategories),
    icon: z.enum(["individual", "couples", "family", "child", "group", "assessment", "workshop"]),
    order: z.number(),
    placeholder: z.boolean(),
    relatedTherapists: z.array(z.string()).default([]),
  }),
});

const therapists = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/therapists" }),
  schema: z.object({
    name: z.string(),
    title: z.string(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    licenseNumber: z.string(),
    registryUrl: z.string().url().optional(),
    specialties: z.array(z.string()),
    approaches: z.array(z.string()),
    education: z.array(z.string()),
    languages: z.array(z.string()).default(["فارسی"]),
    online: z.boolean().default(false),
    order: z.number(),
    featured: z.boolean().default(false),
    placeholder: z.boolean(),
  }),
});

const workshops = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/workshops" }),
  schema: z.object({
    title: z.string(),
    instructor: z.string(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    dateDisplay: z.string().optional(),
    time: z.string().optional(),
    location: z.string().default("کلینیک علمی روانشناسی پندار نیم‌رخ"),
    sessions: z.number().optional(),
    audience: z.string().optional(),
    capacity: z.number().optional(),
    fee: z.string().optional(),
    status: z.enum(["open", "full", "past"]),
    registrationNote: z.string().optional(),
    placeholder: z.boolean(),
  }),
});

const articles = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/articles" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    dateDisplay: z.string(),
    author: z.string(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    placeholder: z.boolean(),
  }),
});

export const collections = { services, therapists, workshops, articles };
