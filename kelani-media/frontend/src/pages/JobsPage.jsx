import React, { useEffect, useState } from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import { useAuth } from '../context/AuthContext.jsx';
import { jobService } from '../services/jobService.js';
import toast from 'react-hot-toast';

const EMPTY_JOB = {
  title: '',
  society: '',
  location: '',
  stipend: '',
  description: '',
  imageUrl: ''
};

const JobsPage = () => {
  const { user } = useAuth();
  const canPublish = user?.roles?.some((role) => ['ADMIN', 'TEACHER'].includes(role));
  const [activeTab, setActiveTab] = useState('Jobs');
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingJob, setSavingJob] = useState(false);
  const [jobForm, setJobForm] = useState(EMPTY_JOB);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [submission, setSubmission] = useState({ submissionUrl: '', comment: '' });
  const [savingSubmission, setSavingSubmission] = useState(false);

  const loadJobs = async () => {
    try {
      const [availableJobs, myApplications] = await Promise.all([
        jobService.getJobs(),
        jobService.getMyApplications()
      ]);
      setJobs(availableJobs);
      setApplications(myApplications);
    } catch {
      toast.error('Could not load jobs. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setSavingJob(true);
    try {
      const job = await jobService.createJob(jobForm);
      setJobs((currentJobs) => [job, ...currentJobs]);
      setJobForm(EMPTY_JOB);
      toast.success('Job posted.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not post this job.');
    } finally {
      setSavingJob(false);
    }
  };

  const handleApply = async (job) => {
    try {
      const application = await jobService.apply(job.id, '');
      setApplications((currentApplications) => [application, ...currentApplications]);
      toast.success('Application submitted.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not apply for this job.');
    }
  };

  const handleSubmitWork = async (e) => {
    e.preventDefault();
    if (!selectedApplication) return;
    setSavingSubmission(true);
    try {
      const updatedApplication = await jobService.submitWork(selectedApplication.id, submission);
      setApplications((currentApplications) => currentApplications.map((application) => (
        application.id === updatedApplication.id ? updatedApplication : application
      )));
      setSelectedApplication(null);
      setSubmission({ submissionUrl: '', comment: '' });
      toast.success('Work submission saved.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not submit your work.');
    } finally {
      setSavingSubmission(false);
    }
  };

  const appliedJobIds = new Set(applications.map((application) => application.jobId));

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <main className="flex-1 flex flex-col lg:flex-row p-6 gap-6 max-w-7xl mx-auto w-full">
        <section className="flex-1 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Campus Jobs</h1>
            <p className="text-sm text-gray-500 mt-1">Browse opportunities and manage your applications.</p>
          </div>

          {canPublish ? (
            <form onSubmit={handleCreateJob} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-3">
              <h2 className="font-bold text-gray-800">Post a job</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ['title', 'Job title'],
                  ['society', 'Organization'],
                  ['location', 'Location'],
                  ['stipend', 'Compensation']
                ].map(([field, label]) => (
                  <input
                    key={field}
                    required
                    maxLength={160}
                    value={jobForm[field]}
                    onChange={(e) => setJobForm({ ...jobForm, [field]: e.target.value })}
                    placeholder={label}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  />
                ))}
              </div>
              <textarea
                required
                maxLength={5000}
                value={jobForm.description}
                onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                placeholder="Describe the opportunity"
                rows={3}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
              <input
                type="url"
                maxLength={2048}
                value={jobForm.imageUrl}
                onChange={(e) => setJobForm({ ...jobForm, imageUrl: e.target.value })}
                placeholder="Image URL (optional)"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
              <button disabled={savingJob} className="rounded-lg bg-[#800000] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                {savingJob ? 'Posting...' : 'Publish job'}
              </button>
            </form>
          ) : (
            <p className="rounded-xl bg-white p-4 text-xs text-gray-500 shadow-sm">
              Job publishing is limited to teacher and admin accounts.
            </p>
          )}

          <div className="flex gap-6 border-b border-gray-200 px-2">
            {['Jobs', 'Ongoing'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 text-sm font-semibold ${activeTab === tab ? 'border-b-2 border-[#800000] text-[#800000]' : 'text-gray-400'}`}
              >
                {tab}{tab === 'Ongoing' ? ` (${applications.length})` : ''}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="py-8 text-center text-sm text-gray-400">Loading jobs...</p>
          ) : activeTab === 'Jobs' ? (
            jobs.length ? jobs.map((job) => (
              <article key={job.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
                <div className="flex justify-between gap-4">
                  <div>
                    <h2 className="font-bold text-gray-800">{job.title}</h2>
                    <p className="text-xs text-gray-500">{job.society} · {job.location}</p>
                  </div>
                  <span className="h-fit rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-xs font-semibold text-[#800000]">{job.stipend}</span>
                </div>
                {job.imageUrl && <img src={job.imageUrl} alt="Job" loading="lazy" className="max-h-64 w-full rounded-xl object-cover" />}
                <p className="whitespace-pre-line text-sm text-gray-600">{job.description}</p>
                <p className="text-xs text-gray-400">Posted by {job.createdByName}</p>
                <button
                  type="button"
                  onClick={() => handleApply(job)}
                  disabled={appliedJobIds.has(job.id) || job.createdBy === user?.id}
                  className="w-full rounded-xl bg-[#3d4451] py-2.5 text-xs font-medium text-white hover:bg-[#2d323c] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {job.createdBy === user?.id ? 'Your job posting' : appliedJobIds.has(job.id) ? 'Applied' : 'Apply for job'}
                </button>
              </article>
            )) : <p className="rounded-xl bg-white p-8 text-center text-sm text-gray-400">No job opportunities have been posted yet.</p>
          ) : applications.length ? applications.map((application) => (
            <article key={application.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-bold text-gray-800">{application.jobTitle}</h2>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">{application.status}</span>
              </div>
              {application.submissionUrl && (
                <a href={application.submissionUrl} target="_blank" rel="noreferrer" className="text-sm text-[#800000] underline">Submitted work</a>
              )}
              {application.status !== 'SUBMITTED' && (
                <button
                  type="button"
                  onClick={() => setSelectedApplication(application)}
                  className="rounded-lg bg-[#3d4451] px-5 py-2 text-xs font-semibold text-white"
                >
                  Submit work link
                </button>
              )}
            </article>
          )) : <p className="rounded-xl bg-white p-8 text-center text-sm text-gray-400">You haven’t applied for any jobs yet.</p>}
        </section>

        <aside className="w-full lg:w-72 space-y-4">
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-800">My applications</h2>
            <p className="mt-2 text-3xl font-bold text-[#800000]">{applications.length}</p>
            <p className="text-xs text-gray-500">Applications saved to your account</p>
          </div>
        </aside>
      </main>

      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form onSubmit={handleSubmitWork} className="w-full max-w-lg space-y-4 rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="font-bold text-gray-800">Submit work for {selectedApplication.jobTitle}</h2>
            <label className="block text-xs font-semibold text-gray-600">
              Work URL
              <input
                required
                type="url"
                maxLength={2048}
                value={submission.submissionUrl}
                onChange={(e) => setSubmission({ ...submission, submissionUrl: e.target.value })}
                placeholder="https://..."
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-normal"
              />
            </label>
            <label className="block text-xs font-semibold text-gray-600">
              Comments
              <textarea
                maxLength={2000}
                value={submission.comment}
                onChange={(e) => setSubmission({ ...submission, comment: e.target.value })}
                rows={3}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-normal"
              />
            </label>
            <div className="flex gap-2">
              <button disabled={savingSubmission} className="flex-1 rounded-lg bg-[#800000] py-2 text-sm font-semibold text-white disabled:opacity-50">
                {savingSubmission ? 'Saving...' : 'Submit'}
              </button>
              <button type="button" onClick={() => setSelectedApplication(null)} className="flex-1 rounded-lg bg-gray-100 py-2 text-sm font-semibold text-gray-700">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default JobsPage;
