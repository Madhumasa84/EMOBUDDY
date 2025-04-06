import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Load user data
  useEffect(() => {
    if (user) {
      setName(user.username || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleProfileUpdate = async () => {
    if (!name.trim()) {
      toast({
        title: "Username required",
        description: "Please provide a username.",
        variant: "destructive",
      });
      return;
    }

    if (!user || !user.id) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to update your profile.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: name,
          email,
          userId: user.id
        }),
        credentials: 'include',
      });

      if (response.ok) {
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        });
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error updating profile",
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get progress data - this would normally come from the server
  const progressStats = [
    { label: "Journal Entries", value: "12" },
    { label: "Days Tracked", value: "28" },
    { label: "Most Common Emotion", value: "Calm" },
    { label: "Mood Improvement", value: "+15%" }
  ];

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-2xl font-heading font-semibold text-neutral-800 mb-6">Your Profile</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="profile">Profile Settings</TabsTrigger>
          <TabsTrigger value="progress">Your Progress</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleProfileUpdate} 
                disabled={isSubmitting}
                className="ml-auto"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Your Journey with EmoBuddy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {progressStats.map((stat, index) => (
                  <div key={index} className="bg-neutral-50 p-4 rounded-lg">
                    <p className="text-sm text-neutral-500">{stat.label}</p>
                    <p className="text-2xl font-semibold text-primary-600">{stat.value}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium text-neutral-800 mb-4">Recommendations</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-secondary-50 border border-secondary-100 rounded-lg">
                    <h4 className="font-medium text-secondary-700">Try daily journaling</h4>
                    <p className="text-sm text-neutral-600">
                      Users who journal daily report 40% more emotional awareness.
                    </p>
                  </div>
                  <div className="p-3 bg-secondary-50 border border-secondary-100 rounded-lg">
                    <h4 className="font-medium text-secondary-700">Track your emotions</h4>
                    <p className="text-sm text-neutral-600">
                      Recording your emotions helps identify patterns and triggers.
                    </p>
                  </div>
                  <div className="p-3 bg-secondary-50 border border-secondary-100 rounded-lg">
                    <h4 className="font-medium text-secondary-700">Try mindfulness</h4>
                    <p className="text-sm text-neutral-600">
                      Just 5 minutes of mindfulness daily can reduce stress by up to 20%.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}