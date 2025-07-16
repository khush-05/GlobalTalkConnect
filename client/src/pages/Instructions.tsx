import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Video, Users, Copy, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function Instructions() {
  const [, setLocation] = useLocation();

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
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

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">How to Test Video Calling</h1>
          <p className="text-xl text-gray-600">Follow these simple steps to test the peer-to-peer video calling</p>
        </div>

        <div className="grid gap-6">
          {/* Step 1 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">1</span>
                Open Two Browser Windows
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                To simulate two users, you need to open two separate browser windows or tabs. You can also use:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Two different browsers (Chrome + Firefox)</li>
                <li>Regular window + Incognito/Private window</li>
                <li>Two different devices on the same network</li>
              </ul>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">2</span>
                User 1: Create a Room
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-gray-600">In the first window:</p>
                <ol className="list-decimal list-inside space-y-2 text-gray-600 ml-4">
                  <li>Click "Setup Call" or "Quick Start"</li>
                  <li>Enter your name (e.g., "User 1")</li>
                  <li>Select a language</li>
                  <li>Click "Create Room"</li>
                  <li>Copy the Room ID from the video call page header</li>
                </ol>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-4 h-4 text-yellow-600 mr-2" />
                    <span className="text-sm text-yellow-800">Allow camera and microphone access when prompted!</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">3</span>
                User 2: Join the Room
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-gray-600">In the second window:</p>
                <ol className="list-decimal list-inside space-y-2 text-gray-600 ml-4">
                  <li>Go to "Setup Call"</li>
                  <li>Enter a different name (e.g., "User 2")</li>
                  <li>Select a language</li>
                  <li>Click "Join Room"</li>
                  <li>Paste the Room ID from User 1</li>
                  <li>Click "Join Room" again</li>
                </ol>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                  <div className="flex items-center">
                    <Video className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-sm text-blue-800">You should now see both video streams!</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 4 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">4</span>
                Test Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-gray-600">Try these features:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Video Controls:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
                      <li>Mute/unmute microphone</li>
                      <li>Turn video on/off</li>
                      <li>Toggle chat panel</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Chat Features:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
                      <li>Send real-time messages</li>
                      <li>See language indicators</li>
                      <li>View timestamps</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Troubleshooting */}
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center text-yellow-800">
                <AlertCircle className="w-5 h-5 mr-2" />
                Troubleshooting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <h4 className="font-medium text-yellow-900">Can't see the other person's video?</h4>
                  <ul className="list-disc list-inside text-yellow-800 mt-1 space-y-1">
                    <li>Check browser console for WebRTC errors</li>
                    <li>Make sure both users granted camera/microphone permissions</li>
                    <li>Try refreshing both pages and reconnecting</li>
                    <li>Use Chrome or Firefox for best WebRTC support</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-yellow-900">Connection issues?</h4>
                  <ul className="list-disc list-inside text-yellow-800 mt-1 space-y-1">
                    <li>Both users should be on the same network for local testing</li>
                    <li>Check if your firewall is blocking WebRTC</li>
                    <li>Try using different browsers or incognito mode</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Button
            size="lg"
            onClick={() => setLocation("/setup")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold"
          >
            <Users className="w-5 h-5 mr-2" />
            Start Testing Now
          </Button>
        </div>
      </div>
    </div>
  );
}