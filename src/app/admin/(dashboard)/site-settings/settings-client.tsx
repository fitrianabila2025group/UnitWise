"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toaster";
import { Save } from "lucide-react";

interface Props {
  initialSettings: Record<string, string>;
}

const FIELDS = [
  { key: "site.url", label: "Site URL", type: "input", placeholder: "https://unitwise.online" },
  { key: "site.name", label: "Site Name", type: "input", placeholder: "UnitWise" },
  { key: "site.tagline", label: "Tagline", type: "input", placeholder: "Free Online Unit Converter Hub" },
  { key: "site.description", label: "Description", type: "textarea", placeholder: "Site description for SEO..." },
  { key: "site.logo", label: "Logo Path", type: "input", placeholder: "/logo.svg" },
];

export function SiteSettingsClient({ initialSettings }: Props) {
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Failed");
      toast({ title: "Saved", description: "Site settings updated." });
    } catch {
      toast({ title: "Error", description: "Failed to save.", variant: "destructive" });
    }
    setSaving(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Site Settings</h1>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {FIELDS.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label>{field.label}</Label>
              {field.type === "textarea" ? (
                <Textarea
                  value={settings[field.key] || ""}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, [field.key]: e.target.value }))
                  }
                  placeholder={field.placeholder}
                  rows={3}
                />
              ) : (
                <Input
                  value={settings[field.key] || ""}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, [field.key]: e.target.value }))
                  }
                  placeholder={field.placeholder}
                />
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
