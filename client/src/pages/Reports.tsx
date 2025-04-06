import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useAuth } from "../context/AuthContext";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

// Emotion colors
const EMOTION_COLORS = {
  happy: "#FCD34D",
  sad: "#93C5FD",
  angry: "#F87171",
  anxious: "#A78BFA",
  neutral: "#9CA3AF",
  calm: "#6EE7B7"
};

interface EmotionData {
  date: string;
  emotion: string;
  intensity: number;
}

interface EmotionSummary {
  emotion: string;
  count: number;
}

export default function Reports() {
  const [timeRange, setTimeRange] = useState("week");
  const [emotionData, setEmotionData] = useState<EmotionData[]>([]);
  const [emotionSummary, setEmotionSummary] = useState<EmotionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    
    if (user && user.id) {
      // Fetch emotion data for the selected time range
      fetch(`/api/emotions/report?range=${timeRange}&userId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.emotions) {
            setEmotionData(data.emotions);
            
            // Calculate emotion summary
            const summary: Record<string, number> = {};
            data.emotions.forEach((item: EmotionData) => {
              summary[item.emotion] = (summary[item.emotion] || 0) + 1;
            });
            
            const summaryData = Object.entries(summary).map(([emotion, count]) => ({
              emotion,
              count
            }));
            
            setEmotionSummary(summaryData);
          }
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching emotion data:', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [timeRange, user]);

  // Mock data for visualization if no data is available
  const mockEmotionData: EmotionData[] = [
    { date: "Mon", emotion: "anxious", intensity: 4 },
    { date: "Tue", emotion: "sad", intensity: 5 },
    { date: "Wed", emotion: "neutral", intensity: 3 },
    { date: "Thu", emotion: "neutral", intensity: 2 },
    { date: "Fri", emotion: "sad", intensity: 4 },
    { date: "Sat", emotion: "calm", intensity: 2 },
    { date: "Sun", emotion: "happy", intensity: 3 }
  ];

  const mockEmotionSummary: EmotionSummary[] = [
    { emotion: "anxious", count: 1 },
    { emotion: "sad", count: 2 },
    { emotion: "neutral", count: 2 },
    { emotion: "calm", count: 1 },
    { emotion: "happy", count: 1 }
  ];

  // Use actual data or fallback to mock data
  const displayData = emotionData.length > 0 ? emotionData : mockEmotionData;
  const displaySummary = emotionSummary.length > 0 ? emotionSummary : mockEmotionSummary;

  // Helper function to get color for emotion
  const getEmotionColor = (emotion: string) => {
    return EMOTION_COLORS[emotion as keyof typeof EMOTION_COLORS] || "#9CA3AF";
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-2xl font-heading font-semibold text-neutral-800 mb-6">Emotional Well-Being Reports</h1>
      
      <div className="mb-6">
        <Tabs value={timeRange} onValueChange={setTimeRange} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
            <TabsTrigger value="year">This Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Emotion Intensity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Emotion Intensity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={displayData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip 
                    formatter={(value, name) => [`Intensity: ${value}`, name]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="intensity"
                    stroke="#3B82F6"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Emotion Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Emotion Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={displaySummary}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="emotion"
                    label={({ emotion }) => emotion}
                  >
                    {displaySummary.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={getEmotionColor(entry.emotion)} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`Count: ${value}`, 'Occurrences']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Emotion Frequency Chart */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Emotion Frequency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={displaySummary}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="emotion" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="count" 
                    name="Frequency" 
                    radius={[4, 4, 0, 0]}
                  >
                    {displaySummary.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={getEmotionColor(entry.emotion)} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
