import { authService } from "../services/auth.service";
import { useMemberStore } from "../store/useMemberStore";
import apiClient from "../client";

/**
 * Member Manager Layer (Business Logic)
 * Sits between UI and API. 
 * Orchestrates API calls and local state persistence.
 */
export const memberManager = {
  /**
   * Fetch all members and update the local store.
   */
  async fetchMembers() {
    try {
      const response = await apiClient.get('/members');
      // Business Logic: Transformation, filtering etc.
      const members = response.data;
      
      // Update local persistence
      useMemberStore.getState().setMembers(members);
      return members;
    } catch (error) {
      console.error("Failed to fetch members:", error);
      throw error;
    }
  },

  /**
   * Invite a new member.
   * Business Logic: Validate role before sending, update local storage on success.
   */
  async inviteMember(memberData: { name: string; email: string; role: string }) {
    // 1. Business Logic: Pre-validation
    if (!['Admin', 'Member'].includes(memberData.role)) {
      throw new Error("Invalid role assigned.");
    }

    try {
      const response = await apiClient.post('/members/invite', memberData);
      const newMember = response.data;

      // 2. Business Logic: Sync to local storage
      useMemberStore.getState().addMember(newMember);
      return newMember;
    } catch (error) {
      console.error("Failed to invite member:", error);
      throw error;
    }
  },

  /**
   * Update member details.
   */
  async updateMember(id: string, updates: any) {
    try {
      const response = await apiClient.patch(`/members/${id}`, updates);
      const updatedMember = response.data;

      // Update local store
      useMemberStore.getState().updateMember(id, updatedMember);
      return updatedMember;
    } catch (error) {
      console.error("Failed to update member:", error);
      throw error;
    }
  },

  /**
   * Remove member.
   */
  async removeMember(id: string) {
    try {
      await apiClient.delete(`/members/${id}`);
      
      // Update local store
      useMemberStore.getState().removeMember(id);
    } catch (error) {
      console.error("Failed to remove member:", error);
      throw error;
    }
  }
};
