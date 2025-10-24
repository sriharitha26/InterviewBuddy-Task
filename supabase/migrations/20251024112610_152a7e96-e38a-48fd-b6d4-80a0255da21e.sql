-- Drop the admin-only insert policy for organizations
DROP POLICY IF EXISTS "Admins can insert organizations" ON public.organizations;

-- Create new policy allowing any authenticated user to insert organizations
CREATE POLICY "Authenticated users can insert organizations"
  ON public.organizations FOR INSERT
  TO authenticated
  WITH CHECK (true);