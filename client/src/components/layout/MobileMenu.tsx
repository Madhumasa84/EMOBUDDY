import { Link } from "wouter";
import { useAuth } from "../../hooks/use-auth";
import { X } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { user, logoutMutation } = useAuth();
  
  const handleLogout = () => {
    logoutMutation.mutate();
    onClose();
  };
  
  return (
    <div 
      className={`fixed inset-0 bg-white z-40 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <span className="text-primary-500 text-2xl mr-2">😊</span>
            <h1 className="font-heading font-semibold text-xl text-neutral-800">EmoBuddy</h1>
          </div>
          <button 
            className="text-neutral-700"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="space-y-4">
          <Link href="/">
            <a className="block py-2 text-neutral-600 hover:text-primary-500 border-b border-neutral-100" onClick={onClose}>
              Home
            </a>
          </Link>
          <Link href="/journal">
            <a className="block py-2 text-neutral-600 hover:text-primary-500 border-b border-neutral-100" onClick={onClose}>
              Journal
            </a>
          </Link>
          <Link href="/reports">
            <a className="block py-2 text-neutral-600 hover:text-primary-500 border-b border-neutral-100" onClick={onClose}>
              Reports
            </a>
          </Link>
          <Link href="/resources">
            <a className="block py-2 text-neutral-600 hover:text-primary-500 border-b border-neutral-100" onClick={onClose}>
              Resources
            </a>
          </Link>
          
          {user ? (
            <button 
              className="block w-full text-left py-2 text-neutral-600 hover:text-primary-500"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? "Signing out..." : "Sign Out"}
            </button>
          ) : (
            <Link href="/auth">
              <a className="block py-2 text-neutral-600 hover:text-primary-500" onClick={onClose}>
                Sign In
              </a>
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}
