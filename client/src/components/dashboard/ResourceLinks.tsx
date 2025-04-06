import { useState, useEffect } from "react";

interface Resource {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  url: string;
}

export default function ResourceLinks() {
  const [resources, setResources] = useState<Resource[]>([
    {
      id: "stress",
      title: "Stress Management Techniques",
      description: "Learn practical strategies for daily stress",
      icon: "ri-mental-health-line",
      color: "#14B8A6",
      url: "/resources/stress-management"
    },
    {
      id: "sleep",
      title: "Sleep Improvement Guide",
      description: "Tips for better sleep quality",
      icon: "ri-sleep-line",
      color: "#3B82F6",
      url: "/resources/sleep-improvement"
    },
    {
      id: "crisis",
      title: "Crisis Support Hotlines",
      description: "24/7 emergency mental health resources",
      icon: "ri-heart-pulse-line",
      color: "#8B5CF6",
      url: "/resources/crisis-support"
    }
  ]);

  // Fetch resources
  useEffect(() => {
    fetch('/api/resources')
      .then(res => res.json())
      .then(data => {
        if (data.resources && data.resources.length > 0) {
          setResources(data.resources);
        }
      })
      .catch(error => {
        console.error('Error fetching resources:', error);
      });
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-card p-5">
      <h2 className="font-heading font-semibold text-lg text-neutral-800 mb-4">Helpful Resources</h2>
      <ul className="space-y-3">
        {resources.map(resource => (
          <li key={resource.id}>
            <a 
              href={resource.url} 
              className="flex items-center p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100"
            >
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                style={{
                  backgroundColor: `${resource.color}20`,
                  color: resource.color
                }}
              >
                <i className={resource.icon}></i>
              </div>
              <div>
                <h3 className="text-sm font-medium text-neutral-800">{resource.title}</h3>
                <p className="text-xs text-neutral-500">{resource.description}</p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
