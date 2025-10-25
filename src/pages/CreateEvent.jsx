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
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, Calendar, MapPin, Settings } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function CreateEvent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date_time: "",
    location: "",
    visibility: "public",
    ruleset_default: "mma",
    equipment_requirements: ["mouthguard", "gloves"],
    max_bouts: 10,
    min_age: 18,
    paid_event: false,
    ticket_price: 0,
    rsvp_limit: 100,
    status: "draft"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await base44.auth.me();
      
      if (user.role !== "organizer") {
        throw new Error("Only organizers can create events");
      }

      const eventData = {
        ...formData,
        organizer_id: user.id,
        max_bouts: parseInt(formData.max_bouts),
        min_age: parseInt(formData.min_age),
        ticket_price: formData.paid_event ? parseFloat(formData.ticket_price) : 0,
        rsvp_limit: parseInt(formData.rsvp_limit)
      };

      const newEvent = await base44.entities.Event.create(eventData);
      navigate(createPageUrl(`EventDetails?id=${newEvent.id}`));
    } catch (err) {
      setError(err.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  const handleEquipmentToggle = (equipment) => {
    setFormData(prev => ({
      ...prev,
      equipment_requirements: prev.equipment_requirements.includes(equipment)
        ? prev.equipment_requirements.filter(e => e !== equipment)
        : [...prev.equipment_requirements, equipment]
    }));
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-8 pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-black mb-2">Create Event</h1>
          <p className="text-zinc-400">Set up your fight event</p>
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
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-red-500" />
                Event Details
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Basic information about your event
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="bg-zinc-800 border-zinc-700"
                  required
                  placeholder="Friday Night Fights"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="bg-zinc-800 border-zinc-700"
                  placeholder="Tell fighters what to expect..."
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date_time">Date & Time *</Label>
                  <Input
                    id="date_time"
                    type="datetime-local"
                    value={formData.date_time}
                    onChange={(e) => setFormData({...formData, date_time: e.target.value})}
                    className="bg-zinc-800 border-zinc-700"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="bg-zinc-800 border-zinc-700"
                    required
                    placeholder="123 Fight St, City, State"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="visibility">Visibility</Label>
                  <Select
                    value={formData.visibility}
                    onValueChange={(value) => setFormData({...formData, visibility: value})}
                  >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - Anyone can see</SelectItem>
                      <SelectItem value="unlisted">Unlisted - Link only</SelectItem>
                      <SelectItem value="private">Private - Invite only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({...formData, status: value})}
                  >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-red-500" />
                Rules & Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="ruleset_default">Default Ruleset</Label>
                  <Select
                    value={formData.ruleset_default}
                    onValueChange={(value) => setFormData({...formData, ruleset_default: value})}
                  >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mma">MMA</SelectItem>
                      <SelectItem value="boxing">Boxing</SelectItem>
                      <SelectItem value="kickboxing">Kickboxing</SelectItem>
                      <SelectItem value="grappling">Grappling</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="max_bouts">Max Bouts</Label>
                  <Input
                    id="max_bouts"
                    type="number"
                    value={formData.max_bouts}
                    onChange={(e) => setFormData({...formData, max_bouts: e.target.value})}
                    className="bg-zinc-800 border-zinc-700"
                    min="1"
                  />
                </div>

                <div>
                  <Label htmlFor="min_age">Minimum Age</Label>
                  <Input
                    id="min_age"
                    type="number"
                    value={formData.min_age}
                    onChange={(e) => setFormData({...formData, min_age: e.target.value})}
                    className="bg-zinc-800 border-zinc-700"
                    min="16"
                  />
                </div>
              </div>

              <div>
                <Label className="mb-3 block">Required Equipment</Label>
                <div className="flex flex-wrap gap-3">
                  {["mouthguard", "gloves", "headgear", "shin_guards", "cup"].map((equipment) => (
                    <div key={equipment} className="flex items-center gap-2">
                      <Checkbox
                        checked={formData.equipment_requirements.includes(equipment)}
                        onCheckedChange={() => handleEquipmentToggle(equipment)}
                        className="border-zinc-700"
                      />
                      <label className="text-sm capitalize cursor-pointer">
                        {equipment.replace(/_/g, " ")}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="rsvp_limit">RSVP Limit</Label>
                <Input
                  id="rsvp_limit"
                  type="number"
                  value={formData.rsvp_limit}
                  onChange={(e) => setFormData({...formData, rsvp_limit: e.target.value})}
                  className="bg-zinc-800 border-zinc-700"
                  placeholder="100"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 mb-6">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3 mb-4">
                <Checkbox
                  checked={formData.paid_event}
                  onCheckedChange={(checked) => setFormData({...formData, paid_event: checked})}
                  className="border-zinc-700 mt-1"
                />
                <div>
                  <Label>Paid Event</Label>
                  <p className="text-sm text-zinc-400">Charge an entry fee for spectators</p>
                </div>
              </div>

              {formData.paid_event && (
                <div>
                  <Label htmlFor="ticket_price">Ticket Price ($)</Label>
                  <Input
                    id="ticket_price"
                    type="number"
                    step="0.01"
                    value={formData.ticket_price}
                    onChange={(e) => setFormData({...formData, ticket_price: e.target.value})}
                    className="bg-zinc-800 border-zinc-700"
                    placeholder="10.00"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-zinc-700 hover:bg-zinc-800"
              onClick={() => navigate(createPageUrl("Events"))}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              {loading ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
