import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, Video, Plus, LogIn, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
];

export default function CallSetup() {
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [language, setLanguage] = useState("");
  const [roomId, setRoomId] = useState("");
  const [showRoomInput, setShowRoomInput] = useState(false);
  const { toast } = useToast();

  const createRoomMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/rooms", {
        name: `${name}'s Room`,
      });
      return response.json();
    },
    onSuccess: (room) => {
      setLocation(`/call/${room.id}?name=${encodeURIComponent(name)}&language=${language}`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create room. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateRoom = () => {
    if (!name || !language) {
      toast({
        title: "Missing Information",
        description: "Please enter your name and select a language.",
        variant: "destructive",
      });
      return;
    }
    createRoomMutation.mutate();
  };

  const handleJoinRoom = () => {
    if (!name || !language) {
      toast({
        title: "Missing Information",
        description: "Please enter your name and select a language.",
        variant: "destructive",
      });
      return;
    }
    if (!showRoomInput) {
      setShowRoomInput(true);
      return;
    }
    if (!roomId) {
      toast({
        title: "Missing Room ID",
        description: "Please enter a room ID to join.",
        variant: "destructive",
      });
      return;
    }
    setLocation(`/call/${roomId}?name=${encodeURIComponent(name)}&language=${language}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Globe className="h-8 w-8 text-blue-600 mr-3" />
                <span className="text-xl font-bold text-gray-900">GlobalTalk</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => setLocation("/")}>
                Home
              </Button>
              <Button variant="ghost" onClick={() => setLocation("/setup")}>
                Setup Call
              </Button>
              <Button onClick={() => setLocation("/setup")} className="bg-blue-600 hover:bg-blue-700">
                <Video className="w-4 h-4 mr-2" />
                Quick Start
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Video className="mx-auto h-16 w-16 text-blue-600 mb-4" />
            <h2 className="text-3xl font-bold text-gray-900">Setup Your Call</h2>
            <p className="mt-2 text-sm text-gray-600">Enter your details to start or join a video call</p>
          </div>
          
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Call Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="language">Your Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex space-x-4">
                <Button
                  onClick={handleCreateRoom}
                  disabled={createRoomMutation.isPending}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {createRoomMutation.isPending ? "Creating..." : "Create Room"}
                </Button>
                <Button
                  onClick={handleJoinRoom}
                  variant="outline"
                  className="flex-1 border-teal-600 text-teal-600 hover:bg-teal-50"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Join Room
                </Button>
              </div>
              
              {showRoomInput && (
                <div>
                  <Label htmlFor="roomId">Room ID</Label>
                  <Input
                    id="roomId"
                    type="text"
                    placeholder="Enter room ID"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="mt-1"
                  />
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Device Check */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Device Check</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-3" />
                  <span className="text-sm text-gray-600">Camera access granted</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-3" />
                  <span className="text-sm text-gray-600">Microphone access granted</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-3" />
                  <span className="text-sm text-gray-600">Internet connection stable</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
