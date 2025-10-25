import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Shield,
  MessageSquare,
  Image as ImageIcon,
  Plus,
  Check,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import BoutCard from "../components/events/BoutCard";
import WaiverDialog from "../components/events/WaiverDialog";
import ChatPanel from "../components/events/ChatPanel";

export default function EventDetails() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [fighter, setFighter] = useState(null);
  const [hasWaiver, setHasWaiver] = useState(false);
  const [showWaiverDialog, setShowWaiverDialog] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get("id");

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

  const { data: event, isLoading: loadingEvent } = useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      const events = await base44.entities.Event.filter({ id: eventId });
      return events[0];
    },
    enabled: !!eventId
  });

  const { data: bouts = [] } = useQuery({
    queryKey: ["bouts", eventId],
    queryFn: () => base44.entities.Bout.filter({ event_id: eventId }, "-bout_order"),
    enabled: !!eventId
  });

  const { data: rsvps = [] } = useQuery({
    queryKey: ["rsvps", eventId],
    queryFn: () => base44.entities.RSVP.filter({ event_id: eventId }),
    enabled: !!eventId
  });

  const { data: waivers = [] } = useQuery({
    queryKey: ["waivers", eventId],
    queryFn: async () => {
      const w = await base44.entities.Waiver.filter({ event_id: eventId });
      if (user) {
        const userWaiver = w.find(waiver => waiver.user_id === user.id);
        setHasWaiver(!!userWaiver);
      }
      return w;
    },
    enabled: !!eventId && !!user
  });

  const rsvpMutation = useMutation({
    mutationFn: (data) => base44.entities.RSVP.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["rsvps", eventId]);
    }
  });

  const handleRSVP = async () => {
    if (!user) {
      base44.auth.redirectToLogin();
      return;
    }

    const existingRSVP = rsvps.find(r => r.user_id === user.id);
    if (!existingRSVP) {
      await rsvpMutation.mutateAsync({
        event_id: eventId,
        user_id: user.id,
        role_at_event: user.role,
        status: "going"
      });
    }
  };

  const handleSignWaiver = () => {
    setShowWaiverDialog(true);
  };

  const userRSVP = rsvps.find(r => r.user_id === user?.id);
  const isOrganizer = user?.id === event?.organizer_id;

  if (loadingEvent) {
    return (
      <div className="min-h-screen bg-zinc-950 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4" />
          <p className="text-zinc-400">Loading event...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-zinc-950 p-4 md:p-8 flex items-center justify-center">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-12 text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-zinc-700" />
            <h3 className="text-lg font-semibold mb-2">Event not found</h3>
            <Link to={createPageUrl("Events")}>
              <Button className="mt-4 bg-red-600 hover:bg-red-700">
                Back to Events
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const mainEvent = bouts.find(b => b.bout_type === "main_event");
  const coMain = bouts.find(b => b.bout_type === "co_main");
  const undercard = bouts.filter(b => b.bout_type === "undercard");

  return (
    <div className="min-h-screen bg-zinc-950 pb-24 md:pb-8">
      {/* Event Hero */}
      <div className="relative bg-gradient-to-br from-red-950 via-zinc-900 to-zinc-950 border-b border-zinc-800">
        {event.banner_image && (
          <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${event.banner_image})` }} />
        )}
        <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-16">
          <Badge variant="secondary" className="bg-red-600/20 text-red-400 border-red-600/30 mb-4">
            {event.status}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black mb-4">{event.title}</h1>
          
          <div className="flex flex-wrap gap-4 text-zinc-300 mb-6">
            <span className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {format(new Date(event.date_time), "EEEE, MMMM d, yyyy 'at' h:mm a")}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              {event.location}
            </span>
            <span className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              {rsvps.length} attending
            </span>
          </div>

          {event.description && (
            <p className="text-zinc-300 max-w-2xl mb-6">{event.description}</p>
          )}

          <div className="flex flex-wrap gap-3">
            {!userRSVP ? (
              <Button onClick={handleRSVP} className="bg-red-600 hover:bg-red-700">
                RSVP to Event
              </Button>
            ) : (
              <Button variant="outline" className="border-green-600 text-green-500" disabled>
                <Check className="w-5 h-5 mr-2" />
                You're Going
              </Button>
            )}
            
            {userRSVP && !hasWaiver && (
              <Button onClick={handleSignWaiver} className="bg-yellow-600 hover:bg-yellow-700">
                <Shield className="w-5 h-5 mr-2" />
                Sign Waiver
              </Button>
            )}

            {isOrganizer && (
              <Link to={createPageUrl(`CreateBout?event_id=${eventId}`)}>
                <Button variant="outline" className="border-zinc-700 hover:bg-zinc-800">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Bout
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="card" className="w-full">
          <TabsList className="bg-zinc-900 border border-zinc-800 mb-6">
            <TabsTrigger value="card">Fight Card</TabsTrigger>
            <TabsTrigger value="chat">
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="media">
              <ImageIcon className="w-4 h-4 mr-2" />
              Media
            </TabsTrigger>
          </TabsList>

          <TabsContent value="card" className="space-y-6">
            {mainEvent && (
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Badge className="bg-red-600">MAIN EVENT</Badge>
                </h2>
                <BoutCard bout={mainEvent} eventId={eventId} isOrganizer={isOrganizer} />
              </div>
            )}

            {coMain && (
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Badge variant="outline" className="border-zinc-700">CO-MAIN EVENT</Badge>
                </h2>
                <BoutCard bout={coMain} eventId={eventId} isOrganizer={isOrganizer} />
              </div>
            )}

            {undercard.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Undercard</h2>
                <div className="space-y-4">
                  {undercard.map(bout => (
                    <BoutCard key={bout.id} bout={bout} eventId={eventId} isOrganizer={isOrganizer} />
                  ))}
                </div>
              </div>
            )}

            {bouts.length === 0 && (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-12 text-center">
                  <Users className="w-16 h-16 mx-auto mb-4 text-zinc-700" />
                  <h3 className="text-lg font-semibold mb-2">No bouts yet</h3>
                  <p className="text-zinc-400 mb-4">The fight card is being built</p>
                  {isOrganizer && (
                    <Link to={createPageUrl(`CreateBout?event_id=${eventId}`)}>
                      <Button className="bg-red-600 hover:bg-red-700">
                        <Plus className="w-5 h-5 mr-2" />
                        Add First Bout
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="chat">
            <ChatPanel eventId={eventId} userId={user?.id} />
          </TabsContent>

          <TabsContent value="media">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-12 text-center">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 text-zinc-700" />
                <h3 className="text-lg font-semibold mb-2">Media gallery coming soon</h3>
                <p className="text-zinc-400">Photos and videos will appear here after the event</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {showWaiverDialog && (
        <WaiverDialog
          eventId={eventId}
          userId={user?.id}
          onClose={() => setShowWaiverDialog(false)}
          onSuccess={() => {
            setHasWaiver(true);
            setShowWaiverDialog(false);
            queryClient.invalidateQueries(["waivers", eventId]);
          }}
        />
      )}
    </div>
  );
}
