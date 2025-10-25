import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Shield, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function WaiverDialog({ eventId, userId, onClose, onSuccess }) {
  const [acknowledged, setAcknowledged] = useState(false);
  const [medicalCleared, setMedicalCleared] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSign = async () => {
    if (!acknowledged || !medicalCleared) return;
    
    setLoading(true);
    try {
      await base44.entities.Waiver.create({
        event_id: eventId,
        user_id: userId,
        signed_at: new Date().toISOString(),
        acknowledged_risks: true,
        medical_clearance: true,
        signature_data: `Digital signature by ${userId} at ${new Date().toISOString()}`
      });
      onSuccess();
    } catch (error) {
      console.error("Error signing waiver:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-zinc-800 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Shield className="w-6 h-6 text-red-500" />
            Event Waiver & Liability Release
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Please read and acknowledge before participating
          </DialogDescription>
        </DialogHeader>

        <Alert className="bg-yellow-950/50 border-yellow-800">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-yellow-200">
            This is a legally binding agreement. Please read carefully.
          </AlertDescription>
        </Alert>

        <div className="space-y-4 text-sm text-zinc-300">
          <div>
            <h4 className="font-bold text-white mb-2">Assumption of Risk</h4>
            <p>
              I understand that combat sports involve inherent risks including but not limited to: 
              bodily injury, broken bones, concussions, cuts, bruises, and in rare cases, serious 
              injury or death. I voluntarily choose to participate knowing these risks.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-2">Release of Liability</h4>
            <p>
              I hereby release, waive, and discharge the event organizers, venue owners, officials, 
              and all other participants from any and all liability for injuries or damages sustained 
              during this event, except in cases of gross negligence or willful misconduct.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-2">Medical Clearance</h4>
            <p>
              I confirm that I am in good physical condition and have no medical conditions that 
              would prevent me from safely participating. I have consulted with a physician if 
              necessary and have disclosed all relevant medical information to the organizer.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-2">Rules Compliance</h4>
            <p>
              I agree to follow all event rules, safety protocols, and instructions from officials. 
              I will wear all required protective equipment and will not participate under the 
              influence of alcohol or drugs.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-2">Emergency Treatment</h4>
            <p>
              I authorize event staff to seek emergency medical treatment on my behalf if necessary. 
              I am responsible for all medical costs incurred.
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-zinc-800">
          <div className="flex items-start gap-3">
            <Checkbox
              id="acknowledge"
              checked={acknowledged}
              onCheckedChange={setAcknowledged}
              className="mt-1"
            />
            <Label htmlFor="acknowledge" className="text-sm cursor-pointer">
              I have read, understand, and agree to the terms above. I acknowledge that I am 
              participating at my own risk and waive all claims against the organizers.
            </Label>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="medical"
              checked={medicalCleared}
              onCheckedChange={setMedicalCleared}
              className="mt-1"
            />
            <Label htmlFor="medical" className="text-sm cursor-pointer">
              I confirm that I am medically cleared to participate and have disclosed all 
              relevant health information to the organizer.
            </Label>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-zinc-700 hover:bg-zinc-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSign}
            disabled={!acknowledged || !medicalCleared || loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? "Signing..." : "Sign Waiver"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
