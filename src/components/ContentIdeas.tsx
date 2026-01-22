"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Lightbulb,
  Plus,
  MoreVertical,
  Trash2,
  Check,
  ArrowRight,
} from "lucide-react";
import { ContentIdea, ContentIdeaStatus, ContentIdeaType } from "@/lib/db/schema";

const typeConfig: Record<ContentIdeaType, { label: string; emoji: string }> = {
  blog_post: { label: "Blog Post", emoji: "📝" },
  video: { label: "Video", emoji: "🎬" },
  tutorial: { label: "Tutorial", emoji: "📚" },
  thread: { label: "Thread", emoji: "🧵" },
  other: { label: "Other", emoji: "💡" },
};

const statusConfig: Record<ContentIdeaStatus, { label: string; color: string }> = {
  idea: { label: "Idea", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300" },
  drafting: { label: "Drafting", color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
  published: { label: "Published", color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" },
};

interface ContentIdeasProps {
  ideas: ContentIdea[];
  onAdd: (idea: { title: string; type: ContentIdeaType }) => void;
  onUpdate: (id: number, data: Partial<ContentIdea>) => void;
  onDelete: (id: number) => void;
}

export function ContentIdeas({ ideas, onAdd, onUpdate, onDelete }: ContentIdeasProps) {
  const [newIdeaTitle, setNewIdeaTitle] = useState("");
  const [newIdeaType, setNewIdeaType] = useState<ContentIdeaType>("blog_post");
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    if (!newIdeaTitle.trim()) return;
    onAdd({ title: newIdeaTitle, type: newIdeaType });
    setNewIdeaTitle("");
    setIsAdding(false);
  };

  const getNextStatus = (current: ContentIdeaStatus): ContentIdeaStatus | null => {
    if (current === "idea") return "drafting";
    if (current === "drafting") return "published";
    return null;
  };

  const getPrevStatus = (current: ContentIdeaStatus): ContentIdeaStatus | null => {
    if (current === "published") return "drafting";
    if (current === "drafting") return "idea";
    return null;
  };

  const ideaGroups = {
    idea: ideas.filter((i) => i.status === "idea"),
    drafting: ideas.filter((i) => i.status === "drafting"),
    published: ideas.filter((i) => i.status === "published"),
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-lg">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            Content Ideas
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsAdding(!isAdding)}
            className="text-violet-600"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto space-y-4">
        {/* Add new idea form */}
        {isAdding && (
          <div className="space-y-2 p-3 bg-gradient-to-r from-violet-50 to-fuchsia-50 dark:from-violet-950/50 dark:to-fuchsia-950/50 rounded-lg border border-violet-200 dark:border-violet-800">
            <Input
              value={newIdeaTitle}
              onChange={(e) => setNewIdeaTitle(e.target.value)}
              placeholder="Content idea title..."
              className="text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAdd();
                if (e.key === "Escape") setIsAdding(false);
              }}
              autoFocus
            />
            <div className="flex gap-2">
              <Select
                value={newIdeaType}
                onValueChange={(v) => setNewIdeaType(v as ContentIdeaType)}
              >
                <SelectTrigger className="flex-1 text-sm h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(typeConfig).map(([value, config]) => (
                    <SelectItem key={value} value={value}>
                      <span className="flex items-center gap-2">
                        <span>{config.emoji}</span>
                        <span>{config.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="sm" onClick={handleAdd} className="h-8">
                <Check className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Ideas by status */}
        {(Object.keys(ideaGroups) as ContentIdeaStatus[]).map((status) => {
          const group = ideaGroups[status];
          if (group.length === 0 && status !== "idea") return null;

          return (
            <div key={status} className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className={`text-xs ${statusConfig[status].color}`}>
                  {statusConfig[status].label}
                </Badge>
                <span className="text-xs text-gray-400">({group.length})</span>
              </div>

              {group.length === 0 ? (
                <p className="text-xs text-gray-400 italic pl-2">No ideas yet</p>
              ) : (
                <div className="space-y-1">
                  {group.map((idea) => {
                    const type = typeConfig[idea.type as ContentIdeaType] || typeConfig.other;
                    const nextStatus = getNextStatus(idea.status as ContentIdeaStatus);
                    const prevStatus = getPrevStatus(idea.status as ContentIdeaStatus);

                    return (
                      <div
                        key={idea.id}
                        className="group flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <span className="text-sm">{type.emoji}</span>
                        <span className="flex-1 text-sm truncate">{idea.title}</span>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            {nextStatus && (
                              <DropdownMenuItem
                                onClick={() => onUpdate(idea.id, { status: nextStatus })}
                              >
                                <ArrowRight className="w-4 h-4 mr-2" />
                                Move to {statusConfig[nextStatus].label}
                              </DropdownMenuItem>
                            )}
                            {prevStatus && (
                              <DropdownMenuItem
                                onClick={() => onUpdate(idea.id, { status: prevStatus })}
                              >
                                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                                Move to {statusConfig[prevStatus].label}
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => onDelete(idea.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
