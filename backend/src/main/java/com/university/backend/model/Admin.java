package com.university.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "administrators")
@Getter
@Setter
public class Admin extends StaffMember {

}
