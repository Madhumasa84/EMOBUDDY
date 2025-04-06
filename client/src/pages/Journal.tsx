import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Textarea } from "../components/ui/textarea";
import { useToast } from "../hooks/use-toast";
import { Journal } from "@shared/schema";

export default function JournalPage() {
  const [searchParams] = useLocation();
  const promptId = new URLSearchParams(searchParams).get("promptId");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [journals, setJournals] = useState<Journal[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("write");
  const { toast } = useToast();

  // Fetch journal prompt if promptId is provided
  useEffect(() => {
    if (promptId) {
      fetch(`/api/journal/prompt/${promptId}`)
        .then(res => res.json())
        .then(data => {
          if (data.prompt) {
            setTitle(data.prompt.title);
          }
        })
        .catch(error => {
          console.error('Error fetching journal prompt:', error);
        });
    }
  }, [promptId]);

  // Fetch past journals
  useEffect(() => {
    fetch('/api/journal')
      .then(res => res.json())
      .then(data => {
        if (data.journals) {
          setJournals(data.journals);
        }
      })
      .catch(error => {
        console.error('Error fetching journals:', error);
      });
  }, []);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both a title and content for your journal entry.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
        }),
        credentials: 'include',
      });

      if (response.ok) {
        const newJournal = await response.json();
        setJournals(prev => [newJournal.journal, ...prev]);
        setTitle("");
        setContent("");
        setActiveTab("history");
        
        toast({
          title: "Journal saved",
          description: "Your journal entry has been saved successfully.",
        });
      } else {
        throw new Error('Failed to save journal');
      }
    } catch (error) {
      console.error('Error saving journal:', error);
      toast({
        title: "Error saving journal",
        description: "There was a problem saving your journal entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-2xl font-heading font-semibold text-neutral-800 mb-6">Journal</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="write">
          <Card>
            <CardHeader>
              <CardTitle>New Journal Entry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Journal title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  How are you feeling today?
                </label>
                <Textarea
                  placeholder="Start writing your thoughts..."
                  className="min-h-[200px]"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className="ml-auto"
              >
                {isSubmitting ? "Saving..." : "Save Journal"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          {journals.length > 0 ? (
            <div className="space-y-4">
              {journals.map((journal) => (
                <Card key={journal.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{journal.title}</CardTitle>
                      <span className="text-xs text-neutral-500">
                        {new Date(journal.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-neutral-700 whitespace-pre-line">
                      {journal.content.length > 200 
                        ? `${journal.content.substring(0, 200)}...` 
                        : journal.content}
                    </p>
                  </CardContent>
                  <CardFooter>
                    {journal.emotion && (
                      <div className="flex items-center">
                        <span 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ 
                            backgroundColor: journal.emotion === 'happy' 
                              ? '#FCD34D' 
                              : journal.emotion === 'sad' 
                              ? '#93C5FD' 
                              : journal.emotion === 'angry' 
                              ? '#F87171' 
                              : journal.emotion === 'anxious' 
                              ? '#A78BFA' 
                              : journal.emotion === 'calm' 
                              ? '#6EE7B7' 
                              : '#9CA3AF' 
                          }}
                        ></span>
                        <span className="text-xs capitalize text-neutral-500">
                          {journal.emotion}
                        </span>
                      </div>
                    )}
                    <Button variant="outline" size="sm" className="ml-auto">
                      Read More
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-neutral-500 mb-4">You haven't created any journal entries yet.</p>
                <Button onClick={() => setActiveTab("write")}>
                  Create Your First Journal Entry
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
