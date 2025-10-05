import Icon from '@/components/ui/icon';

interface HeaderProps {
  isLoggedIn: boolean;
  currentUser: string | null;
  onSignIn: () => void;
  onLogout: () => void;
}

export default function Header({ isLoggedIn, currentUser, onSignIn, onLogout }: HeaderProps) {
  return (
    <header className="max-w-6xl mx-auto flex items-center justify-between py-6 px-6">
      <div className="text-base font-semibold tracking-tight flex items-center gap-2">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-white" />
        Lunacy Botnet
      </div>
      <div className="flex items-center gap-3">
        {isLoggedIn && (
          <span className="text-sm text-zinc-400">Hi, {currentUser}</span>
        )}
        <a
          className="button-ghost px-4 py-2 rounded-md flex items-center gap-2"
          href="https://t.me/mirai_network"
        >
          <Icon name="Zap" size={14} />
          Telegram
        </a>
        {isLoggedIn ? (
          <>
            <a
              href="/dashboard"
              className="bg-white text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-white/90 transition-colors flex items-center gap-2"
            >
              <Icon name="LayoutDashboard" size={14} />
              Dashboard
            </a>
            <button
              onClick={onLogout}
              className="button-ghost px-4 py-2 rounded-md flex items-center gap-2 text-sm"
            >
              <Icon name="LogOut" size={14} />
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={onSignIn}
            className="bg-white text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-white/90 transition-colors"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}