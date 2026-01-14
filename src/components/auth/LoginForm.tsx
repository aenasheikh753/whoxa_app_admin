import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import {
  CardContent,
  CardFooter,
} from '../ui/Card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

// ✅ Zod Schema
const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(2, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

type LoginFormValues = z.infer<typeof loginFormSchema>;

export function LoginForm({ onSuccess, onError }: LoginFormProps) {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const { formState: { isSubmitting } } = form;

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login({ email: data.email, password: data.password });
      onSuccess?.();
    } catch (error) {
      console.error('Login failed:', error);
      onError?.(error as Error);
    }
  };

  return (
    <div className="w-full">
      <Form<LoginFormValues> form={form} onSubmit={onSubmit}>
        <CardContent className="w-full flex flex-col gap-6 p-0">
          {/* Email Field */}
          <FormField name="email">
            <FormItem>
              <label htmlFor="email" className='text-slate-700 dark:text-slate-300 font-medium text-sm'>Email <span className='text-red-500'>*</span></label>
              <FormControl>
                <div className="relative mt-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    autoComplete="email"
                    disabled={isSubmitting}
                    className="w-full pl-10 text-slate-900 dark:text-slate-50 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 pr-4 transition-all"
                    {...form.register("email")}
                  />
                  <Mail className="absolute text-slate-500 dark:text-slate-400 left-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          {/* Password Field */}
          <FormField name="password">
            <FormItem>
              <label htmlFor="password" className='text-slate-700 dark:text-slate-300 font-medium text-sm'>Password <span className='text-red-500'>*</span></label>
              <FormControl>
                <div className="relative mt-2">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={isSubmitting}
                    className="w-full pl-10 text-slate-900 dark:text-slate-50 bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 pr-10"
                    {...form.register("password")}
                  />
                  <Lock className="absolute text-slate-500 dark:text-slate-400 left-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none" />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 -translate-y-1/2 transition-colors"
                    disabled={isSubmitting}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </CardContent>

        {/* Submit Button */}
        <CardFooter className="flex flex-col mt-6 w-full">
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </Button>
        </CardFooter>

      </Form>
    </div>

  );
}
