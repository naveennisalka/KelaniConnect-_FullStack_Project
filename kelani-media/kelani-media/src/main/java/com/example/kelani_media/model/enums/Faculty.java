package com.example.kelani_media.model.enums;

public enum Faculty {
    FACULTY_OF_COMPUTING_AND_TECHNOLOGY("Faculty of Computing & Technology"),
    FACULTY_OF_SCIENCE("Faculty of Science"),
    FACULTY_OF_HUMANITIES("Faculty of Humanities"),
    FACULTY_OF_SOCIAL_SCIENCES("Faculty of Social Sciences"),
    FACULTY_OF_COMMERCE_AND_MANAGEMENT("Faculty of Commerce & Management"),
    FACULTY_OF_MEDICINE("Faculty of Medicine");

    private final String displayName;

    Faculty(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
