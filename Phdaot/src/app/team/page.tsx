"use client";

import React, { useState } from "react";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconButton } from "@/components/ui/IconButton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>([
    { id: "1", name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
    { id: "2", name: "Bob Smith", email: "bob@example.com", role: "Editor" },
  ]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", role: "" });

  const handleAdd = () => {
    if (!formData.name || !formData.email) return;
    if (isEditing) {
      setMembers(members.map(m => m.id === isEditing ? { ...m, ...formData } : m));
      setIsEditing(null);
    } else {
      setMembers([...members, { id: Date.now().toString(), ...formData, role: formData.role || "Viewer" }]);
    }
    setFormData({ name: "", email: "", role: "" });
  };

  const handleEdit = (m: Member) => {
    setIsEditing(m.id);
    setFormData({ name: m.name, email: m.email, role: m.role });
  };

  const handleDelete = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
  };

  return (
    <div className="flex flex-col h-full w-full max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h2">Workspace Members</Typography>
          <Typography variant="body">Manage who has access to this workspace.</Typography>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="col-span-1 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm h-fit space-y-4">
          <Typography variant="h4">{isEditing ? "Edit Member" : "Invite New Member"}</Typography>
          
          <Input 
            label="Full Name" 
            placeholder="e.g. Jane Doe" 
            icon="person"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <Input 
            label="Email Address" 
            placeholder="jane@example.com" 
            icon="mail"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <Input 
            label="Role" 
            placeholder="e.g. Admin, Editor, Viewer" 
            icon="badge"
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
          />
          
          <div className="flex gap-2 pt-2">
            <Button fullWidth onClick={handleAdd}>
              {isEditing ? "Save Changes" : "Send Invite"}
            </Button>
            {isEditing && (
              <Button variant="ghost" onClick={() => { setIsEditing(null); setFormData({name: "", email: "", role: ""}); }}>
                Cancel
              </Button>
            )}
          </div>
        </div>

        {/* List Section */}
        <div className="col-span-1 md:col-span-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-outline">No members found.</TableCell>
                </TableRow>
              )}
              {members.map(member => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <Typography variant="h4" className="text-sm">{member.name}</Typography>
                        <Typography variant="body" className="text-xs">{member.email}</Typography>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="bg-secondary-container text-on-secondary-container px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                      {member.role}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <IconButton icon="edit" variant="ghost" onClick={() => handleEdit(member)} />
                      <IconButton icon="delete" variant="ghost" className="text-error hover:text-error hover:bg-error-container" onClick={() => handleDelete(member.id)} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
