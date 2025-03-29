'use client'



import React, { useState, useEffect, Suspense } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, Video, Mic, MicOff, VideoOff, X, MessageCircle, Users,  Send, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Vapi from '@vapi-ai/web';

const CallPageContent = () => {
  const searchParams = useSearchParams();
  const doctor = JSON.parse(decodeURIComponent(searchParams.get('doctor')));
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [vapi, setVapi] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [deviceError, setDeviceError] = useState(null);
  const [hasDevicePermissions, setHasDevicePermissions] = useState(false);
  const [userVideoStream, setUserVideoStream] = useState(null); // State to store the user's video stream

 
  

  useEffect(() => {
    checkDevicePermissions();
    initializeVapi();
  }, []);

  const initializeVideoStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true,
        audio: true 
      });
      setUserVideoStream(stream);
      setDeviceError(null);
      setHasDevicePermissions(true);
      return stream;
    } catch (error) {
      console.error('Video permission error:', error);
      setDeviceError(getErrorMessage(error));
      setHasDevicePermissions(false);
      return null;
    }
  };

  // Modify the checkDevicePermissions function
  const checkDevicePermissions = async () => {
    try {
      const stream = await initializeVideoStream();
      if (stream) {
        setHasDevicePermissions(true);
        setDeviceError(null);
      }
    } catch (error) {
      console.error('Permission error:', error);
      setDeviceError(getErrorMessage(error));
      setHasDevicePermissions(false);
    }
  };

  const getErrorMessage = (error) => {
    switch (error.name) {
      case 'NotFoundError':
        return 'No microphone found. Please connect a microphone and try again.';
      case 'NotAllowedError':
        return 'Microphone access denied. Please allow microphone access in your browser settings.';
      case 'NotReadableError':
        return 'Unable to access your microphone. Please make sure it\'s not being used by another application.';
      default:
        return 'An error occurred while accessing your microphone. Please check your device settings.';
    }
  };

    // Add toggle video function
    const toggleVideo = async () => {
      if (userVideoStream) {
        const videoTracks = userVideoStream.getVideoTracks();
        videoTracks.forEach(track => {
          track.enabled = !isVideoOff;
        });
        setIsVideoOff(!isVideoOff);
      } else {
        // If stream doesn't exist, try to initialize it
        await initializeVideoStream();
      }
    };

  const initializeVapi = () => {
    try {
      const vapiInstance = new Vapi("67b304bb-8cc0-4f4a-91fd-ebd0538e00d8"); // add vapi public key
      setVapi(vapiInstance);

      // Add error event listener
      vapiInstance.on('error', (error) => {
        console.error('Vapi error:', error);
        setDeviceError('An error occurred with the call service. Please try again.');
        setIsCallActive(false);
      });

      return () => {
        if (vapiInstance) {
          vapiInstance.stop();
        }
      };
    } catch (error) {
      console.error('Vapi initialization error:', error);
      setDeviceError('Failed to initialize call service. Please refresh the page.');
    }
  };

  const startCall = async () => {
    if (!hasDevicePermissions) {
      await checkDevicePermissions();
      if (!hasDevicePermissions) return;
    }

    try {
      if (vapi) {
        const call = await vapi.start(doctor.assistantId);
        setIsCallActive(true);
        setDeviceError(null);
        console.log('Call started:', call);
      }
    } catch (error) {
      console.error('Start call error:', error);
      setDeviceError('Failed to start the call. Please try again.');
      setIsCallActive(false);
    }
  };

  const endCall = () => {
    try {
      if (vapi) {
        vapi.stop();
        setIsCallActive(false);
        console.log('Call ended');
      }
    } catch (error) {
      console.error('End call error:', error);
      setDeviceError('Error ending call. Please refresh the page.');
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      setChatMessages([...chatMessages, { text: message, sender: 'user', time: new Date() }]);
      if (vapi) {
        try {
          vapi.send({
            type: "add-message",
            message: {
              role: "user",
              content: message,
            },
          });
        } catch (error) {
          console.error('Send message error:', error);
          setChatMessages(prev => [...prev, { 
            text: "Failed to send message. Please try again.", 
            sender: 'system', 
            time: new Date() 
          }]);
        }
      }
      setMessage('');
    }
  };

  const toggleMute = () => {
    try {
      if (vapi) {
        vapi.setMuted(!isMuted);
        setIsMuted(!isMuted);
      }
    } catch (error) {
      console.error('Toggle mute error:', error);
      setDeviceError('Failed to toggle mute. Please check your microphone.');
    }
  };

  // Clean up the video stream when the component unmounts
  useEffect(() => {
    return () => {
      if (userVideoStream) {
        userVideoStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [userVideoStream]);

  return (
    <div className="bg-gradient-to-b from-gray-900 via-teal-900 to-gray-900 text-gray-100 min-h-screen">
      {/* Navigation */}
      <nav className="px-6 py-4 flex justify-between items-center border-b border-teal-800">
        <Link href="/doctors">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg hover:shadow-teal-500/50 transition-shadow duration-300">
              D
            </div>
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-200">
              Doctorify
            </span>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="text-teal-400 hover:text-teal-300 hover:bg-teal-900/50"
          >
           1 <Users className="w-5 h-5 mr-2" />
            Participants
          </Button>
        </div>
      </nav>

      {/* Error Alert */}
      {deviceError && (
        <Alert variant="destructive" className="mx-auto mt-4 max-w-2xl bg-red-900/50 border-red-700">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{deviceError}</AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-6">
        {/* Video Area */}

        <div className="flex-grow">
      <div className="relative aspect-video bg-gray-800 rounded-xl overflow-hidden shadow-xl flex items-center justify-center">
        {/* Doctor Avatar at the Center */}
        <div className="w-32 h-32 bg-teal-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
          {doctor.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
        </div>

        {/* Small Video Preview (Your Video) */}
        <div className="absolute bottom-4 right-4 w-48 aspect-video bg-gray-900 rounded-lg overflow-hidden border-2 border-teal-600">
          {userVideoStream && !isVideoOff ? (
            <video
              ref={(video) => {
                if (video && userVideoStream) {
                  video.srcObject = userVideoStream;
                }
              }}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-700">
              <VideoOff className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        {isCallActive && (
          <>
            {/* Call Duration */}
            <div className="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded-full text-sm">
              32:15
            </div>

            {/* Call Quality */}
            <div className="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded-full text-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              HD
            </div>
          </>
        )}
      </div>

      {/* Controls */}
      <div className="mt-6 flex justify-center items-center gap-4">
        {!isCallActive ? (
          <Button 
            className="bg-green-600 hover:bg-green-700 rounded-full p-4"
            onClick={startCall}
            disabled={!!deviceError}
          >
            <Phone className="w-6 h-6" />
          </Button>
        ) : (
          <>
            <Button
              onClick={toggleMute}
              className={`rounded-full p-4 ${isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-teal-600 hover:bg-teal-700'}`}
              disabled={!!deviceError}
            >
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </Button>
            <Button 
              className="bg-red-600 hover:bg-red-700 rounded-full p-4"
              onClick={endCall}
            >
              <Phone className="w-6 h-6" />
            </Button>
          </>
        )}
        <Button 
          className={`bg-teal-600 hover:bg-teal-700 rounded-full p-4 ${isChatOpen ? 'bg-teal-700' : ''}`}
          onClick={() => setIsChatOpen(!isChatOpen)}
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
        
      </div>
    </div>

        {/* Side Panel */}
        <Card className="w-full lg:w-80 bg-gray-800/50 border-gray-700 p-4">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-teal-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
              {doctor.name.charAt(0)}
            </div>
            <h3 className="text-xl font-semibold text-white mb-1">{doctor.name}</h3>
            <p className="text-teal-400 text-sm">{doctor.specialty}</p>
            
            {/* Call Details */}
            <div className="mt-6 w-full space-y-4">
              <div className="bg-gray-700/50 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Call Details</h4>
                <p className="text-sm text-gray-400">Started at: 10:30 AM</p>
                <p className="text-sm text-gray-400">Call ID: #12345</p>
              </div>
              
              <div className="bg-gray-700/50 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Network Quality</h4>
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-grow bg-gray-600 rounded-full overflow-hidden">
                    <div className="h-full w-4/5 bg-gradient-to-r from-teal-500 to-teal-400"></div>
                  </div>
                  <span className="text-sm text-teal-400">Good</span>
                </div>
              </div>
            </div>

            {/* Chat Messages Section */}
            {isChatOpen && (
              <div className="mt-6 w-full">
                <div className="bg-gray-700/50 p-3 rounded-lg max-h-60 overflow-y-auto mb-4">
                  {chatMessages.map((msg, index) => (
                    <div 
                      key={index}
                      className={`mb-2 p-2 rounded-lg ${
                        msg.sender === 'user' 
                          ? 'bg-teal-600 ml-auto' 
                          : msg.sender === 'system'
                          ? 'bg-red-600 mx-auto'
                          : 'bg-gray-600 mr-auto'
                      } max-w-[80%]`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <span className="text-xs text-gray-300">
                        {msg.time.toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  <Button 
                    onClick={sendMessage}
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

const CallPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CallPageContent />
    </Suspense>
  );
};

export default CallPage;