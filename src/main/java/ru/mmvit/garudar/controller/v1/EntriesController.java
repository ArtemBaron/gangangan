package ru.mmvit.garudar.controller.v1;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.parameters.RequestBody;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import ru.mmvit.garudar.dto.EntryDto;
import ru.mmvit.garudar.mapper.EntryMapper;
import ru.mmvit.garudar.model.Entry;
import ru.mmvit.garudar.model.Role;
import ru.mmvit.garudar.model.User;
import ru.mmvit.garudar.service.EntriesService;
import ru.mmvit.garudar.service.UsersService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/entries")
@Tag(name = "Entries", description = "Управление записями")
public class EntriesController {

    @Autowired
    private EntriesService entriesService;

    @Autowired
    private EntryMapper entryMapper;

    @Autowired
    private UsersService usersService;

    @Operation(summary = "Получить запись по ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Запись найдена", content = @Content(schema = @Schema(implementation = EntryDto.class))),
            @ApiResponse(responseCode = "401", description = "Не авторизован", content = @Content),
            @ApiResponse(responseCode = "404", description = "Запись не найдена", content = @Content)
    })
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<EntryDto> getEntryById(
            @Parameter(description = "ID записи") @PathVariable Long id
    ) {
        Entry entry = entriesService.getEntryById(id);
        if (entry == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(entryMapper.toDto(entry));
    }

    @Operation(summary = "Поиск записей")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Список найденных записей", content = @Content(schema = @Schema(implementation = EntryDto.class))),
            @ApiResponse(responseCode = "401", description = "Не авторизован", content = @Content)
    })
    @GetMapping("/search")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<EntryDto>> searchEntries(
            @Parameter(description = "Строка поиска") @RequestParam(required = false) String query,
            @Parameter(description = "Тип записи. 1-Individual. 2-Corporate.") @RequestParam(defaultValue = "1") Integer entryType,
            @Parameter(description = "Искать по всем полям") @RequestParam(defaultValue = "0") String allSearch
    ) {
        boolean searchAll = "1".equals(allSearch);
        List<Entry> entries = entriesService.searchEntries(query, entryType, searchAll);
        List<EntryDto> dtos = entries.stream().map(entryMapper::toDto).toList();
        return ResponseEntity.ok(dtos);
    }

    @Operation(summary = "Получить все записи (только для админа)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Список всех записей", content = @Content(schema = @Schema(implementation = EntryDto.class))),
            @ApiResponse(responseCode = "403", description = "Нет доступа", content = @Content)
    })
    @GetMapping("/all")
    public ResponseEntity<List<EntryDto>> getAllEntries() {
        if (!isAdmin()) return ResponseEntity.status(403).build();
        List<Entry> entries = entriesService.getAllEntries();
        List<EntryDto> dtos = entries.stream().map(entryMapper::toDto).toList();
        return ResponseEntity.ok(dtos);
    }

    @Operation(summary = "Обновить запись (только для админа)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Запись обновлена", content = @Content(schema = @Schema(implementation = EntryDto.class))),
            @ApiResponse(responseCode = "403", description = "Нет доступа", content = @Content),
            @ApiResponse(responseCode = "404", description = "Запись не найдена", content = @Content)
    })
    @PutMapping("/{id}")
    public ResponseEntity<EntryDto> updateEntry(
            @Parameter(description = "ID записи") @PathVariable Long id,
            @RequestBody(description = "Данные для обновления записи", required = true,
                    content = @Content(schema = @Schema(implementation = EntryDto.class))) @org.springframework.web.bind.annotation.RequestBody EntryDto dto
    ) {
        if (!isAdmin()) return ResponseEntity.status(403).build();
        Entry existing = entriesService.getEntryById(id);
        if (existing == null) return ResponseEntity.notFound().build();

        entryMapper.updateEntryFromDto(dto, existing);
        entriesService.saveEntry(existing);
        return ResponseEntity.ok(entryMapper.toDto(existing));
    }

    @Operation(summary = "Удалить запись (только для админа)")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Запись удалена"),
            @ApiResponse(responseCode = "403", description = "Нет доступа", content = @Content),
            @ApiResponse(responseCode = "404", description = "Запись не найдена", content = @Content)
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEntry(
            @Parameter(description = "ID записи") @PathVariable Long id
    ) {
        if (!isAdmin()) return ResponseEntity.status(403).build();
        Entry existing = entriesService.getEntryById(id);
        if (existing == null) return ResponseEntity.notFound().build();

        entriesService.deleteEntry(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Импортировать записи (bulk, только админ)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Записи импортированы", content = @Content(schema = @Schema(implementation = EntryDto.class))),
            @ApiResponse(responseCode = "400", description = "Неверный запрос", content = @Content),
            @ApiResponse(responseCode = "403", description = "Нет доступа", content = @Content)
    })
    @PostMapping("/bulk")
    public ResponseEntity<List<EntryDto>> importEntries(
            @RequestBody(description = "Список записей для импорта", required = true,
                    content = @Content(schema = @Schema(implementation = BulkEntryRequest.class))) @org.springframework.web.bind.annotation.RequestBody BulkEntryRequest request
    ) {
        if (!isAdmin()) return ResponseEntity.status(403).build();
        if (request == null || request.getEntries() == null || request.getEntries().isEmpty()) return ResponseEntity.badRequest().build();

        LocalDate importDate = LocalDate.now();
        List<Entry> savedEntries = request.getEntries().stream().map(dto -> {
            Entry entry = entryMapper.toEntity(dto);
            entry.setLoadDate(importDate);
            return entriesService.saveEntry(entry);
        }).toList();

        List<EntryDto> responseDtos = savedEntries.stream().map(entryMapper::toDto).toList();
        return ResponseEntity.ok(responseDtos);
    }

    @Schema(description = "Объект запроса для bulk импорта")
    public static class BulkEntryRequest {
        private List<EntryDto> entries;

        public List<EntryDto> getEntries() { return entries; }
        public void setEntries(List<EntryDto> entries) { this.entries = entries; }
    }

    // --------------------------
    // Вспомогательные методы
    // --------------------------
    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return null;
        String username = auth.getName();
        return usersService.getUserByUsername(username);
    }

    private boolean isAdmin() {
        User currentUser = getAuthenticatedUser();
        return currentUser != null && currentUser.getRole() == Role.ADMIN;
    }
}


