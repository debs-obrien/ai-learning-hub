"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster, toast } from "sonner";
import {
  Brain,
  Plus,
  Search,
  BookOpen,
  CheckCircle,
  Clock,
  LogOut,
  Sparkles,
  Filter,
} from "lucide-react";
import { ResourceCard } from "./ResourceCard";
import { AddResourceModal } from "./AddResourceModal";
import { NotesModal } from "./NotesModal";
import { ContentIdeas } from "./ContentIdeas";
import {
  Resource,
  ResourceCategory,
  ResourceStatus,
  ContentIdea,
  ContentIdeaType,
} from "@/lib/db/schema";

const categories: { value: ResourceCategory | "all"; label: string; emoji: string }[] = [
  { value: "all", label: "All", emoji: "📚" },
  { value: "blog", label: "Blog", emoji: "📝" },
  { value: "video", label: "Video", emoji: "🎬" },
  { value: "podcast", label: "Podcast", emoji: "🎧" },
  { value: "course", label: "Course", emoji: "🎓" },
  { value: "paper", label: "Paper", emoji: "📄" },
  { value: "other", label: "Other", emoji: "🔗" },
];

export function Dashboard() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ResourceCategory | "all">("all");
  const [activeTab, setActiveTab] = useState<ResourceStatus | "all">("to_learn");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editResource, setEditResource] = useState<Resource | null>(null);
  const [notesResource, setNotesResource] = useState<Resource | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch resources
  const fetchResources = async () => {
    try {
      const response = await fetch("/api/resources");
      if (response.ok) {
        const data = await response.json();
        setResources(data);
      }
    } catch (error) {
      console.error("Error fetching resources:", error);
      toast.error("Failed to load resources");
    }
  };

  // Fetch ideas
  const fetchIdeas = async () => {
    try {
      const response = await fetch("/api/ideas");
      if (response.ok) {
        const data = await response.json();
        setIdeas(data);
      }
    } catch (error) {
      console.error("Error fetching ideas:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchResources(), fetchIdeas()]);
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Add resource
  const handleAddResource = async (
    resourceData: Omit<Resource, "id" | "createdAt" | "updatedAt" | "completedAt" | "priority" | "status">
  ) => {
    try {
      const response = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resourceData),
      });

      if (response.ok) {
        const newResource = await response.json();
        setResources((prev) => [...prev, newResource]);
        toast.success("Resource added! 🎉");
      } else {
        toast.error("Failed to add resource");
      }
    } catch (error) {
      console.error("Error adding resource:", error);
      toast.error("Failed to add resource");
    }
  };

  // Update resource
  const handleUpdateResource = async (id: number, data: Partial<Resource>) => {
    try {
      const response = await fetch(`/api/resources/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updated = await response.json();
        setResources((prev) =>
          prev.map((r) => (r.id === id ? updated : r))
        );
        if (data.status === "completed") {
          toast.success("Marked as complete! 🎊");
        }
      }
    } catch (error) {
      console.error("Error updating resource:", error);
      toast.error("Failed to update resource");
    }
  };

  // Delete resource
  const handleDeleteResource = async (id: number) => {
    try {
      const response = await fetch(`/api/resources/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setResources((prev) => prev.filter((r) => r.id !== id));
        toast.success("Resource deleted");
      }
    } catch (error) {
      console.error("Error deleting resource:", error);
      toast.error("Failed to delete resource");
    }
  };

  // Reorder resources
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = filteredResources.findIndex((r) => r.id === active.id);
      const newIndex = filteredResources.findIndex((r) => r.id === over.id);

      const newOrder = arrayMove(filteredResources, oldIndex, newIndex);

      // Update local state immediately for smooth UX
      setResources((prev) => {
        const others = prev.filter(
          (r) => !filteredResources.some((fr) => fr.id === r.id)
        );
        return [...newOrder, ...others];
      });

      // Persist to server
      try {
        await fetch("/api/resources/reorder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderedIds: newOrder.map((r) => r.id),
          }),
        });
      } catch (error) {
        console.error("Error reordering:", error);
        fetchResources(); // Revert on error
      }
    }
  };

  // Edit resource
  const handleEditResource = async (id: number, data: Partial<Resource>) => {
    await handleUpdateResource(id, data);
    setEditResource(null);
  };

  // Save notes
  const handleSaveNotes = async (id: number, notes: string) => {
    await handleUpdateResource(id, { notes });
  };

  // Content Ideas handlers
  const handleAddIdea = async (ideaData: { title: string; type: ContentIdeaType }) => {
    try {
      const response = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ideaData),
      });

      if (response.ok) {
        const newIdea = await response.json();
        setIdeas((prev) => [newIdea, ...prev]);
        toast.success("Idea added! 💡");
      }
    } catch (error) {
      console.error("Error adding idea:", error);
      toast.error("Failed to add idea");
    }
  };

  const handleUpdateIdea = async (id: number, data: Partial<ContentIdea>) => {
    try {
      const response = await fetch(`/api/ideas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updated = await response.json();
        setIdeas((prev) => prev.map((i) => (i.id === id ? updated : i)));
      }
    } catch (error) {
      console.error("Error updating idea:", error);
    }
  };

  const handleDeleteIdea = async (id: number) => {
    try {
      const response = await fetch(`/api/ideas/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setIdeas((prev) => prev.filter((i) => i.id !== id));
      }
    } catch (error) {
      console.error("Error deleting idea:", error);
    }
  };

  // Logout
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  // Filter resources
  const filteredResources = resources
    .filter((r) => {
      if (activeTab !== "all" && r.status !== activeTab) return false;
      if (categoryFilter !== "all" && r.category !== categoryFilter) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          r.title.toLowerCase().includes(query) ||
          r.description?.toLowerCase().includes(query) ||
          r.notes?.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => a.priority - b.priority);

  // Stats
  const stats = {
    toLearn: resources.filter((r) => r.status === "to_learn").length,
    learning: resources.filter((r) => r.status === "learning").length,
    completed: resources.filter((r) => r.status === "completed").length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500">Loading your learning hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900">
      <Toaster position="bottom-right" richColors />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                  AI Learning Hub
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  {resources.length} resources • {stats.completed} completed
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Add URL</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Resources Section */}
          <div className="flex-1 space-y-4">
            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search resources..."
                  className="pl-9 bg-white dark:bg-gray-800"
                />
              </div>
              <Select
                value={categoryFilter}
                onValueChange={(v) => setCategoryFilter(v as ResourceCategory | "all")}
              >
                <SelectTrigger className="w-full sm:w-40 bg-white dark:bg-gray-800">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Category" />
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

            {/* Status Tabs */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ResourceStatus | "all")}>
              <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-gray-800">
                <TabsTrigger value="to_learn" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="hidden sm:inline">Queue</span>
                  <Badge variant="secondary" className="ml-1">
                    {stats.toLearn}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="learning" className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span className="hidden sm:inline">Learning</span>
                  <Badge variant="secondary" className="ml-1">
                    {stats.learning}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="completed" className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Done</span>
                  <Badge variant="secondary" className="ml-1">
                    {stats.completed}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="all" className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden sm:inline">All</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-4">
                {filteredResources.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-900 dark:to-fuchsia-900 rounded-full flex items-center justify-center mb-4">
                      <Sparkles className="w-8 h-8 text-violet-500" />
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                      {searchQuery || categoryFilter !== "all"
                        ? "No matching resources"
                        : "No resources yet"}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      {searchQuery || categoryFilter !== "all"
                        ? "Try adjusting your filters"
                        : "Add your first AI learning resource!"}
                    </p>
                    {!searchQuery && categoryFilter === "all" && (
                      <Button
                        onClick={() => setIsAddModalOpen(true)}
                        variant="outline"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Resource
                      </Button>
                    )}
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={filteredResources.map((r) => r.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-2">
                        {filteredResources.map((resource) => (
                          <ResourceCard
                            key={resource.id}
                            resource={resource}
                            onStatusChange={(id, status) =>
                              handleUpdateResource(id, { status })
                            }
                            onDelete={handleDeleteResource}
                            onEdit={setEditResource}
                            onNotesClick={setNotesResource}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Content Ideas Sidebar */}
          <div className="lg:w-80">
            <ContentIdeas
              ideas={ideas}
              onAdd={handleAddIdea}
              onUpdate={handleUpdateIdea}
              onDelete={handleDeleteIdea}
            />
          </div>
        </div>
      </main>

      {/* Modals */}
      <AddResourceModal
        open={isAddModalOpen || !!editResource}
        onOpenChange={(open) => {
          setIsAddModalOpen(open);
          if (!open) setEditResource(null);
        }}
        onAdd={handleAddResource}
        editResource={editResource}
        onEdit={handleEditResource}
      />

      <NotesModal
        open={!!notesResource}
        onOpenChange={(open) => !open && setNotesResource(null)}
        resource={notesResource}
        onSave={handleSaveNotes}
      />
    </div>
  );
}
