import { useState, useEffect } from "react";
import { EmotionTrack } from "@shared/schema";
import { useAuth } from "@/context/AuthContext";

// Emotion data
const emotions = [
  { id: "anxious", label: "Anxious", icon: "ri-mental-health-line", color: "#A78BFA" },
  { id: "stressed", label: "Stressed", icon: "ri-emotion-sad-line", color: "#93C5FD" },
  { id: "neutral", label: "Neutral", icon: "ri-emotion-normal-line", color: "#9CA3AF" },
  { id: "happy", label: "Happy", icon: "ri-emotion-happy-line", color: "#FCD34D" },
];

// Days of the week
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function EmotionTracker() {
  const [selectedEmotion, setSelectedEmotion] = useState<string>("stressed");
  const [weekData, setWeekData] = useState<EmotionTrack[]>([]);
  const { user } = useAuth();
  
  // Fetch weekly emotion data
  useEffect(() => {
    if (user && user.id) {
      fetch(`/api/emotions/weekly?userId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.emotions) {
            setWeekData(data.emotions);
          }
        })
        .catch(error => {
          console.error('Error fetching weekly emotions:', error);
        });
    }
  }, [user]);

  // Mock data for visualization if no data is available
  const mockWeekData = [
    { emotion: "anxious", intensity: 4, day: "Mon" },
    { emotion: "sad", intensity: 5, day: "Tue" },
    { emotion: "neutral", intensity: 3, day: "Wed" },
    { emotion: "neutral", intensity: 2, day: "Thu" },
    { emotion: "sad", intensity: 4, day: "Fri" },
    { emotion: "calm", intensity: 2, day: "Sat" },
    { emotion: "neutral", intensity: 1, day: "Sun" },
  ];

  // Get emotion data or fallback to mock
  const displayData = weekData.length > 0 ? weekData : mockWeekData;

  // Track user's emotion
  const trackEmotion = (emotionId: string) => {
    setSelectedEmotion(emotionId);
    
    // Record emotion in the database if user is logged in
    if (user && user.id) {
      fetch('/api/emotions/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emotion: emotionId,
          intensity: 5, // Default to high intensity
          userId: user.id
        }),
        credentials: 'include',
      })
      .then(response => {
        if (response.ok) {
          // Refresh the weekly emotions data after tracking
          fetch(`/api/emotions/weekly?userId=${user.id}`)
            .then(res => res.json())
            .then(data => {
              if (data.emotions) {
                setWeekData(data.emotions);
              }
            });
        }
      })
      .catch(error => {
        console.error('Error tracking emotion:', error);
      });
    }
  };

  // Get emotion color
  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case "anxious": return "#A78BFA";
      case "sad": return "#93C5FD";
      case "neutral": return "#9CA3AF";
      case "happy": return "#FCD34D";
      case "calm": return "#6EE7B7";
      default: return "#E5E7EB";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-card p-5">
      <h2 className="font-heading font-semibold text-lg text-neutral-800 mb-4">Your Emotional Journey</h2>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-neutral-600 mb-2">Today's mood</p>
          <div className="flex items-center space-x-2">
            {emotions.map((emotion) => (
              <button
                key={emotion.id}
                className={`emotion-card p-2 rounded-lg ${
                  selectedEmotion === emotion.id
                    ? "bg-primary-50 hover:bg-primary-100 border-2 border-primary-300"
                    : "bg-neutral-100 hover:bg-neutral-200"
                } flex flex-col items-center`}
                onClick={() => trackEmotion(emotion.id)}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white mb-1"
                  style={{ backgroundColor: emotion.color }}
                >
                  <i className={emotion.icon}></i>
                </div>
                <span className="text-xs">{emotion.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm text-neutral-600 mb-2">This week's pattern</p>
          <div className="h-32 bg-neutral-50 rounded-lg flex items-end justify-between px-3 py-2">
            {displayData.map((day, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`w-2 rounded-full`}
                  style={{
                    height: `${day.intensity * 8}px`,
                    backgroundColor: getEmotionColor(day.emotion)
                  }}
                ></div>
                <span className="text-xs mt-1">{weekDays[index]}</span>
              </div>
            ))}
          </div>
        </div>
        <a href="/reports" className="block text-center py-2 text-sm text-primary-600 hover:text-primary-700">
          View detailed report →
        </a>
      </div>
    </div>
  );
}
