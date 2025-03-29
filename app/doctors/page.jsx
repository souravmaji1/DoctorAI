'use client'

import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Menu, X, Star, Phone } from 'lucide-react';
import Link from 'next/link';
import { useUser, SignInButton, UserButton } from '@clerk/nextjs';

const DoctorsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { user, isSignedIn } = useUser();
  const categories = [
    'All',
    'Primary Care',
    'Cardiology',
    'Dermatology',
    'Pediatrics',
    'Psychiatry',
    'Orthopedics'
  ];

  const doctors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Primary Care",
      rating: 4.9,
      reviews: 128,
      nextAvailable: "Today",
      assistantId: '91d01c43-f203-4c7f-a4d1-de2f6beb5f8e',
      experience: "15 years",
      price: 29
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Cardiology",
      rating: 4.8,
      reviews: 256,
      nextAvailable: "Tomorrow",
      assistantId: '91d01c43-f203-4c7f-a4d1-de2f6beb5f8e',
      experience: "20 years",
      price: 29
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialty: "Dermatology",
      rating: 4.7,
      reviews: 189,
      nextAvailable: "Today",
      assistantId: '91d01c43-f203-4c7f-a4d1-de2f6beb5f8e',
      experience: "12 years",
      price: 29
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      specialty: "Pediatrics",
      rating: 4.9,
      reviews: 312,
      nextAvailable: "Tomorrow",
      assistantId: '91d01c43-f203-4c7f-a4d1-de2f6beb5f8e',
      experience: "18 years",
      price: 29
    },
    {
      id: 5,
      name: "Dr. Lisa Thompson",
      specialty: "Psychiatry",
      rating: 4.8,
      reviews: 167,
      assistantId: '91d01c43-f203-4c7f-a4d1-de2f6beb5f8e',
      nextAvailable: "Today",
      experience: "14 years",
      price: 29
    },
    {
      id: 6,
      name: "Dr. Robert Kim",
      specialty: "Orthopedics",
      rating: 4.9,
      assistantId: '91d01c43-f203-4c7f-a4d1-de2f6beb5f8e',
      reviews: 203,
      nextAvailable: "Tomorrow",
      experience: "22 years",
      price: 29
    }
  ];

  const filteredDoctors = selectedCategory === 'All' 
    ? doctors 
    : doctors.filter(doctor => doctor.specialty === selectedCategory);

  return (
    <div className="bg-gradient-to-b from-gray-900 via-teal-900 to-gray-900 text-gray-100 min-h-screen">
      {/* Navigation */}
      <nav className="px-6 py-4 flex justify-between items-center border-b border-teal-800">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="focus:outline-none">
          <Menu className="text-teal-400 w-7 h-7 hover:text-teal-300 cursor-pointer transition-colors duration-300" />
        </button>
        <Link href="/">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg hover:shadow-teal-500/50 transition-shadow duration-300">
              D
            </div>
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-200">
              Doctorify
            </span>
          </div>
        </Link>
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
      <div className={`fixed inset-y-0 left-0 w-64 bg-teal-900 transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out z-50`}>
        <div className="p-6">
          <button onClick={() => setIsSidebarOpen(false)} className="focus:outline-none">
            <X className="text-teal-400 w-7 h-7 hover:text-teal-300 cursor-pointer transition-colors duration-300" />
          </button>
          <nav className="mt-6">
            <ul className="space-y-4">
              <li>
                <Link href="/" className="text-teal-100 hover:text-teal-300 text-lg transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li>
                <a href="/pricing" className="text-teal-100 hover:text-teal-300 text-lg transition-colors duration-300">
                  Pricing
                </a>
              </li>
              <li>
                <a href="/doctors" className="text-teal-100 hover:text-teal-300 text-lg transition-colors duration-300">
                  Doctors
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Categories */}
        <div className="flex gap-4 overflow-x-auto pb-4 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full whitespace-nowrap transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-teal-600 text-white'
                  : 'bg-teal-800/50 text-teal-300 hover:bg-teal-700'
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="bg-gradient-to-r from-teal-800 to-teal-900 border-teal-700 p-6 rounded-xl hover:shadow-lg hover:shadow-teal-500/20 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">{doctor.name}</h3>
                  <p className="text-teal-300">{doctor.specialty}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-white">{doctor.rating}</span>
                  <span className="text-teal-400">({doctor.reviews})</span>
                </div>
              </div>
              
              <div className="space-y-2 mb-6">
                <p className="text-teal-200">Experience: {doctor.experience}</p>
                <p className="text-teal-200">Next Available: {doctor.nextAvailable}</p>
                <p className="text-teal-200">Visit Price: ${doctor.price}</p>
              </div>

              <Link href={`/call-page?doctor=${encodeURIComponent(JSON.stringify(doctor))}`}>
                <Button 
                  className="w-full bg-gradient-to-r from-teal-600 to-orange-600 hover:from-teal-700 hover:to-orange-700 text-white h-12 text-lg rounded-xl shadow-lg hover:shadow-teal-500/30 transition-all duration-300"
                >
                  <Phone className="w-4 h-4" />
                  Call Now
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DoctorsPage;