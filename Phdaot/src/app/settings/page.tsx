"use client";

import React, { useState } from "react";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  const [workspace, setWorkspace] = useState({
    name: "Design System Team",
    description: "Premium Workspace for the UX/UI and Front-End engineering teams.",
    domain: "design-system",
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const handleSave = () => {
    setIsSaving(true);
    // Mock save delay
    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage("Workspace settings saved successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    }, 800);
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this workspace? This action cannot be undone."
    );
    if (confirmDelete) {
      alert("Workspace deleted! (Mock action)");
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto space-y-10">
      <div>
        <Typography variant="h2">Workspace Settings</Typography>
        <Typography variant="body">Manage your team's workspace configuration and identity.</Typography>
      </div>

      <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant shadow-sm space-y-8">
        <Typography variant="h4">General Settings</Typography>
        
        <div className="space-y-6 max-w-2xl">
          <Input 
            label="Workspace Name" 
            placeholder="e.g. Acme Corp" 
            icon="workspaces"
            value={workspace.name}
            onChange={(e) => setWorkspace({ ...workspace, name: e.target.value })}
          />
          <Input 
            label="Workspace Description" 
            placeholder="What is this workspace for?" 
            icon="description"
            value={workspace.description}
            onChange={(e) => setWorkspace({ ...workspace, description: e.target.value })}
          />
          <Input 
            label="Workspace URL / Domain" 
            placeholder="e.g. acme-corp" 
            icon="link"
            value={workspace.domain}
            onChange={(e) => setWorkspace({ ...workspace, domain: e.target.value })}
          />
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-outline-variant">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
          {saveMessage && (
            <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              {saveMessage}
            </span>
          )}
        </div>
      </div>

      <div className="bg-error-container/20 p-8 rounded-3xl border border-error/20 space-y-4">
        <Typography variant="h4" className="text-error">Danger Zone</Typography>
        <Typography variant="body">
          Permanently delete this workspace and all of its boards, cards, and team associations.
        </Typography>
        <div className="pt-2">
          <Button variant="destructive" onClick={handleDelete}>Delete Workspace</Button>
        </div>
      </div>
    </div>
  );
}
