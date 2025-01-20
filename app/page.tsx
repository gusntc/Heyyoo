import { Button } from '@/components/ui/button';
import { MapPin, Users, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl font-bold text-blue-900 mb-6">
                Connect with Friends in Real Life
              </h1>
              <p className="text-xl text-blue-700 mb-8">
                Never miss an opportunity to meet up with friends when you're nearby. Share your location, see who's around, and make real connections happen.
              </p>
              <div className="space-x-4">
                <Link href="/auth/signup">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    Get Started
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button size="lg" variant="outline">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2089&q=80"
                alt="Friends meeting"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-8 rounded-lg text-center">
              <MapPin className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-4">Share Location</h3>
              <p className="text-gray-600">
                Securely share your location with trusted friends and see when they're nearby.
              </p>
            </div>
            
            <div className="bg-blue-50 p-8 rounded-lg text-center">
              <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-4">Find Friends</h3>
              <p className="text-gray-600">
                See which friends are in your area and arrange spontaneous meetups.
              </p>
            </div>

            <div className="bg-blue-50 p-8 rounded-lg text-center">
              <MessageCircle className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-4">Stay Connected</h3>
              <p className="text-gray-600">
                Chat with friends and coordinate meetups when you're in the same area.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Join Thousands of Connected Friends</h2>
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600">10K+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600">50K+</div>
              <div className="text-gray-600">Connections Made</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600">100K+</div>
              <div className="text-gray-600">Meetups Arranged</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}