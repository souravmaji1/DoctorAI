'use client'

import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Video, Mic, MicOff, VideoOff, X } from 'lucide-react';
import Link from 'next/link';

const CallPage = ({ doctor }) => {
  return (
    <div className="bg-gradient-to-b from-gray-900 via-teal-900 to-gray-900 text-gray-100 min-h-screen">
      {/* Navigation */}
      <nav className="px-6 py-4 flex justify-between items-center border-b border-teal-800">
        <Link href="/doctors">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white text-lg shadow-lg hover:shadow-teal-500/50 transition-shadow duration-300">
              +
            </div>
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-200">
              Doctorify
            </span>
          </div>
        </Link>
        <Button
          variant="ghost"
          className="text-teal-400 hover:text-teal-300 text-lg hover:bg-teal-900/50 transition-colors duration-300"
        >
          End Call
        </Button>
      </nav>

      {/* Call Interface */}
      <main className="container mx-auto px-6 py-8 flex flex-col items-center justify-center">
        <Card className="bg-gradient-to-r from-teal-800 to-teal-900 border-teal-700 p-6 rounded-xl hover:shadow-lg hover:shadow-teal-500/20 transition-all duration-300">
          <div className="flex items-center justify-center mb-6">
            <div className="w-24 h-24 bg-teal-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
              {doctor.name.charAt(0)}
            </div>
          </div>
          <h3 className="text-xl font-semibold text-white mb-1 text-center">{doctor.name}</h3>
          <p className="text-teal-300 text-center">{doctor.specialty}</p>

          <div className="flex gap-4 mt-8">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white rounded-full p-3">
              <Mic className="w-6 h-6" />
            </Button>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white rounded-full p-3">
              <Video className="w-6 h-6" />
            </Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white rounded-full p-3">
              <X className="w-6 h-6" />
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default CallPage;