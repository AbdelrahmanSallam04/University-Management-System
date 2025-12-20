package com.university.backend.service;

import com.university.backend.dto.*;
import com.university.backend.model.*;
import com.university.backend.repository.*;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StaffDirectoryService {
    private final StaffMemberRepository staffMemberRepository;
    private final ProfessorRepository professorRepository;
    private final TARepository taRepository;
    private final OfficeHoursRepository officeHoursRepository;
    private final OfficeHourSlotRepository officeHourSlotRepository;
    private final CourseRepository courseRepository;
    private final StudentRepository studentRepository; // Add this
    private final HttpSession session;

    private Student getCurrentStudent() {
        Integer userId = (Integer) session.getAttribute("userID");
        if (userId == null) {
            return null;
        }
        return studentRepository.findById(userId).orElse(null);
    }


    public List<StaffMemberDTO> getAllStaff() {
        List<StaffMember> allStaff = staffMemberRepository.findAll();
        return allStaff.stream()
                .map(this::convertStaffMemberToDTO)
                .collect(Collectors.toList());
    }

    public List<StaffMemberDTO> getProfessors() {
        List<Professor> professors = professorRepository.findAll();
        return professors.stream()
                .map(this::convertProfessorToDTO)
                .collect(Collectors.toList());
    }

    public List<StaffMemberDTO> getTAs() {
        List<TA> tas = taRepository.findAll();
        return tas.stream()
                .map(this::convertTAToDTO)
                .collect(Collectors.toList());
    }

    public List<OfficeHoursDTO> getOfficeHours(Integer staffMemberId) {
        List<OfficeHours> officeHours = officeHoursRepository.findByStaffMember_UserId(Math.toIntExact(Long.valueOf(staffMemberId)));

        if (officeHours.isEmpty()) {
            return new ArrayList<>();
        }

        // Get staff member for name
        StaffMember staff = staffMemberRepository.findById(staffMemberId)
                .orElseThrow(() -> new RuntimeException("Staff member not found with ID: " + staffMemberId));

        return officeHours.stream()
                .map(oh -> convertToOfficeHoursDTO(oh, staff))
                .collect(Collectors.toList());
    }

    private StaffMemberDTO convertStaffMemberToDTO(StaffMember staffMember) {
        StaffMemberDTO dto = new StaffMemberDTO();

        // Safely get the ID
        if (staffMember != null) {
            // Use getUserId() instead of getId()
            dto.setId(staffMember.getUserId() != null ? staffMember.getUserId().longValue() : null);
            dto.setFirstName(staffMember.getFirstName());
            dto.setLastName(staffMember.getLastName());

            if (staffMember.getDepartment() != null) {
                dto.setDepartmentName(staffMember.getDepartment().getDepartmentName());
            }

            // Check if staff has office hours in database
            if (staffMember.getUserId() != null) {
                List<OfficeHours> hours = officeHoursRepository.findByStaffMember_UserId(Math.toIntExact(Long.valueOf(staffMember.getUserId())));
                dto.setHasOfficeHours(!hours.isEmpty());
            } else {
                dto.setHasOfficeHours(false);
            }

            if (staffMember instanceof Professor) {
                dto.setStaffType("Professor");
                dto.setCourses(getProfessorCourses((Professor) staffMember));
            } else if (staffMember instanceof TA) {
                dto.setStaffType("Teaching Assistant");
                dto.setCourses(getTACourses((TA) staffMember));
            } else {
                dto.setStaffType("Staff");
                dto.setCourses(new ArrayList<>());
            }
        }

        return dto;
    }

    private StaffMemberDTO convertProfessorToDTO(Professor professor) {
        StaffMemberDTO dto = convertStaffMemberToDTO(professor);
        if (dto != null) {
            dto.setStaffType("Professor");
            dto.setCourses(getProfessorCourses(professor));
        }
        return dto;
    }

    private StaffMemberDTO convertTAToDTO(TA ta) {
        StaffMemberDTO dto = convertStaffMemberToDTO(ta);
        if (dto != null) {
            dto.setStaffType("Teaching Assistant");
            dto.setCourses(getTACourses(ta));
        }
        return dto;
    }

    private List<CourseInfoDTO> getProfessorCourses(Professor professor) {
        if (professor == null) return new ArrayList<>();

        List<Course> courses = courseRepository.findByProfessor(professor);
        if (courses == null) return new ArrayList<>();

        return courses.stream()
                .map(this::convertCourseToDTO)
                .collect(Collectors.toList());
    }

    private List<CourseInfoDTO> getTACourses(TA ta) {
        if (ta == null) return new ArrayList<>();

        if (ta.getAssistingCourses() != null) {
            return ta.getAssistingCourses().stream()
                    .map(this::convertCourseToDTO)
                    .collect(Collectors.toList());
        }
        return new ArrayList<>();
    }

    private CourseInfoDTO convertCourseToDTO(Course course) {
        CourseInfoDTO dto = new CourseInfoDTO();
        if (course != null) {
            dto.setCourseId(course.getCourseId());
            dto.setCode(course.getCode());
            dto.setName(course.getName());
        }
        return dto;
    }

    private OfficeHoursDTO convertToOfficeHoursDTO(OfficeHours officeHours, StaffMember staff) {
        OfficeHoursDTO dto = new OfficeHoursDTO();
        if (officeHours != null && staff != null) {
            dto.setId(officeHours.getId());
            dto.setDayOfWeek(officeHours.getDayOfWeek());
            dto.setStartTime(officeHours.getStartTime());
            dto.setEndTime(officeHours.getEndTime());
            dto.setSlotDuration(officeHours.getSlotDuration());
            dto.setStaffName(staff.getFirstName() + " " + staff.getLastName());
            dto.setStaffType(staff instanceof Professor ? "Professor" : "Teaching Assistant");

            // Get existing slots from database
            List<OfficeHourSlot> slots = officeHourSlotRepository.findByOfficeHoursId(officeHours.getId());

            // Filter for upcoming slots only (next 4 weeks)
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime fourWeeksLater = now.plusWeeks(4);

            List<OfficeHourSlot> upcomingSlots = slots.stream()
                    .filter(slot -> slot != null && slot.getSlotDateTime() != null)
                    .filter(slot ->
                            slot.getSlotDateTime().isAfter(now) &&
                                    slot.getSlotDateTime().isBefore(fourWeeksLater)
                    )
                    .collect(Collectors.toList());

            dto.setSlots(upcomingSlots.stream()
                    .map(slot -> convertToSlotDTO(slot, staff))
                    .collect(Collectors.toList()));
        }

        return dto;
    }
    // ADD THIS NEW METHOD FOR BOOKING
    public OfficeHourSlotDTO bookOfficeHourSlot(Long slotId, String purpose) {
        Student currentStudent = getCurrentStudent();
        if (currentStudent == null) {
            throw new RuntimeException("Student not authenticated. Please log in.");
        }

        OfficeHourSlot slot = officeHourSlotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Time slot not found"));

        if (slot.getStatus() != OfficeHourSlot.SlotStatus.AVAILABLE) {
            throw new RuntimeException("This time slot is no longer available");
        }

        // Check if slot is in the future
        if (slot.getSlotDateTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Cannot book past time slots");
        }

        // Check if student already has a booking at this time
        List<OfficeHourSlot> studentBookings = officeHourSlotRepository.findByBookedBy_UserId(currentStudent.getUserId());
        boolean hasConflict = studentBookings.stream()
                .anyMatch(booking ->
                        booking.getSlotDateTime().toLocalDate().equals(slot.getSlotDateTime().toLocalDate()) &&
                                booking.getOfficeHours().getStaffMember().getUserId().equals(slot.getOfficeHours().getStaffMember().getUserId())
                );

        if (hasConflict) {
            throw new RuntimeException("You already have a booking with this staff member for this date");
        }

        slot.setBookedBy(currentStudent);
        slot.setPurpose(purpose);
        slot.setStatus(OfficeHourSlot.SlotStatus.BOOKED);

        OfficeHourSlot savedSlot = officeHourSlotRepository.save(slot);
        return convertToSlotDTO(savedSlot, savedSlot.getOfficeHours().getStaffMember());
    }

    // UPDATE THIS METHOD to set bookable to true for available slots
    private OfficeHourSlotDTO convertToSlotDTO(OfficeHourSlot slot, StaffMember staff) {
        OfficeHourSlotDTO dto = new OfficeHourSlotDTO();
        if (slot != null && staff != null) {
            dto.setId(slot.getId());
            dto.setSlotDateTime(slot.getSlotDateTime());
            dto.setEndDateTime(slot.getEndDateTime());

            if (slot.getBookedBy() != null) {
                dto.setStudentName(slot.getBookedBy().getFirstName() + " " + slot.getBookedBy().getLastName());
                dto.setPurpose(slot.getPurpose());
            }

            dto.setStatus(slot.getStatus() != null ? slot.getStatus().toString() : "UNKNOWN");

            // CHANGE THIS LINE: Set bookable to true for available slots
            dto.setBookable(slot.getStatus() == OfficeHourSlot.SlotStatus.AVAILABLE);

            dto.setStaffName(staff.getFirstName() + " " + staff.getLastName());
            dto.setStaffType(staff instanceof Professor ? "Professor" : "Teaching Assistant");
        }

        return dto;
    }
}