import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "../../hooks/use-auth";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";
import { UserCircle, Menu } from "lucide-react";

interface HeaderProps {
  onMobileMenuToggle: () => void;
}

export default function Header({ onMobileMenuToggle }: HeaderProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-30">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center">
            <span className="text-primary-500 text-2xl mr-2">😊</span>
            <h1 className="font-heading font-semibold text-xl text-neutral-800">EmoBuddy</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/">
              <a className={`text-sm font-medium ${location === '/' ? 'text-primary-500' : 'text-neutral-600 hover:text-primary-500'}`}>
                Home
              </a>
            </Link>
            <Link href="/journal">
              <a className={`text-sm font-medium ${location === '/journal' ? 'text-primary-500' : 'text-neutral-600 hover:text-primary-500'}`}>
                Journal
              </a>
            </Link>
            <Link href="/reports">
              <a className={`text-sm font-medium ${location === '/reports' ? 'text-primary-500' : 'text-neutral-600 hover:text-primary-500'}`}>
                Reports
              </a>
            </Link>
            <Link href="/resources">
              <a className={`text-sm font-medium ${location === '/resources' ? 'text-primary-500' : 'text-neutral-600 hover:text-primary-500'}`}>
                Resources
              </a>
            </Link>
          </div>
          
          {user ? (
            <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2 focus:outline-none">
                  <span className="hidden sm:inline text-sm font-medium text-neutral-700">
                    {user.username}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                    <UserCircle className="h-5 w-5" />
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuItem>
                  <Link href="/profile">
                    <a className="w-full">Your Profile</a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/settings">
                    <a className="w-full">Settings</a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} disabled={logoutMutation.isPending}>
                  {logoutMutation.isPending ? "Signing out..." : "Sign out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth">
              <a className="text-sm font-medium text-primary-600 hover:text-primary-700">
                Sign in
              </a>
            </Link>
          )}
          
          <button 
            className="md:hidden text-neutral-700"
            onClick={onMobileMenuToggle}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
