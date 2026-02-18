"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toaster";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, CheckCircle, AlertCircle } from "lucide-react";

interface Props {
  initialSettings: Record<string, string>;
}

const AD_SLOTS = [
  { key: "top", label: "Top Banner", desc: "Above main content" },
  { key: "sidebar", label: "Sidebar", desc: "Right sidebar on desktop" },
  { key: "inContent", label: "In-Content", desc: "Between content sections" },
  { key: "footer", label: "Footer", desc: "Below main content" },
  { key: "mobileSticky", label: "Mobile Sticky", desc: "Bottom sticky on mobile" },
] as const;

export function AdsManagerClient({ initialSettings }: Props) {
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);

  const update = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/ads", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast({ title: "Settings saved", description: "Ad settings updated successfully." });
    } catch {
      toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" });
    }
    setSaving(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Ads Manager</h1>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save All Settings"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="slots">Ad Slots</TabsTrigger>
          <TabsTrigger value="adsense">AdSense</TabsTrigger>
          <TabsTrigger value="codes">Global Codes</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure your ad provider and global settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Ad Provider</Label>
                <Select
                  value={settings["ads.provider"] || "custom"}
                  onValueChange={(v) => update("ads.provider", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="adsense">Google AdSense</SelectItem>
                    <SelectItem value="adsterra">Adsterra</SelectItem>
                    <SelectItem value="monetag">Monetag</SelectItem>
                    <SelectItem value="hilltopads">HilltopAds</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  checked={settings["ads.enabled"] === "true"}
                  onCheckedChange={(v) => update("ads.enabled", v ? "true" : "false")}
                />
                <Label>Enable Ads Globally</Label>
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  checked={settings["ads.nonPersonalizedDefault"] === "true"}
                  onCheckedChange={(v) => update("ads.nonPersonalizedDefault", v ? "true" : "false")}
                />
                <Label>Non-Personalized Ads by Default (GDPR)</Label>
              </div>

              <div className="space-y-2">
                <Label>ads.txt Content</Label>
                <Textarea
                  value={settings["ads.adsTxtContent"] || ""}
                  onChange={(e) => update("ads.adsTxtContent", e.target.value)}
                  rows={4}
                  placeholder="google.com, pub-XXXX, DIRECT, f08c47fec0942fa0"
                />
                <p className="text-xs text-muted-foreground">
                  Content served at /ads.txt. For AdSense, the line is auto-generated from your pub ID.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ad Slots */}
        <TabsContent value="slots">
          <div className="space-y-4">
            {AD_SLOTS.map((slot) => (
              <Card key={slot.key}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">{slot.label}</CardTitle>
                      <CardDescription>{slot.desc}</CardDescription>
                    </div>
                    <Switch
                      checked={settings[`ads.slot.${slot.key}.enabled`] === "true"}
                      onCheckedChange={(v) =>
                        update(`ads.slot.${slot.key}.enabled`, v ? "true" : "false")
                      }
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <Label className="text-xs text-muted-foreground mb-2 block">
                    Ad HTML/Script Code
                  </Label>
                  <Textarea
                    value={settings[`ads.slot.${slot.key}.html`] || ""}
                    onChange={(e) =>
                      update(`ads.slot.${slot.key}.html`, e.target.value)
                    }
                    rows={4}
                    placeholder="Paste your ad code here..."
                    className="font-mono text-xs"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* AdSense */}
        <TabsContent value="adsense">
          <Card>
            <CardHeader>
              <CardTitle>Google AdSense Settings</CardTitle>
              <CardDescription>
                Configure AdSense-specific settings. These are used for verification and ads.txt.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Client ID (ca-pub-...)</Label>
                <Input
                  value={settings["ads.adsense.clientId"] || ""}
                  onChange={(e) => update("ads.adsense.clientId", e.target.value)}
                  placeholder="ca-pub-1234567890123456"
                />
                <p className="text-xs text-muted-foreground">
                  Used for the meta verification tag in page source.
                </p>
              </div>
              <div className="space-y-2">
                <Label>Publisher ID (pub-...)</Label>
                <Input
                  value={settings["ads.adsense.pubId"] || ""}
                  onChange={(e) => update("ads.adsense.pubId", e.target.value)}
                  placeholder="pub-1234567890123456"
                />
                <p className="text-xs text-muted-foreground">
                  Used for ads.txt auto-generation.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Global Codes */}
        <TabsContent value="codes">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Global Head HTML</CardTitle>
                <CardDescription>
                  Scripts/tags injected in the &lt;head&gt; of every page (e.g., ad network scripts)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={settings["ads.globalHeadHtml"] || ""}
                  onChange={(e) => update("ads.globalHeadHtml", e.target.value)}
                  rows={6}
                  placeholder='<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXX" crossorigin="anonymous"></script>'
                  className="font-mono text-xs"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Global Body HTML</CardTitle>
                <CardDescription>
                  Scripts/tags injected at the end of &lt;body&gt; on every page
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={settings["ads.globalBodyHtml"] || ""}
                  onChange={(e) => update("ads.globalBodyHtml", e.target.value)}
                  rows={6}
                  placeholder="Paste global body scripts here..."
                  className="font-mono text-xs"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Verification */}
        <TabsContent value="verification">
          <Card>
            <CardHeader>
              <CardTitle>Ad Verification Checklist</CardTitle>
              <CardDescription>Check the status of your ad setup</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <VerificationItem
                label="Ad Provider Configured"
                ok={!!settings["ads.provider"] && settings["ads.provider"] !== "custom"}
                detail={`Provider: ${settings["ads.provider"] || "none"}`}
              />
              <VerificationItem
                label="Ads Enabled"
                ok={settings["ads.enabled"] === "true"}
                detail={settings["ads.enabled"] === "true" ? "Enabled" : "Disabled"}
              />
              <VerificationItem
                label="AdSense Client ID"
                ok={!!settings["ads.adsense.clientId"]}
                detail={settings["ads.adsense.clientId"] || "Not set"}
              />
              <VerificationItem
                label="AdSense Publisher ID"
                ok={!!settings["ads.adsense.pubId"]}
                detail={settings["ads.adsense.pubId"] || "Not set"}
              />
              <VerificationItem
                label="ads.txt Content"
                ok={!!settings["ads.adsTxtContent"] || !!settings["ads.adsense.pubId"]}
                detail="Check /ads.txt endpoint"
              />
              <VerificationItem
                label="Global Head Script"
                ok={!!settings["ads.globalHeadHtml"]}
                detail={settings["ads.globalHeadHtml"] ? "Configured" : "Not set"}
              />
              <VerificationItem
                label="At Least One Slot Enabled"
                ok={AD_SLOTS.some((s) => settings[`ads.slot.${s.key}.enabled`] === "true")}
                detail={
                  AD_SLOTS.filter((s) => settings[`ads.slot.${s.key}.enabled`] === "true")
                    .map((s) => s.label)
                    .join(", ") || "None enabled"
                }
              />

              <div className="mt-6 p-4 bg-muted rounded-md">
                <h3 className="font-semibold text-sm mb-2">Current Head HTML Preview</h3>
                <pre className="text-xs overflow-x-auto whitespace-pre-wrap text-muted-foreground">
                  {settings["ads.globalHeadHtml"] || "(empty)"}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function VerificationItem({
  label,
  ok,
  detail,
}: {
  label: string;
  ok: boolean;
  detail: string;
}) {
  return (
    <div className="flex items-center gap-3">
      {ok ? (
        <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
      ) : (
        <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0" />
      )}
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{detail}</p>
      </div>
    </div>
  );
}
