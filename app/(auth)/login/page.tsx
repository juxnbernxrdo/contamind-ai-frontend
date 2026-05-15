import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-black overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 blur-[120px] rounded-full" />
      
      <div className="relative z-10 w-full max-w-md px-4">
        <LoginForm />
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-8 text-white/20 text-xs font-medium tracking-widest uppercase">
        ContaMind AI Security Infrastructure
      </div>
    </main>
  );
}
