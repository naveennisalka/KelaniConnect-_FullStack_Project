package com.example.kelani_media.controller;

import com.example.kelani_media.dto.ApplyForJobRequest;
import com.example.kelani_media.dto.CreateJobRequest;
import com.example.kelani_media.dto.SubmitWorkRequest;
import com.example.kelani_media.model.Job;
import com.example.kelani_media.model.JobApplication;
import com.example.kelani_media.model.User;
import com.example.kelani_media.repository.JobApplicationRepository;
import com.example.kelani_media.repository.JobRepository;
import com.example.kelani_media.service.CurrentUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobRepository jobRepository;
    private final JobApplicationRepository applicationRepository;
    private final CurrentUserService currentUserService;

    @GetMapping
    public List<Job> getJobs() {
        return jobRepository.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping
    public Job createJob(Authentication authentication, @Valid @RequestBody CreateJobRequest request) {
        User publisher = currentUserService.require(authentication);
        currentUserService.requireAnyRole(publisher, "ADMIN", "TEACHER");

        Job job = new Job();
        job.setTitle(request.title().trim());
        job.setSociety(request.society().trim());
        job.setLocation(request.location().trim());
        job.setStipend(request.stipend().trim());
        job.setDescription(request.description().trim());
        job.setImageUrl(blankToNull(request.imageUrl()));
        job.setCreatedBy(publisher.getId());
        job.setCreatedByName((publisher.getFirstName() + " " + publisher.getLastName()).trim());
        return jobRepository.save(job);
    }

    @GetMapping("/my-applications")
    public List<JobApplication> getMyApplications(Authentication authentication) {
        User user = currentUserService.require(authentication);
        return applicationRepository.findByApplicantIdOrderByCreatedAtDesc(user.getId());
    }

    @PostMapping("/{jobId}/applications")
    public JobApplication applyForJob(
            Authentication authentication,
            @PathVariable String jobId,
            @Valid @RequestBody ApplyForJobRequest request
    ) {
        User applicant = currentUserService.require(authentication);
        Job job = findJob(jobId);
        if (applicant.getId().equals(job.getCreatedBy())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot apply for your own job");
        }
        if (applicationRepository.existsByJobIdAndApplicantId(jobId, applicant.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "You have already applied for this job");
        }

        JobApplication application = new JobApplication();
        application.setJobId(job.getId());
        application.setJobTitle(job.getTitle());
        application.setApplicantId(applicant.getId());
        application.setApplicantName((applicant.getFirstName() + " " + applicant.getLastName()).trim());
        application.setCoverLetter(request.coverLetter() == null ? "" : request.coverLetter().trim());
        return applicationRepository.save(application);
    }

    @PostMapping("/applications/{applicationId}/submission")
    public JobApplication submitWork(
            Authentication authentication,
            @PathVariable String applicationId,
            @Valid @RequestBody SubmitWorkRequest request
    ) {
        User applicant = currentUserService.require(authentication);
        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));
        if (!application.getApplicantId().equals(applicant.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot submit work for this application");
        }

        application.setSubmissionUrl(request.submissionUrl().trim());
        application.setSubmissionComment(request.comment() == null ? "" : request.comment().trim());
        application.setStatus("SUBMITTED");
        application.setUpdatedAt(LocalDateTime.now());
        return applicationRepository.save(application);
    }

    private Job findJob(String jobId) {
        return jobRepository.findById(jobId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found"));
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
