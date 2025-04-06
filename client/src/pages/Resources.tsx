import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

interface Resource {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  icon: string;
}

export default function Resources() {
  const [category, setCategory] = useState("all");
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    // Fetch resources
    fetch(`/api/resources?category=${category}`)
      .then(res => res.json())
      .then(data => {
        if (data.resources) {
          setResources(data.resources);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching resources:', error);
        setLoading(false);
      });
  }, [category]);

  // Mock resources for visualization if no data is available
  const mockResources: Resource[] = [
    {
      id: "stress-management",
      title: "Stress Management Techniques",
      description: "Learn practical strategies for daily stress",
      content: "Practicing mindfulness, deep breathing exercises, and regular physical activity can help reduce stress levels. Try the 4-7-8 breathing technique: Inhale for 4 seconds, hold for 7 seconds, and exhale for 8 seconds.",
      category: "stress",
      icon: "ri-mental-health-line"
    },
    {
      id: "sleep-improvement",
      title: "Sleep Improvement Guide",
      description: "Tips for better sleep quality",
      content: "Establish a regular sleep schedule, create a restful environment, limit exposure to screens before bedtime, and avoid caffeine and alcohol close to bedtime. Consider trying relaxation techniques like progressive muscle relaxation before sleep.",
      category: "sleep",
      icon: "ri-sleep-line"
    },
    {
      id: "crisis-hotlines",
      title: "Crisis Support Hotlines",
      description: "24/7 emergency mental health resources",
      content: "National Suicide Prevention Lifeline: 1-800-273-8255\nCrisis Text Line: Text HOME to 741741\nVeterans Crisis Line: 1-800-273-8255 (Press 1)\nLGBTQ+ Youth: The Trevor Project at 1-866-488-7386",
      category: "crisis",
      icon: "ri-heart-pulse-line"
    },
    {
      id: "mindfulness-meditation",
      title: "Mindfulness Meditation Guide",
      description: "Simple meditation techniques for beginners",
      content: "Start with just 5 minutes a day of focused breathing. Find a quiet place, sit comfortably, and focus on your breath. When your mind wanders, gently bring your attention back to your breathing. Gradually increase your meditation time as you become more comfortable with the practice.",
      category: "mental",
      icon: "ri-sun-line"
    },
    {
      id: "anxiety-coping",
      title: "Anxiety Coping Strategies",
      description: "Practical ways to manage anxiety symptoms",
      content: "Practice the 5-4-3-2-1 grounding technique: Acknowledge 5 things you see, 4 things you can touch, 3 things you hear, 2 things you smell, and 1 thing you taste. This helps bring you back to the present moment when anxiety feels overwhelming.",
      category: "anxiety",
      icon: "ri-psychotherapy-line"
    }
  ];

  // Use actual data or fallback to mock data
  const displayResources = resources.length > 0 ? resources : mockResources;
  
  // Filter resources by category
  const filteredResources = category === "all" 
    ? displayResources 
    : displayResources.filter(resource => resource.category === category);

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-2xl font-heading font-semibold text-neutral-800 mb-6">Mental Health Resources</h1>
      
      <div className="mb-6">
        <Tabs value={category} onValueChange={setCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="stress">Stress</TabsTrigger>
            <TabsTrigger value="anxiety">Anxiety</TabsTrigger>
            <TabsTrigger value="sleep">Sleep</TabsTrigger>
            <TabsTrigger value="mental">Mindfulness</TabsTrigger>
            <TabsTrigger value="crisis">Crisis</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="space-y-6">
        {filteredResources.map((resource) => (
          <Card key={resource.id} className="overflow-hidden">
            <CardHeader className="bg-neutral-50 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-primary-600 bg-primary-100"
                >
                  <i className={resource.icon}></i>
                </div>
                <div>
                  <CardTitle>{resource.title}</CardTitle>
                  <CardDescription>{resource.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-line">{resource.content}</p>
              </div>
              
              {resource.category === "crisis" && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Button variant="outline" className="flex items-center justify-center gap-2">
                    <i className="ri-phone-line"></i> Call Helpline
                  </Button>
                  <Button className="flex items-center justify-center gap-2">
                    <i className="ri-message-2-line"></i> Text Crisis Line
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        
        {filteredResources.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-neutral-500 mb-4">No resources found for this category.</p>
            <Button onClick={() => setCategory("all")}>
              View All Resources
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
