
CREATE POLICY "Heads can insert roles" ON public.user_roles
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'head'));

CREATE POLICY "Heads can update roles" ON public.user_roles
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'head'))
  WITH CHECK (public.has_role(auth.uid(), 'head'));

CREATE POLICY "Heads can delete roles" ON public.user_roles
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'head'));
