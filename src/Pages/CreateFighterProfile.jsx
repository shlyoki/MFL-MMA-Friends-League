import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Shield } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function CreateFighterProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    weight_class: "lightweight",
    stance: "orthodox",
    experience_level: "beginner",
    gym_team: "",
    preferred_rulesets: [],
    emergency_contact_name: "",
    emergency_contact_phone: "",
    medical_notes: "",
    current_weight: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await base44.auth.me();
      
      const fighterData = {
        user_id: user.id,
        ...formData,
        current_weight: formData.current_weight ? parseFloat(formData.current_weight) : null,
        status: "active"
      };

      await base44.entities.Fighter.create(fighterData);
      navigate(createPageUrl("Profile"));
    } catch (err) {
      setError(err.message || "Failed to create fighter profile");
    } finally {
      setLoading(false);
    }
  };

  const handleRulesetToggle = (ruleset) => {
    setFormData(prev => ({
      ...prev,
      preferred_rulesets: prev.preferred_rulesets.includes(ruleset)
        ? prev.preferred_rulesets.filter(r => r !== ruleset)
        : [...prev.preferred_rulesets, ruleset]
    }));
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-8 pb-24 md:pb-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-black mb-2">Create Fighter Profile</h1>
          <p className="text-zinc-400">Set up your fighter profile to start competing</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6 bg-red-950 border-red-800">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Card className="bg-zinc-900 border-zinc-800 mb-6">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription className="text-zinc-400">
                Your fighting stats and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weight_class">Weight Class</Label>
                  <Select
                    value={formData.weight_class}
                    onValueChange={(value) => setFormData({...formData, weight_class: value})}
                  >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="strawweight">Strawweight (115 lbs)</SelectItem>
                      <SelectItem value="flyweight">Flyweight (125 lbs)</SelectItem>
                      <SelectItem value="bantamweight">Bantamweight (135 lbs)</SelectItem>
                      <SelectItem value="featherweight">Featherweight (145 lbs)</SelectItem>
                      <SelectItem value="lightweight">Lightweight (155 lbs)</SelectItem>
                      <SelectItem value="welterweight">Welterweight (170 lbs)</SelectItem>
                      <SelectItem value="middleweight">Middleweight (185 lbs)</SelectItem>
                      <SelectItem value="light_heavyweight">Light Heavyweight (205 lbs)</SelectItem>
                      <SelectItem value="heavyweight">Heavyweight (265 lbs)</SelectItem>
                      <SelectItem value="super_heavyweight">Super Heavyweight (265+ lbs)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="current_weight">Current Weight (lbs)</Label>
                  <Input
                    id="current_weight"
                    type="number"
                    value={formData.current_weight}
                    onChange={(e) => setFormData({...formData, current_weight: e.target.value})}
                    className="bg-zinc-800 border-zinc-700"
                    placeholder="155"
                  />
                </div>

                <div>
                  <Label htmlFor="stance">Stance</Label>
                  <Select
                    value={formData.stance}
                    onValueChange={(value) => setFormData({...formData, stance: value})}
                  >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="orthodox">Orthodox</SelectItem>
                      <SelectItem value="southpaw">Southpaw</SelectItem>
                      <SelectItem value="switch">Switch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="experience_level">Experience Level</Label>
                  <Select
                    value={formData.experience_level}
                    onValueChange={(value) => setFormData({...formData, experience_level: value})}
                  >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner (0-3 fights)</SelectItem>
                      <SelectItem value="intermediate">Intermediate (4-10 fights)</SelectItem>
                      <SelectItem value="advanced">Advanced (10+ fights)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="gym_team">Gym / Team (Optional)</Label>
                <Input
                  id="gym_team"
                  value={formData.gym_team}
                  onChange={(e) => setFormData({...formData, gym_team: e.target.value})}
                  className="bg-zinc-800 border-zinc-700"
                  placeholder="Your gym or team name"
                />
              </div>

              <div>
                <Label className="mb-3 block">Preferred Rulesets</Label>
                <div className="flex flex-wrap gap-2">
                  {["mma", "boxing", "kickboxing", "grappling"].map((ruleset) => (
                    <Button
                      key={ruleset}
                      type="button"
                      variant={formData.preferred_rulesets.includes(ruleset) ? "default" : "outline"}
                      className={formData.preferred_rulesets.includes(ruleset) 
                        ? "bg-red-600 hover:bg-red-700" 
                        : "border-zinc-700 hover:bg-zinc-800"}
                      onClick={() => handleRulesetToggle(ruleset)}
                    >
                      {ruleset.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-500" />
                Safety & Emergency Contact
              </CardTitle>
              <CardDescription className="text-zinc-400">
                This information is private and only shared with event organizers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emergency_contact_name">Emergency Contact Name *</Label>
                  <Input
                    id="emergency_contact_name"
                    value={formData.emergency_contact_name}
                    onChange={(e) => setFormData({...formData, emergency_contact_name: e.target.value})}
                    className="bg-zinc-800 border-zinc-700"
                    required
                    placeholder="Full name"
                  />
                </div>

                <div>
                  <Label htmlFor="emergency_contact_phone">Emergency Contact Phone *</Label>
                  <Input
                    id="emergency_contact_phone"
                    type="tel"
                    value={formData.emergency_contact_phone}
                    onChange={(e) => setFormData({...formData, emergency_contact_phone: e.target.value})}
                    className="bg-zinc-800 border-zinc-700"
                    required
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="medical_notes">Medical Notes (Optional)</Label>
                <Textarea
                  id="medical_notes"
                  value={formData.medical_notes}
                  onChange={(e) => setFormData({...formData, medical_notes: e.target.value})}
                  className="bg-zinc-800 border-zinc-700"
                  placeholder="Any injuries, conditions, or medical considerations..."
                  rows={3}
                />
                <p className="text-xs text-zinc-500 mt-1">
                  This information is confidential and only visible to event organizers
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-zinc-700 hover:bg-zinc-800"
              onClick={() => navigate(createPageUrl("Home"))}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              {loading ? "Creating..." : "Create Profile"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