//package ru.mmvit.garudar.controller;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.web.bind.annotation.*;
//import ru.mmvit.garudar.dto.EntryDto;
//import ru.mmvit.garudar.mapper.EntryMapper;
//import ru.mmvit.garudar.model.Entry;
//import ru.mmvit.garudar.model.Role;
//import ru.mmvit.garudar.model.User;
//import ru.mmvit.garudar.service.EntriesService;
//import ru.mmvit.garudar.service.UsersService;
//
//import java.time.LocalDate;
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/entries")
//public class EntriesController {
//
//    @Autowired
//    private EntriesService entriesService;
//
//    @Autowired
//    private EntryMapper entryMapper;
//
//    @Autowired
//    private UsersService usersService;
//
//    // 🔹 GET /api/entries/{id} (только для авторизованных)
//    @GetMapping("/{id}")
//    @PreAuthorize("isAuthenticated()")
//    public ResponseEntity<EntryDto> getEntryById(@PathVariable Long id) {
//        Entry entry = entriesService.getEntryById(id);
//        if (entry == null) return ResponseEntity.notFound().build();
//        return ResponseEntity.ok(entryMapper.toDto(entry));
//    }
//
//    // 🔹 GET /api/entries/search?query=...&entryType=...&allSearch=... (только для авторизованных)
//    @GetMapping("/search")
//    @PreAuthorize("isAuthenticated()")
//    public ResponseEntity<List<EntryDto>> searchEntries(
//            @RequestParam(required = false) String query,
//            @RequestParam(defaultValue = "1") Integer entryType,
//            @RequestParam(defaultValue = "0") String allSearch) {
//
//        // Преобразуем allSearch в boolean
//        boolean searchAll = "1".equals(allSearch);
//
//        List<Entry> entries = entriesService.searchEntries(query, entryType, searchAll);
//        List<EntryDto> dtos = entries.stream()
//                .map(entryMapper::toDto)
//                .toList();
//        return ResponseEntity.ok(dtos);
//    }
//
//    // 🔹 GET /api/entries/all (только для админа)
//    @GetMapping("/all")
//    public ResponseEntity<List<EntryDto>> getAllEntries() {
//        if (!isAdmin()) return ResponseEntity.status(403).build();
//        List<Entry> entries = entriesService.getAllEntries(); // метод сервиса возвращает все записи
//        List<EntryDto> dtos = entries.stream()
//                .map(entryMapper::toDto)
//                .toList();
//        return ResponseEntity.ok(dtos);
//    }
//
//    // 🔹 PUT /api/entries/{id} (только админ может обновлять)
//    @PutMapping("/{id}")
//    public ResponseEntity<EntryDto> updateEntry(@PathVariable Long id, @RequestBody EntryDto dto) {
//        if (!isAdmin()) return ResponseEntity.status(403).build();
//
//        Entry existing = entriesService.getEntryById(id);
//        if (existing == null) return ResponseEntity.notFound().build();
//
//        entryMapper.updateEntryFromDto(dto, existing);
//        entriesService.saveEntry(existing);
//
//        return ResponseEntity.ok(entryMapper.toDto(existing));
//    }
//
//    // 🔹 DELETE /api/entries/{id} (только админ может удалить)
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteEntry(@PathVariable Long id) {
//        if (!isAdmin()) return ResponseEntity.status(403).build();
//
//        Entry existing = entriesService.getEntryById(id);
//        if (existing == null) return ResponseEntity.notFound().build();
//
//        entriesService.deleteEntry(id);
//        return ResponseEntity.noContent().build();
//    }
//
//    // --------------------------
//    // POST /api/entries/bulk (импорт CSV, только админ)
//    // --------------------------
//    @PostMapping("/bulk")
//    public ResponseEntity<List<EntryDto>> importEntries(@RequestBody BulkEntryRequest request) {
//        if (!isAdmin()) return ResponseEntity.status(403).build();
//
//        if (request == null || request.getEntries() == null || request.getEntries().isEmpty()) {
//            return ResponseEntity.badRequest().build();
//        }
//
//        // 🔹 Генерируем дату импорта один раз
//        LocalDate importDate = LocalDate.now();
//
//        List<EntryDto> dtos = request.getEntries();
//        List<Entry> savedEntries = dtos.stream().map(dto -> {
//            Entry entry = entryMapper.toEntity(dto);
//
//            // ⚡ Ставим одну и ту же дату импорта всем записям
//            entry.setLoadDate(importDate);
//
//            return entriesService.saveEntry(entry);
//        }).toList();
//
//        List<EntryDto> responseDtos = savedEntries.stream()
//                .map(entryMapper::toDto)
//                .toList();
//
//        return ResponseEntity.ok(responseDtos);
//    }
//
//    // --------------------------
//    // Вспомогательный DTO для bulk
//    // --------------------------
//    public static class BulkEntryRequest {
//        private List<EntryDto> entries;
//
//        public List<EntryDto> getEntries() { return entries; }
//        public void setEntries(List<EntryDto> entries) { this.entries = entries; }
//    }
//
//
//    // --------------------------
//    // Вспомогательные методы
//    // --------------------------
//
//    private User getAuthenticatedUser() {
//        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
//        if (auth == null) return null;
//        String username = auth.getName();
//        return usersService.getUserByUsername(username);
//    }
//
//    private boolean isAdmin() {
//        User currentUser = getAuthenticatedUser();
//        return currentUser != null && currentUser.getRole() == Role.ADMIN;
//    }
//
//
//}
