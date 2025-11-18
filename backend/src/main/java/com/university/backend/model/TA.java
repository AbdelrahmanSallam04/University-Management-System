import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tas")
@Getter
@Setter
public class TA extends StaffMember {
    // Additional TA-specific fields if needed
}
