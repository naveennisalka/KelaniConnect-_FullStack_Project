import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiCalendar, HiX } from 'react-icons/hi';
import toast from 'react-hot-toast';
import Sidebar from '../components/sidebar/Sidebar';
import StepProgressBar from '../components/StepProgressBar.jsx';
import ImagePicker from '../components/events/ImagePicker.jsx';
import UserPicker from '../components/events/UserPicker.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { eventService } from '../services/eventService.js';

// The titles shown at the top of each step
const STEPS = [
  { title: 'Name your event', subtitle: 'Give your event a name and tell people what it is about' },
  { title: 'When and where?', subtitle: 'Add the date, time and location of the event' },
  { title: 'Add a profile photo', subtitle: 'This photo is shown next to the event name (you can skip this)' },
  { title: 'Add a cover photo', subtitle: 'A wide photo shown at the top of your event page (you can skip this)' },
  { title: 'Add organizers', subtitle: 'Add other students who will help you manage this event (you can skip this)' }
];

const CreateEventPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = STEPS.length;
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // All the data of the new event
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    profilePhoto: '',
    coverPhoto: ''
  });

  // Students picked as organizers in step 5
  const [organizers, setOrganizers] = useState([]);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  // Check the fields of the current step. Returns true if everything is OK.
  const validateStep = () => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.title.trim()) newErrors.title = 'Event name is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
    }

    if (currentStep === 2) {
      if (!formData.date) newErrors.date = 'Date is required';
      if (!formData.time) newErrors.time = 'Time is required';
      if (!formData.location.trim()) newErrors.location = 'Location is required';
    }

    // Steps 3, 4 and 5 are optional

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleCreateEvent();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleCreateEvent = async () => {
    setSaving(true);
    try {
      const event = await eventService.createEvent({
        title: formData.title,
        description: formData.description,
        location: formData.location,
        startsAt: `${formData.date}T${formData.time}`, // e.g. "2026-12-01T18:30"
        profilePhoto: formData.profilePhoto,
        coverPhoto: formData.coverPhoto,
        organizerIds: organizers.map((organizer) => organizer.id)
      });
      toast.success('Event created! 🎉');
      navigate(`/events/${event.id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not create the event. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addOrganizer = (student) => {
    setOrganizers([...organizers, student]);
  };

  const removeOrganizer = (studentId) => {
    setOrganizers(organizers.filter((organizer) => organizer.id !== studentId));
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 rounded-xl border ${errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'} text-gray-900 placeholder-gray-400 focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/10 transition-all`;

  const step = STEPS[currentStep - 1];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <main className="flex-1 flex justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          {/* Page title */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-[#800000] rounded-2xl mb-3">
              <HiCalendar className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Create Event</h1>
            <p className="text-sm text-gray-500">Step {currentStep} of {totalSteps}</p>
          </div>

          <StepProgressBar currentStep={currentStep} totalSteps={totalSteps} />

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">{step.title}</h2>
              <p className="text-sm text-gray-500">{step.subtitle}</p>
            </div>

            {/* ==================== STEP 1: Name and description ==================== */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Event Name</label>
                  <input
                    value={formData.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    maxLength={160}
                    placeholder="e.g. Kelani Tech Night 2026"
                    className={inputClass('title')}
                  />
                  {errors.title && <p className="mt-1.5 text-sm text-red-500">{errors.title}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    maxLength={5000}
                    rows={5}
                    placeholder="What will happen at this event?"
                    className={`${inputClass('description')} resize-none`}
                  />
                  {errors.description && <p className="mt-1.5 text-sm text-red-500">{errors.description}</p>}
                </div>
              </div>
            )}

            {/* ==================== STEP 2: Date, time and location ==================== */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => updateField('date', e.target.value)}
                      className={inputClass('date')}
                    />
                    {errors.date && <p className="mt-1.5 text-sm text-red-500">{errors.date}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Time</label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => updateField('time', e.target.value)}
                      className={inputClass('time')}
                    />
                    {errors.time && <p className="mt-1.5 text-sm text-red-500">{errors.time}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                  <input
                    value={formData.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    maxLength={160}
                    placeholder="e.g. Main Auditorium, University of Kelaniya"
                    className={inputClass('location')}
                  />
                  {errors.location && <p className="mt-1.5 text-sm text-red-500">{errors.location}</p>}
                </div>
              </div>
            )}

            {/* ==================== STEP 3: Profile photo ==================== */}
            {currentStep === 3 && (
              <ImagePicker
                value={formData.profilePhoto}
                onChange={(image) => updateField('profilePhoto', image)}
                shape="circle"
                maxWidth={400}
              />
            )}

            {/* ==================== STEP 4: Cover photo ==================== */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <ImagePicker
                  value={formData.coverPhoto}
                  onChange={(image) => updateField('coverPhoto', image)}
                  shape="cover"
                  maxWidth={1600}
                />
              </div>
            )}

            {/* ==================== STEP 5: Organizers ==================== */}
            {currentStep === 5 && (
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-400 mb-2">Organizers</p>
                  <div className="flex flex-wrap gap-2">
                    {/* The creator is always an organizer */}
                    <span className="rounded-full bg-[#800000] px-3 py-1 text-xs font-semibold text-white">
                      {user?.firstName} {user?.lastName} (you)
                    </span>
                    {organizers.map((organizer) => (
                      <span
                        key={organizer.id}
                        className="flex items-center gap-1 rounded-full bg-[#800000]/10 px-3 py-1 text-xs font-semibold text-[#800000]"
                      >
                        {organizer.firstName} {organizer.lastName}
                        <button
                          type="button"
                          onClick={() => removeOrganizer(organizer.id)}
                          aria-label={`Remove ${organizer.firstName}`}
                        >
                          <HiX className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <UserPicker
                  onSelect={addOrganizer}
                  excludeIds={[user?.id, ...organizers.map((organizer) => organizer.id)]}
                  buttonLabel="Add"
                />
              </div>
            )}

            {/* ==================== Back / Next buttons ==================== */}
            <div className="flex gap-3 mt-8">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-2 px-5 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
                >
                  <HiArrowLeft className="w-4 h-4" /> Back
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-5 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              )}
              <button
                type="button"
                onClick={handleNext}
                disabled={saving}
                className="flex-1 py-3 bg-[#800000] text-white font-semibold rounded-xl hover:bg-[#660000] disabled:opacity-50 transition-all"
              >
                {currentStep === totalSteps ? (saving ? 'Creating...' : 'Create Event') : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateEventPage;
