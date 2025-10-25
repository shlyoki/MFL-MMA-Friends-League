import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, TrendingUp, Flame, Target, Medal } from "lucide-react";

export default function Leaderboard() {
  const [selectedRuleset, setSelectedRuleset] = useState("mma");
  const [selectedWeightClass, setSelectedWeightClass] = useState("all");

  const { data: fighters = [] } = useQuery({
    queryKey: ["leaderboardFighters"],
    queryFn: () => base44.entities.Fighter.list("-wins")
  });

  const { data: users = {} } = useQuery({
    queryKey: ["leaderboardUsers"],
    queryFn: async () => {
      const allUsers = await base44.entities.User.list();
      return allUsers.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
      }, {});
    }
  });

  const filteredFighters = fighters.filter(fighter => {
    if (selectedWeightClass === "all") return true;
    return fighter.weight_class === selectedWeightClass;
  });

  const getWinRate = (fighter) => {
    const total = fighter.wins + fighter.losses;
    if (total === 0) return 0;
    return ((fighter.wins / total) * 100).toFixed(1);
  };

  const getFinishRate = (fighter) => {
    if (fighter.wins === 0) return 0;
    const finishes = (fighter.ko_wins || 0) + (fighter.submission_wins || 0);
    return ((finishes / fighter.wins) * 100).toFixed(1);
  };

  const getRankIcon = (index) => {
    if (index === 0) return { icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-500/20" };
    if (index === 1) return { icon: Medal, color: "text-zinc-300", bg: "bg-zinc-400/20" };
    if (index === 2) return { icon: Medal, color: "text-amber-700", bg: "bg-amber-700/20" };
    return { icon: Target, color: "text-zinc-500", bg: "bg-zinc-700/20" };
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-8 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-black mb-2">Leaderboard</h1>
          <p className="text-zinc-400">Top fighters in the league</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-yellow-950 to-zinc-900 border-yellow-800/50">
            <CardContent className="p-6">
              <Trophy className="w-8 h-8 text-yellow-500 mb-3" />
              <p className="text-3xl font-bold">{fighters.filter(f => f.wins > 0).length}</p>
              <p className="text-sm text-zinc-400">Active Winners</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-950 to-zinc-900 border-red-800/50">
            <CardContent className="p-6">
              <Flame className="w-8 h-8 text-red-500 mb-3" />
              <p className="text-3xl font-bold">
                {fighters.reduce((sum, f) => sum + (f.ko_wins || 0), 0)}
              </p>
              <p className="text-sm text-zinc-400">Total KOs</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-950 to-zinc-900 border-blue-800/50">
            <CardContent className="p-6">
              <Target className="w-8 h-8 text-blue-500 mb-3" />
              <p className="text-3xl font-bold">
                {fighters.reduce((sum, f) => sum + (f.submission_wins || 0), 0)}
              </p>
              <p className="text-sm text-zinc-400">Total Subs</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-950 to-zinc-900 border-purple-800/50">
            <CardContent className="p-6">
              <TrendingUp className="w-8 h-8 text-purple-500 mb-3" />
              <p className="text-3xl font-bold">
                {fighters.reduce((sum, f) => sum + f.wins + f.losses + (f.draws || 0), 0)}
              </p>
              <p className="text-sm text-zinc-400">Total Bouts</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-zinc-900 border border-zinc-800 mb-6">
            <TabsTrigger value="all" onClick={() => setSelectedWeightClass("all")}>
              All Divisions
            </TabsTrigger>
            <TabsTrigger value="lightweight" onClick={() => setSelectedWeightClass("lightweight")}>
              Lightweight
            </TabsTrigger>
            <TabsTrigger value="welterweight" onClick={() => setSelectedWeightClass("welterweight")}>
              Welterweight
            </TabsTrigger>
            <TabsTrigger value="middleweight" onClick={() => setSelectedWeightClass("middleweight")}>
              Middleweight
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedWeightClass}>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Rankings - {selectedWeightClass === "all" ? "All Weight Classes" : selectedWeightClass.charAt(0).toUpperCase() + selectedWeightClass.slice(1)}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-zinc-800">
                  {filteredFighters.length > 0 ? (
                    filteredFighters.map((fighter, index) => {
                      const user = users[fighter.user_id];
                      const rankInfo = getRankIcon(index);
                      const RankIcon = rankInfo.icon;

                      return (
                        <div
                          key={fighter.id}
                          className="p-6 hover:bg-zinc-800/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            {/* Rank */}
                            <div className={`w-12 h-12 rounded-full ${rankInfo.bg} flex items-center justify-center flex-shrink-0`}>
                              {index < 3 ? (
                                <RankIcon className={`w-6 h-6 ${rankInfo.color}`} />
                              ) : (
                                <span className="text-lg font-bold text-zinc-400">
                                  {index + 1}
                                </span>
                              )}
                            </div>

                            {/* Fighter Info */}
                            <Avatar className="w-12 h-12 border-2 border-zinc-800">
                              <AvatarImage src={user?.avatar} />
                              <AvatarFallback className="bg-gradient-to-br from-red-600 to-red-700">
                                {user?.full_name?.[0] || "F"}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold truncate">
                                {user?.full_name || "Fighter"}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-zinc-400">
                                <span className="capitalize">{fighter.weight_class.replace(/_/g, " ")}</span>
                                <span>•</span>
                                <span className="capitalize">{fighter.stance}</span>
                              </div>
                            </div>

                            {/* Stats */}
                            <div className="hidden md:grid md:grid-cols-3 gap-6 text-center">
                              <div>
                                <p className="text-2xl font-bold text-green-500">
                                  {fighter.wins}-{fighter.losses}-{fighter.draws || 0}
                                </p>
                                <p className="text-xs text-zinc-400">Record</p>
                              </div>

                              <div>
                                <p className="text-2xl font-bold">
                                  {getWinRate(fighter)}%
                                </p>
                                <p className="text-xs text-zinc-400">Win Rate</p>
                              </div>

                              <div>
                                <p className="text-2xl font-bold text-red-500">
                                  {getFinishRate(fighter)}%
                                </p>
                                <p className="text-xs text-zinc-400">Finish Rate</p>
                              </div>
                            </div>

                            {/* Badges */}
                            <div className="flex flex-col gap-1">
                              {fighter.ko_wins > 0 && (
                                <Badge variant="outline" className="border-red-600/30 text-red-400 text-xs">
                                  <Flame className="w-3 h-3 mr-1" />
                                  {fighter.ko_wins} KO
                                </Badge>
                              )}
                              {fighter.submission_wins > 0 && (
                                <Badge variant="outline" className="border-blue-600/30 text-blue-400 text-xs">
                                  <Target className="w-3 h-3 mr-1" />
                                  {fighter.submission_wins} Sub
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Mobile Stats */}
                          <div className="md:hidden mt-4 grid grid-cols-3 gap-3 text-center">
                            <div className="p-2 bg-zinc-800 rounded">
                              <p className="font-bold text-green-500">
                                {fighter.wins}-{fighter.losses}
                              </p>
                              <p className="text-xs text-zinc-400">Record</p>
                            </div>
                            <div className="p-2 bg-zinc-800 rounded">
                              <p className="font-bold">{getWinRate(fighter)}%</p>
                              <p className="text-xs text-zinc-400">Win Rate</p>
                            </div>
                            <div className="p-2 bg-zinc-800 rounded">
                              <p className="font-bold text-red-500">{getFinishRate(fighter)}%</p>
                              <p className="text-xs text-zinc-400">Finishes</p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-12 text-center text-zinc-500">
                      <Trophy className="w-16 h-16 mx-auto mb-4 opacity-20" />
                      <p>No fighters in this division yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
