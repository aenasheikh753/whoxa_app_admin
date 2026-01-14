import { useEffect } from 'react';
import { useThemeStore } from '@/store/theme/themeStore';
import { useProjectConfigStore } from '@/stores/useProjectConfigStore';

export const useFavicon = () => {
  const resolvedTheme = useThemeStore((state) => state.resolvedTheme);
  const config = useProjectConfigStore((state) => state.config);

  useEffect(() => {
    const faviconLink = document.querySelector<HTMLLinkElement>("link[rel~='icon']") || 
      document.createElement('link');
    
    faviconLink.rel = 'icon';
    
    // Use the appropriate favicon based on the theme
    // Default to faviconn.png if config logos are not available
    const faviconUrl = config
      ? (resolvedTheme === 'dark' 
          ? config.web_logo_dark || config.web_logo_light || '/assets/faviconn.png'
          : config.web_logo_light || '/assets/faviconn.png')
      : '/assets/faviconn.png';

    if (faviconUrl && faviconUrl !== faviconLink.href) {
      faviconLink.href = faviconUrl;
      
      if (!document.head.contains(faviconLink)) {
        document.head.appendChild(faviconLink);
      }
    }
    
    if (config?.app_name) {
      document.title = config.app_name;
    } else {
      document.title = 'ConvoX - Admin Dashboard';
    }
  }, [resolvedTheme, config]);
};
