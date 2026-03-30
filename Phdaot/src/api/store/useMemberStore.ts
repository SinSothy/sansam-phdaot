import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Member {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  lastActive: string;
  boards: any[];
  avatarColor?: string;
}

interface MemberState {
  members: Member[];
  setMembers: (members: Member[]) => void;
  addMember: (member: Member) => void;
  updateMember: (id: string, updates: Partial<Member>) => void;
  removeMember: (id: string) => void;
}

/**
 * Member Store with Persistence
 * Standard industry practice to handle "save some data in local".
 * Data is synced to localStorage automatically.
 */
export const useMemberStore = create<MemberState>()(
  persist(
    (set) => ({
      members: [],
      setMembers: (members) => set({ members }),
      addMember: (member) => set((state) => ({ 
        members: [...state.members, member] 
      })),
      updateMember: (id, updates) => set((state) => ({
        members: state.members.map((m) => m.id === id ? { ...m, ...updates } : m)
      })),
      removeMember: (id) => set((state) => ({
        members: state.members.filter((m) => m.id !== id)
      })),
    }),
    {
      name: 'member-storage', // unique name for localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
