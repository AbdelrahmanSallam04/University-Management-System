package com.university.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Entity
@Table(name = "account_type")
@Getter
@Setter
public class AccountType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "account_type_id")
    private Integer id;

    @Column(name = "account_type_name", nullable = false)
    private String name;

    @JsonIgnore
    @OneToMany(mappedBy = "accountType")
    private List<Account> accounts;
}