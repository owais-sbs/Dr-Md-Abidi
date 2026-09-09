import { useEffect, useState } from 'react';
import { Loader2, Pencil, Plus, Trash2, ToggleLeft, ToggleRight, Save, AlertCircle, UserPlus } from 'lucide-react';
import {
  getCmsBlogPosts, saveCmsBlogPost, deleteCmsBlogPost, newId, makeSlug,
  type CmsBlogPost,
} from '@/data/cms';
import { uploadPackageImage, deletePackageImage } from '@/lib/imageUpload';
import { supabase } from '@/lib/supabase';
import { adminConfirm, adminError, adminSuccess, adminToast } from '@/lib/adminSwal';

const inp = 'w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary-900';
const lbl = 'block text-xs font-semibold text-ink-700 mb-1.5';

export function AdminBlogPanel({ onError }: { onError: (msg: string) => void }) {
  const [posts, setPosts] = useState<CmsBlogPost[]>([]);
  const [editing, setEditing] = useState<CmsBlogPost | null | 'new'>(null);
  const [delConfirm, setDelConfirm] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      setPosts(await getCmsBlogPosts());
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Could not load blog posts. Run supabase/patch-blog-images-admin.sql first.');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  async function save(p: CmsBlogPost) {
    try {
      await saveCmsBlogPost(p);
      setEditing(null);
      await load();
      await adminSuccess('Blog post saved', 'Published posts appear on the Blog page.');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Could not save blog post.';
      onError(msg);
      await adminError('Save failed', msg);
      throw err;
    }
  }

  async function del(id: string) {
    const ok = await adminConfirm({
      title: 'Delete this blog post?',
      text: 'This cannot be undone.',
      confirmText: 'Delete',
      danger: true,
    });
    if (!ok) return;
    try {
      await deleteCmsBlogPost(id);
      setDelConfirm(null);
      await load();
      await adminToast('Blog post deleted', 'success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Could not delete blog post.';
      onError(msg);
      await adminError('Delete failed', msg);
    }
  }

  async function toggle(p: CmsBlogPost) {
    try {
      await saveCmsBlogPost({ ...p, enabled: !p.enabled });
      await load();
      await adminToast(p.enabled ? 'Moved to draft' : 'Post published', 'success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Could not update blog post.';
      onError(msg);
      await adminError('Update failed', msg);
    }
  }

  if (loading) return <div className="py-16 grid place-items-center"><Loader2 className="w-6 h-6 animate-spin text-primary-900"/></div>;

  return (
    <div className="space-y-4">
      {!editing && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-ink-500">{posts.length} blog post{posts.length === 1 ? '' : 's'}</p>
          <button type="button" onClick={() => setEditing('new')} className="inline-flex items-center gap-2 bg-primary-900 hover:bg-primary-800 text-white font-semibold text-xs px-5 py-2.5 rounded-full">
            <Plus className="w-3.5 h-3.5"/> Add Post
          </button>
        </div>
      )}
      {editing && (
        <BlogForm
          initial={editing === 'new' ? undefined : editing}
          onCancel={() => setEditing(null)}
          onSave={save}
        />
      )}
      {!editing && (
        <div className="grid gap-2">
          {posts.map((p) => (
            <div key={p.id} className="bg-white rounded-xl border border-ink-100 p-4 flex items-center gap-4 shadow-soft">
              {p.featuredImage ? <img src={p.featuredImage} alt="" className="w-14 h-10 rounded-lg object-cover shrink-0"/> : <div className="w-14 h-10 rounded-lg bg-ink-100 shrink-0"/>}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-ink-900 text-xs truncate">{p.title || 'Untitled'}</h3>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${p.enabled ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-ink-100 text-ink-500'}`}>{p.enabled ? 'Published' : 'Draft'}</span>
                </div>
                <p className="text-[10px] text-ink-400">/blog/{p.slug}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button type="button" onClick={() => toggle(p)} className="h-7 px-3 text-[11px] font-bold border border-ink-200 rounded-full text-ink-600">{p.enabled ? 'Draft' : 'Activate'}</button>
                <button type="button" onClick={() => setEditing(p)} className="h-7 px-3 text-[11px] font-bold border border-ink-200 rounded-full text-ink-600 inline-flex items-center gap-1"><Pencil className="w-3 h-3"/>Edit</button>
                {delConfirm === p.id ? (
                  <>
                    <button type="button" onClick={() => del(p.id)} className="h-7 px-3 text-[11px] font-bold bg-red-500 text-white rounded-full">Confirm</button>
                    <button type="button" onClick={() => setDelConfirm(null)} className="h-7 px-3 text-[11px] border border-ink-200 rounded-full">Cancel</button>
                  </>
                ) : (
                  <button type="button" onClick={() => setDelConfirm(p.id)} className="h-7 w-7 grid place-items-center border border-ink-200 rounded-full text-ink-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5"/></button>
                )}
              </div>
            </div>
          ))}
          {posts.length === 0 && <p className="text-sm text-ink-500 py-8 text-center">No CMS blog posts yet. Static posts still show on the website.</p>}
        </div>
      )}
    </div>
  );
}

