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
                      <ImageUploadField
                        label="Cover Image"
                        folder="blog-covers"
                        value={blogForm.imageUrl || ""}
                        onChange={(imageUrl) =>
                          setBlogForm({ ...blogForm, imageUrl })
                        }
                        onError={(message) => showToast(message, true)}
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">Author Name</label>
                      <input
                        type="text"
                        value={blogForm.authorName || ""}
                        onChange={(e) =>
                          setBlogForm({ ...blogForm, authorName: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-xs"
                      />
                    </div>
                    <ImageUploadField
                      label="Author Photo"
                      folder="authors"
                      value={blogForm.authorAvatar || ""}
                      onChange={(authorAvatar) =>
                        setBlogForm({ ...blogForm, authorAvatar })
                      }
                      onError={(message) => showToast(message, true)}
                    />
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
