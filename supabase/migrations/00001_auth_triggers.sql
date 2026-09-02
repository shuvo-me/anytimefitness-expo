-- Auto-create profiles row when a new user signs up via Supabase Auth.
-- This runs as SECURITY DEFINER so it bypasses RLS on insert.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', 'Member'),
    COALESCE((NEW.raw_user_meta_data ->> 'role')::user_role, 'member')
  );
  RETURN NEW;
END;
$$;

-- Also create a members row for new users (defaults to 'basic' tier, 'pending' status)
CREATE OR REPLACE FUNCTION public.handle_new_member()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.members (id, membership_tier, membership_status)
  VALUES (NEW.id, 'basic', 'pending');
  RETURN NEW;
END;
$$;

-- Trigger: on auth.users insert
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Trigger: on profiles insert (creates the members row)
CREATE OR REPLACE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  WHEN (NEW.role = 'member')
  EXECUTE FUNCTION public.handle_new_member();
