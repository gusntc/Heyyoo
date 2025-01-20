"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MapPin, Users, MessageCircle } from 'lucide-react';
import { supabase, type Profile } from '@/lib/supabase';
import Link from 'next/link';

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

export default function MapPage() {
  const [friends, setFriends] = useState<Profile[]>([]);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        setUserProfile(profile);
      }

      // Get friends
      const { data: connections } = await supabase
        .from('connections')
        .select('friend_id')
        .eq('user_id', user.id)
        .eq('status', 'accepted');

      if (connections) {
        const friendIds = connections.map(c => c.friend_id);
        const { data: friendProfiles } = await supabase
          .from('profiles')
          .select('*')
          .in('id', friendIds);

        if (friendProfiles) {
          setFriends(friendProfiles);
        }
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  if (typeof window === 'undefined') return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="h-screen flex">
      {/* Map */}
      <div className="flex-grow">
        <MapContainer
          center={[0, 0]}
          zoom={2}
          style={{ height: '100vh', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {userProfile?.latitude && userProfile?.longitude && (
            <Marker position={[userProfile.latitude, userProfile.longitude]}>
              <Popup>
                You are here
              </Popup>
            </Marker>
          )}
          {friends.map((friend) => (
            friend.latitude && friend.longitude && (
              <Marker
                key={friend.id}
                position={[friend.latitude, friend.longitude]}
              >
                <Popup>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={friend.avatar_url || undefined} />
                      <AvatarFallback>{friend.username[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span>{friend.username}</span>
                    <Link href={`/dashboard/chat/${friend.id}`}>
                      <Button size="sm" variant="outline">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </Popup>
              </Marker>
            )
          ))}
        </MapContainer>
      </div>

      {/* Sidebar */}
      <div className="w-80 bg-white p-4 shadow-lg overflow-y-auto">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Friends</h2>
          <Link href="/dashboard/nearby" className="block">
            <Button variant="outline" className="w-full">
              <Users className="mr-2 h-4 w-4" />
              View Nearby Friends
            </Button>
          </Link>
          {friends.map((friend) => (
            <Card key={friend.id} className="p-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={friend.avatar_url || undefined} />
                  <AvatarFallback>{friend.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <div className="font-semibold">{friend.username}</div>
                  <div className="text-sm text-gray-500">
                    {friend.latitude && friend.longitude ? (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>Location shared</span>
                      </div>
                    ) : (
                      'Location not shared'
                    )}
                  </div>
                </div>
                <Link href={`/dashboard/chat/${friend.id}`}>
                  <Button size="sm" variant="outline">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}