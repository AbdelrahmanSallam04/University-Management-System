package com.university.backend.service;

import com.university.backend.model.TA;
import com.university.backend.repository.TARepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
public class TADashboardService {

    private final TARepository taRepository;

    @Autowired
    public TADashboardService(TARepository taRepository) {
        this.taRepository = taRepository;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getTADashboardDataAsMap(Integer userId) {
        Map<String, Object> response = new HashMap<>();

        try {
            System.out.println("Looking for TA with userId: " + userId);

            // Find TA by userId
            TA ta = taRepository.findByUserId(userId).orElse(null);

            if (ta != null) {
                System.out.println("TA found: " + ta.getFirstName() + " " + ta.getLastName());
                System.out.println("TA ID: " + ta.getUserId());

                // Basic TA info
                response.put("userId", ta.getUserId());
                response.put("firstName", ta.getFirstName());
                response.put("lastName", ta.getLastName());
                response.put("phone", ta.getPhone());
                response.put("salary", ta.getSalary());

                // Department info
                if (ta.getDepartment() != null) {
                    response.put("departmentName", ta.getDepartment().getDepartmentName());
                } else {
                    response.put("departmentName", "Not Assigned");
                }
                response.put("accountType", "TA");

                // Count assigned courses - use the ManyToMany relationship
                int assignedCourses = 0;
                try {
                    if (ta.getAssistingCourses() != null) {
                        assignedCourses = ta.getAssistingCourses().size();
                        System.out.println("Number of assisting courses: " + assignedCourses);
                    }
                } catch (Exception e) {
                    System.err.println("Error getting assisting courses: " + e.getMessage());
                    assignedCourses = 0;
                }
                response.put("assignedCourses", assignedCourses);

                // Count office hours
                int officeHours = 0;
                try {
                    if (ta.getOfficeHourSlots() != null) {
                        officeHours = ta.getOfficeHourSlots().size();
                    }
                } catch (Exception e) {
                    System.err.println("Error getting office hours: " + e.getMessage());
                    officeHours = 0;
                }
                response.put("officeHours", officeHours);

                // Additional debug info
                response.put("success", true);
                response.put("message", "TA data retrieved successfully");

                return response;
            } else {
                System.out.println("No TA found for userId: " + userId);
                response.put("success", false);
                response.put("error", "TA not found in database");
                response.put("userId", userId);
                return response;
            }

        } catch (Exception e) {
            System.err.println("Error in TAService.getTADashboardDataAsMap: " + e.getMessage());
            e.printStackTrace();
            return createErrorResponse(userId, e);
        }
    }

    private Map<String, Object> createErrorResponse(Integer userId, Exception e) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("userId", userId);
        errorResponse.put("firstName", "Error");
        errorResponse.put("lastName", "Loading");
        errorResponse.put("email", "error@university.edu");
        errorResponse.put("departmentName", "Error Department");
        errorResponse.put("assignedCourses", 0);
        errorResponse.put("officeHours", 0);
        errorResponse.put("accountType", "TA");
        errorResponse.put("success", false);
        errorResponse.put("error", e.getMessage());
        errorResponse.put("debug", "Check backend logs for details");
        return errorResponse;
    }

    // Simple method to check if TA exists
    public boolean doesTAExist(Integer userId) {
        try {
            return taRepository.findByUserId(userId).isPresent();
        } catch (Exception e) {
            System.err.println("Error checking TA existence: " + e.getMessage());
            return false;
        }
    }
}