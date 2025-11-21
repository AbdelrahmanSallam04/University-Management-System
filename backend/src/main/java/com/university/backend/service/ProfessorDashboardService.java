package com.university.backend.service;

import com.university.backend.dto.Advised_By_ProfessorDTO;
import com.university.backend.dto.Course_by_ProfessorDTO;
import com.university.backend.dto.ProfessorDashboardDTO;
import com.university.backend.model.Course;
import com.university.backend.model.Professor;
import com.university.backend.model.Student;
import com.university.backend.repository.ProfessorRepository;
import com.university.backend.repository.CourseRepository;
import com.university.backend.repository.StudentRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service layer to handle business logic for the Professor Dashboard.
 * Fetches data from repositories and maps it to ProfessorDashboardDTO,
 * respecting the new User (Integer PK) and Account (for email) schema.
 */
@Service
public class ProfessorDashboardService {

    private final ProfessorRepository professorRepository;
    private final CourseRepository courseRepository;
    private final StudentRepository studentRepository;

    public ProfessorDashboardService(ProfessorRepository professorRepository, CourseRepository courseRepository, StudentRepository studentRepository) {
        this.professorRepository = professorRepository;
        this.courseRepository = courseRepository;
        this.studentRepository = studentRepository;
    }

    /**
     * Retrieves all data required for the professor's dashboard view.
     * @param professorId The ID of the professor (Integer).
     * @return ProfessorDashboardDTO containing profile, courses, and advisees.
     * @throws RuntimeException if the professor is not found.
     */
    public ProfessorDashboardDTO getProfessorDashboardData(Integer professorId) {

        // 1. Fetch Professor Entity (using Integer PK)
        Optional<Professor> professorOpt = professorRepository.findById(Long.valueOf(professorId));

        if (professorOpt.isEmpty()) {
            throw new RuntimeException("Professor with ID " + professorId + " not found.");
        }

        Professor professor = professorOpt.get();

        // 2. Fetch Taught Courses
        List<Course> taughtCourses = courseRepository.findByProfessor(professor);

        // 3. Fetch Advisee Students
        List<Student> adviseeStudents = studentRepository.findByAdvisor(professor);

        // 4. Map entities to the ProfessorDashboardDTO
        return mapToProfessorDashboardDTO(professor, taughtCourses, adviseeStudents);
    }

    /**
     * Maps the fetched entities to the ProfessorDashboardDTO.
     */
    private ProfessorDashboardDTO mapToProfessorDashboardDTO(
            Professor professor,
            List<Course> taughtCourses,
            List<Student> adviseeStudents) {

        ProfessorDashboardDTO dto = new ProfessorDashboardDTO();

        // --- 1. Professor Profile and Department Info ---
        dto.setUserId(professor.getUserId());
        dto.setFirstName(professor.getFirstName());
        dto.setLastName(professor.getLastName());

        // Email is fetched via the Account entity
        if (professor.getAccount() != null) {
            dto.setEmail(professor.getAccount().getEmail());
        } else {
            dto.setEmail("N/A");
        }

        // Salary is from StaffMember
        dto.setSalary(professor.getSalary());

        if (professor.getDepartment() != null) {
            // Since the Department model lacks a 'name' field, we use the ID as a placeholder string.
            // If you add a 'name' field, change this line to: dto.setDepartmentName(professor.getDepartment().getName());
            dto.setDepartmentName(professor.getDepartment().getDepartmentId().toString());
        }

        // --- 2. Taught Courses ---
        List<Course_by_ProfessorDTO> courseDTOs = taughtCourses.stream()
                .map(this::mapToCourseDTO)
                .collect(Collectors.toList());
        dto.setTaughtCourses(courseDTOs);

        // --- 3. Advisee Students ---
        List<Advised_By_ProfessorDTO> adviseeDTOs = adviseeStudents.stream()
                .map(this::mapToAdviseeDTO)
                .collect(Collectors.toList());
        dto.setAdviseeStudents(adviseeDTOs);

        return dto;
    }

    /**
     * Helper method to map Course entity to Course_by_ProfessorDTO.
     */
    private Course_by_ProfessorDTO mapToCourseDTO(Course course) {
        Course_by_ProfessorDTO dto = new Course_by_ProfessorDTO();
        dto.setCourseId(course.getCourseId());
        dto.setCode(course.getCode());
        dto.setName(course.getName());
        dto.setCreditHours(course.getCreditHours());
        return dto;
    }

    /**
     * Helper method to map Student entity to Advised_By_ProfessorDTO.
     */
    private Advised_By_ProfessorDTO mapToAdviseeDTO(Student student) {
        Advised_By_ProfessorDTO dto = new Advised_By_ProfessorDTO();
        // Uses Integer PK:
        dto.setStudentId(student.getUserId());
        dto.setFirstName(student.getFirstName());
        dto.setLastName(student.getLastName());

        // Email is fetched via the Account entity
        if (student.getAccount() != null) {
            dto.setEmail(student.getAccount().getEmail());
        } else {
            dto.setEmail("N/A");
        }

        return dto;
    }
}