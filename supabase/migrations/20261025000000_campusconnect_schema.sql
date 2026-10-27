-- ==============================================================================
-- CampusConnect Supabase Database Schema Migration
-- Student Networking & Hackathon Team-Finding Platform
--
-- Features:
-- 1. Profiles (linked to auth.users.id)
-- 2. Projects (student project portfolios & hackathon ideas)
-- 3. Certifications (uploaded student certificates)
-- 4. Project Members (team management & roles)
-- 5. Collaboration Requests (join requests & applicant screening)
-- 6. Conversations (chat channels)
-- 7. Conversation Members (participants)
-- 8. Messages (direct & group chat)
-- 9. Student Connections (networking & connection requests)
-- 10. Likes (project appreciation)
-- 11. Storage Buckets & Policies (profile_pictures, project_images, private certificates)
-- 12. Automated Auth Triggers & updated_at Triggers
-- ==============================================================================

-- Enable UUID & cryptographic extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- HELPER FUNCTIONS & TRIGGERS
-- ==============================================================================

-- 1. Auto-update updated_at timestamp function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

-- 2. Security Definer Helper: Check project owner without RLS recursion
CREATE OR REPLACE FUNCTION public.is_project_owner(_project_id UUID, _user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.projects
    WHERE id = _project_id
      AND owner_id = _user_id
  );
$$;

-- 3. Security Definer Helper: Check accepted project member without RLS recursion
CREATE OR REPLACE FUNCTION public.is_project_member(_project_id UUID, _user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.project_members
    WHERE project_id = _project_id
      AND student_id = _user_id
      AND lower(status) = 'accepted'
  );
$$;

-- 4. Security Definer Helper: Check conversation membership without RLS recursion
CREATE OR REPLACE FUNCTION public.is_conversation_member(_conversation_id UUID, _user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.conversation_members
    WHERE conversation_id = _conversation_id
      AND student_id = _user_id
  );
$$;

-- ==============================================================================
-- 1. PROFILES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT,
  avatar_url TEXT,
  college_name TEXT,
  department TEXT,
  course TEXT,
  year_of_study INTEGER CHECK (year_of_study IS NULL OR (year_of_study >= 1 AND year_of_study <= 6)),
  bio TEXT,
  location TEXT,
  skills TEXT[] NOT NULL DEFAULT '{}'::text[],
  interests TEXT[] NOT NULL DEFAULT '{}'::text[],
  github_url TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Profiles updated_at trigger
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 2. PROJECTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  tech_stack TEXT[] NOT NULL DEFAULT '{}'::text[],
  github_url TEXT,
  live_demo_url TEXT,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'planning' CHECK (lower(status) IN ('planning', 'in_progress', 'completed', 'active')),
  looking_for_members BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Projects updated_at trigger
DROP TRIGGER IF EXISTS set_projects_updated_at ON public.projects;
CREATE TRIGGER set_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 3. CERTIFICATIONS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  issuing_organization TEXT NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE,
  credential_id TEXT,
  credential_url TEXT,
  file_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT valid_certification_dates CHECK (expiry_date IS NULL OR expiry_date >= issue_date)
);

-- ==============================================================================
-- 4. PROJECT MEMBERS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'Member',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (lower(status) IN ('pending', 'accepted', 'rejected')),
  joined_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_project_member UNIQUE (project_id, student_id)
);

-- ==============================================================================
-- 5. COLLABORATION REQUESTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.collaboration_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (lower(status) IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_collaboration_request UNIQUE (project_id, requester_id)
);

-- Collaboration requests updated_at trigger
DROP TRIGGER IF EXISTS set_collaboration_requests_updated_at ON public.collaboration_requests;
CREATE TRIGGER set_collaboration_requests_updated_at
  BEFORE UPDATE ON public.collaboration_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 6. CONVERSATIONS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Conversations updated_at trigger
