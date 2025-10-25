import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  MapPin,
  Clock,
  Plus,
  Search,
  Users,
  Filter
} from "lucide-react";
import { format } from "date-fns";

export default function Events() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: () => base44.entities.Event.list("-date_time")
  });

  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => base44.auth.me()
  });

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || event.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "published": return "bg-green-600/20 text-green-400 border-green-600/30";
      case "live": return "bg-red-600/20 text-red-400 border-red-600/30";
      case "completed": return "bg-zinc-600/20 text-zinc-400 border-zinc-600/30";
      case "draft": return "bg-yellow-600/20 text-yellow-400 border-yellow-600/30";
      default: return "bg-zinc-600/20 text-zinc-400 border-zinc-600/30";
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-8 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-black mb-2">Events</h1>
            <p className="text-zinc-400">Browse and join upcoming fight events</p>
          </div>
          {user?.role === "organizer" && (
            <Link to={createPageUrl("CreateEvent")}>
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="w-5 h-5 mr-2" />
                Create Event
              </Button>
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <Input
              placeholder="Search events by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-zinc-900 border-zinc-800"
            />
          </div>

          <Tabs value={filterStatus} onValueChange={setFilterStatus}>
            <TabsList className="bg-zinc-900 border border-zinc-800">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
              <TabsTrigger value="live">Live</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="bg-zinc-900 border-zinc-800 animate-pulse">
                <div className="h-48 bg-zinc-800" />
                <CardContent className="p-6">
                  <div className="h-6 bg-zinc-800 rounded mb-3" />
                  <div className="h-4 bg-zinc-800 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-zinc-800 rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Link key={event.id} to={createPageUrl(`EventDetails?id=${event.id}`)}>
                <Card className="bg-zinc-900 border-zinc-800 hover:border-red-600/50 transition-all h-full group">
                  {/* Event Banner */}
                  <div className="relative h-48 bg-gradient-to-br from-red-950 to-zinc-900 overflow-hidden">
                    {event.banner_image ? (
                      <img
                        src={event.banner_image}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Calendar className="w-16 h-16 text-zinc-700" />
                      </div>
                    )}
                    <Badge
                      variant="secondary"
                      className={`absolute top-3 right-3 ${getStatusColor(event.status)}`}
                    >
                      {event.status}
                    </Badge>
                  </div>

                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-3 group-hover:text-red-500 transition-colors">
                      {event.title}
                    </h3>

                    <div className="space-y-2 text-sm text-zinc-400">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{format(new Date(event.date_time), "MMM d, yyyy 'at' h:mm a")}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{event.location}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span className="capitalize">{event.ruleset_default || "Mixed"} Rules</span>
                      </div>
                    </div>

                    {event.description && (
                      <p className="mt-3 text-sm text-zinc-500 line-clamp-2">
                        {event.description}
                      </p>
                    )}

                    {event.paid_event && (
                      <Badge variant="outline" className="mt-3 border-yellow-600/30 text-yellow-500">
                        ${event.ticket_price} Entry
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-12 text-center">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-zinc-700" />
              <h3 className="text-lg font-semibold mb-2">No events found</h3>
              <p className="text-zinc-400 mb-4">
                {searchTerm ? "Try adjusting your search" : "Be the first to create an event"}
              </p>
              {user?.role === "organizer" && (
                <Link to={createPageUrl("CreateEvent")}>
                  <Button className="bg-red-600 hover:bg-red-700">
                    <Plus className="w-5 h-5 mr-2" />
                    Create Event
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
