package ru.mmvit.garudar.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mmvit.garudar.model.Entry;
import ru.mmvit.garudar.model.User;
import ru.mmvit.garudar.repository.EntriesRepository;

import java.util.List;

@Service
public class EntriesService {

    private final EntriesRepository entriesRepository;

    @Autowired
    public EntriesService(EntriesRepository entriesRepository) {
        this.entriesRepository = entriesRepository;
    }

    public Entry getEntryById(Long id) {
        return entriesRepository.findById(id).orElse(null);
    }

    public List<Entry> searchEntries(String query, int entryType, boolean searchAll ) {

        // пустой список если query пустой
        if (query == null || query.trim().isEmpty()) {
            return List.of();
        }
        // Individual
        if (entryType == 1) {
            // only name
            if (!searchAll) {
                List<Entry> test = entriesRepository.searchIndividualOnlyNames(query.trim());
                return test;
            }
            // all data
            else {
                return entriesRepository.searchIndividualAllData(query.trim());
            }
        }
        // Corporate
        if (entryType == 2) {
            // only name
            if (!searchAll) {
                return entriesRepository.searchCorporateOnlyNames(query.trim());
            }
            // all data
            else {
                return entriesRepository.searchCorporateAllData(query.trim());
            }
        }

        return List.of();
    }

    public Entry saveEntry(Entry entry) {
        // Просто сохраняем запись
        return entriesRepository.save(entry);
    }

    public List<Entry> getAllEntries() {
        return entriesRepository.findAll(); // или любой способ получить все записи
    }

    @Transactional
    public void deleteEntry(Long id) {
        // 3️⃣ Удаляем записи
        entriesRepository.deleteById(id);
    }


}