DROP TRIGGER IF EXISTS set_conversations_updated_at ON public.conversations;
CREATE TRIGGER set_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 7. CONVERSATION MEMBERS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.conversation_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_conversation_member UNIQUE (conversation_id, student_id)
);

-- ==============================================================================
-- 8. MESSAGES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  read_at TIMESTAMPTZ
);

-- ==============================================================================
-- 9. STUDENT CONNECTIONS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.student_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (lower(status) IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT no_self_connection CHECK (requester_id <> receiver_id)
);

-- Unique index ensuring no duplicate connection pairs in either direction
CREATE UNIQUE INDEX IF NOT EXISTS unique_student_connection_pair
  ON public.student_connections (LEAST(requester_id, receiver_id), GREATEST(requester_id, receiver_id));

-- ==============================================================================
-- 10. LIKES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_project_like UNIQUE (project_id, student_id)
);

-- ==============================================================================
-- PERFORMANCE & QUERY INDEXES
-- ==============================================================================

-- Profiles
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_college ON public.profiles(college_name);

-- Projects
CREATE INDEX IF NOT EXISTS idx_projects_owner_id ON public.projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_looking ON public.projects(looking_for_members);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);

-- Certifications
CREATE INDEX IF NOT EXISTS idx_certifications_student_id ON public.certifications(student_id);
CREATE INDEX IF NOT EXISTS idx_certifications_issue_date ON public.certifications(issue_date DESC);

-- Project Members
CREATE INDEX IF NOT EXISTS idx_project_members_project_id ON public.project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_members_student_id ON public.project_members(student_id);
CREATE INDEX IF NOT EXISTS idx_project_members_status ON public.project_members(status);

-- Collaboration Requests
CREATE INDEX IF NOT EXISTS idx_collab_req_project_id ON public.collaboration_requests(project_id);
CREATE INDEX IF NOT EXISTS idx_collab_req_requester_id ON public.collaboration_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_collab_req_status ON public.collaboration_requests(status);

-- Conversations & Messages
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON public.conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_convo_members_convo_id ON public.conversation_members(conversation_id);
CREATE INDEX IF NOT EXISTS idx_convo_members_student_id ON public.conversation_members(student_id);
CREATE INDEX IF NOT EXISTS idx_messages_convo_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at ASC);

-- Student Connections
CREATE INDEX IF NOT EXISTS idx_connections_requester ON public.student_connections(requester_id);
CREATE INDEX IF NOT EXISTS idx_connections_receiver ON public.student_connections(receiver_id);
CREATE INDEX IF NOT EXISTS idx_connections_status ON public.student_connections(status);

-- Likes
CREATE INDEX IF NOT EXISTS idx_likes_project_id ON public.likes(project_id);
CREATE INDEX IF NOT EXISTS idx_likes_student_id ON public.likes(student_id);

-- ==============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    full_name,
    email,
    avatar_url,
    college_name
  )
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1),
      'Student'
    ),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(
      NEW.raw_user_meta_data->>'college_name',
      NEW.raw_user_meta_data->>'college',
      'Campus Student'
    )
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = CASE 
      WHEN public.profiles.full_name IS NULL OR public.profiles.full_name = '' 
      THEN EXCLUDED.full_name 
      ELSE public.profiles.full_name 
    END,
    updated_at = timezone('utc'::text, now());

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 1. Profiles Policies
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Profiles are readable by authenticated users" ON public.profiles;
CREATE POLICY "Profiles are readable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update only their own profile" ON public.profiles;
CREATE POLICY "Users can update only their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can delete only their own profile" ON public.profiles;
CREATE POLICY "Users can delete only their own profile"
  ON public.profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- 2. Projects Policies
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Projects are viewable by authenticated users" ON public.projects;
CREATE POLICY "Projects are viewable by authenticated users"
  ON public.projects FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Students can insert their own projects" ON public.projects;
