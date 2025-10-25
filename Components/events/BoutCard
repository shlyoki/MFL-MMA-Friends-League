import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Award } from "lucide-react";

export default function BoutCard({ bout, eventId, isOrganizer }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed": return "bg-green-600/20 text-green-400 border-green-600/30";
      case "in_progress": return "bg-blue-600/20 text-blue-400 border-blue-600/30";
      case "completed": return "bg-zinc-600/20 text-zinc-400 border-zinc-600/30";
      case "proposed": return "bg-yellow-600/20 text-yellow-400 border-yellow-600/30";
      default: return "bg-zinc-600/20 text-zinc-400 border-zinc-600/30";
    }
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800 hover:border-red-600/50 transition-all">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Red Corner */}
          <div className="flex-1 text-center md:text-right">
            <div className="inline-flex items-center gap-2 mb-2">
              <Badge className="bg-red-600">RED</Badge>
            </div>
            <h3 className="text-2xl font-bold mb-2">
              Fighter #{bout.red_fighter_id.slice(0, 8)}
            </h3>
            {bout.status === "completed" && bout.winner_id === bout.red_fighter_id && (
              <Badge className="bg-yellow-500 text-black">
                <Award className="w-3 h-3 mr-1" />
                WINNER
              </Badge>
            )}
          </div>

          {/* VS Section */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center">
              <span className="text-2xl font-black">VS</span>
            </div>
            <div className="text-center">
              <Badge variant="secondary" className={getStatusColor(bout.status)}>
                {bout.status}
              </Badge>
              <div className="text-sm text-zinc-400 mt-2">
                {bout.rounds} x {bout.round_length_minutes} min
              </div>
              <div className="text-xs text-zinc-500 capitalize">
                {bout.ruleset}
              </div>
            </div>
          </div>

          {/* Blue Corner */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 mb-2">
              <Badge className="bg-blue-600">BLUE</Badge>
            </div>
            <h3 className="text-2xl font-bold mb-2">
              Fighter #{bout.blue_fighter_id.slice(0, 8)}
            </h3>
            {bout.status === "completed" && bout.winner_id === bout.blue_fighter_id && (
              <Badge className="bg-yellow-500 text-black">
                <Award className="w-3 h-3 mr-1" />
                WINNER
              </Badge>
            )}
          </div>
        </div>

        {/* Result Details */}
        {bout.status === "completed" && bout.result && (
          <div className="mt-6 pt-6 border-t border-zinc-800 text-center">
            <p className="text-sm text-zinc-400">
              Result: <span className="text-white font-bold">{bout.result}</span>
              {bout.method && <span className="ml-2">by {bout.method}</span>}
              {bout.round_finished && (
                <span className="ml-2">
                  Round {bout.round_finished}
                  {bout.time_finished && ` at ${bout.time_finished}`}
                </span>
              )}
            </p>
          </div>
        )}

        {/* Acceptance Status */}
        {bout.status === "proposed" && (
          <div className="mt-6 pt-6 border-t border-zinc-800">
            <div className="flex justify-around text-sm">
              <div className="flex items-center gap-2">
                <span className="text-zinc-400">Red Corner:</span>
                {bout.red_accepted ? (
                  <Badge className="bg-green-600">Accepted</Badge>
                ) : (
                  <Badge variant="outline" className="border-zinc-700">Pending</Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-zinc-400">Blue Corner:</span>
                {bout.blue_accepted ? (
                  <Badge className="bg-green-600">Accepted</Badge>
                ) : (
                  <Badge variant="outline" className="border-zinc-700">Pending</Badge>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
