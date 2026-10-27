import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.info(
    '[CampusConnect] Supabase credentials not found in environment variables. ' +
    'The app will continue using offline demo state until you add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env'
  );
}

// Client-side Supabase instance using only the publishable anon key (safe for browser)
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Dummy student test account credentials for offline / test mode
export const DUMMY_STUDENT_ID = 'd0d0d0d0-d0d0-d0d0-d0d0-d0d0d0d0d0d0';
export const DUMMY_STUDENT_EMAIL = 'vivek.kumar@campus.edu';

// ==============================================================================
// 1. Auth Service
// ==============================================================================
export const authService = {
  async signUp(email, password, metadata = {}) {
    if (!supabase) return { error: { message: 'Supabase client not initialized' } };
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: metadata.fullName || metadata.name || '',
          college_name: metadata.college || metadata.collegeName || '',
          avatar_url: metadata.avatarUrl || ''
        }
      }
    });
  },

  async signIn(email, password) {
    if (!supabase) return { error: { message: 'Supabase client not initialized' } };
    return await supabase.auth.signInWithPassword({ email, password });
  },

  async signOut() {
    if (!supabase) return { error: null };
    return await supabase.auth.signOut();
  },

  async getCurrentUser() {
    if (!supabase) return null;
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  onAuthStateChange(callback) {
    if (!supabase) return { data: { subscription: { unsubscribe: () => {} } } };
    return supabase.auth.onAuthStateChange(callback);
  }
};

// ==============================================================================
// 2. Profiles Service
// ==============================================================================
export const profilesService = {
  async getProfile(userId) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data;
  },

  async getAllProfiles() {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('full_name', { ascending: true });
    if (error) throw error;
    return data;
  },

  async updateProfile(userId, updates) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

// ==============================================================================
// 3. Projects Service
// ==============================================================================
export const projectsService = {
  async getProjects() {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        owner:profiles!projects_owner_id_fkey(id, full_name, avatar_url, college_name),
        members:project_members(
          id, role, status,
          student:profiles!project_members_student_id_fkey(id, full_name, avatar_url, college_name)
        ),
        likes(id, student_id)
      `)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getProjectById(projectId) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        owner:profiles!projects_owner_id_fkey(id, full_name, avatar_url, college_name),
        members:project_members(
          id, role, status,
          student:profiles!project_members_student_id_fkey(id, full_name, avatar_url, college_name)
        )
      `)
      .eq('id', projectId)
      .single();
    if (error) throw error;
    return data;
  },

  async createProject(projectData) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateProject(projectId, updates) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteProject(projectId) {
    if (!supabase) return null;
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);
    if (error) throw error;
    return true;
  }
};

