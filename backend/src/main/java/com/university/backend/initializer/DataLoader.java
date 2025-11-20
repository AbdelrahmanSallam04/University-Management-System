//package com.university.backend.initializer;
//
//import com.university.backend.model.*; // Import all your model classes
//import com.university.backend.repository.*; // Import all your repository interfaces
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.stereotype.Component;
//import java.time.LocalDateTime;
//
//@Component
//public class DataLoader implements CommandLineRunner {
//
//    // Inject repositories for the entities we need to populate
//    private final RoomRepository roomRepository;
//    private final BookingRepository bookingRepository;
//    private final RoomTypeRepository roomTypeRepository;
//    private final BookingStatusRepository bookingStatusRepository;
//    private final StaffMemberRepository staffMemberRepository; // Assuming this exists
//
//    @Autowired
//    public DataLoader(RoomRepository roomRepository, BookingRepository bookingRepository,
//                      RoomTypeRepository roomTypeRepository, BookingStatusRepository bookingStatusRepository,
//                      StaffMemberRepository staffMemberRepository) {
//        this.roomRepository = roomRepository;
//        this.bookingRepository = bookingRepository;
//        this.roomTypeRepository = roomTypeRepository;
//        this.bookingStatusRepository = bookingStatusRepository;
//        this.staffMemberRepository = staffMemberRepository;
//    }
//
//    @Override
//    public void run(String... args) throws Exception {
//        if (roomRepository.count() == 0) {
//            System.out.println("--- Initializing Mock Data for Room Availability Testing ---");
//
//            // 1. Create Statuses
//            BookingStatus confirmedStatus = new BookingStatus();
//            confirmedStatus.setId(1);
//            confirmedStatus.setStatus("Confirmed");
//            bookingStatusRepository.save(confirmedStatus);
//
//            BookingStatus pendingStatus = new BookingStatus();
//            pendingStatus.setId(2);
//            pendingStatus.setStatus("Pending");
//            bookingStatusRepository.save(pendingStatus);
//
//            // 2. Create Room Types
//            RoomType classroom = new RoomType();
//            classroom.setType("Classroom");
//            roomTypeRepository.save(classroom);
//
//            RoomType lab = new RoomType();
//            lab.setType("Computer Lab");
//            roomTypeRepository.save(lab);
//
//            // 3. Create a Mock Faculty Member
//            Professor faculty = new Professor();
//            // NOTE: You'll need to define fields like ID, Name, etc., based on your StaffMember entity
//            // For testing, we only need the ID/primary key to avoid null reference in Booking
//            staffMemberRepository.save(faculty);
//
//
//            // 4. Create Rooms
//            Room roomA101 = new Room();
//            roomA101.setRoom_code("A101");
//            roomA101.setRoom_type(classroom);
//            roomA101.setBuilding("Main");
//            roomA101.setCapacity(50);
//            roomA101.setActive(true);
//            roomRepository.save(roomA101);
//
//            Room roomL205 = new Room();
//            roomL205.setRoom_code("L205");
//            roomL205.setRoom_type(lab);
//            roomL205.setBuilding("Science");
//            roomL205.setCapacity(30);
//            roomL205.setActive(true);
//            roomRepository.save(roomL205);
//
//            // 5. Create a Conflicting Booking (Booked for TODAY at 09:30-11:00)
//
//            // CRITICAL: Set the date to TODAY's date (November 20, 2025)
//            // to match the default selected date in the React frontend.
//            LocalDateTime todayStart = LocalDateTime.of(2025, 11, 20, 9, 30);
//            LocalDateTime todayEnd = LocalDateTime.of(2025, 11, 20, 11, 0);
//
//            Booking booking = new Booking();
//            booking.setRoom(roomA101);
//            booking.setBookedByFaculty(faculty);
//            booking.setPurpose("Project Review Meeting");
//            booking.setStartTime(todayStart);
//            booking.setEndTime(todayEnd);
//            booking.setCreatedAt(LocalDateTime.now());
//            booking.setStatus(confirmedStatus);
//            bookingRepository.save(booking);
//
//            System.out.println("--- Data initialized successfully: A101 is booked 09:30-11:00 ---");
//        }
//    }
//}