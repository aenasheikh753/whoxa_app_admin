import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { LoginForm } from '@/components/auth/LoginForm';
import MockDetails from '@/components/ui/login/mock_details';
import { useProjectConfigStore } from '@/stores/useProjectConfigStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const { config, fetchConfig } = useProjectConfigStore();

  useEffect(() => {
    if (!config) {
      fetchConfig();
    }
  }, [config, fetchConfig]);

  const handleLoginSuccess = () => {
    toast.success('Login successful!');
    navigate('/dashboard');
  };

  const handleLoginError = (error: Error) => {
    toast.error(error.message || 'Failed to login. Please try again.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto h-screen lg:max-w-none">
        <div className="grid h-full lg:grid-cols-2">

          {/* Left side - Mock Details with Blue Gradient */}
          <div className="hidden lg:flex relative overflow-hidden">
            <MockDetails />
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-blue-700/10 to-transparent pointer-events-none"></div>
          </div>

          {/* Right side - Login Form */}
          <div className="flex flex-col bg-white dark:bg-slate-800 justify-center p-4 sm:p-6 lg:p-8 lg:px-12">
            <div className="w-full max-w-lg space-y-8 mx-auto lg:mx-0">

              {/* Logo Section - Left Aligned */}
              <div className="text-left">
                <img
                  src="/assets/covo-logo.png"
                  alt="ConvoX Logo"
                  className="h-15 sm:h-15 lg:h-20 xl:h-20 w-auto max-w-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent && !parent.querySelector('.logo-fallback')) {
                      const fallback = document.createElement('div');
                      fallback.className = 'logo-fallback flex items-center gap-2';
                      fallback.innerHTML = `
                        <div class="h-20 w-20 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                          <span class="text-white font-bold text-3xl">CX</span>
                        </div>
                        <span class="text-4xl font-bold text-slate-900 dark:text-slate-50">ConvoX</span>
                      `;
                      parent.appendChild(fallback);
                    }
                  }}
                />
              </div>

              {/* Welcome Text - Left Aligned */}
              <div className="text-left space-y-2">
                <h2 className="font-bold text-slate-900 dark:text-slate-50 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-tight">
                  Welcome back!
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg sm:text-xl lg:text-2xl font-medium">
                  Please{" "}
                  <span className="relative inline-block text-blue-600 dark:text-blue-400 font-semibold">
                    Sign in
                    <svg
                      className="absolute left-0 top-full w-full mt-1"
                      height="4"
                      viewBox="0 0 100 4"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0 2 Q25 0, 50 2 T100 2"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        className="text-blue-600 dark:text-blue-400"
                      />
                    </svg>
                  </span>{" "}
                  to continue
                </p>
              </div>

              {/* Login Form Card */}
              <div className="w-full">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 lg:p-8">
                  <LoginForm
                    onSuccess={handleLoginSuccess}
                    onError={handleLoginError}
                  />
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;