// ==============================================================================
// 4. Certifications Service
// ==============================================================================
export const certificationsService = {
  async getStudentCertificates(studentId) {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .eq('student_id', studentId)
      .order('issue_date', { ascending: false });
    if (error) throw error;
    return data;
  },

  async addCertification(certData) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('certifications')
      .insert([certData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteCertification(certId) {
    if (!supabase) return null;
    const { error } = await supabase
      .from('certifications')
      .delete()
      .eq('id', certId);
    if (error) throw error;
    return true;
  }
};

// ==============================================================================
// 5. Project Members & Collaboration Requests Service
// ==============================================================================
export const collaborationService = {
  async sendJoinRequest(projectId, requesterId, message = '') {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('collaboration_requests')
      .insert([{ project_id: projectId, requester_id: requesterId, message }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getProjectRequests(projectId) {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('collaboration_requests')
      .select(`
        *,
        requester:profiles!collaboration_requests_requester_id_fkey(id, full_name, avatar_url, college_name, skills)
      `)
      .eq('project_id', projectId);
    if (error) throw error;
    return data;
  },

  async updateRequestStatus(requestId, status, projectId = null, requesterId = null, role = 'Member') {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('collaboration_requests')
      .update({ status })
      .eq('id', requestId)
      .select()
      .single();
    if (error) throw error;

    // If request accepted, automatically create team membership row
    if (status === 'accepted' && projectId && requesterId) {
      await supabase
        .from('project_members')
        .insert([{ project_id: projectId, student_id: requesterId, role, status: 'accepted' }]);
    }
    return data;
  }
};

// ==============================================================================
// 6. Conversations & Messages Service
// ==============================================================================
export const chatService = {
  async getUserConversations(userId) {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('conversation_members')
      .select(`
        conversation:conversations(
          id, updated_at,
          members:conversation_members(
            student:profiles(id, full_name, avatar_url)
          ),
          messages(id, sender_id, content, created_at, read_at)
        )
      `)
      .eq('student_id', userId);
    if (error) throw error;
    return data.map((item) => item.conversation);
  },

  async getMessages(conversationId) {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(id, full_name, avatar_url)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data;
  },

  async sendMessage(conversationId, senderId, content, messageType = 'text') {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('messages')
      .insert([{
        conversation_id: conversationId,
        sender_id: senderId,
        content,
        message_type: messageType
      }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

// ==============================================================================
// 7. Student Connections Service
// ==============================================================================
export const connectionsService = {
  async sendConnectionRequest(requesterId, receiverId) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('student_connections')
      .insert([{ requester_id: requesterId, receiver_id: receiverId, status: 'pending' }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getUserConnections(userId) {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('student_connections')
      .select(`
        *,
        requester:profiles!student_connections_requester_id_fkey(id, full_name, avatar_url, college_name),
        receiver:profiles!student_connections_receiver_id_fkey(id, full_name, avatar_url, college_name)
      `)
      .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`);
    if (error) throw error;
    return data;
  },

  async updateConnectionStatus(connectionId, status) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('student_connections')
      .update({ status })
      .eq('id', connectionId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

// ==============================================================================
// 8. Likes Service
// ==============================================================================
export const likesService = {
  async toggleLike(projectId, studentId) {
    if (!supabase) return null;
    const { data: existing } = await supabase
      .from('likes')
      .select('id')
      .eq('project_id', projectId)
      .eq('student_id', studentId)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase.from('likes').delete().eq('id', existing.id);
      if (error) throw error;
      return { liked: false };
    } else {
      const { data, error } = await supabase
        .from('likes')
        .insert([{ project_id: projectId, student_id: studentId }])
        .select()
        .single();
      if (error) throw error;
      return { liked: true, data };
    }
  }
};

// ==============================================================================
// 9. Storage Service (Files & Media)
// ==============================================================================
export const storageService = {
  async uploadProfileAvatar(userId, file) {
    if (!supabase) return null;
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/avatar-${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage
      .from('profile_pictures')
      .upload(filePath, file, { upsert: true });
    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('profile_pictures')
      .getPublicUrl(filePath);

    return publicUrl;
  },

  async uploadProjectImage(userId, projectId, file) {
    if (!supabase) return null;
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/${projectId}-${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage
      .from('project_images')
      .upload(filePath, file, { upsert: true });
    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('project_images')
      .getPublicUrl(filePath);

    return publicUrl;
  },

  async uploadCertificateFile(studentId, file) {
    if (!supabase) return null;
    const fileExt = file.name.split('.').pop();
    const filePath = `${studentId}/cert-${Date.now()}.${fileExt}`;
    // Private bucket: do NOT use getPublicUrl! Use createSignedUrl when viewing
    const { error } = await supabase.storage
      .from('certificates')
      .upload(filePath, file, { upsert: true });
    if (error) throw error;

    return filePath;
  },

  async getCertificateSignedUrl(filePath, expiresInSeconds = 3600) {
    if (!supabase) return null;
    const { data, error } = await supabase.storage
      .from('certificates')
      .createSignedUrl(filePath, expiresInSeconds);
    if (error) throw error;
    return data.signedUrl;
  }
};