CREATE POLICY "Students can insert their own projects"
  ON public.projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Project owners can update their projects" ON public.projects;
CREATE POLICY "Project owners can update their projects"
  ON public.projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Project owners can delete their projects" ON public.projects;
CREATE POLICY "Project owners can delete their projects"
  ON public.projects FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- ------------------------------------------------------------------------------
-- 3. Certifications Policies
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Certifications viewable by authenticated students" ON public.certifications;
CREATE POLICY "Certifications viewable by authenticated students"
  ON public.certifications FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Students can insert their own certifications" ON public.certifications;
CREATE POLICY "Students can insert their own certifications"
  ON public.certifications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "Students can update their own certifications" ON public.certifications;
CREATE POLICY "Students can update their own certifications"
  ON public.certifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "Students can delete their own certifications" ON public.certifications;
CREATE POLICY "Students can delete their own certifications"
  ON public.certifications FOR DELETE
  TO authenticated
  USING (auth.uid() = student_id);

-- ------------------------------------------------------------------------------
-- 4. Project Members Policies
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Project members are viewable by authenticated users" ON public.project_members;
CREATE POLICY "Project members are viewable by authenticated users"
  ON public.project_members FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Project owner or self can add project membership" ON public.project_members;
CREATE POLICY "Project owner or self can add project membership"
  ON public.project_members FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = student_id OR
    public.is_project_owner(project_id, auth.uid())
  );

DROP POLICY IF EXISTS "Project owner or member can update membership" ON public.project_members;
CREATE POLICY "Project owner or member can update membership"
  ON public.project_members FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = student_id OR
    public.is_project_owner(project_id, auth.uid())
  )
  WITH CHECK (
    auth.uid() = student_id OR
    public.is_project_owner(project_id, auth.uid())
  );

DROP POLICY IF EXISTS "Project owner or member can remove membership" ON public.project_members;
CREATE POLICY "Project owner or member can remove membership"
  ON public.project_members FOR DELETE
  TO authenticated
  USING (
    auth.uid() = student_id OR
    public.is_project_owner(project_id, auth.uid())
  );

-- ------------------------------------------------------------------------------
-- 5. Collaboration Requests Policies
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Requests viewable by requester, owner, or members" ON public.collaboration_requests;
CREATE POLICY "Requests viewable by requester, owner, or members"
  ON public.collaboration_requests FOR SELECT
  TO authenticated
  USING (
    auth.uid() = requester_id OR
    public.is_project_owner(project_id, auth.uid()) OR
    public.is_project_member(project_id, auth.uid())
  );

DROP POLICY IF EXISTS "Requesters can submit collaboration request" ON public.collaboration_requests;
CREATE POLICY "Requesters can submit collaboration request"
  ON public.collaboration_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = requester_id);

DROP POLICY IF EXISTS "Project owner or requester can update request" ON public.collaboration_requests;
CREATE POLICY "Project owner or requester can update request"
  ON public.collaboration_requests FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = requester_id OR
    public.is_project_owner(project_id, auth.uid())
  )
  WITH CHECK (
    auth.uid() = requester_id OR
    public.is_project_owner(project_id, auth.uid())
  );

DROP POLICY IF EXISTS "Project owner or requester can delete request" ON public.collaboration_requests;
CREATE POLICY "Project owner or requester can delete request"
  ON public.collaboration_requests FOR DELETE
  TO authenticated
  USING (
    auth.uid() = requester_id OR
    public.is_project_owner(project_id, auth.uid())
  );

