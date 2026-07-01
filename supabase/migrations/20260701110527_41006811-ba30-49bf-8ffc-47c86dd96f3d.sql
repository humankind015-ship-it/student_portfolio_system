
-- Ensure trigger on auth.users exists (creates profile + role on signup)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill missing profiles for existing auth users
INSERT INTO public.profiles (id, full_name)
SELECT u.id, COALESCE(u.raw_user_meta_data->>'full_name', u.email, '')
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL;

-- Backfill roles: first user (oldest) => head, rest => intern
WITH ranked AS (
  SELECT u.id, ROW_NUMBER() OVER (ORDER BY u.created_at ASC) AS rn
  FROM auth.users u
  LEFT JOIN public.user_roles r ON r.user_id = u.id
  WHERE r.user_id IS NULL
)
INSERT INTO public.user_roles (user_id, role)
SELECT id, CASE WHEN rn = 1 AND NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'head') THEN 'head'::app_role ELSE 'intern'::app_role END
FROM ranked;
