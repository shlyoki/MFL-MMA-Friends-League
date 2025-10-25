import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Trophy, Target, Shield, Filter } from "lucide-react";

export default function Fighters() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterWeightClass, setFilterWeightClass] = useState("all");
  const [filterExperience, setFilterExperience] = useState("all");

  const { data: fighters = [], isLoading } = useQuery({
    queryKey: ["fighters"],
    queryFn: () => base44.entities.Fighter.list("-wins")
  });

  const { data: users = {} } = useQuery({
    queryKey: ["fighterUsers"],
    queryFn: async () => {
      const allUsers = await base44.entities.User.list();
      return allUsers.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
      }, {});
    }
  });

  const filteredFighters = fighters.filter(fighter => {
    const user = users[fighter.user_id];
    const matchesSearch = 
      user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.nickname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fighter.gym_team?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWeight = filterWeightClass === "all" || fighter.weight_class === filterWeightClass;
    const matchesExperience = filterExperience === "all" || fighter.experience_level === filterExperience;
    return matchesSearch && matchesWeight && matchesExperience;
  });

  const getRecordColor = (wins, losses) => {
    if (losses === 0 && wins > 0) return "text-green-500";
    if (wins > losses) return "text-green-400";
    if (wins === losses) return "text-yellow-500";
    return "text-red-400";
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-8 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-black mb-2">Fighters</h1>
          <p className="text-zinc-400">Browse the league roster</p>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <Input
              placeholder="Search fighters by name, nickname, or gym..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-zinc-900 border-zinc-800"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Select value={filterWeightClass} onValueChange={setFilterWeightClass}>
              <SelectTrigger className="bg-zinc-900 border-zinc-800">
                <SelectValue placeholder="All Weight Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Weight Classes</SelectItem>
                <SelectItem value="strawweight">Strawweight</SelectItem>
                <SelectItem value="flyweight">Flyweight</SelectItem>
                <SelectItem value="bantamweight">Bantamweight</SelectItem>
                <SelectItem value="featherweight">Featherweight</SelectItem>
                <SelectItem value="lightweight">Lightweight</SelectItem>
                <SelectItem value="welterweight">Welterweight</SelectItem>
                <SelectItem value="middleweight">Middleweight</SelectItem>
                <SelectItem value="light_heavyweight">Light Heavyweight</SelectItem>
                <SelectItem value="heavyweight">Heavyweight</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterExperience} onValueChange={setFilterExperience}>
              <SelectTrigger className="bg-zinc-900 border-zinc-800">
                <SelectValue placeholder="All Experience Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Experience Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Fighters Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="bg-zinc-900 border-zinc-800 animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-zinc-800 rounded-full" />
                    <div className="flex-1">
                      <div className="h-5 bg-zinc-800 rounded mb-2" />
                      <div className="h-4 bg-zinc-800 rounded w-3/4" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-zinc-800 rounded" />
                    <div className="h-4 bg-zinc-800 rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredFighters.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFighters.map((fighter) => {
              const user = users[fighter.user_id];
              const totalFights = fighter.wins + fighter.losses + (fighter.draws || 0);
              
              return (
                <Card key={fighter.id} className="bg-zinc-900 border-zinc-800 hover:border-red-600/50 transition-all group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="w-16 h-16 border-2 border-zinc-800 group-hover:border-red-600 transition-colors">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-red-600 to-red-700 text-lg">
                          {user?.full_name?.[0] || user?.email?.[0] || "F"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold truncate group-hover:text-red-500 transition-colors">
                          {user?.full_name || "Fighter"}
                        </h3>
                        {user?.nickname && (
                          <p className="text-sm text-zinc-400 truncate">"{user.nickname}"</p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="border-zinc-700 text-xs capitalize">
                            {fighter.stance}
                          </Badge>
                          {fighter.status === "active" && (
                            <Badge className="bg-green-600/20 text-green-400 border-green-600/30 text-xs">
                              Active
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm text-zinc-400">Record</span>
                        </div>
                        <span className={`font-bold ${getRecordColor(fighter.wins, fighter.losses)}`}>
                          {fighter.wins}-{fighter.losses}-{fighter.draws || 0}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-zinc-400" />
                          <span className="text-sm text-zinc-400">Weight Class</span>
                        </div>
                        <span className="text-sm font-semibold capitalize">
                          {fighter.weight_class.replace(/_/g, " ")}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-zinc-400" />
                          <span className="text-sm text-zinc-400">Experience</span>
                        </div>
                        <span className="text-sm font-semibold capitalize">
                          {fighter.experience_level}
                        </span>
                      </div>

                      {fighter.gym_team && (
                        <div className="text-center p-2 bg-zinc-800/50 rounded text-xs text-zinc-400">
                          {fighter.gym_team}
                        </div>
                      )}

                      {fighter.preferred_rulesets && fighter.preferred_rulesets.length > 0 && (
                        <div className="flex flex-wrap gap-1 justify-center">
                          {fighter.preferred_rulesets.map((ruleset) => (
                            <Badge key={ruleset} variant="outline" className="border-zinc-700 text-xs uppercase">
                              {ruleset}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-12 text-center">
              <Shield className="w-16 h-16 mx-auto mb-4 text-zinc-700" />
              <h3 className="text-lg font-semibold mb-2">No fighters found</h3>
              <p className="text-zinc-400">
                {searchTerm ? "Try adjusting your search or filters" : "Be the first to create a fighter profile"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
