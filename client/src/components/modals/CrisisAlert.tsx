import { useEffect } from "react";
import { useChat } from "../../context/ChatContext";

interface CrisisAlertProps {
  isVisible: boolean;
}

export default function CrisisAlert({ isVisible }: CrisisAlertProps) {
  const { setShowCrisisAlert } = useChat();

  const dismissAlert = () => {
    setShowCrisisAlert(false);
  };

  // Automatically hide after 30 seconds
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setShowCrisisAlert(false);
      }, 30000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, setShowCrisisAlert]);

  return (
    <div className={`fixed inset-x-0 bottom-0 transform ${isVisible ? 'translate-y-0' : 'translate-y-full'} transition-transform duration-300 ease-in-out z-40`}>
      <div className="bg-red-50 border-t-4 border-red-500 p-4 mx-4 mb-4 rounded-lg shadow-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <i className="ri-alert-line text-red-500 text-xl"></i>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Crisis Support Available</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>If you're experiencing thoughts of self-harm, please reach out for immediate support:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>National Suicide Prevention Lifeline: 1-800-273-8255</li>
                <li>Crisis Text Line: Text HOME to 741741</li>
              </ul>
            </div>
            <div className="mt-4 flex gap-2">
              <a 
                href="tel:1-800-273-8255" 
                className="px-3 py-1.5 bg-white border border-red-300 text-red-700 text-sm rounded-md hover:bg-red-50"
              >
                Call Now
              </a>
              <a 
                href="sms:741741?body=HOME" 
                className="px-3 py-1.5 bg-white border border-red-300 text-red-700 text-sm rounded-md hover:bg-red-50"
              >
                Text Crisis Line
              </a>
              <button 
                className="px-3 py-1.5 bg-white border border-red-300 text-red-700 text-sm rounded-md hover:bg-red-50 ml-auto"
                onClick={dismissAlert}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
