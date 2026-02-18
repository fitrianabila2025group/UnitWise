import prisma from "@/lib/db";

export async function AdsHead() {
  let headHtml = "";

  try {
    const globalHead = await prisma.adSetting.findUnique({
      where: { key: "ads.globalHeadHtml" },
    });
    headHtml = globalHead?.value || "";
  } catch {
    // DB not available
  }

  if (!headHtml) return null;

  return <>{headHtml && <div dangerouslySetInnerHTML={{ __html: headHtml }} />}</>;
}
