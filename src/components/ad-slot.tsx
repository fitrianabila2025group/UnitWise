import prisma from "@/lib/db";

interface AdSlotProps {
  slot: "top" | "sidebar" | "inContent" | "footer" | "mobileSticky";
  className?: string;
}

export async function AdSlot({ slot, className }: AdSlotProps) {
  let enabled = false;
  let html = "";

  try {
    const enabledSetting = await prisma.adSetting.findUnique({
      where: { key: `ads.slot.${slot}.enabled` },
    });
    const htmlSetting = await prisma.adSetting.findUnique({
      where: { key: `ads.slot.${slot}.html` },
    });

    enabled = enabledSetting?.value === "true";
    html = htmlSetting?.value || "";
  } catch {
    return null;
  }

  if (!enabled || !html) return null;

  return (
    <div
      className={className}
      style={{ minHeight: slot === "mobileSticky" ? "50px" : "90px" }}
      data-ad-slot={slot}
    >
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
