import { Suspense, lazy } from "react";
import type { ReactNode } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorLayout } from "@/components/layout/ErrorLayout";
import { useNetworkStatus } from "@/components/common/NetworkStatus";
import { useFavicon } from "@/hooks/useFavicon";
import { AuthGuard } from "@/guards/AuthGuard";
import { useAuth } from "@/providers/AuthProvider";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { ModalProvider } from "@/contexts/ModalContext";
import { ToastProvider } from "@/components/ui/Toast";
import { HomePage, ProfilePage } from "./pages";
import DashboardUserListPage from "@/pages/user/UserListPage";
import DashboardUsersByCountryPage from "@/pages/user/UsersByCountryPage";
import { ROUTES } from "./config/routes";
import BlockedUserListPage from "./pages/user/BlockedUsersListPage";
import AvatarListPage from "./pages/avatar/AvatarListPage";
import ReportedUsersListPage from "./pages/user/ReportedUsersListPage";
import { Settings } from "./pages/Settings";
import LanguageListPage from "./pages/language/LanguageListPage";
import GroupListPage from "./pages/group/GroupListPage";
import NotificationList from "./pages/Notification/PushNotificationListPage";
import ReportTypesListPage from "./pages/ReportTypesListPage";
import ReportedGroupsListPage from "./pages/user/ReportedGroupsListPage";
import CMSPage from "./pages/CMS";
import CallsList from "./pages/calls/CallsList";
import TranslatedWordListPage from "./pages/language/TranslatedWordListPage";

// Error boundary fallback component
const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) => <ErrorLayout error={error} onRetry={resetErrorBoundary} />;

// Loading component for Suspense fallback
const PageLoading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner size="lg" label="Loading page..." />
  </div>
);

// Lazy load pages
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const DashboardPage = lazy(() => import("@/pages/Dashboard"));
const NotFoundPage = lazy(() => import("@/pages/NotFound"));

// Public route wrapper
const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

function App() {
  useFavicon();
  const { isOnline } = useNetworkStatus();
  return (
    <div className="min-h-screen ">
      {/* Network status indicator */}
      {!isOnline && (
        <div className="bg-yellow-100 text-yellow-800 text-center p-2 text-sm">
          You are currently offline. Some features may be limited.
        </div>
      )}

      <ErrorBoundary fallback={ErrorFallback}>
        <ToastProvider>
          <ModalProvider>
            <Suspense fallback={<PageLoading />}>
              <Routes>
                {/* Public Routes */}
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <LoginPage />
                    </PublicRoute>
                  }
                />

                {/* Protected Routes */}
                <Route
                  element={
                    <AuthGuard>
                      <DashboardLayout  />
                    </AuthGuard>
                  }
                >
                  <Route path="/" element={<HomePage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/users">
                    <Route
                      path={ROUTES.USERS.LIST}
                      element={<DashboardUserListPage />}
                    />
                    <Route
                      path={ROUTES.USERS.COUNTRY_WISE}
                      element={<DashboardUsersByCountryPage />}
                    />
                    <Route
                      path={ROUTES.USERS.BLOCKED_USERS}
                      element={<BlockedUserListPage />}
                    />
                  </Route>
                  <Route path="/groups">
                    <Route
                      path={ROUTES.GROUP.LIST}
                      element={<GroupListPage />}
                    />
                  </Route>
                  <Route path="/notifications">
                    <Route
                      path={ROUTES.NOTIFICATIONS.LIST}
                      element={<NotificationList />}
                    />
                  </Route>
                  <Route
                    path={ROUTES.AVATARS.LIST}
                    element={<AvatarListPage />}
                  />
                  <Route path="/reports-list">
                    <Route
                      path={ROUTES.REPORTS.USERS}
                      element={<ReportedUsersListPage />}
                    />
                    <Route
                      path={ROUTES.REPORTS.GROUPS}
                      element={<ReportedGroupsListPage />}
                    />
                    <Route
                      path={ROUTES.REPORTS.REPORTTYPES}
                      element={<ReportTypesListPage />}
                    />
                  </Route>
                  <Route path={ROUTES.SETTINGS} element={<Settings />} />
                  <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
                  <Route path="/language">
                    <Route
                      path={ROUTES.LANGUAGE.LIST}
                      element={<LanguageListPage />}
                    />
                    <Route
                      path={ROUTES.LANGUAGE.TRANSLATED_WORD_LIST}
                      element={<TranslatedWordListPage />}
                    />
                  </Route>
                  {/* Add more protected routes here */}
                  <Route path={ROUTES.CMS} element={<CMSPage />} />
                  <Route path="/calls">
                    <Route
                      path={ROUTES.CALLS.AUDIO_CALL_LIST}
                      element={<CallsList type="audio" />}
                    />
                    <Route
                      path={ROUTES.CALLS.VIDEO_CALL_LIST}
                      element={<CallsList type="video" />}
                    />
                  </Route>
                </Route>
                {/* 404 - Not Found */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </ModalProvider>
        </ToastProvider>
      </ErrorBoundary>
    </div>
  );
}

export default App;
