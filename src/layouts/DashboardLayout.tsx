import { useState, useEffect } from 'react';
import { Suspense } from 'react';
import type { ReactNode } from 'react';

import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
// import { useTheme } from '@/providers/ThemeProvider';
import { useAuth } from '@/providers/AuthProvider';
import { Header } from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { useModal } from '@/contexts/ModalContext';
// import { Button } from '@/components/ui/button';
import { ErrorBoundary } from 'react-error-boundary';
import { ROUTES, getPageTitle } from '@/config/routes';
// import { useMediaQuery } from '@/hooks/use-media-query';
import { Button } from '@/components/ui/Button';
import { Plus, AlertCircle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

interface DashboardLayoutProps {
  children?: ReactNode;
  className?: string;
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useAuth();
  const { openAvatarModal } = useModal();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMounted, setIsMounted] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Set mounted state to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate(ROUTES.LOGIN, { replace: true });
    }
  }, [user, navigate]);

  if (!isMounted) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null; // Will be redirected by the effect
  }

  const pageTitle = getPageTitle(location.pathname);

  // Toggle sidebar collapsed state
  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Handle navbar "New" button click based on current route
  const handleNewButtonClick = () => {
    if (location.pathname === ROUTES.AVATARS.MANAGEMENT) {
      openAvatarModal();
    } else {
      // Default behavior for other pages
      console.log('New button clicked on:', location.pathname);
    }
  };

  return (
    <div className={cn('flex h-screen bg-secondary', className)}>
      {/* Floating Toggle Button - Hidden on mobile */}
      {!isMobile && (
        <button
          onClick={handleToggleSidebar}
          className={cn(
            'fixed top-4   cursor-pointer bg-text-muted/55 shadow-lg',
            ' ',
            'transition-all duration-200 ',
            'flex items-center justify-center h-6 w-6', // Keep original dimensions
            'transform translate-x-0', // Remove negative translation
            'overflow-visible',
            // Adjust padding to position chevron
            sidebarCollapsed ? 'md:left-16' : 'md:left-64' // Adjust based on sidebar width
          )}
          style={{
            left: sidebarCollapsed ? '64px' : '256px', // Half of sidebar width - half of button width
          }}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
         <div className=' z-50'>
           {sidebarCollapsed ? (
            <ChevronRight className="h-5 w-5 text-text-muted" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-text-muted" />
          )}
         </div>
        </button>
      )}

      {/* Mobile sidebar backdrop */}
      {isMobile && sidebarOpen && (
        <div
          className={cn(
            'fixed inset-0 z-40 ',
            'transition-opacity duration-300',
            'bg-secondary',
            'backdrop-blur-sm'
          )}
          onClick={() => setSidebarOpen(false)}
          aria-hidden={!sidebarOpen}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out',
          'bg-secondary',
          'border-r border-gray-200 dark:border-gray-700',
          'flex flex-col',
          'shadow-lg',
          // Mobile behavior
          isMobile ? (
            sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'
          ) : (
            // Desktop behavior
            `static translate-x-0 shadow-none ${sidebarCollapsed ? 'w-16' : 'w-64'}`
          )
        )}
      >

        {/* <div className="flex-1 overflow-y-auto"> */}
        <Sidebar
          collapsed={!isMobile && sidebarCollapsed}
          onCollapse={setSidebarCollapsed}
          className={cn(
            'transition-all duration-200 ease-in-out',
            isMobile ? 'w-64' : (sidebarCollapsed ? 'w-16' : 'w-64')
          )}
        />
        {/* </div> */}
        {/* <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
              <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user.email}
              </p>
            </div>
          </div>
        </div> */}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          variant=""
          showMobileMenu={isMobile}
          sidebarOpen={sidebarOpen}
        />

        <main className="flex-1 overflow-y-auto focus:outline-none p-4 md:p-6">
          <div className="max-w-full mx-auto">


            <div className=" ">
              <ErrorBoundary
                fallback={
                  <div className="text-center py-8">
                    <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                      Something went wrong
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      We're having trouble loading this content. Please try again later.
                    </p>
                    <div className="mt-6">
                      <Button onClick={() => window.location.reload()}>
                        Try again
                      </Button>
                    </div>
                  </div>
                }
              >
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center ">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  }
                >
                  {children || <Outlet />}
                </Suspense>
              </ErrorBoundary>
            </div>
          </div>
        </main>

        {/* <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} Your Company. All rights reserved.
            </p>
            <div className="mt-2 md:mt-0 flex space-x-6">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                Privacy
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                Terms
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                Help
              </a>
            </div>
          </div>
        </footer> */}
      </div>
    </div>
  );
}

// Add display name for debugging
DashboardLayout.displayName = 'DashboardLayout';