function BlogForm({ initial, onSave, onCancel }: {
  initial?: CmsBlogPost;
  onSave: (p: CmsBlogPost) => Promise<void>;
  onCancel: () => void;
}) {
  const [f, setF] = useState(() => initial || {
    id: newId(),
    slug: '',
    title: '',
    excerpt: '',
    author: 'MD Abidi Arthritis Institute',
    featuredImage: '',
    content: '',
    publishedAt: new Date().toISOString().slice(0, 10),
    enabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [uploading, setUploading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    const slug = f.slug || makeSlug(f.title);
    if (!f.title.trim()) { setErr('Title is required.'); return; }
    setSaving(true);
    try {
      await onSave({ ...f, slug });
    } catch (error) {
      setErr(error instanceof Error ? error.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  async function onFile(file: File) {
    setUploading(true);
    try {
      if (f.featuredImage) await deletePackageImage(f.featuredImage);
      const url = await uploadPackageImage(file);
      setF((p) => ({ ...p, featuredImage: url }));
    } catch (error) {
      setErr(error instanceof Error ? error.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-2xl border border-ink-100 shadow-soft overflow-hidden">
      <div className="px-5 py-4 border-b border-ink-100 flex items-center justify-between gap-3">
        <h3 className="font-bold text-ink-900 text-sm">{initial ? 'Edit Blog Post' : 'Add Blog Post'}</h3>
        <div className="flex gap-2">
          <button type="button" onClick={onCancel} className="h-9 px-4 text-xs font-semibold border border-ink-200 rounded-full">Discard</button>
          <button type="submit" disabled={saving} className="h-9 px-5 text-xs font-bold bg-primary-900 text-white rounded-full inline-flex items-center gap-1.5 disabled:opacity-60">
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> : <Save className="w-3.5 h-3.5"/>}
            Save
          </button>
        </div>
      </div>
      <div className="p-6 grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2"><label className={lbl}>Title *</label><input className={inp} value={f.title} onChange={(e) => setF((p) => ({ ...p, title: e.target.value, slug: p.slug || makeSlug(e.target.value) }))} required/></div>
        <div><label className={lbl}>Slug</label><input className={inp} value={f.slug} onChange={(e) => setF((p) => ({ ...p, slug: e.target.value }))}/></div>
        <div><label className={lbl}>Publish date</label><input type="date" className={inp} value={f.publishedAt?.slice(0, 10) || ''} onChange={(e) => setF((p) => ({ ...p, publishedAt: e.target.value }))}/></div>
        <div className="sm:col-span-2"><label className={lbl}>Excerpt</label><textarea className={`${inp} resize-none`} rows={2} value={f.excerpt} onChange={(e) => setF((p) => ({ ...p, excerpt: e.target.value }))}/></div>
        <div className="sm:col-span-2">
          <label className={lbl}>Featured image</label>
          <p className="text-[10px] text-ink-400 mb-2">Recommended: 1200×700 px</p>
          {f.featuredImage && <img src={f.featuredImage} alt="" className="h-28 w-full object-cover rounded-xl border border-ink-100 mb-2"/>}
          <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) void onFile(file); }}/>
          {uploading && <p className="text-xs text-ink-500 mt-1">Uploading…</p>}
        </div>
        <div className="sm:col-span-2"><label className={lbl}>Content</label><textarea className={`${inp} resize-none font-mono`} rows={10} value={f.content} onChange={(e) => setF((p) => ({ ...p, content: e.target.value }))} placeholder={"Paragraphs separated by blank lines.\nUse ## Heading for headings\nUse - item for bullet lists"}/></div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setF((p) => ({ ...p, enabled: !p.enabled }))} className={f.enabled ? 'text-green-500' : 'text-ink-300'}>
            {f.enabled ? <ToggleRight className="w-8 h-8"/> : <ToggleLeft className="w-8 h-8"/>}
          </button>
          <span className="text-xs font-semibold">{f.enabled ? 'Published' : 'Draft'}</span>
        </div>
        {err && <div className="sm:col-span-2 text-red-500 text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4"/>{err}</div>}
      </div>
    </form>
  );
}

export function AdminSettingsPanel({ onError }: { onError: (msg: string) => void }) {
  const [users, setUsers] = useState<{ id: string; email: string; createdAt?: string; lastSignInAt?: string }[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  async function token() {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || '';
  }

  async function load() {
    try {
      setLoading(true);
      const access = await token();
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${access}` },
        body: JSON.stringify({ action: 'list' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not load users.');
      setUsers(data.users || []);
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Could not load admin users.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  async function createUser(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const access = await token();
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${access}` },
        body: JSON.stringify({ action: 'create', email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not create user.');
      setEmail('');
      setPassword('');
      await load();
      await adminSuccess('Admin user created', email);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Could not create user.';
      onError(msg);
      await adminError('Create failed', msg);
    } finally {
      setBusy(false);
    }
  }

  async function removeUser(id: string) {
    const ok = await adminConfirm({
      title: 'Delete this admin user?',
      text: 'They will no longer be able to sign in.',
      confirmText: 'Delete',
      danger: true,
    });
    if (!ok) return;
    setBusy(true);
    try {
      const access = await token();
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${access}` },
        body: JSON.stringify({ action: 'delete', id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not delete user.');
      await load();
      await adminToast('Admin user deleted', 'success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Could not delete user.';
      onError(msg);
      await adminError('Delete failed', msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <form onSubmit={createUser} className="bg-white rounded-2xl border border-ink-100 p-5 shadow-soft space-y-3">
        <h3 className="font-bold text-ink-900 text-sm flex items-center gap-2"><UserPlus className="w-4 h-4"/> Create admin user</h3>
        <div><label className={lbl}>Email</label><input type="email" required className={inp} value={email} onChange={(e) => setEmail(e.target.value)}/></div>
        <div><label className={lbl}>Password (min 8)</label><input type="password" required minLength={8} className={inp} value={password} onChange={(e) => setPassword(e.target.value)}/></div>
        <button type="submit" disabled={busy} className="h-9 px-5 text-xs font-bold bg-primary-900 text-white rounded-full disabled:opacity-60">
          {busy ? 'Working…' : 'Create admin'}
        </button>
      </form>

      <div className="bg-white rounded-2xl border border-ink-100 shadow-soft overflow-hidden">
        <div className="px-5 py-3 border-b border-ink-100 text-sm font-bold text-ink-900">Admin users</div>
        {loading ? (
          <div className="py-10 grid place-items-center"><Loader2 className="w-5 h-5 animate-spin text-primary-900"/></div>
        ) : (
          <div className="divide-y divide-ink-100">
            {users.map((u) => (
              <div key={u.id} className="px-5 py-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-ink-900">{u.email}</div>
                  <div className="text-[10px] text-ink-400">Created {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</div>
                </div>
                <button type="button" onClick={() => removeUser(u.id)} className="h-7 px-3 text-[11px] font-bold border border-red-200 text-red-500 rounded-full">Delete</button>
              </div>
            ))}
            {users.length === 0 && <p className="px-5 py-8 text-sm text-ink-500 text-center">No admin users found.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
