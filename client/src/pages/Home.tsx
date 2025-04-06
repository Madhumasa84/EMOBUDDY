import { useState, useEffect } from "react";
import ChatSection from "../components/chat/ChatSection";
import EmotionTracker from "../components/dashboard/EmotionTracker";
import JournalPrompt from "../components/dashboard/JournalPrompt";
import ResourceLinks from "../components/dashboard/ResourceLinks";
import { Link, useLocation } from "wouter";

export default function Home() {
  const [location] = useLocation();
  
  return (
    <>
      <div className="md:hidden py-3">
        <div className="flex items-center space-x-3 overflow-x-auto scroll-hidden py-1 px-1">
          <Link href="/">
            <a className="flex-shrink-0 px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm">
              Chat
            </a>
          </Link>
          <Link href="/journal">
            <a className="flex-shrink-0 px-3 py-1 bg-white text-neutral-600 rounded-full text-sm">
              Journal
            </a>
          </Link>
          <Link href="/reports">
            <a className="flex-shrink-0 px-3 py-1 bg-white text-neutral-600 rounded-full text-sm">
              Reports
            </a>
          </Link>
          <Link href="/resources">
            <a className="flex-shrink-0 px-3 py-1 bg-white text-neutral-600 rounded-full text-sm">
              Resources
            </a>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        {/* Main Section (Chat) */}
        <div className="lg:col-span-2">
          <ChatSection />
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          <EmotionTracker />
          <JournalPrompt />
          <ResourceLinks />
        </div>
      </div>
    </>
  );
}
