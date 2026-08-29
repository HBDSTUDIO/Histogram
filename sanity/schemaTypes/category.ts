import { defineField, defineType } from "sanity";

export default defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (rule) => rule.required() }),
    defineField({ name: "section", title: "Section", type: "reference", to: [{ type: "section" }], validation: (rule) => rule.required() }),
    defineField({ name: "order", title: "Order", type: "number" }),
    defineField({ name: "visible", title: "Visible", type: "boolean", initialValue: true }),
  ],
});
