import { create } from 'zustand';
import type { StoreApi, StateCreator } from 'zustand';
import { toast } from 'sonner';
import { projectService } from '@/services/global/projectConfigurationService';
import type { ProjectConfiguration } from '@/types/project_configuration';
import { devtools, persist } from 'zustand/middleware';

type ConfigValue = string | number | boolean | Record<string, unknown> | null;

interface ProjectConfigState {
  config: ProjectConfiguration['data'] | null;
  isLoading: boolean;
  error: string | null;
  fetchConfig: () => Promise<void>;
  updateConfig: (key: string, value: ConfigValue) => Promise<void>;
}

type Store = ProjectConfigState;

const store: StateCreator<Store> = (set) => ({
  config: null,
  isLoading: false,
  error: null,
  
  fetchConfig: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await projectService.getProjectConfig();
      console.log('Fetched project configuration:', response);
      
      // Backend returns: { status: true, data: config, message: "...", toast: false }
      // projectService.getProjectConfig() returns ProjectConfiguration type
      // So response.data contains the actual config data
      if (!response) {
        throw new Error('No response received from server');
      }
      
      // Check if response has data property and it's not empty/null
      if (!response.data || (typeof response.data === 'object' && Object.keys(response.data).length === 0)) {
        console.warn('Config data is empty or null, waiting for backend to initialize...');
        // Don't throw error, just set loading to false - config will be created by backend
        set({ 
          config: null, 
          isLoading: false,
          error: 'Configuration not initialized. Please wait for backend to create initial config.'
        });
        return;
      }
      
      set({ 
        config: response.data, 
        isLoading: false 
      });
      console.log('Project configuration loaded:', response.data);
      
    } catch (error) {
      console.error('Failed to fetch config:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load configuration', 
        isLoading: false 
      });
      // Only show toast if it's a real error, not just empty config
      if (error instanceof Error && !error.message.includes('not initialized')) {
        toast.error('Failed to load configuration');
      }
    }
  },
  
  updateConfig: async (key: string, value: ConfigValue) => {
    try {
      set({ isLoading: true });
      await projectService.updateConfig(key, value);
      
      set((state) => ({
        ...state,
        config: state.config ? {
          ...state.config,
          [key]: value
        } : null,
        isLoading: false
      }));
      
      toast.success('Configuration updated successfully');
    } catch (error) {
      console.error('Failed to update config:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to update configuration',
        isLoading: false
      });
      toast.error('Failed to update configuration');
      throw error;
    }
  },
});

export const useProjectConfigStore = create<Store>()(
  devtools(
      store,
      {
        name: 'project-config-store',
      }
   
  )
);

// Initialize the store when the app loads
const initializeConfig = () => {
  const store = useProjectConfigStore.getState();
  if (!store.config) {
    store.fetchConfig();
  }
};

// Call initialize when the store is imported
if (typeof window !== 'undefined') {
  initializeConfig();
}
