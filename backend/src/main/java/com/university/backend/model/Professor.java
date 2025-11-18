import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "professors")
@Getter
@Setter
public class Professor extends StaffMember {
    // Additional professor-specific fields can be added here
}
