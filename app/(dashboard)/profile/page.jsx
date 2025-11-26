// app/(dashboard)/profile/page.jsx
'use client';

import { useCallback, useEffect, useState } from 'react';
import { getProfile, updateProfile } from '@/lib/user';
import Button from '@/components/ui/Button';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState(null); // {type:'success'|'error', message:string}
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const p = await getProfile();
      setProfile(p);
      setForm({
        firstName: p?.firstName || p?.first_name || p?.name || '',
        lastName: p?.lastName || p?.last_name || '',
        phone: p?.phone || '',
        enrollmentNumber: p?.enrollmentNumber || p?.enrollment_number || '',
        barCouncil: p?.barCouncil || p?.bar_council || '',
        profilePictureUrl: p?.profilePictureUrl || p?.profile_picture_url || '',
      });
    } catch (err) {
      console.error('Failed to fetch profile', err);
      setFeedback({ type: 'error', message: 'Failed to load profile.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const toggleEdit = () => {
    setFeedback(null);
    if (isEditing) setForm({
      firstName: profile?.firstName || profile?.first_name || profile?.name || '',
      lastName: profile?.lastName || profile?.last_name || '',
      phone: profile?.phone || '',
      enrollmentNumber: profile?.enrollmentNumber || profile?.enrollment_number || '',
      barCouncil: profile?.barCouncil || profile?.bar_council || '',
      profilePictureUrl: profile?.profilePictureUrl || profile?.profile_picture_url || '',
    });
    setIsEditing((v) => !v);
  };

  const onChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const onPickPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm((s) => ({ ...s, profilePictureUrl: ev.target?.result }));
    };
    reader.readAsDataURL(file);
  };

  const onSave = async (e) => {
    e.preventDefault();
    if (!profile) return;
    setIsSaving(true);
    setFeedback(null);

    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        enrollmentNumber: form.enrollmentNumber,
        barCouncil: form.barCouncil,
        profilePictureUrl: form.profilePictureUrl,
      };
      // remove undefined/empty values
      Object.keys(payload).forEach((k) => {
        if (payload[k] === undefined || payload[k] === '') delete payload[k];
      });

      await updateProfile(payload);
      setFeedback({ type: 'success', message: 'Profile updated successfully.' });
      setIsEditing(false);
      await fetchProfile();
    } catch (err) {
      console.error('Update failed', err);
      // Friendly error when backend does not support PATCH
      if (err?.code === 'NOT_IMPLEMENTED') {
        setFeedback({
          type: 'error',
          message:
            'Profile update is not implemented on the backend yet. Please ask backend team to add PATCH /user/v1/me to allow saving edits.',
        });
      } else {
        setFeedback({ type: 'error', message: err.message || 'Failed to update profile.' });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const input =
    'w-full mt-1 bg-[var(--bg-elev)] text-foreground p-2 rounded-lg border border-border/50 text-sm outline-none focus:ring-2 focus:ring-primary';
  const label = 'text-xs font-semibold text-muted uppercase';

  const avatarSrc =
    form?.profilePictureUrl ||
    (profile?.name
      ? `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=F4B400&color=000&bold=true`
      : '');

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-8">My Profile</h1>

      <div className="bg-[var(--bg-elev)] p-6 rounded-xl border border-border/20 max-w-4xl">
        {loading ? (
          <p className="text-muted text-center py-10">Loading profile…</p>
        ) : !profile ? (
          <p className="text-center text-red-500">Profile not available. Please login again.</p>
        ) : (
          <form onSubmit={onSave}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-primary">Your Information</h2>
                <p className="text-muted mt-1 text-sm">This information is synced with your Team Directory profile.</p>
              </div>
              <button
                type="button"
                onClick={toggleEdit}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-bold rounded-md bg-primary/10 text-primary hover:bg-primary/20"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-shrink-0 text-center">
                {avatarSrc ? (
                  <img src={avatarSrc} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-primary/40 mx-auto" />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-foreground/10 border-4 border-primary/40 mx-auto" />
                )}

                {isEditing && (
                  <div className="mt-4">
                    <label htmlFor="profile-picture-upload" className="cursor-pointer text-sm text-primary hover:underline">
                      Change Picture
                    </label>
                    <input id="profile-picture-upload" type="file" accept="image/*" onChange={onPickPhoto} className="hidden" />
                  </div>
                )}
              </div>

              <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                <div>
                  <label className={label}>Name</label>
                  {isEditing ? (
                    <input name="firstName" value={form.firstName || ''} onChange={onChange} className={input} />
                  ) : (
                    <p className="mt-1 text-lg">{profile.name || `${profile.firstName || ''} ${profile.lastName || ''}`}</p>
                  )}
                </div>

                <div>
                  <label className={label}>Role</label>
                  <p className="mt-1 text-lg">{profile.role || '—'}</p>
                </div>

                <div>
                  <label className={label}>Email</label>
                  <p className="mt-1">{profile.email}</p>
                </div>

                <div>
                  <label className={label}>Phone</label>
                  {isEditing ? <input name="phone" value={form.phone || ''} onChange={onChange} className={input} /> : <p className="mt-1">{profile.phone || 'N/A'}</p>}
                </div>

                <div>
                  <label className={label}>Enrollment Number</label>
                  {isEditing ? (
                    <input name="enrollmentNumber" value={form.enrollmentNumber || ''} onChange={onChange} className={input} />
                  ) : (
                    <p className="mt-1">{profile.enrollmentNumber || 'N/A'}</p>
                  )}
                </div>

                <div>
                  <label className={label}>Bar Council</label>
                  {isEditing ? <input name="barCouncil" value={form.barCouncil || ''} onChange={onChange} className={input} /> : <p className="mt-1">{profile.barCouncil || 'N/A'}</p>}
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="mt-6 pt-6 border-t border-border/20 flex justify-end">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? 'Saving…' : 'Save Changes'}
                </Button>
              </div>
            )}

            {feedback && (
              <p className={`mt-4 text-center text-sm ${feedback.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>{feedback.message}</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}