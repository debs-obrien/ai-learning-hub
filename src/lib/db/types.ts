// Database types for Supabase

export type ResourceCategory = "blog" | "video" | "podcast" | "course" | "paper" | "other";
export type ResourceStatus = "to_learn" | "learning" | "completed";
export type ContentIdeaType = "blog_post" | "video" | "tutorial" | "thread" | "other";
export type ContentIdeaStatus = "idea" | "drafting" | "published";

// Database row types (snake_case - matches Supabase)
export interface ResourceRow {
  id: number;
  url: string;
  title: string;
  description: string | null;
  category: ResourceCategory;
  status: ResourceStatus;
  priority: number;
  notes: string | null;
  favicon: string | null;
  created_at: string | null;
  updated_at: string | null;
  completed_at: string | null;
}

export interface ContentIdeaRow {
  id: number;
  title: string;
  description: string | null;
  type: ContentIdeaType;
  status: ContentIdeaStatus;
  linked_resource_ids: string | null;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// App types (camelCase - for frontend use)
export interface Resource {
  id: number;
  url: string;
  title: string;
  description: string | null;
  category: ResourceCategory;
  status: ResourceStatus;
  priority: number;
  notes: string | null;
  favicon: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  completedAt: string | null;
}

export interface ContentIdea {
  id: number;
  title: string;
  description: string | null;
  type: ContentIdeaType;
  status: ContentIdeaStatus;
  linkedResourceIds: string | null;
  notes: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export type NewResource = Omit<Resource, "id" | "createdAt" | "updatedAt" | "completedAt">;
export type NewContentIdea = Omit<ContentIdea, "id" | "createdAt" | "updatedAt">;

// Helper functions to convert between snake_case and camelCase
export function toResource(row: ResourceRow): Resource {
  return {
    id: row.id,
    url: row.url,
    title: row.title,
    description: row.description,
    category: row.category,
    status: row.status,
    priority: row.priority,
    notes: row.notes,
    favicon: row.favicon,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    completedAt: row.completed_at,
  };
}

export function toContentIdea(row: ContentIdeaRow): ContentIdea {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    type: row.type,
    status: row.status,
    linkedResourceIds: row.linked_resource_ids,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Supabase Database type definition
export interface Database {
  public: {
    Tables: {
      resources: {
        Row: ResourceRow;
        Insert: Partial<ResourceRow> & { url: string; title: string };
        Update: Partial<ResourceRow>;
      };
      content_ideas: {
        Row: ContentIdeaRow;
        Insert: Partial<ContentIdeaRow> & { title: string };
        Update: Partial<ContentIdeaRow>;
      };
    };
  };
}
