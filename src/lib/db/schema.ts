import { pgTable, text, integer, serial, timestamp } from "drizzle-orm/pg-core";

// Resources table - for storing learning materials
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category", {
    enum: ["blog", "video", "podcast", "course", "paper", "other"],
  }).notNull().default("other"),
  status: text("status", {
    enum: ["to_learn", "learning", "completed"],
  }).notNull().default("to_learn"),
  priority: integer("priority").notNull().default(0),
  notes: text("notes"),
  favicon: text("favicon"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Content Ideas table - for tracking content creation ideas
export const contentIdeas = pgTable("content_ideas", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type", {
    enum: ["blog_post", "video", "tutorial", "thread", "other"],
  }).notNull().default("blog_post"),
  status: text("status", {
    enum: ["idea", "drafting", "published"],
  }).notNull().default("idea"),
  linkedResourceIds: text("linked_resource_ids"), // JSON array of resource IDs
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Types
export type Resource = typeof resources.$inferSelect;
export type NewResource = typeof resources.$inferInsert;
export type ContentIdea = typeof contentIdeas.$inferSelect;
export type NewContentIdea = typeof contentIdeas.$inferInsert;

export type ResourceCategory = "blog" | "video" | "podcast" | "course" | "paper" | "other";
export type ResourceStatus = "to_learn" | "learning" | "completed";
export type ContentIdeaType = "blog_post" | "video" | "tutorial" | "thread" | "other";
export type ContentIdeaStatus = "idea" | "drafting" | "published";
