package ru.mmvit.garudar.mapper;

import org.springframework.stereotype.Component;
import ru.mmvit.garudar.dto.EntryDto;
import ru.mmvit.garudar.model.Entry;

@Component
public class EntryMapper {

    public EntryDto toDto(Entry entry) {
        if (entry == null) return null;

        EntryDto dto = new EntryDto();

        dto.setId(entry.getId());
        dto.setSourceList(entry.getSourceList());
        dto.setEntryType(entry.getEntryType());
        dto.setFullName(entry.getFullName());
        dto.setName1(entry.getName1());
        dto.setName2(entry.getName2());
        dto.setName3(entry.getName3());
        dto.setName4(entry.getName4());
        dto.setTittle(entry.getTittle());
        dto.setJobTitle(entry.getJobTitle());
        dto.setDob(entry.getDob());
        dto.setPob(entry.getPob());
        dto.setAlias(entry.getAlias());
        dto.setNationality(entry.getNationality());
        dto.setPassportNo(entry.getPassportNo());
        dto.setIdentityNo(entry.getIdentityNo());
        dto.setAddress(entry.getAddress());
        dto.setAdditionalInfo(entry.getAdditionalInfo());
        dto.setLoadDate(entry.getLoadDate());

        return dto;
    }

    public Entry toEntity(EntryDto dto) {
        if (dto == null) return null;

        Entry entry = new Entry();

        // id игнорируем — как у вас было
        entry.setSourceList(dto.getSourceList());
        entry.setEntryType(dto.getEntryType());
        entry.setFullName(dto.getFullName());
        entry.setName1(dto.getName1());
        entry.setName2(dto.getName2());
        entry.setName3(dto.getName3());
        entry.setName4(dto.getName4());
        entry.setTittle(dto.getTittle());
        entry.setJobTitle(dto.getJobTitle());
        entry.setDob(dto.getDob());
        entry.setPob(dto.getPob());
        entry.setAlias(dto.getAlias());
        entry.setNationality(dto.getNationality());
        entry.setPassportNo(dto.getPassportNo());
        entry.setIdentityNo(dto.getIdentityNo());
        entry.setAddress(dto.getAddress());
        entry.setAdditionalInfo(dto.getAdditionalInfo());
        entry.setLoadDate(dto.getLoadDate());

        return entry;
    }

    public void updateEntryFromDto(EntryDto dto, Entry entry) {
        if (dto == null || entry == null) return;

        // id и loadDate не трогаем — как в MapStruct
        entry.setSourceList(dto.getSourceList());
        entry.setEntryType(dto.getEntryType());
        entry.setFullName(dto.getFullName());
        entry.setName1(dto.getName1());
        entry.setName2(dto.getName2());
        entry.setName3(dto.getName3());
        entry.setName4(dto.getName4());
        entry.setTittle(dto.getTittle());
        entry.setJobTitle(dto.getJobTitle());
        entry.setDob(dto.getDob());
        entry.setPob(dto.getPob());
        entry.setAlias(dto.getAlias());
        entry.setNationality(dto.getNationality());
        entry.setPassportNo(dto.getPassportNo());
        entry.setIdentityNo(dto.getIdentityNo());
        entry.setAddress(dto.getAddress());
        entry.setAdditionalInfo(dto.getAdditionalInfo());
    }
}

