
'use client'
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Menu, Lock, X } from 'lucide-react';
import { useUser, SignInButton, UserButton } from '@clerk/nextjs';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://fmkjdrdiifebucfpkbsz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZta2pkcmRpaWZlYnVjZnBrYnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMTczMzcsImV4cCI6MjA1Nzc5MzMzN30.DpHqHHbpHnW981laR2u37syuQ8L_QEf6116vqsSMwGI'
);

const PricingPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaypal, setShowPaypal] = useState(false);
  const { user, isSignedIn } = useUser();
 

  const plans = {
    free: {
      price: 0,
      name: 'Free'
    },
    pro: {
      price: 29,
      name: 'Pro'
    },
    premium: {
      price: 49,
      name: 'Premium'
    }
  };

  const handlePlanSelection = async (planType) => {
    if (!isSignedIn) {
     
      return;
    }

    // Check if user already has an active subscription
    const { data: existingSubscription, error } = await supabase
      .from('usersubscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (existingSubscription) {
    
      return;
    }

    setSelectedPlan(planType);
    setShowPaypal(true);
  };

  const handlePaypalApprove = async (data, actions) => {
    try {
      const order = await actions.order.capture();

        const { error} = await supabase
        .from('usersubscriptions')
        .update({
          plan_type: selectedPlan,
          payment_id: order.id,
          amount: plans[selectedPlan].price,
          status: 'active',
        })
        .eq('user_id', user.id);


      if (error) throw error;

     

      setShowPaypal(false);
      setSelectedPlan(null);
      
    } catch (error) {
      console.error('Error processing subscription:', error);
      
    }
  };

  const renderPaypalButton = (planType) => {
    if (!showPaypal || selectedPlan !== planType || plans[planType].price === 0) {
      return null;
    }

    return (
      <div className="mt-4">
        <PayPalButtons
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: plans[planType].price.toString(),
                    currency_code: "USD"
                  },
                  description: `Doctronic ${plans[planType].name} Plan Subscription`
                }
              ]
            });
          }}
          onApprove={handlePaypalApprove}
          onError={(err) => {
            console.error('PayPal Error:', err);
          
          }}
        />
      </div>
    );
  };

  return (
    <PayPalScriptProvider options={{ "client-id": 'AQ3hHQbVcAFxIVpKOip-LluE3whXGHLeLpI215fswm7_9ulbeO6vlwMxpN5tE7vdQN8ej44pvFleU91r' }}>
      <div className="bg-gradient-to-b from-gray-900 via-teal-900 to-gray-900 text-gray-100 min-h-screen relative overflow-hidden">
        <nav className="px-6 py-4 flex justify-between items-center border-b border-teal-800">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="focus:outline-none">
            <Menu className="text-teal-400 w-7 h-7 hover:text-teal-300 cursor-pointer transition-colors duration-300" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white text-lg shadow-lg hover:shadow-teal-500/50 transition-shadow duration-300">
              +
            </div>
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-200">
              Doctronic
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
            <button onClick={() => setIsSidebarOpen(false)} className="focus:outline-none">
              <X className="text-teal-400 w-7 h-7 hover:text-teal-300 cursor-pointer transition-colors duration-300" />
            </button>
            <nav className="mt-6">
              <ul className="space-y-4">
                <li>
                  <a
                    href="/"
                    className="text-teal-100 hover:text-teal-300 text-lg transition-colors duration-300"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/pricing"
                    className="text-teal-100 hover:text-teal-300 text-lg transition-colors duration-300"
                  >
                    Pricing
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Pricing Section */}
        <main className="container mx-auto px-6 py-12">
          <h2 className="text-4xl font-bold text-teal-100 text-center mb-8">
            Choose Your Plan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <Card className="bg-gradient-to-r from-teal-800 to-teal-900 border-teal-700 p-6 rounded-2xl shadow-lg hover:shadow-teal-500/20 transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-teal-100 mb-4">Free</h3>
              <p className="text-teal-300 text-lg mb-6">$0<span className="text-sm">/month</span></p>
              <ul className="space-y-3 mb-6">
                <li className="text-teal-100">✔️ Basic AI consultations</li>
                <li className="text-teal-100">✔️ Limited to 5 chats/month</li>
                <li className="text-teal-100">✔️ Community support</li>
              </ul>
              <Button 
                onClick={() => handlePlanSelection('free')}
                className="w-full bg-gradient-to-r from-teal-600 to-orange-600 hover:from-teal-700 hover:to-orange-700 text-white h-12 text-lg rounded-xl shadow-lg hover:shadow-teal-500/30 transition-all duration-300"
              >
                Get Started
              </Button>
              {renderPaypalButton('free')}
            </Card>

            {/* Pro Plan */}
            <Card className="bg-gradient-to-r from-teal-800 to-teal-900 border-teal-700 p-6 rounded-2xl shadow-lg hover:shadow-teal-500/20 transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-teal-100 mb-4">Pro</h3>
              <p className="text-teal-300 text-lg mb-6">$29<span className="text-sm">/month</span></p>
              <ul className="space-y-3 mb-6">
                <li className="text-teal-100">✔️ Unlimited AI consultations</li>
                <li className="text-teal-100">✔️ Priority support</li>
                <li className="text-teal-100">✔️ Access to voice call visits</li>
              </ul>
              <Button 
                onClick={() => handlePlanSelection('pro')}
                className="w-full bg-gradient-to-r from-teal-600 to-orange-600 hover:from-teal-700 hover:to-orange-700 text-white h-12 text-lg rounded-xl shadow-lg hover:shadow-teal-500/30 transition-all duration-300"
              >
                Upgrade to Pro
              </Button>
              {renderPaypalButton('pro')}
            </Card>

            {/* Premium Plan */}
            <Card className="bg-gradient-to-r from-teal-800 to-teal-900 border-teal-700 p-6 rounded-2xl shadow-lg hover:shadow-teal-500/20 transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-teal-100 mb-4">Premium</h3>
              <p className="text-teal-300 text-lg mb-6">$49<span className="text-sm">/month</span></p>
              <ul className="space-y-3 mb-6">
                <li className="text-teal-100">✔️ All Pro features</li>
                <li className="text-teal-100">✔️ 24/7 doctor access</li>
                <li className="text-teal-100">✔️ Personalized health plans</li>
              </ul>
              <Button 
                onClick={() => handlePlanSelection('premium')}
                className="w-full bg-gradient-to-r from-teal-600 to-orange-600 hover:from-teal-700 hover:to-orange-700 text-white h-12 text-lg rounded-xl shadow-lg hover:shadow-teal-500/30 transition-all duration-300"
              >
                Go Premium
              </Button>
              {renderPaypalButton('premium')}
            </Card>
          </div>
        </main>

        <footer className="text-sm text-teal-400 text-center space-y-2 mt-12 pb-8">
          <p>
            <a href="#" className="text-teal-300 hover:text-teal-200 underline transition-colors duration-300">
              Always discuss Doctronic output with a doctor.
            </a>{' '}
            Doctronic is an AI doctor, not a licensed doctor, does not practice medicine, and does not provide medical
            advice or patient care.
          </p>
          <p>
            Doctronic is the first AI doctor working with human doctors licensed to practice medicine in all 50 states.
            By using Doctronic, you agree to our Terms of Service & Privacy Policy.
          </p>
        </footer>
      </div>
    </PayPalScriptProvider>
  );
};

export default PricingPage;