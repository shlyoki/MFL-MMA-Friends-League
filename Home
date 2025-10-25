import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  TrendingUp,
  Plus,
  Clock,
  Flame,
  ArrowRight
} from "lucide-react";
import { format } from "date-fns";

export default function Home() {
  const [user, setUser] = useState(null);
  const [fighter, setFighter] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      
      if (currentUser.role === "fighter") {
        const fighters = await base44.entities.Fighter.filter({ user_id: currentUser.id });
        if (fighters.length > 0) {
          setFighter(fighters[0]);
        }
      }
    } catch (error) {
      console.log("Not logged in");
    }
  };

  const { data: upcomingEvents = [] } = useQuery({
    queryKey: ["upcomingEvents"],
    queryFn: async () => {
      const events = await base44.entities.Event.filter(
        { status: "published" },
        "-date_time",
        10
      );
      return events;
    }
  });

  const { data: myBouts = [] } = useQuery({
    queryKey: ["myBouts", fighter?.id],
    queryFn: async () => {
      if (!fighter?.id) return [];
      const bouts = await base44.entities.Bout.list("-created_date", 5);
      return bouts.filter(
        b => b.red_fighter_id === fighter.id || b.blue_fighter_id === fighter.id
      );
    },
    enabled: !!fighter?.id
  });

  const { data: topFighters = [] } = useQuery({
    queryKey: ["topFighters"],
    queryFn: async () => {
      const fighters = await base44.entities.Fighter.list("-wins", 5);
      return fighters;
    }
  });

  return (
    <div className="min-h-screen bg-zinc-950 pb-24 md:pb-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-red-950 via-zinc-900 to-zinc-950 border-b border-zinc-800">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=1200')] bg-cover bg-center opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-20">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-6 h-6 text-red-500" />
            <span className="text-red-500 font-bold uppercase text-sm tracking-wider">
              Live Events Platform
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            MMA Friends League
          </h1>
          <p className="text-lg md:text-xl text-zinc-300 mb-8 max-w-2xl">
            Organize safe, competitive combat sports events among friends. Track records, manage matchups, and build your legacy.
          </p>
          
          {user ? (
            <div className="flex flex-wrap gap-3">
              {user.role === "organizer" && (
                <Link to={createPageUrl("CreateEvent")}>
                  <Button size="lg" className="bg-red-600 hover:bg-red-700">
                    <Plus className="w-5 h-5 mr-2" />
                    Create Event
                  </Button>
                </Link>
              )}
              {!fighter && user.role === "fighter" && (
                <Link to={createPageUrl("CreateFighterProfile")}>
                  <Button size="lg" className="bg-red-600 hover:bg-red-700">
                    <Plus className="w-5 h-5 mr-2" />
                    Create Fighter Profile
                  </Button>
                </Link>
              )}
              <Link to={createPageUrl("Events")}>
                <Button size="lg" variant="outline" className="border-zinc-700 hover:bg-zinc-800">
                  Browse Events
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          ) : (
            <Button size="lg" className="bg-red-600 hover:bg-red-700" onClick={() => base44.auth.redirectToLogin()}>
              Get Started
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        {fighter && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Trophy className="w-8 h-8 text-yellow-500" />
                </div>
                <p className="text-3xl font-bold">{fighter.wins || 0}</p>
                <p className="text-sm text-zinc-400">Wins</p>
              </CardContent>
            </Card>
            
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-8 h-8 text-red-500" />
                </div>
                <p className="text-3xl font-bold">{fighter.losses || 0}</p>
                <p className="text-sm text-zinc-400">Losses</p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Flame className="w-8 h-8 text-orange-500" />
                </div>
                <p className="text-3xl font-bold">{fighter.ko_wins || 0}</p>
                <p className="text-sm text-zinc-400">KO/TKO</p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
                <p className="text-3xl font-bold">{fighter.submission_wins || 0}</p>
                <p className="text-sm text-zinc-400">Submissions</p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Upcoming Events */}
          <div className="lg:col-span-2">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="border-b border-zinc-800">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-red-500" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {upcomingEvents.length > 0 ? (
                  <div className="divide-y divide-zinc-800">
                    {upcomingEvents.map((event) => (
                      <Link
                        key={event.id}
                        to={createPageUrl(`EventDetails?id=${event.id}`)}
                        className="block p-6 hover:bg-zinc-800/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold mb-2">{event.title}</h3>
                            <div className="flex flex-wrap gap-3 text-sm text-zinc-400">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {format(new Date(event.date_time), "MMM d, yyyy 'at' h:mm a")}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {event.location}
                              </span>
                            </div>
                          </div>
                          <Badge variant="secondary" className="bg-red-600/20 text-red-400 border-red-600/30">
                            {event.status}
                          </Badge>
                        </div>
                        {event.description && (
                          <p className="text-sm text-zinc-400 line-clamp-2">{event.description}</p>
                        )}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center text-zinc-500">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No upcoming events</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Top Fighters */}
          <div>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="border-b border-zinc-800">
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Top Fighters
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {topFighters.length > 0 ? (
                  <div className="divide-y divide-zinc-800">
                    {topFighters.map((f, idx) => (
                      <div key={f.id} className="p-4 flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          idx === 0 ? "bg-yellow-500 text-black" :
                          idx === 1 ? "bg-zinc-400 text-black" :
                          idx === 2 ? "bg-amber-700 text-white" :
                          "bg-zinc-800 text-zinc-400"
                        }`}>
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate text-sm">
                            Fighter #{f.user_id.slice(0, 8)}
                          </p>
                          <p className="text-xs text-zinc-400">
                            {f.wins}-{f.losses}-{f.draws || 0}
                          </p>
                        </div>
                        <Badge variant="outline" className="border-zinc-700 text-zinc-300 text-xs">
                          {f.weight_class}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-zinc-500">
                    <Users className="w-10 h-10 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">No fighters yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
