package ru.mmvit.garudar.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EntryDto {

    private Long id;
    private String sourceList;
    private String entryType;
    private String fullName;
    private String name1;
    private String name2;
    private String name3;
    private String name4;
    private String tittle;
    private String jobTitle;
    private String dob;
    private String pob;
    private String alias;
    private String nationality;
    private String passportNo;
    private String identityNo;
    private String address;
    private String additionalInfo;
    private LocalDate loadDate;
}
