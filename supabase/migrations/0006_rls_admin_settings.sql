-- RLS for admin_settings (admin-only).
-- Hand-authored: drizzle-kit cannot express RLS policies.

-- Helper: is the current user an admin? SECURITY DEFINER so it can read
-- profiles regardless of RLS. STABLE since it only reads.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Security gate: only admins may read/write the global settings row.
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_select_settings" ON public.admin_settings;
CREATE POLICY "admin_select_settings"
  ON public.admin_settings
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "admin_insert_settings" ON public.admin_settings;
CREATE POLICY "admin_insert_settings"
  ON public.admin_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admin_update_settings" ON public.admin_settings;
CREATE POLICY "admin_update_settings"
  ON public.admin_settings
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Seed the single default settings row (one global row; upsert pattern uses ON CONFLICT).
INSERT INTO public.admin_settings (value)
SELECT '{
  "admin": {
    "name": "Alex Morgan",
    "email": "alex.morgan@ironcladgym.com",
    "phone": "+1 (555) 789-0142",
    "title": "Director of Operations & Head Coach",
    "gymBranch": "Ironclad Athletic Lab - Downtown Flagship",
    "bio": "",
    "certifications": ["CSCS", "NASM-CPT"],
    "shiftHours": "06:00 AM - 02:00 PM",
    "securityPin": "4829",
    "twoFactorEnabled": true,
    "emergencyContact": { "name": "", "phone": "", "relation": "" }
  },
  "facility": {
    "facilityName": "Ironclad Athletic Lab - Downtown Flagship",
    "facilityAddress": "400 Grand Ave, Suite 100, Austin, TX 78701",
    "facilityPhone": "+1 (555) 800-4766",
    "facilityEmail": "operations@ironcladgym.com",
    "operatingHours": "05:00 AM - 11:00 PM (Mon - Sun)",
    "maxFloorCapacity": 50,
    "peakOccupancyAlertThreshold": 85,
    "currencySymbol": "৳",
    "taxRatePercent": 8.25,
    "pricing": {
      "basic": { "monthly": 700, "yearly": 8000 },
      "premium": { "monthly": 1000, "yearly": 12000 }
    },
    "amenities": {
      "lockers": true,
      "sauna": true,
      "coldPlunge": true,
      "juiceBar": true,
      "towelService": true,
      "personalTraining": true
    },
    "notifications": {
      "overduePaymentReminders": true,
      "peakCapacityAlerts": true,
      "dailyExecutiveDigest": true,
      "instantOnboardingAlerts": true
    },
    "gateAccess": {
      "qrScannerSensitivity": "instant",
      "autoCheckoutHours": 4,
      "guestPassAllowed": true
    },
    "stripeMode": "live"
  }
}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.admin_settings);
