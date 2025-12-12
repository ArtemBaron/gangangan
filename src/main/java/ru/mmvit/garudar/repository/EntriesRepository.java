package ru.mmvit.garudar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.mmvit.garudar.model.Entry;

import java.util.List;

@Repository
public interface EntriesRepository extends JpaRepository<Entry, Long> {

    @Query("SELECT e FROM Entry e WHERE " +
            "LOWER(e.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.name1) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.name2) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.name3) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.name4) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.alias) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.jobTitle) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.dob) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.pob) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.nationality) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.passportNo) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.identityNo) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.address) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.additionalInfo) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.sourceList) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.entryType) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.tittle) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Entry> searchAllFields(@Param("query") String query);

    // 1) Поиск Individual только по именам
    @Query("SELECT e FROM Entry e WHERE e.entryType = 'Individual' AND (" +
            "LOWER(e.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.name1) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.name2) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.name3) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.name4) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.alias) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Entry> searchIndividualOnlyNames(@Param("query") String query);

    // 2) Поиск Individual по всем данным
    @Query("SELECT e FROM Entry e WHERE e.entryType = 'Individual' AND (" +
            "LOWER(e.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.name1) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.name2) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.name3) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.name4) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.alias) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.jobTitle) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.dob) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.pob) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.nationality) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.passportNo) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.identityNo) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.address) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.additionalInfo) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.sourceList) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.tittle) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Entry> searchIndividualAllData(@Param("query") String query);

    // 3) Поиск Corporate только по именам (по аналогии)
    @Query("SELECT e FROM Entry e WHERE e.entryType = 'Entity' AND (" +
            "LOWER(e.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.name1) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.name2) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.name3) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.name4) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.alias) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Entry> searchCorporateOnlyNames(@Param("query") String query);

    // 4) Поиск Corporate по всем данным (по аналогии)
    @Query("SELECT e FROM Entry e WHERE e.entryType = 'Entity' AND (" +
            "LOWER(e.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.name1) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.name2) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.name3) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.name4) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.alias) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.jobTitle) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.dob) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.pob) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.nationality) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.passportNo) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.identityNo) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.address) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.additionalInfo) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.sourceList) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.tittle) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Entry> searchCorporateAllData(@Param("query") String query);
}