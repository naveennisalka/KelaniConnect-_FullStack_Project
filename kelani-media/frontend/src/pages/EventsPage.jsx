import React, { useEffect, useState } from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import { useAuth } from '../context/AuthContext.jsx';
import { eventService } from '../services/eventService.js';
import toast from 'react-hot-toast';

const EMPTY_EVENT = {
  title: '',
  organizer: '',
  location: '',
  description: '',
  startsAt: '',
  imageUrl: ''
};

const EventsPage = () => {
  const { user } = useAuth();
  const canPublish = user?.roles?.some((role) => ['ADMIN', 'EVENT_ORGANIZER'].includes(role));
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(EMPTY_EVENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadEvents = async () => {
    try {
      setEvents(await eventService.getEvents());
    } catch {
      toast.error('Could not load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const event = await eventService.createEvent(form);
      setEvents((currentEvents) => [...currentEvents, event].sort(
        (a, b) => new Date(a.startsAt) - new Date(b.startsAt)
      ));
      setForm(EMPTY_EVENT);
      toast.success('Event published.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not publish this event.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 mx-auto w-full max-w-5xl space-y-6 p-6">
        <header>
          <h1 className="text-2xl font-bold text-gray-900">Campus Events</h1>
          <p className="mt-1 text-sm text-gray-500">Discover events and activities at the University of Kelaniya.</p>
        </header>

        {canPublish ? (
          <form onSubmit={handleCreateEvent} className="space-y-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="font-bold text-gray-800">Create event</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ['title', 'Event title'],
                ['organizer', 'Organizing group'],
                ['location', 'Location']
              ].map(([field, label]) => (
                <input
                  key={field}
                  required
                  maxLength={160}
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  placeholder={label}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              ))}
              <input
                required
                type="datetime-local"
                value={form.startsAt}
                onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
            </div>
            <textarea
              required
              maxLength={5000}
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Event details"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
            <input
              type="url"
              maxLength={2048}
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="Event image URL (optional)"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
            <button disabled={saving} className="rounded-lg bg-[#800000] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
              {saving ? 'Publishing...' : 'Publish event'}
            </button>
          </form>
        ) : (
          <p className="rounded-xl bg-white p-4 text-xs text-gray-500 shadow-sm">
            Event publishing is limited to event organizer and admin accounts.
          </p>
        )}

        <section className="space-y-4">
          <h2 className="font-bold text-gray-800">Upcoming events</h2>
          {loading ? (
            <p className="py-8 text-center text-sm text-gray-400">Loading events...</p>
          ) : events.length ? events.map((event) => (
            <article key={event.id} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              {event.imageUrl && <img src={event.imageUrl} alt="Event" loading="lazy" className="max-h-72 w-full object-cover" />}
              <div className="space-y-2 p-5">
                <h3 className="font-bold text-gray-900">{event.title}</h3>
                <p className="text-xs text-gray-500">{event.organizer} · {event.location}</p>
                <p className="text-xs font-semibold text-[#800000]">{new Date(event.startsAt).toLocaleString()}</p>
                <p className="whitespace-pre-line text-sm text-gray-600">{event.description}</p>
                <p className="text-xs text-gray-400">Organized by {event.organizerName}</p>
              </div>
            </article>
          )) : (
            <p className="rounded-xl bg-white p-8 text-center text-sm text-gray-400">No events have been added yet.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default EventsPage;
