"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Sparkles, Link } from "lucide-react";
import { Resource, ResourceCategory } from "@/lib/db/schema";

interface AddResourceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (resource: Omit<Resource, "id" | "createdAt" | "updatedAt" | "completedAt" | "priority" | "status">) => void;
  editResource?: Resource | null;
  onEdit?: (id: number, data: Partial<Resource>) => void;
}

const categories: { value: ResourceCategory; label: string; emoji: string }[] = [
  { value: "blog", label: "Blog Post", emoji: "📝" },
  { value: "video", label: "Video", emoji: "🎬" },
  { value: "podcast", label: "Podcast", emoji: "🎧" },
  { value: "course", label: "Course", emoji: "🎓" },
  { value: "paper", label: "Paper", emoji: "📄" },
  { value: "other", label: "Other", emoji: "🔗" },
];

export function AddResourceModal({
  open,
  onOpenChange,
  onAdd,
  editResource,
  onEdit,
}: AddResourceModalProps) {
  const [url, setUrl] = useState(editResource?.url || "");
  const [title, setTitle] = useState(editResource?.title || "");
  const [description, setDescription] = useState(editResource?.description || "");
  const [category, setCategory] = useState<ResourceCategory>(
    (editResource?.category as ResourceCategory) || "other"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const isEditing = !!editResource;

  const resetForm = () => {
    setUrl("");
    setTitle("");
    setDescription("");
    setCategory("other");
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const fetchMetadata = async () => {
    if (!url) return;

    setIsFetching(true);
    try {
      const response = await fetch("/api/metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (response.ok) {
        const data = await response.json();
        setTitle(data.title || "");
        setDescription(data.description || "");
        setCategory(data.category || "other");
      }
    } catch (error) {
      console.error("Error fetching metadata:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !title) return;

    setIsLoading(true);
    try {
      if (isEditing && onEdit) {
        onEdit(editResource.id, {
          url,
          title,
          description,
          category,
        });
      } else {
        onAdd({
          url,
          title,
          description,
          category,
          notes: null,
          favicon: null,
        });
      }
      handleClose();
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fetch metadata when URL changes (with debounce effect)
  const handleUrlBlur = () => {
    if (url && !title) {
      fetchMetadata();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditing ? (
              <>✏️ Edit Resource</>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-violet-500" />
                Add Learning Resource
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the resource details below."
              : "Paste a URL and we'll automatically fetch the title and description."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* URL Input */}
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onBlur={handleUrlBlur}
                  placeholder="https://example.com/article"
                  className="pl-9"
                  required
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={fetchMetadata}
                disabled={!url || isFetching}
              >
                {isFetching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Resource title"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the resource..."
              rows={3}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as ResourceCategory)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <span className="flex items-center gap-2">
                      <span>{cat.emoji}</span>
                      <span>{cat.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !url || !title}
              className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {isEditing ? "Save Changes" : "Add Resource"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
