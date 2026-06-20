import React, { useState } from "react";
import { 
  Settings as SettingsIcon, 
  Users, 
  Briefcase, 
  BookOpen, 
  Plus, 
  Trash2, 
  Save, 
  Globe, 
  UserPlus, 
  PenTool, 
  CheckCircle2, 
  ChevronRight,
  Eye,
  AlertCircle
} from "lucide-react";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, handleFirestoreError } from "../lib/firebase";
import { 
  Settings, 
  TeamMember, 
  PortfolioProject, 
  BlogPost, 
  OperationType 
} from "../types";

interface AdminDashboardProps {
  settings: Settings;
  setSettings: (settings: Settings) => void;
  team: TeamMember[];
  setTeam: (team: TeamMember[]) => void;
  portfolio: PortfolioProject[];
  setPortfolio: (portfolio: PortfolioProject[]) => void;
  blogs: BlogPost[];
  setBlogs: (blogs: BlogPost[]) => void;
  onClose: () => void;
}

type TabType = "branding" | "team_mgmt" | "portfolio_mgmt" | "blog_mgmt";

export default function AdminDashboard({
  settings,
  setSettings,
  team,
  setTeam,
  portfolio,
  setPortfolio,
  blogs,
  setBlogs,
  onClose
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("branding");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Local Form States
  const [settingsForm, setSettingsForm] = useState<Settings>({ ...settings });
  
  // Team Form States
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [memberForm, setMemberForm] = useState<Partial<TeamMember>>({
    id: "",
    name: "",
    role: "",
    photoUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400",
    bio: "",
    order: 5,
    socialLinkedin: "",
    socialGithub: ""
  });

  // Portfolio Form States
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState<Partial<PortfolioProject>>({
    id: "",
    title: "",
    category: "Web Engineering",
    description: "",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    clientName: "",
    tags: [],
    date: "",
    projectUrl: ""
  });
  const [tagsInput, setTagsInput] = useState("");

  // Blog Form States
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [blogForm, setBlogForm] = useState<Partial<BlogPost>>({
    id: "",
    title: "",
    excerpt: "",
    content: "",
    slug: "",
    category: "SEO & Growth",
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=800",
    authorName: "Thukha Aung",
    authorAvatar: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=100",
    publishedAt: new Date().toISOString().split("T")[0],
    status: "published"
  });

  const showToast = (msg: string, isError = false) => {
    if (isError) {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(""), 6000);
    } else {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(""), 4000);
    }
  };

  // 1. SAVE GLOBAL SETTINGS
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const configPath = "settings/config";
    try {
      await setDoc(doc(db, "settings", "config"), settingsForm);
      setSettings(settingsForm);
      showToast("Global website configuration updated securely in Firebase!");
    } catch (err) {
      showToast("Access Denied. You do not hold authorized credentials.", true);
      handleFirestoreError(err, OperationType.UPDATE, configPath);
    }
  };

  // 2. TEAM MANAGEMENT FUNCTIONS
  const handleEditMember = (member: TeamMember) => {
    setEditingMemberId(member.id);
    setMemberForm(member);
  };

  const handleAddNewMemberBtn = () => {
    setEditingMemberId(null);
    setMemberForm({
      id: "member-" + Date.now(),
      name: "",
      role: "",
      photoUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400",
      bio: "",
      order: team.length + 1,
      socialLinkedin: "",
      socialGithub: ""
    });
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberForm.id || !memberForm.name || !memberForm.role || !memberForm.photoUrl) {
      showToast("Missing required fields.", true);
      return;
    }
    const path = `team/${memberForm.id}`;
    try {
      const saved = { ...memberForm } as TeamMember;
      await setDoc(doc(db, "team", saved.id), saved);
      
      const exists = team.some((m) => m.id === saved.id);
      if (exists) {
        setTeam(team.map((m) => m.id === saved.id ? saved : m));
      } else {
        setTeam([...team, saved]);
      }
      
      showToast("Team profile saved successfully!");
      setEditingMemberId(null);
      setMemberForm({ id: "" });
    } catch (err) {
      showToast("Access Denied or Validation Error.", true);
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team profile?")) return;
    const path = `team/${id}`;
    try {
      await deleteDoc(doc(db, "team", id));
      setTeam(team.filter((m) => m.id !== id));
      showToast("Team profile deleted.");
    } catch (err) {
      showToast("Delete operation rejected.", true);
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  // 3. PORTFOLIO MANAGEMENT FUNCTIONS
  const handleEditProject = (proj: PortfolioProject) => {
    setEditingProjectId(proj.id);
    setProjectForm(proj);
    setTagsInput(proj.tags?.join(", ") || "");
  };

  const handleAddNewProjectBtn = () => {
    setEditingProjectId(null);
    setProjectForm({
      id: "project-" + Date.now(),
      title: "",
      category: "Web Engineering",
      description: "",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
      clientName: "",
      tags: [],
      date: new Date().getFullYear().toString(),
      projectUrl: ""
    });
    setTagsInput("");
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.id || !projectForm.title || !projectForm.category || !projectForm.imageUrl) {
      showToast("Missing required fields for project.", true);
      return;
    }
    const path = `portfolio/${projectForm.id}`;
    try {
      const parsedTags = tagsInput ? tagsInput.split(",").map(t => t.trim()).filter(Boolean) : [];
      const saved = { ...projectForm, tags: parsedTags } as PortfolioProject;
      await setDoc(doc(db, "portfolio", saved.id), saved);
      
      const exists = portfolio.some((p) => p.id === saved.id);
      if (exists) {
        setPortfolio(portfolio.map((p) => p.id === saved.id ? saved : p));
      } else {
        setPortfolio([...portfolio, saved]);
      }
      
      showToast("Case study project saved!");
      setEditingProjectId(null);
      setProjectForm({ id: "" });
    } catch (err) {
      showToast("Access Denied.", true);
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this case study?")) return;
    const path = `portfolio/${id}`;
    try {
      await deleteDoc(doc(db, "portfolio", id));
      setPortfolio(portfolio.filter((p) => p.id !== id));
      showToast("Project deleted successfully.");
    } catch (err) {
      showToast("Could not delete project.", true);
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  // 4. BLOG MANAGEMENT FUNCTIONS
  const handleEditBlog = (post: BlogPost) => {
    setEditingBlogId(post.id);
    setBlogForm(post);
  };

  const handleAddNewBlogBtn = () => {
    setEditingBlogId(null);
    setBlogForm({
      id: "blog-" + Date.now(),
      title: "",
      excerpt: "",
      content: "",
      slug: "",
      category: "SEO & Growth",
      imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=800",
      authorName: "Thukha Aung",
      authorAvatar: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=100",
      publishedAt: new Date().toISOString().split("T")[0],
      status: "published"
    });
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogForm.id || !blogForm.title || !blogForm.excerpt || !blogForm.content || !blogForm.slug) {
      showToast("Missing required blog fields. Slug and excerpt are required.", true);
      return;
    }
    const path = `blog/${blogForm.id}`;
    try {
      const saved = { ...blogForm } as BlogPost;
      await setDoc(doc(db, "blog", saved.id), saved);
      
      const exists = blogs.some((b) => b.id === saved.id);
      if (exists) {
        setBlogs(blogs.map((b) => b.id === saved.id ? saved : b));
      } else {
        setBlogs([...blogs, saved]);
      }
      
      showToast("Blog article updated/created!");
      setEditingBlogId(null);
      setBlogForm({ id: "" });
    } catch (err) {
      showToast("Access Denied.", true);
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    const path = `blog/${id}`;
    try {
      await deleteDoc(doc(db, "blog", id));
      setBlogs(blogs.filter((b) => b.id !== id));
      showToast("Blog post deleted from database.");
    } catch (err) {
      showToast("Delete request failed.", true);
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  return (
    <div id="admin_console_scaffold" className="min-h-screen bg-[#07090d] text-white">
      {/* Top Banner */}
      <div className="bg-[#0b0e15] border-b border-gray-800 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <Globe size={18} />
          </div>
          <div>
            <h1 className="text-md sm:text-lg font-bold font-display tracking-tight text-white flex items-center gap-2">
              <span>Dynamic Control Panel</span>
              <span className="text-[10px] bg-indigo-600 font-mono py-0.5 px-2 rounded-full uppercase text-white font-extrabold font-mono tracking-widest text-[9px]">Firebase</span>
            </h1>
            <p className="text-[10px] md:text-xs text-gray-400">Values updated here propagate to code-free sections instantly.</p>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="text-xs px-4 py-2 font-bold cursor-pointer transition-all bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 rounded-xl"
        >
          View Client Website
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Tabs bar */}
        <div className="lg:col-span-3 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-none border-b lg:border-b-0 lg:border-r border-gray-900/60 pr-0 lg:pr-6">
          <button 
            onClick={() => setActiveTab("branding")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-xs md:text-sm whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "branding" 
                ? "bg-indigo-500 text-white font-semibold" 
                : "text-gray-400 hover:text-white hover:bg-gray-900/50"
            }`}
          >
            <SettingsIcon size={16} />
            <span>Identity & Layouts</span>
          </button>
          <button 
            onClick={() => setActiveTab("team_mgmt")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-xs md:text-sm whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "team_mgmt" 
                ? "bg-indigo-500 text-white font-semibold" 
                : "text-gray-400 hover:text-white hover:bg-gray-900/50"
            }`}
          >
            <Users size={16} />
            <span>Squad Profiles ({team.length})</span>
          </button>
          <button 
            onClick={() => setActiveTab("portfolio_mgmt")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-xs md:text-sm whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "portfolio_mgmt" 
                ? "bg-indigo-500 text-white font-semibold" 
                : "text-gray-400 hover:text-white hover:bg-gray-900/50"
            }`}
          >
            <Briefcase size={16} />
            <span>Case Studies ({portfolio.length})</span>
          </button>
          <button 
            onClick={() => setActiveTab("blog_mgmt")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-xs md:text-sm whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "blog_mgmt" 
                ? "bg-indigo-500 text-white font-semibold" 
                : "text-gray-400 hover:text-white hover:bg-gray-900/50"
            }`}
          >
            <BookOpen size={16} />
            <span>Blog Articles ({blogs.length})</span>
          </button>
        </div>

        {/* Dynamic Content Panel */}
        <div className="lg:col-span-9 bg-[#0b0d13]/40 border border-gray-950 p-6 md:p-8 rounded-2xl relative min-h-[500px]">
          {/* Status feedback notifications */}
          {successMsg && (
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-300 text-xs flex items-center gap-2.5 mb-6">
              <CheckCircle2 size={16} className="text-green-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/20 text-red-300 text-xs flex items-center gap-2.5 mb-6">
              <AlertCircle size={16} className="text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: LOGO, BRANDING, COPYWRITING */}
          {activeTab === "branding" && (
            <div>
              <h2 className="text-lg font-bold font-display text-white mb-6 flex items-center gap-2">
                <SettingsIcon size={18} className="text-indigo-400" />
                <span>Global Settings Settings & Text</span>
              </h2>

              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Brand Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={settingsForm.brandName}
                      onChange={(e) => setSettingsForm({ ...settingsForm, brandName: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0d0f14] border border-gray-800 rounded-xl focus:border-indigo-500 outline-none text-sm text-gray-200" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Logo Text (with dot)</label>
                    <input 
                      type="text"
                      required
                      value={settingsForm.logoText}
                      onChange={(e) => setSettingsForm({ ...settingsForm, logoText: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0d0f14] border border-gray-800 rounded-xl focus:border-indigo-500 outline-none text-sm text-gray-200" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Custom Logo Image URL (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="Leave empty for fallback text logo"
                      value={settingsForm.logoUrl || ""}
                      onChange={(e) => setSettingsForm({ ...settingsForm, logoUrl: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0d0f14] border border-gray-800 rounded-xl focus:border-indigo-500 outline-none text-sm text-gray-200" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Clutch Ratings / Proof</label>
                    <input 
                      type="text" 
                      value={settingsForm.clutchRating || ""}
                      onChange={(e) => setSettingsForm({ ...settingsForm, clutchRating: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0d0f14] border border-gray-800 rounded-xl focus:border-indigo-500 outline-none text-sm text-gray-200" 
                    />
                  </div>
                </div>

                <hr className="border-gray-900/80 my-4" />

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Hero Main Heading Title</label>
                  <input 
                    type="text" 
                    value={settingsForm.heroTitle || ""}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroTitle: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0d0f14] border border-gray-800 rounded-xl focus:border-indigo-500 outline-none text-sm text-gray-200" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Hero Subtitle Text</label>
                  <textarea 
                    value={settingsForm.heroSubtitle || ""}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-[#0d0f14] border border-gray-800 rounded-xl focus:border-indigo-500 outline-none text-sm text-gray-200"
                  />
                </div>

                <hr className="border-gray-900/80 my-4" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Contact Email</label>
                    <input 
                      type="email" 
                      value={settingsForm.email || ""}
                      onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0d0f14] border border-gray-800 rounded-xl focus:border-indigo-500 outline-none text-sm text-gray-200" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Contact Phone</label>
                    <input 
                      type="text" 
                      value={settingsForm.phone || ""}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0d0f14] border border-gray-800 rounded-xl focus:border-indigo-500 outline-none text-sm text-gray-200" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Contact Office Address</label>
                  <input 
                    type="text" 
                    value={settingsForm.address || ""}
                    onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0d0f14] border border-gray-800 rounded-xl focus:border-indigo-500 outline-none text-sm text-gray-200" 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Facebook Link</label>
                    <input 
                      type="text" 
                      value={settingsForm.facebookUrl || ""}
                      onChange={(e) => setSettingsForm({ ...settingsForm, facebookUrl: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0d0f14] border border-gray-800 rounded-xl focus:border-indigo-500 outline-none text-xs text-gray-200" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">LinkedIn Link</label>
                    <input 
                      type="text" 
                      value={settingsForm.linkedinUrl || ""}
                      onChange={(e) => setSettingsForm({ ...settingsForm, linkedinUrl: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0d0f14] border border-gray-800 rounded-xl focus:border-indigo-500 outline-none text-xs text-gray-200" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Github Link</label>
                    <input 
                      type="text" 
                      value={settingsForm.githubUrl || ""}
                      onChange={(e) => setSettingsForm({ ...settingsForm, githubUrl: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0d0f14] border border-gray-800 rounded-xl focus:border-indigo-500 outline-none text-xs text-gray-200" 
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/15 cursor-pointer"
                >
                  <Save size={16} />
                  <span>Save Configuration Settings</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: TEAM MANAGEMENT */}
          {activeTab === "team_mgmt" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
                  <Users size={18} className="text-indigo-400" />
                  <span>Squad Profiles Listing</span>
                </h2>
                <button 
                  onClick={handleAddNewMemberBtn}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-xs font-semibold"
                >
                  <UserPlus size={13} />
                  <span>Add Member</span>
                </button>
              </div>

              {/* Editing block/form */}
              {editingMemberId !== null || memberForm.id ? (
                <form onSubmit={handleSaveMember} className="bg-[#0b0e15] border border-gray-800 rounded-xl p-5 mb-8 space-y-4">
                  <h3 className="text-sm font-bold font-display text-gray-200 uppercase tracking-widest mb-2 border-b border-gray-800 pb-2 flex items-center justify-between">
                    <span>{editingMemberId ? "Update Squad Profile" : "Register New Squad Profile"}</span>
                    <button 
                      type="button" 
                      onClick={() => setMemberForm({ id: "" })}
                      className="text-gray-500 hover:text-white text-[10px]"
                    >
                      Cancel Form
                    </button>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={memberForm.name || ""}
                        onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">Professional Role</label>
                      <input 
                        type="text" 
                        required
                        value={memberForm.role || ""}
                        onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">Photo Image URL</label>
                      <input 
                        type="text" 
                        required
                        value={memberForm.photoUrl || ""}
                        onChange={(e) => setMemberForm({ ...memberForm, photoUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">Layout Alignment Order (1 = Top)</label>
                      <input 
                        type="number" 
                        value={memberForm.order || 5}
                        onChange={(e) => setMemberForm({ ...memberForm, order: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">Biography</label>
                    <textarea 
                      value={memberForm.bio || ""}
                      onChange={(e) => setMemberForm({ ...memberForm, bio: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">LinkedIn Link (Optional)</label>
                      <input 
                        type="text" 
                        value={memberForm.socialLinkedin || ""}
                        onChange={(e) => setMemberForm({ ...memberForm, socialLinkedin: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">Github Link (Optional)</label>
                      <input 
                        type="text" 
                        value={memberForm.socialGithub || ""}
                        onChange={(e) => setMemberForm({ ...memberForm, socialGithub: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 font-semibold rounded-lg text-xs"
                  >
                    Save Squad Member
                  </button>
                </form>
              ) : null}

              {/* Member lists */}
              <div className="space-y-3">
                {team.map((m) => (
                  <div key={m.id} className="flex items-center justify-between p-4 bg-[#0a0d15] rounded-xl border border-gray-900">
                    <div className="flex items-center gap-3">
                      <img src={m.photoUrl} alt={m.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-white">{m.name}</div>
                        <div className="text-[10px] text-gray-400 font-mono flex items-center gap-2">
                          <span>{m.role}</span>
                          <span>•</span>
                          <span>Order: {m.order || 5}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditMember(m)}
                        className="p-1 px-2.5 rounded bg-gray-900 hover:bg-gray-800 border border-gray-800 text-[10px] text-gray-300 transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteMember(m.id)}
                        className="p-1 px-2.5 rounded bg-red-950/40 hover:bg-red-900 border border-red-900/30 text-[10px] text-red-400 transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PORTFOLIO MANAGEMENT */}
          {activeTab === "portfolio_mgmt" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
                  <Briefcase size={18} className="text-indigo-400" />
                  <span>Case Studies List</span>
                </h2>
                <button 
                  onClick={handleAddNewProjectBtn}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-xs font-semibold"
                >
                  <Plus size={13} />
                  <span>Add Case Study</span>
                </button>
              </div>

              {/* Editing structure */}
              {editingProjectId !== null || projectForm.id ? (
                <form onSubmit={handleSaveProject} className="bg-[#0b0e15] border border-gray-800 rounded-xl p-5 mb-8 space-y-4">
                  <h3 className="text-sm font-bold font-display text-gray-200 uppercase tracking-widest border-b border-gray-800 pb-2 flex items-center justify-between">
                    <span>{editingProjectId ? "Modify Case Study Project" : "Register New Case Study Project"}</span>
                    <button type="button" onClick={() => setProjectForm({ id: "" })} className="text-xs text-gray-500 hover:text-white">Cancel</button>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">Project Title</label>
                      <input 
                        type="text" 
                        required
                        value={projectForm.title || ""}
                        onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-xs" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">Category Domain</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Web Engineering, Branding"
                        value={projectForm.category || ""}
                        onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-xs" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">Image Showcover URL</label>
                      <input 
                        type="text" 
                        required
                        value={projectForm.imageUrl || ""}
                        onChange={(e) => setProjectForm({ ...projectForm, imageUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-xs" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">Client Business Name</label>
                      <input 
                        type="text" 
                        value={projectForm.clientName || ""}
                        onChange={(e) => setProjectForm({ ...projectForm, clientName: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-xs" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">Detailed Description of Engineering Work</label>
                    <textarea 
                      required
                      value={projectForm.description || ""}
                      onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">Technical Stack Tags (split with comma)</label>
                      <input 
                        type="text" 
                        placeholder="React, CSS, Firebase"
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-xs" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">Case study Link URL (Optional)</label>
                      <input 
                        type="text" 
                        value={projectForm.projectUrl || ""}
                        onChange={(e) => setProjectForm({ ...projectForm, projectUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-xs" 
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 font-semibold rounded-lg text-xs"
                  >
                    Save Case Study
                  </button>
                </form>
              ) : null}

              {/* Projects List */}
              <div className="space-y-3">
                {portfolio.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-4 bg-[#0a0d15] rounded-xl border border-gray-900">
                    <div className="flex items-center gap-3">
                      <img src={p.imageUrl} alt={p.title} className="w-12 h-8 rounded object-cover shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-white">{p.title}</div>
                        <div className="text-[10px] text-gray-500 font-mono">{p.category}</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditProject(p)}
                        className="p-1 px-2.5 rounded bg-gray-900 hover:bg-gray-800 border border-gray-800 text-[10px] text-gray-300 transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteProject(p.id)}
                        className="p-1 px-2.5 rounded bg-red-950/40 hover:bg-red-900 border border-red-900/30 text-[10px] text-red-400 transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: BLOG MANAGEMENT */}
          {activeTab === "blog_mgmt" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
                  <BookOpen size={18} className="text-indigo-400" />
                  <span>Blog Publications List</span>
                </h2>
                <button 
                  onClick={handleAddNewBlogBtn}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-xs font-semibold"
                >
                  <PenTool size={13} />
                  <span>Write Blog Post</span>
                </button>
              </div>

              {/* Create/Edit Blog form */}
              {editingBlogId !== null || blogForm.id ? (
                <form onSubmit={handleSaveBlog} className="bg-[#0b0e15] border border-gray-800 rounded-xl p-5 mb-8 space-y-4">
                  <h3 className="text-sm font-bold font-display text-gray-200 uppercase tracking-widest border-b border-gray-800 pb-2 flex items-center justify-between">
                    <span>{editingBlogId ? "Modify Blog Article" : "Write Brand New Blog Article"}</span>
                    <button type="button" onClick={() => setBlogForm({ id: "" })} className="text-xs text-gray-500 hover:text-white">Cancel</button>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">Article Title</label>
                      <input 
                        type="text" 
                        required
                        value={blogForm.title || ""}
                        onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-xs" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">Friendly URL Slug</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. secure-firebase-setup"
                        value={blogForm.slug || ""}
                        onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-xs" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">Category Tag</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. SEO, Cloud Security"
                        value={blogForm.category || ""}
                        onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-xs" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">Cover Image Link</label>
                      <input 
                        type="text" 
                        value={blogForm.imageUrl || ""}
                        onChange={(e) => setBlogForm({ ...blogForm, imageUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-xs" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">Status Mode</label>
                      <select 
                        value={blogForm.status || "published"}
                        onChange={(e) => setBlogForm({ ...blogForm, status: e.target.value as "published" | "draft" })}
                        className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-xs text-gray-300"
                      >
                        <option value="published">Published (Public can read)</option>
                        <option value="draft">Draft (Admin eyes only)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">Short excerpt summary (1-2 sentences)</label>
                    <input 
                      type="text" 
                      required
                      value={blogForm.excerpt || ""}
                      onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-xs" 
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">Full Article Content (Markdown format supported)</label>
                    <textarea 
                      required
                      value={blogForm.content || ""}
                      onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                      rows={12}
                      className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-xs font-mono"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 font-semibold rounded-lg text-xs"
                  >
                    Save Blog Publication
                  </button>
                </form>
              ) : null}

              {/* Blogs List */}
              <div className="space-y-3">
                {blogs.map((b) => (
                  <div key={b.id} className="flex items-center justify-between p-4 bg-[#0a0d15] rounded-xl border border-gray-900">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-gray-900 flex items-center justify-center font-bold text-gray-500 font-mono text-xs">
                        {b.status === "published" ? "PUB" : "DFT"}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">{b.title}</div>
                        <div className="text-[10px] text-gray-500 font-mono">
                          <span>{b.category}</span>
                          <span className="mx-2">•</span>
                          <span>Views: {b.views || 0}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditBlog(b)}
                        className="p-1 px-2.5 rounded bg-gray-900 hover:bg-gray-800 border border-gray-800 text-[10px] text-gray-300 transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteBlog(b.id)}
                        className="p-1 px-2.5 rounded bg-red-950/40 hover:bg-red-900 border border-red-900/30 text-[10px] text-red-400 transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
