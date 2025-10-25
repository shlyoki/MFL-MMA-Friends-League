import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Trophy,
  Calendar,
  Shield,
  Target,
  Flame,
  Edit
} from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [fighter, setFighter] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
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

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 p-4 md:p-8 flex items-center justify-center">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-12 text-center">
            <User className="w-16 h-16 mx-auto mb-4 text-zinc-700" />
            <h3 className="text-lg font-semibold mb-2">Login required</h3>
            <Button
              onClick={() => base44.auth.redirectToLogin()}
              className="mt-4 bg-red-600 hover:bg-red-700"
            >
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-8 pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <Card className="bg-gradient-to-br from-red-950 to-zinc-900 border-zinc-800 mb-6">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="w-24 h-24 border-4 border-zinc-800">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-red-600 to-red-700 text-3xl">
                  {user.full_name?.[0] || user.email?.[0] || "U"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-black mb-2">
                  {user.full_name || user.email}
                </h1>
                {user.nickname && (
                  <p className="text-xl text-zinc-400 mb-3">"{user.nickname}"</p>
                )}
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge className="bg-red-600 capitalize">{user.role}</Badge>
                  {user.verified && (
                    <Badge variant="outline" className="border-green-600 text-green-400">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>

              <Button variant="outline" className="border-zinc-700 hover:bg-zinc-800">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Fighter Stats */}
        {fighter && (
          <>
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6 text-center">
                  <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                  <p className="text-2xl font-bold">{fighter.wins}</p>
                  <p className="text-sm text-zinc-400">Wins</p>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6 text-center">
                  <Target className="w-8 h-8 mx-auto mb-2 text-red-500" />
                  <p className="text-2xl font-bold">{fighter.losses}</p>
                  <p className="text-sm text-zinc-400">Losses</p>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6 text-center">
                  <Flame className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                  <p className="text-2xl font-bold">{fighter.ko_wins || 0}</p>
                  <p className="text-sm text-zinc-400">KO/TKO</p>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6 text-center">
                  <Target className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <p className="text-2xl font-bold">{fighter.submission_wins || 0}</p>
                  <p className="text-sm text-zinc-400">Subs</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle>Fighter Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-zinc-800 rounded-lg">
                    <p className="text-sm text-zinc-400 mb-1">Weight Class</p>
                    <p className="font-semibold capitalize">
                      {fighter.weight_class.replace(/_/g, " ")}
                    </p>
                  </div>

                  <div className="p-4 bg-zinc-800 rounded-lg">
                    <p className="text-sm text-zinc-400 mb-1">Stance</p>
                    <p className="font-semibold capitalize">{fighter.stance}</p>
                  </div>

                  <div className="p-4 bg-zinc-800 rounded-lg">
                    <p className="text-sm text-zinc-400 mb-1">Experience</p>
                    <p className="font-semibold capitalize">{fighter.experience_level}</p>
                  </div>

                  <div className="p-4 bg-zinc-800 rounded-lg">
                    <p className="text-sm text-zinc-400 mb-1">Status</p>
                    <Badge className={fighter.status === "active" ? "bg-green-600" : "bg-zinc-600"}>
                      {fighter.status}
                    </Badge>
                  </div>
                </div>

                {fighter.gym_team && (
                  <div className="p-4 bg-zinc-800 rounded-lg">
                    <p className="text-sm text-zinc-400 mb-1">Gym / Team</p>
                    <p className="font-semibold">{fighter.gym_team}</p>
                  </div>
                )}

                {fighter.preferred_rulesets && fighter.preferred_rulesets.length > 0 && (
                  <div className="p-4 bg-zinc-800 rounded-lg">
                    <p className="text-sm text-zinc-400 mb-2">Preferred Rulesets</p>
                    <div className="flex flex-wrap gap-2">
                      {fighter.preferred_rulesets.map((ruleset) => (
                        <Badge key={ruleset} variant="outline" className="border-zinc-700 uppercase">
                          {ruleset}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {!fighter && user.role === "fighter" && (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-12 text-center">
              <Shield className="w-16 h-16 mx-auto mb-4 text-zinc-700" />
              <h3 className="text-lg font-semibold mb-2">Create your fighter profile</h3>
              <p className="text-zinc-400 mb-4">
                Set up your profile to start competing
              </p>
              <Link to={createPageUrl("CreateFighterProfile")}>
                <Button className="bg-red-600 hover:bg-red-700">
                  Create Fighter Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
