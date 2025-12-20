package com.university.backend.service;

import com.university.backend.dto.*;
import com.university.backend.model.*;
import com.university.backend.repository.*;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
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
    private final OfficeHourSlotRepository officeHourSlotRepository;
    private final CourseRepository courseRepository;
    private final StudentRepository studentRepository;
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

    // Changed return type to List<OfficeHourSlotDTO>
    public List<OfficeHourSlotDTO> getOfficeHours(Integer staffMemberId) {
        // Get upcoming slots for this staff member (next 4 weeks)
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime fourWeeksLater = now.plusWeeks(4);

        List<OfficeHourSlot> slots = officeHourSlotRepository.findByStaffMember_UserIdAndSlotDateTimeBetween(
                staffMemberId, now, fourWeeksLater
        );

        if (slots.isEmpty()) {
            return new ArrayList<>();
        }

        // Get staff member for name
        StaffMember staff = staffMemberRepository.findById(staffMemberId)
                .orElseThrow(() -> new RuntimeException("Staff member not found with ID: " + staffMemberId));

        // Convert each slot to DTO
        return slots.stream()
                .map(slot -> convertToOfficeHourSlotDTO(slot, staff))
                .collect(Collectors.toList());
    }

    private OfficeHourSlotDTO convertToOfficeHourSlotDTO(OfficeHourSlot slot, StaffMember staff) {
        OfficeHourSlotDTO dto = new OfficeHourSlotDTO();
        dto.setId(slot.getId());
        dto.setSlotDateTime(slot.getStartTime());
        dto.setEndDateTime(slot.getEndTime());

        if (slot.getBookedBy() != null) {
            dto.setStudentName(slot.getBookedBy().getFirstName() + " " + slot.getBookedBy().getLastName());
            dto.setPurpose(slot.getPurpose());
        }

        dto.setStatus(slot.getStatus().toString());
        dto.setBookable(slot.getStatus() == OfficeHourSlot.SlotStatus.AVAILABLE); // This should work now
        dto.setStaffName(staff.getFirstName() + " " + staff.getLastName());
        dto.setStaffType(staff instanceof Professor ? "Professor" : "Teaching Assistant");

        // For backward compatibility, set slots as empty list
        dto.setSlots(new ArrayList<>());

        return dto;
    }

    private StaffMemberDTO convertStaffMemberToDTO(StaffMember staffMember) {
        StaffMemberDTO dto = new StaffMemberDTO();

        if (staffMember != null) {
            dto.setId(staffMember.getUserId() != null ? staffMember.getUserId().longValue() : null);
            dto.setFirstName(staffMember.getFirstName());
            dto.setLastName(staffMember.getLastName());

            if (staffMember.getDepartment() != null) {
                dto.setDepartmentName(staffMember.getDepartment().getDepartmentName());
            }

            // Check if staff has office hours in database
            if (staffMember.getUserId() != null) {
                List<OfficeHourSlot> slots = officeHourSlotRepository.findByStaffMember_UserId(staffMember.getUserId());
                dto.setHasOfficeHours(!slots.isEmpty());
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

    // Booking method - returns OfficeHourSlotDTO
    public OfficeHourSlotDTO bookOfficeHourSlot(Integer slotId, String purpose) {
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
        if (slot.getStartTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Cannot book past time slots");
        }

        // Check if student already has a booking at this time with same staff member
        List<OfficeHourSlot> studentBookings = officeHourSlotRepository.findByBookedBy_UserId(currentStudent.getUserId());
        boolean hasConflict = studentBookings.stream()
                .anyMatch(booking ->
                        booking.getStartTime().toLocalDate().equals(slot.getStartTime().toLocalDate()) &&
                                booking.getStaffMember().getUserId().equals(slot.getStaffMember().getUserId())
                );

        if (hasConflict) {
            throw new RuntimeException("You already have a booking with this staff member for this date");
        }

        slot.setBookedBy(currentStudent);
        slot.setPurpose(purpose);
        slot.setStatus(OfficeHourSlot.SlotStatus.BOOKED);

        OfficeHourSlot savedSlot = officeHourSlotRepository.save(slot);
        return convertToOfficeHourSlotDTO(savedSlot, savedSlot.getStaffMember());
    }
}