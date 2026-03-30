"use client";

import React, { useState } from "react";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconButton } from "@/components/ui/IconButton";
import { Dialog, DialogFooter } from "@/components/ui/dialog";
import { MemberAction } from "@/components/team/MemberAction";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface Board {
  id: string;
  name: string;
}

interface Member {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  lastActive: string;
  boards: Board[];
  avatarColor?: string;
}

const AVATAR_COLORS = [
  "bg-orange-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-green-500",
  "bg-rose-500",
];

export default function TeamPage() {
  const t = useTranslations();
  const [members, setMembers] = useState<Member[]>([
    { 
      id: "1", 
      name: "srengkhorn", 
      username: "@srengkhorn", 
      email: "srengkhorn@example.com", 
      role: "Admin", 
      lastActive: "Mar 2026", 
      boards: [
        { id: "b1", name: "Engineering Design" },
        { id: "b2", name: "Alpha Release" },
        { id: "b3", name: "Sprint 24 Planning" }
      ],
      avatarColor: "bg-orange-500"
    },
    { 
      id: "2", 
      name: "SinSothy", 
      username: "@sinsothy", 
      email: "sinsothy@example.com", 
      role: "Admin", 
      lastActive: "Mar 2026", 
      boards: [
        { id: "b1", name: "Engineering Design" },
        { id: "b4", name: "Product Roadmap" },
        { id: "b5", name: "Marketing Strategy" }
      ],
      avatarColor: "bg-blue-500"
    },
    { 
      id: "3", 
      name: "seth@cmcb", 
      username: "@sethcmcb", 
      email: "seth@example.com", 
      role: "Admin", 
      lastActive: "Mar 2025", 
      boards: [
        { id: "b2", name: "Alpha Release" },
        { id: "b4", name: "Product Roadmap" }
      ],
      avatarColor: "bg-rose-500"
    },
  ]);

  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", role: "Admin", username: "" });

  const handleOpenUpdate = (member: Member) => {
    setSelectedMember(member);
    setFormData({ 
      name: member.name, 
      email: member.email, 
      role: member.role,
      username: member.username
    });
    setIsUpdateDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!selectedMember) return;
    setMembers(members.map(m => m.id === selectedMember.id ? { ...m, ...formData } : m));
    setIsUpdateDialogOpen(false);
  };

  const handleInvite = () => {
    if (!formData.name || !formData.email) return;
    const newMember: Member = {
      id: Date.now().toString(),
      name: formData.name,
      username: formData.username || `@${formData.name.toLowerCase().replace(/\s+/g, "")}`,
      email: formData.email,
      role: formData.role,
      lastActive: "Never",
      boards: [],
      avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]
    };
    setMembers([...members, newMember]);
    setIsInviteDialogOpen(false);
    setFormData({ name: "", email: "", role: "Admin", username: "" });
  };

  const handleDelete = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
  };

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto py-10 px-6 space-y-10">
      {/* Header Section */}
      <div className="flex items-end justify-between border-b pb-6 border-outline-variant">
        <div className="space-y-1">
          <Typography variant="h1" className="text-3xl">{t('Team.pageTitle')}</Typography>
          <Typography variant="body" className="text-secondary max-w-lg">
            {t('Team.pageDescription')}
          </Typography>
        </div>
        <Button 
          className="rounded-full px-6 flex items-center gap-2" 
          onClick={() => {
            setFormData({ name: "", email: "", role: "Admin", username: "" });
            setIsInviteDialogOpen(true);
          }}
        >
          <span className="material-symbols-outlined text-lg">person_add</span>
          {t('Team.inviteMember')}
        </Button>
      </div>

      {/* Members List */}
      <div className="space-y-2">
        {members.length === 0 ? (
          <div className="py-20 text-center bg-surface-container-low rounded-3xl border border-dashed border-outline-variant">
            <Typography variant="body" className="opacity-50">{t('Team.noMembersFound')}</Typography>
          </div>
        ) : (
          members.map((member) => (
            <div 
              key={member.id}
              onClick={() => handleOpenUpdate(member)}
              className="group flex items-center justify-between p-4 bg-surface-container-lowest rounded-2xl border border-transparent hover:border-outline-variant hover:bg-surface-container-low transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-4 flex-1">
                {/* Avatar */}
                <div className={cn("h-12 w-12 rounded-full flex items-center justify-center text-on-primary font-bold shadow-inner uppercase", member.avatarColor || "bg-primary")}>
                  {member.name.substring(0, 2)}
                </div>
                
                {/* Info */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Typography variant="h4" className="text-base">{member.name}</Typography>
                    <Typography variant="body" className="text-xs text-secondary opacity-70">{member.username}</Typography>
                  </div>
                  <Typography variant="caption" className="text-secondary font-medium tracking-normal normal-case">
                    {t('Team.lastActive', {time: member.lastActive})}
                  </Typography>
                </div>
              </div>

              {/* Actions & Status */}
              <MemberAction 
                member={member} 
                onUpdateRole={() => handleOpenUpdate(member)} 
                onActionClick={() => {
                   if (member.name === "SinSothy") {
                      alert("Leaving workspace...");
                   } else {
                      handleDelete(member.id);
                   }
                }}
              />
            </div>
          ))
        )}
      </div>

      {/* Update Member Dialog */}
      <Dialog 
        isOpen={isUpdateDialogOpen} 
        onClose={() => setIsUpdateDialogOpen(false)}
        title={t('Team.updateMember.title')}
        description={t('Team.updateMember.description')}
        className="max-w-md"
      >
        <div className="space-y-5">
           <Input 
             label={t('Team.inviteNewMember.fullName')} 
             value={formData.name}
             onChange={(e) => setFormData({...formData, name: e.target.value})}
             placeholder="Enter name"
           />
           <Input 
             label="Username" 
             value={formData.username}
             onChange={(e) => setFormData({...formData, username: e.target.value})}
             placeholder="@username"
           />
           <Input 
             label="Role" 
             value={formData.role}
             onChange={(e) => setFormData({...formData, role: e.target.value})}
             placeholder="Admin, Member, etc."
           />
           
           <DialogFooter>
             <Button variant="ghost" onClick={() => setIsUpdateDialogOpen(false)}>{t('Common.cancel')}</Button>
             <Button onClick={handleUpdate}>{t('Common.save')}</Button>
           </DialogFooter>
        </div>
      </Dialog>

      {/* Invite Member Dialog */}
      <Dialog 
        isOpen={isInviteDialogOpen} 
        onClose={() => setIsInviteDialogOpen(false)}
        title={t('Team.inviteNewMember.title')}
        description={t('Team.inviteNewMember.description')}
        className="max-w-md"
      >
        <div className="space-y-5">
           <div className="bg-primary-container/10 p-4 rounded-2xl flex items-center gap-3 border border-primary/20">
              <span className="material-symbols-outlined text-primary text-3xl">mail</span>
              <Typography variant="body" className="text-xs text-primary font-medium">
                {t('Team.inviteNewMember.emailInstruction')}
              </Typography>
           </div>

           <Input 
             label={t('Team.inviteNewMember.fullName')} 
             value={formData.name}
             onChange={(e) => setFormData({...formData, name: e.target.value})}
             placeholder="e.g. John Doe"
           />
           <Input 
             label={t('Team.inviteNewMember.emailAddress')} 
             value={formData.email}
             onChange={(e) => setFormData({...formData, email: e.target.value})}
             placeholder="john@example.com"
           />
           
           <div className="pt-2">
             <Typography variant="label" className="mb-2 block">{t('Team.inviteNewMember.availableRoles')}</Typography>
             <div className="grid grid-cols-2 gap-2">
                {["Admin", "Member"].map(role => (
                   <button
                    key={role}
                    onClick={() => setFormData({...formData, role})}
                    className={cn(
                      "p-3 rounded-xl border text-sm font-bold transition-all",
                      formData.role === role 
                        ? "bg-primary text-on-primary border-primary" 
                        : "bg-surface-container-low border-outline-variant hover:bg-surface-container-high"
                    )}
                   >
                     {role}
                   </button>
                ))}
             </div>
           </div>
           
           <DialogFooter>
             <Button variant="ghost" onClick={() => setIsInviteDialogOpen(false)}>{t('Common.cancel')}</Button>
             <Button onClick={handleInvite} fullWidth>{t('Team.inviteNewMember.sendInvitation')}</Button>
           </DialogFooter>
        </div>
      </Dialog>
    </div>
  );
}
