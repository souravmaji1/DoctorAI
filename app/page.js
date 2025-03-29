'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, Lock, X } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Send, PlusCircle, AlertCircle, User, Bot, Paperclip, Image, Mic, Loader2 , Phone} from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from 'next/link';
import { useUser, SignInButton, UserButton } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'sonner';

const supabase = createClient(
  'https://fmkjdrdiifebucfpkbsz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZta2pkcmRpaWZlYnVjZnBrYnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMTczMzcsImV4cCI6MjA1Nzc5MzMzN30.DpHqHHbpHnW981laR2u37syuQ8L_QEf6116vqsSMwGI'
);

const LandingPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const router = useRouter();
  const [chatMessages, setChatMessages] = useState([
    { 
      role: 'assistant', 
      content: "Hello! I'm Dr. AI, your personal health assistant. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const { isSignedIn, user } = useUser();
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handlePaypalSuccess = (details) => {
    setHasPaid(true);
    console.log('Payment completed:', details);
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result.split(',')[1];
        setSelectedImage(base64Image); // Store the image instead of analyzing immediately
        // Optional: Add a message to indicate image selection
        setChatInput(''); // Clear any existing input
      };
      reader.readAsDataURL(file);
    }
  };
  
  

  // Modify sendMessage to handle both text and image messages
  const sendMessage = async () => {
    if ((!chatInput.trim() && !selectedImage) || isLoading) return;
  
    setIsLoading(true);
    const userMessage = chatInput.trim();

    // Add user message to chat
    setChatMessages(prev => [...prev, { 
      role: 'user', 
      content: userMessage,
      timestamp: new Date()
    }]);
    setChatInput('');

    try {
      let response;
      
      if (selectedImage) {
        // If there's a selected image, make the vision API call
        response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer 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`
          },
          body: JSON.stringify({
            model: "llama-3.2-11b-vision-preview",
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: userMessage || "Please analyze this health-related image."
                  },
                  {
                    type: "image_url",
                    image_url: {
                      url: `data:image/jpeg;base64,${selectedImage}`
                    }
                  }
                ]
              }
            ],
            temperature: 0.7,
            max_tokens: 1024
          })
        });
        
        const data = await response.json();
        response = { response: data.choices[0].message.content };
        setSelectedImage(null); // Clear the selected image after sending
      } else {
        // Regular text message API call
        const apiMessages = chatMessages.map(({ role, content }) => ({
          role,
          content
        }));
        apiMessages.push({ role: 'user', content: userMessage });

        response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: apiMessages,
          }),
        });
        response = await response.json();
      }

      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.response,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to send message', {
        description: 'Please try again later.',
      });
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }]);
    }
    setIsLoading(false);
  };



  const userImages = [
    'https://static.vecteezy.com/system/resources/previews/049/093/990/non_2x/professional-indian-real-estate-agent-with-house-model-isolated-on-transparent-background-png.png',
    'https://www.century21.com/c21/remote-media/affiliate-4x5-316w/eee/e6d/ff/aHR0cHM6Ly9pLmMyMS5jb20vMTIyOGkwL3RwY20xejE3anNucTR5NjJtYzBrMXNlZmg3aQ.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRa5ojAyTAJRdAJCdcjaNTMUJwQxXiMtA9tS32Vlo_raqPJS5aEQ877WvjNlinMzFJeM4&usqp=CAU',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpDHzsl69KqhALD1V-t4MP6lFk6oRZSmyeoIw1Ep5iD1pmMGXEwg4mXv-cKMWB_TxE6U0&usqp=CAU',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmZCJGYp52Jc2Zhrbq46nqQbyBYqKdJ3Q2GJif_3py2O8uhLvO0ULc4YcPyE5eYAlPAg0&usqp=CAU',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTb-DJlfftRTkNaqJayf-yLRlrgqAw3hnyhT3PXm4UGC1vriv3OxtvSx-ae-EQq4b-KRsQ&usqp=CAU',
  ];

   // Check subscription status
   const checkSubscriptionStatus = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('usersubscriptions')
        .select('status')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data?.status === 'active';
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return false;
    }
  };

  // Handle start chat
  const handleStartChat = async () => {
    if (!isSignedIn) {
      toast.error('Please sign in to continue', {
        description: 'You need to be logged in to access the chat feature.',
        duration: 3000,
      });
      return;
    }

    const hasActiveSubscription = await checkSubscriptionStatus(user.id);
    
    if (hasActiveSubscription) {
      setHasStarted(true);
      toast.success('Chat session started', {
        description: 'Welcome to your private consultation.',
      });
    } else {

      toast.warning('Subscription required', {
        description: 'Please subscribe to access premium features.',
        action: {
          label: 'View Plans',
          onClick: () => router.push('/pricing'),
        },
      });
      // Redirect to pricing page if no active subscription
      router.push('/pricing');
    }
  };

  const handleUserConnection = async (user) => {
    if (!user) return null;
  
    try {
      // Check if user already exists in Supabase
      const { data: existingUser, error: fetchError } = await supabase
        .from('usersubscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();
  
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error checking for existing user:', fetchError);
        return null;
      }
  
      // If user doesn't exist, insert new user
      if (!existingUser) {
        const { data: newUser, error: insertError } = await supabase
          .from('usersubscriptions')
          .insert([
            {
              user_id: user.id,
              email: user.emailAddresses[0]?.emailAddress,
              status: 'notpaid',
            }
          ])
          .select()
          .single();
  
        if (insertError) {
          console.error('Error inserting new user:', insertError);
          return null;
        }
  
        return newUser;
      }
  
      return existingUser;
    } catch (error) {
      console.error('Error in handleUserConnection:', error);
      return null;
    }
  };

  useEffect(() => {
    if (isSignedIn && user) {
      handleUserConnection(user);
    }
  }, [isSignedIn, user]);


   // Reference for speech recognition
   const recognitionRef = useRef(null);

   // Initialize speech recognition
   useEffect(() => {
     if (typeof window !== 'undefined') {
       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
       if (SpeechRecognition) {
         recognitionRef.current = new SpeechRecognition();
         recognitionRef.current.continuous = true;
         recognitionRef.current.interimResults = true;
         recognitionRef.current.lang = 'en-US';
 
         recognitionRef.current.onresult = (event) => {
           const transcript = Array.from(event.results)
             .map(result => result[0])
             .map(result => result.transcript)
             .join('');
           
           setChatInput(transcript);
         };
 
         recognitionRef.current.onerror = (event) => {
           setSpeechError(event.error);
           setIsListening(false);
         };
 
         recognitionRef.current.onend = () => {
           setIsListening(false);
         };
       }
     }
   }, []);
 
   // Function to toggle speech recognition
   const toggleListening = () => {
     if (!recognitionRef.current) {
       setSpeechError('Speech recognition not supported in this browser');
       return;
     }
 
     if (isListening) {
       recognitionRef.current.stop();
     } else {
       setSpeechError(null);
       recognitionRef.current.start();
     }
     setIsListening(!isListening);
   };
 
   // Modify the chat input area to include the microphone button
    // Modify renderChatInput to show when an image is selected
  const renderChatInput = () => (
    <div className="flex gap-3">
      <div className="flex gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="image-upload"
        />
        <label 
          htmlFor="image-upload" 
          className={`cursor-pointer inline-flex items-center justify-center w-12 h-12 rounded-xl ${
            selectedImage ? 'bg-teal-700 text-white' : 'bg-gray-800/50 border border-gray-700 hover:bg-gray-700 text-teal-300'
          } transition-colors duration-200`}
        >
          <Image className="w-5 h-5" />
        </label>

        <Button
          variant="outline"
          onClick={toggleListening}
          className={`bg-gray-800/50 border-gray-700 hover:bg-gray-700 text-teal-300 rounded-xl w-12 h-12 ${
            isListening ? 'bg-red-600 hover:bg-red-700' : ''
          }`}
        >
          <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
        </Button>
      </div>

      <div className="flex-grow relative">
        <Input
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder={
            selectedImage 
              ? 'Describe what you want to know about the selected image...' 
              : isListening 
                ? 'Listening...' 
                : 'Type your message...'
          }
          className="w-full bg-gray-800/50 border-gray-700 text-gray-100 placeholder:text-gray-400 h-12 pr-20 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
        />
        <Button
          onClick={sendMessage}
          disabled={isLoading}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 h-8 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );

 
   // Add error alert for speech recognition errors
   const renderSpeechError = () => (
     speechError && (
       <Alert variant="destructive" className="mt-2">
         <AlertCircle className="h-4 w-4" />
         <AlertDescription>
           {speechError}
         </AlertDescription>
       </Alert>
     )
   );
 
   // Modify your existing chat interface to include the new components
   const renderChatInterface = () => (
     <div className="space-y-4">
       {/* Keep existing chat interface code... */}
       
       {/* Add the new chat input with voice support */}
       {renderChatInput()}
       {renderSpeechError()}
     </div>
   );


  return (
    <div className="bg-gradient-to-b from-gray-900 via-teal-900 to-gray-900 text-gray-100 min-h-screen relative overflow-hidden">
      {/* Navigation */}
      <Toaster richColors position="top-center" />
      <nav className="px-6 py-4 flex justify-between items-center border-b border-teal-800">
        <button onClick={toggleSidebar} className="focus:outline-none">
          <Menu className="text-teal-400 w-7 h-7 hover:text-teal-300 cursor-pointer transition-colors duration-300" />
        </button>
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg hover:shadow-teal-500/50 transition-shadow duration-300">
              D
            </div>
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-200">
              Doctorify
            </span>
          </div>
          {isSignedIn ? (
          <UserButton  />
        ) : (
          <SignInButton>
            <Button
              variant="ghost"
              className="text-teal-400 hover:text-teal-300 text-lg hover:bg-teal-900/50 transition-colors duration-300"
            >
              Log In
            </Button>
          </SignInButton>
        )}
      </nav>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-teal-900 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="p-6">
          <button onClick={toggleSidebar} className="focus:outline-none">
            <X className="text-teal-400 w-7 h-7 hover:text-teal-300 cursor-pointer transition-colors duration-300" />
          </button>
          <nav className="mt-6">
            <ul className="space-y-4">
              <li>
                <a href="/" className="text-teal-100 hover:text-teal-300 text-lg transition-colors duration-300">
                  Home
                </a>
              </li>
              <li>
                <a href="/pricing" className="text-teal-100 hover:text-teal-300 text-lg transition-colors duration-300">
                  Pricing
                </a>
              </li>
             
            </ul>
          </nav>
        </div>
      </div>

      {/* Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        {!hasStarted ? (
          <div className="space-y-8">
            {/* Hero Text */}
            <h1 className="text-5xl font-bold leading-tight text-teal-100">
              Hi, I'm Doctorify, your{' '}
              <em className="font-normal not-italic text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-orange-300">
                private and personal
              </em>{' '}
              AI doctor.
            </h1>

            {/* Info Cards */}
            <Card className="bg-gradient-to-r from-teal-800 to-teal-900 border-teal-700 p-6 rounded-2xl shadow-lg hover:shadow-teal-500/20 transition-shadow duration-300">
              <p className="text-teal-100 text-lg">Free to start your consultation with me.</p>
            </Card>

            <Card className="bg-gradient-to-r from-teal-800 to-teal-900 border-teal-700 p-6 rounded-2xl shadow-lg hover:shadow-teal-500/20 transition-shadow duration-300">
  <div className="flex justify-between items-center">
    <p className="text-teal-100 text-lg">I've already helped people in 7,514,333 chats!</p>
    <div className="flex gap-2">
      {userImages.map((imageUrl, index) => (
        <div
          key={index}
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-teal-500 hover:border-teal-300 transition-colors duration-300"
        >
          <img
            src={imageUrl}
            alt={`User ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  </div>
</Card>

            <Card className="bg-gradient-to-r from-teal-800 to-teal-900 border-teal-700 p-6 rounded-2xl shadow-lg hover:shadow-teal-500/20 transition-shadow duration-300">
              <p className="text-teal-100 text-lg">
                When we're done, you can have a Audio call visit with a top AI doctor if you want. Those visits only cost $29.
              </p>
            </Card>

            {/* Form Section */}
            <div className="space-y-6">
              <p className="text-teal-100 text-lg">Please tell me your age and biological sex to get started.</p>

              <div className="grid grid-cols-3 gap-4">
                <Input
                  placeholder="Age (18+)"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="col-span-1 bg-teal-800 border-teal-700 text-teal-100 placeholder:text-teal-400 h-14 text-lg rounded-xl"
                />
                <Button
                  variant="outline"
                  onClick={() => setGender('female')}
                  className={`col-span-1 border-teal-700 bg-teal-800 hover:bg-teal-700 text-teal-100 h-14 text-lg rounded-xl ${
                    gender === 'female' ? 'bg-teal-600' : ''
                  }`}
                >
                  Female
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setGender('male')}
                  className={`col-span-1 border-teal-700 bg-teal-800 hover:bg-teal-700 text-teal-100 h-14 text-lg rounded-xl ${
                    gender === 'male' ? 'bg-teal-600' : ''
                  }`}
                >
                  Male
                </Button>
              </div>

              <Button
                onClick={handleStartChat}
                disabled={!age || !gender}
                className="w-full bg-gradient-to-r from-teal-600 to-orange-600 hover:from-teal-700 hover:to-orange-700 text-white h-14 text-lg rounded-xl"
              >
                Get Started
              </Button>

              <div className="flex items-center justify-center gap-2 text-teal-400">
                <Lock className="w-5 h-5" />
                <span className="text-base">HIPAA compliant and anonymous</span>
              </div>
            </div>

            {/* Footer */}
            <footer className="text-sm text-teal-400 text-center space-y-2">
              <p>
                <a href="#" className="text-teal-300 hover:text-teal-200 underline transition-colors duration-300">
                  Always discuss Doctorify output with a doctor.
                </a>{' '}
                Doctorify is an AI doctor, not a licensed doctor, does not practice medicine, and does not provide medical
                advice or patient care.
              </p>
              <p>
                Doctorify is the first AI doctor working with human doctors licensed to practice medicine in all 50 states.
                By using Doctorify, you agree to our Terms of Service & Privacy Policy.
              </p>
            </footer>
          </div>
       
        ) : (
          // Chat interface
         // Enhanced Chat Interface
         <div className="space-y-4">
         {/* Premium Header */}
         <div className="flex items-center justify-between bg-gradient-to-r from-teal-900 to-emerald-900 rounded-xl p-4 border border-teal-700/50">
           <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
               <Bot className="w-7 h-7 text-white" />
             </div>
             <div>
               <h2 className="text-xl font-semibold text-white">Medical Assistant</h2>
               <p className="text-teal-200 text-sm">Online • HIPAA Compliant</p>
             </div>
           </div>
           
           <Link href='/doctors'>
           <Button 
                variant="outline" 
                className="flex items-center gap-2 bg-teal-800 hover:bg-teal-700 border-teal-600 text-white rounded-lg px-4 py-2 transition-all duration-300 hover:scale-105"
               
              >
                <Phone className="w-4 h-4" />
                <span>Start Call</span>
              </Button>
           </Link>
         
         </div>

         {/* Chat Messages */}
         <Card className="h-[60vh] overflow-hidden rounded-xl bg-gradient-to-b from-[rgba(10, 187, 160, 0.5)] to-[rgba(17, 56, 49, 0.5)] border border-gray-800">
           <div className="h-full overflow-y-auto p-6 space-y-6" style={{ scrollbarWidth: 'thin' }}>
             {chatMessages.map((message, index) => (
               <div
                 key={index}
                 className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-3 transform transition-all duration-300 ease-out`}
               >
                 {message.role === 'assistant' && (
                   <div className="flex flex-col items-center gap-1">
                     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 p-[2px]">
                       <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                         <Bot className="w-6 h-6 text-teal-300" />
                       </div>
                     </div>
                   </div>
                 )}
                 
                 <div
                   className={`group relative max-w-[70%] ${
                     message.role === 'user' ? 'ml-12' : 'mr-12'
                   }`}
                 >
                   <div className={`p-4 rounded-2xl shadow-lg transition-all duration-300 ${
                     message.role === 'user'
                       ? 'bg-gradient-to-br from-teal-600 to-emerald-600 text-white'
                       : 'bg-gradient-to-br from-gray-800 to-gray-700 text-gray-100'
                   }`}>
                     <p className="text-lg leading-relaxed">{message.content}</p>
                     <div className="mt-2 text-xs opacity-70 flex items-center gap-2">
                       {message.role === 'user' ? 'You' : 'Dr. AI'} • {formatTime(message.timestamp)}
                     </div>
                   </div>
                 </div>

                 {message.role === 'user' && (
                   <div className="flex flex-col items-center gap-1">
                     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-500 p-[2px]">
                       <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
                         <User className="w-6 h-6 text-gray-300" />
                       </div>
                     </div>
                   </div>
                 )}
               </div>
             ))}
             <div ref={messagesEndRef} />
             
             {isLoading && (
               <div className="flex items-center gap-2 text-teal-300 animate-pulse">
                 <Loader2 className="w-4 h-4 animate-spin" />
                 <span className="text-sm">Dr. AI is typing...</span>
               </div>
             )}
           </div>
         </Card>

        
         {renderChatInterface()}



       </div>
     


        )}
      </main>
    </div>
  );
};

export default LandingPage;