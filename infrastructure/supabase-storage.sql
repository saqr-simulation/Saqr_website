-- Run in the Supabase SQL editor when provisioning the project.
-- Private by default. Browser uploads/downloads remain unavailable in Week 1.
insert into storage.buckets (id, name, public)
values ('course-resources', 'course-resources', false)
on conflict (id) do update set public = false;
-- No permissive object policies. Future NestJS routes must authorize the user,
-- verify enrollment/role, and issue short-lived signed URLs server-side.
