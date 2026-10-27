import React, { useState, useEffect } from 'react';
import MobileFrame from './components/MobileFrame';
import Toast from './components/Toast';
import NewProjectModal from './components/Modals/NewProjectModal';
import NotificationsModal from './components/Modals/NotificationsModal';
import PersonProfileModal from './components/Modals/PersonProfileModal';
import HackathonAdModal from './components/Modals/HackathonAdModal';

import OnboardingScreen from './screens/OnboardingScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import PeopleScreen from './screens/PeopleScreen';
import ProjectsScreen from './screens/ProjectsScreen';
import ProjectDetailScreen from './screens/ProjectDetailScreen';
import ChatsScreen from './screens/ChatsScreen';
import ChatRoomScreen from './screens/ChatRoomScreen';
import ProfileScreen from './screens/ProfileScreen';

import {
  INITIAL_USER_PROFILE,
  INITIAL_PEOPLE,
  INITIAL_PROJECTS,
  INITIAL_CONVERSATIONS,
  NOTIFICATIONS,
  INITIAL_HACKATHONS
} from './data/initialData';
import { projectsService, DUMMY_STUDENT_ID, DUMMY_STUDENT_EMAIL } from './lib/supabaseClient';

import './App.css';

export default function App() {
  // Screen and Tab routing state
  const [currentScreen, setCurrentScreen] = useState('onboarding');
  const [activeTab, setActiveTab] = useState('home');

  // Application Data States
  const [currentUser, setCurrentUser] = useState({
    id: DUMMY_STUDENT_ID,
    email: DUMMY_STUDENT_EMAIL,
    name: INITIAL_USER_PROFILE.name
  });
  const [userProfile, setUserProfile] = useState(INITIAL_USER_PROFILE);
  const [people, setPeople] = useState(INITIAL_PEOPLE);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [hackathons, setHackathons] = useState(INITIAL_HACKATHONS);

  // Sync projects with Supabase database on load
  useEffect(() => {
    async function fetchDatabaseProjects() {
      try {
        const dbProjects = await projectsService.getProjects();
        if (dbProjects && dbProjects.length > 0) {
          const mapped = dbProjects.map((p) => {
            const isMine = p.owner_id === (currentUser?.id || DUMMY_STUDENT_ID);
            const statusDisplay = p.status === 'in_progress' ? 'Active' : (p.status ? p.status.charAt(0).toUpperCase() + p.status.slice(1) : 'Planning');
            const ownerName = p.owner?.full_name || 'Vivek Kumar';
            const ownerInitials = ownerName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() || 'VK';
            const ownerCollege = p.owner?.college_name || 'KIIT University';

            return {
              id: p.id,
              title: p.title,
              description: p.description || '',
              about: p.description || '',
              status: statusDisplay,
              techStack: p.tech_stack || [],
              membersCount: (p.members?.length || 0) + 1,
              ownership: isMine ? 'My Projects' : 'Other',
              lead: {
                name: ownerName,
                initials: ownerInitials,
                role: 'Lead',
                college: ownerCollege
              },
              members: [
                {
                  name: ownerName,
                  initials: ownerInitials,
                  role: 'Project Lead',
                  college: ownerCollege
                }
              ],
              requested: false,
              chatId: `proj-${p.id}`
            };
          });
          setProjects(mapped);
        }
      } catch (err) {
        console.warn('[Supabase] Initial project fetch notice:', err);
      }
    }
    fetchDatabaseProjects();
  }, [currentUser]);

  // Active Selections
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedHackathon, setSelectedHackathon] = useState(null);

  // Modals & Feedback
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [toast, setToast] = useState({ message: null, type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: null, type: 'success' });
    }, 3200);
  };

  // Connection count dynamically calculated from connected users
  const connectedCount = people.filter((p) => p.connected).length;

  // Unread chat messages count
  const unreadChatCount = conversations.reduce((acc, curr) => acc + (curr.unread || 0), 0);

  // Navigation handlers
  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    setCurrentScreen(tabId);
  };

  const handleToggleConnect = (personId) => {
    setPeople((prev) =>
      prev.map((person) => {
        if (person.id === personId) {
          const nextState = !person.connected;
          if (nextState) {
            showToast(`Connected with ${person.name}!`, 'success');
          } else {
            showToast(`Disconnected from ${person.name}`, 'alert');
          }
          return { ...person, connected: nextState };
        }
        return person;
      })
    );
  };

  const handleSelectProject = (projectId) => {
    setSelectedProjectId(projectId);
    setCurrentScreen('project-detail');
  };

  const handleRequestJoinProject = (projectId) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === projectId) {
          showToast(`Join request submitted to ${proj.lead?.name || 'Project Lead'}!`, 'success');
          return { ...proj, requested: true };
        }
        return proj;
      })
    );
  };

  const handleChatWithTeam = (project) => {
    // Look up or establish conversation for this project
    let convo = conversations.find(
      (c) => c.projectId === project.id || c.name.toLowerCase() === project.title.toLowerCase()
    );

    if (!convo) {
      const newConvo = {
        id: `convo-proj-${project.id}`,
        name: `${project.title} Team`,
        initials: project.title.slice(0, 2).toUpperCase(),
        isProject: true,
        projectId: project.id,
        time: 'Just now',
        unread: 0,
        avatarBg: '#DBEAFE',
        avatarColor: '#1E40AF',
        messages: [
          {
            id: 1,
            sender: project.lead?.name || 'Lead',
            text: `Welcome to the ${project.title} team chat! Let's build something awesome.`,
            time: 'Just now',
            isMe: false
          }
        ]
      };
      setConversations([newConvo, ...conversations]);
      setSelectedConversationId(newConvo.id);
    } else {
      setSelectedConversationId(convo.id);
    }

    setActiveTab('chats');
    setCurrentScreen('chat-room');
  };

  const handleStartDirectChat = (person) => {
    // Check if conversation already exists with this person
    let convo = conversations.find(
      (c) => c.id === person.id || c.name.toLowerCase() === person.name.toLowerCase()
    );

    if (!convo) {
      const newConvo = {
        id: person.id,
        name: person.name,
        initials: person.initials,
        isProject: false,
        time: 'Just now',
        unread: 0,
        avatarBg: person.avatarBg || '#E0E7FF',
        avatarColor: person.avatarColor || '#3730A3',
        messages: [
          {
            id: 1,
            sender: person.name,
            text: `Hi Vivek! Great to connect with you.`,
            time: 'Just now',
            isMe: false
          }
        ]
      };
      setConversations([newConvo, ...conversations]);
      setSelectedConversationId(newConvo.id);
    } else {
      setSelectedConversationId(convo.id);
    }

    setSelectedPerson(null);
    setActiveTab('chats');
    setCurrentScreen('chat-room');
  };

  const handleSelectConversation = (convoId) => {
    // Mark as read
    setConversations((prev) =>
      prev.map((c) => (c.id === convoId ? { ...c, unread: 0 } : c))
    );
    setSelectedConversationId(convoId);
    setCurrentScreen('chat-room');
  };

  const handleSendMessage = (convoId, messageText) => {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const timeStr = `${hours}:${formattedMinutes}`;

    const newMsg = {
      id: Date.now(),
      sender: userProfile.name,
      text: messageText,
      time: timeStr,
      isMe: true
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === convoId) {
          return {
            ...c,
            time: timeStr,
            unread: 0,
            messages: [...c.messages, newMsg]
          };
        }
        return c;
      })
    );

    // Simulated responsive student reply after 1.4 seconds for realism
    setTimeout(() => {
      const responses = [
        "Sounds like a great plan! Let's do it.",
        "Got it! I will push my updates in a bit.",
        "Nice, that works perfectly for our demo.",
        "Thanks for the update, let's sync up later today."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === convoId) {
            const replyMsg = {
              id: Date.now() + 1,
              sender: c.isProject ? (c.messages[0]?.sender || 'Team Member') : c.name,
              text: randomResponse,
              time: `${new Date().getHours()}:${new Date().getMinutes() < 10 ? '0' : ''}${new Date().getMinutes()}`,
              isMe: false
            };
            return {
              ...c,
              time: replyMsg.time,
              messages: [...c.messages, replyMsg]
            };
          }
          return c;
        })
      );
    }, 1400);
  };

  const handleCreateProject = async (newProject) => {
    // 1. Immediately update UI state for instant responsiveness
    setProjects([newProject, ...projects]);
    setUserProfile((prev) => ({
      ...prev,
      projectsCount: prev.projectsCount + 1,
      myProjects: [
        {
          id: newProject.id,
          title: newProject.title,
          description: newProject.description,
          techStack: newProject.techStack,
          status: newProject.status
        },
        ...prev.myProjects
      ]
    }));
    showToast(`Project "${newProject.title}" published!`, 'success');

    // 2. Persist to Supabase database with dummy student ID
    try {
      const ownerId = currentUser?.id || DUMMY_STUDENT_ID;
      const dbStatus = newProject.status?.toLowerCase() === 'active' ? 'in_progress' : (newProject.status?.toLowerCase() || 'planning');

      await projectsService.createProject({
        owner_id: ownerId,
        title: newProject.title,
        description: newProject.description,
        tech_stack: newProject.techStack || [],
        status: dbStatus,
        looking_for_members: true
      });
      console.info('[Supabase] Project saved successfully to database');
    } catch (err) {
      console.warn('[Supabase] Project database save notice:', err.message || err);
    }
  };

  const handleSignupSuccess = (newUserData) => {
    if (newUserData?.id) {
      setCurrentUser((prev) => ({
        ...prev,
        id: newUserData.id,
        email: newUserData.email,
        name: newUserData.name
      }));
    }
    setUserProfile((prev) => ({
      ...prev,
      name: newUserData.name,
      email: newUserData.email,
      college: newUserData.college
    }));
    setActiveTab('home');
    setCurrentScreen('home');
  };

  const handleLoginSuccess = (userData) => {
    if (userData?.id) {
      setCurrentUser((prev) => ({
        ...prev,
        id: userData.id,
        email: userData.email || prev.email,
        name: userData.user_metadata?.full_name || prev.name
      }));
    }
    setActiveTab('home');
    setCurrentScreen('home');
  };

  const handleRegisterHackathon = (hackathonId) => {
    setHackathons((prev) =>
      prev.map((h) => {
        if (h.id === hackathonId) {
          const nextState = !h.registered;
          if (nextState) {
            showToast(`🎉 Registered for ${h.title}! Check your email.`, 'success');
          } else {
            showToast(`Withdrawn registration for ${h.title}`, 'alert');
          }
          return { ...h, registered: nextState };
        }
        return h;
      })
    );
    setSelectedHackathon((prev) =>
      prev && prev.id === hackathonId ? { ...prev, registered: !prev.registered } : prev
    );
  };

  const handleLogout = () => {
    showToast('Signed out successfully', 'alert');
    setCurrentScreen('onboarding');
  };

  const currentProject = projects.find((p) => p.id === selectedProjectId);
  const currentConversation = conversations.find((c) => c.id === selectedConversationId);

  return (
    <MobileFrame
      currentScreen={currentScreen}
      activeTab={activeTab}
      onSelectTab={handleSelectTab}
      unreadChatCount={unreadChatCount}
    >
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: null, type: 'success' })}
        />
      )}

      {/* Screen Routing */}
      {currentScreen === 'onboarding' && (
        <OnboardingScreen onNavigate={(screen) => setCurrentScreen(screen)} />
      )}

      {currentScreen === 'login' && (
        <LoginScreen
          onNavigate={(screen) => setCurrentScreen(screen)}
          onLoginSuccess={handleLoginSuccess}
          onShowToast={showToast}
        />
      )}

      {currentScreen === 'signup' && (
        <SignupScreen
          onNavigate={(screen) => setCurrentScreen(screen)}
          onSignupSuccess={handleSignupSuccess}
          onShowToast={showToast}
        />
      )}

      {currentScreen === 'home' && (
        <HomeScreen
          people={people}
          projects={projects}
          hackathons={hackathons}
          onSelectHackathon={setSelectedHackathon}
          onRegisterHackathon={handleRegisterHackathon}
          onToggleConnect={handleToggleConnect}
          onSelectProject={handleSelectProject}
          onSelectPerson={setSelectedPerson}
          onNavigateTab={handleSelectTab}
          onOpenNotifications={() => setIsNotificationsModalOpen(true)}
          unreadNotificationsCount={notifications.length}
        />
      )}

      {currentScreen === 'people' && (
        <PeopleScreen
          people={people}
          onToggleConnect={handleToggleConnect}
          onSelectPerson={setSelectedPerson}
          onNavigateBack={() => handleSelectTab('home')}
        />
      )}

      {currentScreen === 'projects' && (
        <ProjectsScreen
          projects={projects}
          onSelectProject={handleSelectProject}
          onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
        />
      )}

      {currentScreen === 'project-detail' && (
        <ProjectDetailScreen
          project={currentProject}
          onNavigateBack={() => setCurrentScreen('projects')}
          onRequestJoin={handleRequestJoinProject}
          onChatWithTeam={handleChatWithTeam}
        />
      )}

      {currentScreen === 'chats' && (
        <ChatsScreen
          conversations={conversations}
          onSelectConversation={handleSelectConversation}
          onShowToast={showToast}
        />
      )}

      {currentScreen === 'chat-room' && (
        <ChatRoomScreen
          conversation={currentConversation}
          onNavigateBack={() => setCurrentScreen('chats')}
          onSendMessage={handleSendMessage}
        />
      )}

      {currentScreen === 'profile' && (
        <ProfileScreen
          userProfile={userProfile}
          connectedCount={connectedCount}
          onSelectProject={handleSelectProject}
          onLogout={handleLogout}
          onShowToast={showToast}
        />
      )}

      {/* Modals */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onCreateProject={handleCreateProject}
      />

      <NotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        notifications={notifications}
        onClearAll={() => {
          setNotifications([]);
          showToast('All notifications marked as read', 'success');
        }}
      />

      <PersonProfileModal
        person={selectedPerson}
        isOpen={!!selectedPerson}
        onClose={() => setSelectedPerson(null)}
        onStartChat={handleStartDirectChat}
      />

      <HackathonAdModal
        hackathon={selectedHackathon}
        isOpen={!!selectedHackathon}
        onClose={() => setSelectedHackathon(null)}
        onRegister={handleRegisterHackathon}
        onFindTeammates={() => {
          setSelectedHackathon(null);
          handleSelectTab('people');
        }}
      />
    </MobileFrame>
  );
}
