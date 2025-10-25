import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Image as ImageIcon, Video, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function MediaGallery() {
  const { data: media = [], isLoading } = useQuery({
    queryKey: ["media"],
    queryFn: () => base44.entities.Media.list("-created_date")
  });

  const { data: events = {} } = useQuery({
    queryKey: ["mediaEvents"],
    queryFn: async () => {
      const allEvents = await base44.entities.Event.list();
      return allEvents.reduce((acc, event) => {
        acc[event.id] = event;
        return acc;
      }, {});
    }
  });

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-8 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-black mb-2">Media Gallery</h1>
          <p className="text-zinc-400">Photos and videos from events</p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-square bg-zinc-900 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : media.length > 0 ? (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {media.map((item) => {
              const event = events[item.event_id];
              return (
                <Card key={item.id} className="bg-zinc-900 border-zinc-800 overflow-hidden group">
                  <div className="aspect-square relative overflow-hidden">
                    {item.media_type === "photo" ? (
                      <img
                        src={item.media_url}
                        alt={item.caption || "Event photo"}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                        <Video className="w-12 h-12 text-zinc-600" />
                      </div>
                    )}
                    <Badge
                      variant="secondary"
                      className="absolute top-2 right-2 bg-black/60 backdrop-blur"
                    >
                      {item.media_type === "photo" ? (
                        <ImageIcon className="w-3 h-3" />
                      ) : (
                        <Video className="w-3 h-3" />
                      )}
                    </Badge>
                  </div>
                  {item.caption && (
                    <CardContent className="p-3">
                      <p className="text-sm line-clamp-2">{item.caption}</p>
                      {event && (
                        <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {event.title}
                        </p>
                      )}
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-12 text-center">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 text-zinc-700" />
              <h3 className="text-lg font-semibold mb-2">No media yet</h3>
              <p className="text-zinc-400">
                Photos and videos from events will appear here
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
