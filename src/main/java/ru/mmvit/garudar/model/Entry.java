package ru.mmvit.garudar.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "entries")
public class Entry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sourceList;
    private String entryType;
    private String fullName;
    private String name1;
    private String name2;
    private String name3;
    private String name4;
    private String tittle;
    @Column(length = 2048)
    private String jobTitle;
    private String dob;
    private String pob;
    @Column(length = 1024)
    private String alias;
    private String nationality;
    private String passportNo;
    private String identityNo;
    @Column(length = 1024)
    private String address;
    @Column(length = 4096)
    private String additionalInfo;

    // 🔹 Время загрузки из CSV
    @Column(name = "load_date")
    private LocalDate loadDate;
}
