"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { DashboardRecord, ProfileDashboardData, ProfileSection } from "@/types/profile";

type ProfileResponse = { section: ProfileSection; data: ProfileDashboardData & { sectionRecords: DashboardRecord[] } };

export function useProfileDashboard(section: ProfileSection) {
  return useQuery({
    queryKey: ["profile-dashboard", section],
    queryFn: async () => (await apiClient.get<ProfileResponse>(`/api/profile/${section}`)).data,
  });
}

export function useProfileAction(section: ProfileSection) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => (await apiClient.post(`/api/profile/${section}`, payload)).data as Promise<{ ok: boolean; id: string; message: string }>,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile-dashboard"] }),
  });
}
