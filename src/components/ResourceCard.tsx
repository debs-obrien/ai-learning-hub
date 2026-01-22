"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  GripVertical,
  ExternalLink,
  MoreVertical,
  CheckCircle,
  BookOpen,
  Trash2,
  FileText,
  Copy,
  Pencil,
} from "lucide-react";
import { Resource, ResourceCategory, ResourceStatus } from "@/lib/db/schema";

const categoryConfig: Record<
  ResourceCategory,
  { label: string; emoji: string; color: string }
> = {
  blog: { label: "Blog", emoji: "📝", color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
  video: { label: "Video", emoji: "🎬", color: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" },
  podcast: { label: "Podcast", emoji: "🎧", color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300" },
  course: { label: "Course", emoji: "🎓", color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" },
  paper: { label: "Paper", emoji: "📄", color: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300" },
  other: { label: "Other", emoji: "🔗", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
};

interface ResourceCardProps {
  resource: Resource;
  onStatusChange: (id: number, status: ResourceStatus) => void;
  onDelete: (id: number) => void;
  onEdit: (resource: Resource) => void;
  onNotesClick: (resource: Resource) => void;
}

export function ResourceCard({
  resource,
  onStatusChange,
  onDelete,
  onEdit,
  onNotesClick,
}: ResourceCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: resource.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const category = categoryConfig[resource.category as ResourceCategory] || categoryConfig.other;
  const hostname = new URL(resource.url).hostname.replace("www.", "");

  const copyToClipboard = () => {
    navigator.clipboard.writeText(resource.url);
  };

  const openResource = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(resource.url, "_blank");
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`group transition-all duration-200 hover:shadow-md border-l-4 ${
        resource.status === "completed"
          ? "border-l-green-500 bg-green-50/50 dark:bg-green-950/20"
          : resource.status === "learning"
          ? "border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20"
          : "border-l-violet-500"
      } ${isDragging ? "opacity-50 shadow-lg scale-105" : ""}`}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-2">
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            className="mt-1 cursor-grab active:cursor-grabbing opacity-40 hover:opacity-100 transition-opacity touch-none"
          >
            <GripVertical className="w-4 h-4 text-gray-400" />
          </button>

          {/* Favicon */}
          <div className="flex-shrink-0 mt-1">
            {resource.favicon ? (
              // eslint-disable-next-line @next/next/no-img-element -- Favicons are from dynamic external domains, small images don't benefit from optimization
              <img
                src={resource.favicon}
                alt=""
                className="w-5 h-5 rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <span className="text-lg">{category.emoji}</span>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={openResource}
                  className="block group/link"
                >
                  <h3 className="font-medium text-sm leading-tight line-clamp-2 text-gray-900 dark:text-gray-100 group-hover/link:text-violet-600 dark:group-hover/link:text-violet-400 transition-colors cursor-pointer">
                    {resource.title}
                  </h3>
                </a>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={openResource}
                  className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                >
                  <span className="truncate">{hostname}</span>
                  <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>

              {/* Actions Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => window.open(resource.url, "_blank")}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Link
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={copyToClipboard}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy URL
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {resource.status !== "learning" && (
                    <DropdownMenuItem onClick={() => onStatusChange(resource.id, "learning")}>
                      <BookOpen className="w-4 h-4 mr-2" />
                      Start Learning
                    </DropdownMenuItem>
                  )}
                  {resource.status !== "completed" && (
                    <DropdownMenuItem onClick={() => onStatusChange(resource.id, "completed")}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Complete
                    </DropdownMenuItem>
                  )}
                  {resource.status !== "to_learn" && (
                    <DropdownMenuItem onClick={() => onStatusChange(resource.id, "to_learn")}>
                      <BookOpen className="w-4 h-4 mr-2" />
                      Move to Queue
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onNotesClick(resource)}>
                    <FileText className="w-4 h-4 mr-2" />
                    {resource.notes ? "View Notes" : "Add Notes"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(resource)}>
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(resource.id)}
                    className="text-red-600 dark:text-red-400"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Description */}
            {resource.description && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                {resource.description}
              </p>
            )}

            {/* Tags row */}
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className={`text-xs ${category.color}`}>
                {category.emoji} {category.label}
              </Badge>
              {resource.notes && (
                <Badge variant="outline" className="text-xs">
                  📝 Notes
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
