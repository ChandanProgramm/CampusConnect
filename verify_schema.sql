-- ==============================================================================
-- CampusConnect Supabase Verification Script
-- Run this in Supabase SQL Editor to check that all tables, RLS, triggers,
-- and storage buckets are configured properly.
-- ==============================================================================

-- 1. Check all 10 tables and RLS Status
SELECT 
  c.relname AS table_name,
  CASE WHEN c.relrowsecurity THEN '✅ ENABLED' ELSE '❌ DISABLED' END AS rls_status,
  pg_size_pretty(pg_total_relation_size(c.oid)) AS total_size
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN (
    'profiles',
    'projects',
    'certifications',
    'project_members',
    'collaboration_requests',
    'conversations',
    'conversation_members',
    'messages',
    'student_connections',
    'likes'
  )
ORDER BY c.relname;

-- 2. Count Active RLS Policies per table
SELECT 
  tablename,
  COUNT(*) AS total_policies,
  string_agg(policyname, ' | ') AS policies
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;

-- 3. Check Auth Trigger on auth.users
SELECT 
  event_object_table AS target_table,
  trigger_name,
  event_manipulation AS event,
  action_statement AS action
FROM information_schema.triggers
WHERE event_object_schema = 'auth'
  AND trigger_name = 'on_auth_user_created';

-- 4. Check Storage Buckets
SELECT 
  id AS bucket_name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
WHERE id IN ('profile_pictures', 'project_images', 'certificates');
