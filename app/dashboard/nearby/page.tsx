"use client";

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MapPin, ArrowLeft, MessageCircle } from 'lucide-react';
import { supabase, type Profile } from '@/lib/supabase';
import Link from 'next/link';

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export default function NearbyFriendsPage() {
  const [nearbyFriends, setNearbyFriends] = useState<(Profile & { distance: number })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNearbyFriends = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user's location
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!userProfile?.latitude || !userProfile?.longitude) {
        setLoading(false);
        return;
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
          const friendsWithDistance = friendProfiles
            .filter(friend => friend.latitude && friend.longitude)
            .map(friend => ({
              ...friend,
              distance: calculateDistance(
                userProfile.latitude!,
                userProfile.longitude!,
                friend.latitude!,
                friend.longitude!
              )
            }))
            .sort((a, b) => a.distance - b.distance);

          setNearbyFriends(friendsWithDistance);
        }
      }

      setLoading(false);
    };

    fetchNearbyFriends();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard/map">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Map
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Nearby Friends</h1>
          <p className="text-gray-600 mt-2">Friends in your vicinity</p>
        </div>

        <div className="space-y-4">
          {nearbyFriends.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500">No friends nearby at the moment</p>
            </Card>
          ) : (
            nearbyFriends.map((friend) => (
              <Card key={friend.id} className="p-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={friend.avatar_url || undefined} />
                    <AvatarFallback>{friend.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                    <div className="font-semibold text-lg">{friend.username}</div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{friend.distance.toFixed(1)} km away</span>
                    </div>
                  </div>
                  <Link href={`/dashboard/chat/${friend.id}`}>
                    <Button>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </Link>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}