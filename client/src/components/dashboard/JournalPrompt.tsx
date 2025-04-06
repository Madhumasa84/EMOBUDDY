import { useState, useEffect } from "react";
import { useLocation } from "wouter";

interface JournalPrompt {
  id: string;
  title: string;
  description: string;
}

export default function JournalPrompt() {
  const [prompt, setPrompt] = useState<JournalPrompt>({
    id: "work-stress",
    title: "Work Stress Reflection",
    description: "What specific aspects of work are causing you stress, and what small changes might help reduce that pressure?"
  });
  const [, setLocation] = useLocation();

  // Fetch daily journal prompt
  useEffect(() => {
    fetch('/api/journal/prompt')
      .then(res => res.json())
      .then(data => {
        if (data.prompt) {
          setPrompt(data.prompt);
        }
      })
      .catch(error => {
        console.error('Error fetching journal prompt:', error);
      });
  }, []);

  // Navigate to journal page with the prompt
  const startJournal = () => {
    setLocation(`/journal?promptId=${prompt.id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-card p-5">
      <h2 className="font-heading font-semibold text-lg text-neutral-800 mb-2">Today's Journal</h2>
      <p className="text-sm text-neutral-600 mb-4">Writing about your feelings can help process emotions.</p>
      <div className="bg-neutral-50 rounded-lg p-4 mb-4">
        <h3 className="font-medium text-neutral-700 mb-2">Prompt: {prompt.title}</h3>
        <p className="text-sm text-neutral-500">{prompt.description}</p>
      </div>
      <button 
        className="w-full py-2 px-4 bg-secondary-500 hover:bg-secondary-600 text-white rounded-lg flex items-center justify-center shadow-sm"
        onClick={startJournal}
      >
        <i className="ri-edit-line mr-2"></i>
        <span>Start Writing</span>
      </button>
    </div>
  );
}
