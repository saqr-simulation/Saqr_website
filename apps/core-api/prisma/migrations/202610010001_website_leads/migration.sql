CREATE TABLE "WebsiteLead" (
  "id" SERIAL NOT NULL,
  "kind" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "phone" TEXT,
  "profile" JSONB NOT NULL,
  "referralCode" TEXT NOT NULL,
  "referredBy" TEXT,
  "consentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "WebsiteLead_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "WebsiteLead_referralCode_key" ON "WebsiteLead"("referralCode");
CREATE UNIQUE INDEX "WebsiteLead_kind_email_key" ON "WebsiteLead"("kind", "email");
CREATE INDEX "WebsiteLead_kind_createdAt_idx" ON "WebsiteLead"("kind", "createdAt");
ALTER TABLE "WebsiteLead" ENABLE ROW LEVEL SECURITY;
