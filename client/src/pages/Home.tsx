import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Globe, Video, Play, Languages, Shield, Mic, Volume2, Users } from "lucide-react";
import { useLocation } from "wouter";
import AnimatedGlobe from "@/components/AnimatedGlobe";

export default function Home() {
  const [, setLocation] = useLocation();

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

      {/* Hero Section */}
      <section className="gradient-bg relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Connect with the{" "}
                <span className="text-yellow-300">world</span>{" "}
                in any language
              </h1>
              <p className="text-xl text-gray-200 mb-8 max-w-2xl">
                Break down language barriers with AI-powered real-time translation during your video calls. 
                Experience seamless global communication like never before.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  onClick={() => setLocation("/setup")}
                  className="bg-yellow-500 text-white px-8 py-4 text-lg font-semibold hover:bg-yellow-600 transform hover:scale-105 transition-all"
                >
                  <Video className="w-5 h-5 mr-2" />
                  Start Video Call
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setLocation("/instructions")}
                  className="bg-white/20 text-white px-8 py-4 text-lg font-semibold hover:bg-white/30 backdrop-blur-sm border-white/30"
                >
                  <Users className="w-5 h-5 mr-2" />
                  How to Test
                </Button>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <AnimatedGlobe />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose GlobalTalk?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of international communication with our cutting-edge features
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6 bg-gray-50 hover:bg-gray-100 transition-colors border-none">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Languages className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Translation</h3>
              <p className="text-gray-600">Communicate seamlessly across 100+ languages with AI-powered translation</p>
            </Card>
            <Card className="text-center p-6 bg-gray-50 hover:bg-gray-100 transition-colors border-none">
              <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">HD Video Calls</h3>
              <p className="text-gray-600">Crystal clear video and audio quality with WebRTC technology</p>
            </Card>
            <Card className="text-center p-6 bg-gray-50 hover:bg-gray-100 transition-colors border-none">
              <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-gray-600">End-to-end encryption ensures your conversations stay private</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Video Calling Example Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">See GlobalTalk in Action</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience how our platform breaks down language barriers in real-time video conversations
            </p>
          </div>
          
          {/* Mock Video Call Interface */}
          <div className="max-w-4xl mx-auto bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="bg-gray-800 p-4 flex items-center justify-between">
              <div className="flex items-center">
                <Globe className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-white font-medium">GlobalTalk Demo</span>
              </div>
              <div className="flex items-center text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm">Live Demo</span>
              </div>
            </div>
            
            {/* Video Grid */}
            <div className="grid grid-cols-2 gap-4 p-6">
              {/* Local Video */}
              <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg aspect-video overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-xl font-semibold">JM</span>
                    </div>
                    <p className="font-medium">John (English)</p>
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 bg-black/50 text-white px-2 py-1 rounded text-xs">
                  <Languages className="w-3 h-3 inline mr-1" />
                  EN
                </div>
                <div className="absolute bottom-3 right-3 text-white">
                  <Mic className="w-4 h-4" />
                </div>
              </div>
              
              {/* Remote Video */}
              <div className="relative bg-gradient-to-br from-green-500 to-teal-600 rounded-lg aspect-video overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-xl font-semibold">MS</span>
                    </div>
                    <p className="font-medium">Maria (Spanish)</p>
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 bg-black/50 text-white px-2 py-1 rounded text-xs">
                  <Languages className="w-3 h-3 inline mr-1" />
                  ES
                </div>
                <div className="absolute bottom-3 right-3 text-white">
                  <Volume2 className="w-4 h-4" />
                </div>
                {/* Translation Overlay */}
                <div className="absolute bottom-12 left-3 right-3 bg-black/80 text-white p-2 rounded text-xs">
                  <div className="text-gray-300 mb-1">Translation:</div>
                  <div>"Hello! Nice to meet you!"</div>
                </div>
              </div>
            </div>
            
            {/* Chat Example */}
            <div className="border-t border-gray-700 p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-white font-medium">Real-time Chat</h4>
                <span className="text-gray-400 text-sm">Translation enabled</span>
              </div>
              <div className="space-y-2 max-h-24 overflow-hidden">
                <div className="bg-blue-600 text-white p-2 rounded-lg max-w-xs">
                  <p className="text-sm">How are you today?</p>
                </div>
                <div className="bg-gray-700 text-white p-2 rounded-lg max-w-xs ml-auto">
                  <p className="text-sm">¡Muy bien, gracias!</p>
                  <div className="text-xs text-gray-300 mt-1 pt-1 border-t border-gray-600">
                    <Languages className="w-3 h-3 inline mr-1" />
                    Very well, thank you!
                  </div>
                </div>
              </div>
            </div>
            
            {/* Controls */}
            <div className="bg-gray-800 p-4 flex justify-center space-x-4">
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                <Video className="w-5 h-5 text-white" />
              </div>
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                <Video className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Button
              size="lg"
              onClick={() => setLocation("/setup")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold"
            >
              Try It Yourself
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Break Languages Barriers?</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands of users connecting across the globe</p>
          <Button
            size="lg"
            onClick={() => setLocation("/setup")}
            className="bg-yellow-500 text-white px-8 py-4 text-lg font-semibold hover:bg-yellow-600 transform hover:scale-105 transition-all"
          >
            <Video className="w-5 h-5 mr-2" />
            Start Your First Call
          </Button>
        </div>
      </section>
    </div>
  );
}