-- ------------------------------------------------------------------------------
-- 6. Conversations Policies
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Conversation members can view their conversations" ON public.conversations;
CREATE POLICY "Conversation members can view their conversations"
  ON public.conversations FOR SELECT
  TO authenticated
  USING (public.is_conversation_member(id, auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can create conversations" ON public.conversations;
CREATE POLICY "Authenticated users can create conversations"
  ON public.conversations FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Conversation members can update conversations" ON public.conversations;
CREATE POLICY "Conversation members can update conversations"
  ON public.conversations FOR UPDATE
  TO authenticated
  USING (public.is_conversation_member(id, auth.uid()))
  WITH CHECK (public.is_conversation_member(id, auth.uid()));

DROP POLICY IF EXISTS "Conversation members can delete conversations" ON public.conversations;
CREATE POLICY "Conversation members can delete conversations"
  ON public.conversations FOR DELETE
  TO authenticated
  USING (public.is_conversation_member(id, auth.uid()));

-- ------------------------------------------------------------------------------
-- 7. Conversation Members Policies
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Members can view participants of their conversations" ON public.conversation_members;
CREATE POLICY "Members can view participants of their conversations"
  ON public.conversation_members FOR SELECT
  TO authenticated
  USING (public.is_conversation_member(conversation_id, auth.uid()));

DROP POLICY IF EXISTS "Users can add conversation members" ON public.conversation_members;
CREATE POLICY "Users can add conversation members"
  ON public.conversation_members FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = student_id OR
    public.is_conversation_member(conversation_id, auth.uid())
  );

DROP POLICY IF EXISTS "Members can leave or be removed from conversations" ON public.conversation_members;
CREATE POLICY "Members can leave or be removed from conversations"
  ON public.conversation_members FOR DELETE
  TO authenticated
  USING (
    auth.uid() = student_id OR
    public.is_conversation_member(conversation_id, auth.uid())
  );

-- ------------------------------------------------------------------------------
-- 8. Messages Policies
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Members can read conversation messages" ON public.messages;
CREATE POLICY "Members can read conversation messages"
  ON public.messages FOR SELECT
  TO authenticated
  USING (public.is_conversation_member(conversation_id, auth.uid()));

DROP POLICY IF EXISTS "Members can send messages" ON public.messages;
CREATE POLICY "Members can send messages"
  ON public.messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id AND
    public.is_conversation_member(conversation_id, auth.uid())
  );

DROP POLICY IF EXISTS "Senders or members can update messages" ON public.messages;
CREATE POLICY "Senders or members can update messages"
  ON public.messages FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = sender_id OR
    public.is_conversation_member(conversation_id, auth.uid())
  )
  WITH CHECK (public.is_conversation_member(conversation_id, auth.uid()));

DROP POLICY IF EXISTS "Senders can delete their messages" ON public.messages;
CREATE POLICY "Senders can delete their messages"
  ON public.messages FOR DELETE
  TO authenticated
  USING (auth.uid() = sender_id);

-- ------------------------------------------------------------------------------
-- 9. Student Connections Policies
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Connections viewable by participants" ON public.student_connections;
CREATE POLICY "Connections viewable by participants"
  ON public.student_connections FOR SELECT
  TO authenticated
  USING (
    auth.uid() = requester_id OR
    auth.uid() = receiver_id
  );

DROP POLICY IF EXISTS "Requesters can create connections" ON public.student_connections;
CREATE POLICY "Requesters can create connections"
  ON public.student_connections FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = requester_id AND
    requester_id <> receiver_id
  );

DROP POLICY IF EXISTS "Participants can update connection status" ON public.student_connections;
CREATE POLICY "Participants can update connection status"
  ON public.student_connections FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = requester_id OR
    auth.uid() = receiver_id
  )
  WITH CHECK (
    auth.uid() = requester_id OR
    auth.uid() = receiver_id
  );

DROP POLICY IF EXISTS "Participants can delete connection" ON public.student_connections;
CREATE POLICY "Participants can delete connection"
  ON public.student_connections FOR DELETE
  TO authenticated
  USING (
    auth.uid() = requester_id OR
    auth.uid() = receiver_id
  );

-- ------------------------------------------------------------------------------
-- 10. Likes Policies
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Likes are viewable by authenticated users" ON public.likes;
CREATE POLICY "Likes are viewable by authenticated users"
  ON public.likes FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Students can like projects" ON public.likes;
