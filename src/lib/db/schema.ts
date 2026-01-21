// Re-export types from types.ts for backward compatibility
export type {
  Resource,
  NewResource,
  ContentIdea,
  NewContentIdea,
  ResourceCategory,
  ResourceStatus,
  ContentIdeaType,
  ContentIdeaStatus,
  ResourceRow,
  ContentIdeaRow,
} from "./types";

export { toResource, toContentIdea } from "./types";
