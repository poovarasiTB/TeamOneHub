import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/api';

interface Project {
  id: string;
  code: string;
  name: string;
  status: string;
  healthStatus: string;
  budget?: number;
  startDate: string;
  endDate?: string;
}

interface ProjectsResponse {
  data: Project[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useProjects(filters?: any) {
  return useQuery<ProjectsResponse>({
    queryKey: ['projects', filters],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/projects', { params: filters });
      return data;
    },
  });
}

export function useProject(id: string) {
  return useQuery<Project>({
    queryKey: ['project', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/projects/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<Project>) => {
      const { data: response } = await apiClient.post('/api/projects', data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useUpdateProject(id: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<Project>) => {
      const { data: response } = await apiClient.patch(`/api/projects/${id}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', id] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
