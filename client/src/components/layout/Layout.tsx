import { ReactNode, useState, useEffect } from "react";
import Header from "./Header";
import MobileMenu from "./MobileMenu";
import LoginModal from "../modals/LoginModal";
import CrisisAlert from "../modals/CrisisAlert";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { isAuthenticated, loading } = useAuth();
  const { showCrisisAlert } = useChat();

  // Show login modal if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setIsLoginModalOpen(true);
    }
  }, [isAuthenticated, loading]);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 font-sans">
      <Header 
        onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
      />
      
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
      
      <main className="flex-1 container mx-auto px-4 pt-16 pb-20">
        {children}
      </main>
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
      
      <CrisisAlert isVisible={showCrisisAlert} />
    </div>
  );
}