CREATE POLICY "Students can like projects"
  ON public.likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "Students can unlike projects" ON public.likes;
CREATE POLICY "Students can unlike projects"
  ON public.likes FOR DELETE
  TO authenticated
  USING (auth.uid() = student_id);

-- ==============================================================================
-- 11. SUPABASE STORAGE BUCKETS & ACCESS POLICIES
-- ==============================================================================

-- Create buckets safely
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('profile_pictures', 'profile_pictures', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('project_images', 'project_images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('certificates', 'certificates', false, 15728640, ARRAY['application/pdf', 'image/jpeg', 'image/png'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ------------------------------------------------------------------------------
-- Storage: profile_pictures (Public read, authenticated owner upload & edit)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view profile pictures" ON storage.objects;
CREATE POLICY "Public can view profile pictures"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile_pictures');

DROP POLICY IF EXISTS "Authenticated students can upload profile pictures" ON storage.objects;
CREATE POLICY "Authenticated students can upload profile pictures"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'profile_pictures' AND
    (
      (auth.uid())::text = (storage.foldername(name))[1] OR
      owner = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Students can update their own profile pictures" ON storage.objects;
CREATE POLICY "Students can update their own profile pictures"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'profile_pictures' AND
    (
      (auth.uid())::text = (storage.foldername(name))[1] OR
      owner = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Students can delete their own profile pictures" ON storage.objects;
CREATE POLICY "Students can delete their own profile pictures"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'profile_pictures' AND
    (
      (auth.uid())::text = (storage.foldername(name))[1] OR
      owner = auth.uid()
    )
  );

-- ------------------------------------------------------------------------------
-- Storage: project_images (Public read, authenticated owner upload & edit)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view project images" ON storage.objects;
CREATE POLICY "Public can view project images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project_images');

DROP POLICY IF EXISTS "Authenticated students can upload project images" ON storage.objects;
CREATE POLICY "Authenticated students can upload project images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'project_images' AND
    (
      (auth.uid())::text = (storage.foldername(name))[1] OR
      owner = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Students can update their own project images" ON storage.objects;
CREATE POLICY "Students can update their own project images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'project_images' AND
    (
      (auth.uid())::text = (storage.foldername(name))[1] OR
      owner = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Students can delete their own project images" ON storage.objects;
CREATE POLICY "Students can delete their own project images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'project_images' AND
    (
      (auth.uid())::text = (storage.foldername(name))[1] OR
      owner = auth.uid()
    )
  );

-- ------------------------------------------------------------------------------
-- Storage: certificates (PRIVATE: strictly owner only for view, upload, delete)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Certificate owners can view their files" ON storage.objects;
CREATE POLICY "Certificate owners can view their files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'certificates' AND
    (
      (auth.uid())::text = (storage.foldername(name))[1] OR
      owner = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Certificate owners can upload files" ON storage.objects;
CREATE POLICY "Certificate owners can upload files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'certificates' AND
    (
      (auth.uid())::text = (storage.foldername(name))[1] OR
      owner = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Certificate owners can update files" ON storage.objects;
CREATE POLICY "Certificate owners can update files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'certificates' AND
    (
      (auth.uid())::text = (storage.foldername(name))[1] OR
      owner = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Certificate owners can delete files" ON storage.objects;
CREATE POLICY "Certificate owners can delete files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'certificates' AND
    (
      (auth.uid())::text = (storage.foldername(name))[1] OR
      owner = auth.uid()
    )
  );

-- ==============================================================================
-- 12. SECURITY HARDENING: REVOKE DIRECT RPC EXECUTION
-- ==============================================================================
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_project_owner(UUID, UUID) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_project_member(UUID, UUID) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_conversation_member(UUID, UUID) FROM PUBLIC, anon, authenticated;

