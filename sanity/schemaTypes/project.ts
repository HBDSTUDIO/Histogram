import { defineField, defineType } from "sanity";

export default defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title", maxLength: 96 }, validation: (rule) => rule.required() }),
    defineField({ name: "section", title: "Section", type: "reference", to: [{ type: "section" }], validation: (rule) => rule.required() }),
    defineField({ name: "category", title: "Category", type: "reference", to: [{ type: "category" }] }),
    defineField({ name: "summary", title: "Short description", type: "text", rows: 3, validation: (rule) => rule.required().max(240) }),
    defineField({ name: "year", title: "Year / period", type: "string" }),
    defineField({ name: "client", title: "Client / brand", type: "string" }),
    defineField({ name: "roles", title: "Participation / roles", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "contribution", title: "Contribution (%)", type: "number", validation: (rule) => rule.min(0).max(100) }),
    defineField({ name: "coverImage", title: "Cover image", type: "image", options: { hotspot: false }, fields: [{ name: "alt", title: "Alt text", type: "string" }] }),
    defineField({ name: "gallery", title: "Gallery (original ratio, no crop)", type: "array", of: [{ type: "image", options: { hotspot: false }, fields: [{ name: "alt", title: "Alt text", type: "string" }, { name: "caption", title: "Caption", type: "string" }] }] }),
    defineField({ name: "featuredOnHome", title: "Show on home", type: "boolean", initialValue: false }),
    defineField({ name: "projectOrder", title: "Project order", type: "number" }),
    defineField({ name: "homeOrder", title: "Home order", type: "number" }),
  ],
  preview: { select: { title: "title", media: "coverImage", subtitle: "section.title" } },
});
