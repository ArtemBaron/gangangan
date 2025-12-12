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

import ru.mmvit.garudar.dto.ErrorResponse;
import ru.mmvit.garudar.dto.UserDto;
import ru.mmvit.garudar.mapper.UserMapper;
import ru.mmvit.garudar.model.Role;
import ru.mmvit.garudar.model.User;
import ru.mmvit.garudar.service.UsersService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "Users", description = "Управление пользователями")
public class UsersController {

    @Autowired
    private UsersService usersService;

    @Autowired
    private UserMapper userMapper;

    @Operation(summary = "Получить список пользователей или одного по username")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Список пользователей или найденный пользователь", content = @Content(schema = @Schema(implementation = UserDto.class))),
            @ApiResponse(responseCode = "400", description = "Неверный запрос", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "Не авторизован", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "Нет доступа", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getUsers(
            @Parameter(description = "Имя пользователя для поиска")
            @RequestParam(required = false) String username
    ) {
        if (isAdmin()) {
            List<UserDto> users = usersService.getAllUsers()
                    .stream()
                    .map(userMapper::toReadDto)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(users);
        } else {
            if (username == null || username.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            User user = usersService.getUserByUsername(username.trim());
            if (user == null) return ResponseEntity.notFound().build();
            return ResponseEntity.ok(userMapper.toFindDto(user));
        }
    }

    @Operation(summary = "Получить информацию о текущем пользователе")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Текущий пользователь", content = @Content(schema = @Schema(implementation = UserDto.class))),
            @ApiResponse(responseCode = "401", description = "Не авторизован", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser() {
        User user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(userMapper.toReadDto(user));
    }

    @Operation(summary = "Получить пользователя по ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Найденный пользователь", content = @Content(schema = @Schema(implementation = UserDto.class))),
            @ApiResponse(responseCode = "401", description = "Не авторизован", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "Нет доступа", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Пользователь не найден", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(
            @Parameter(description = "ID пользователя") @PathVariable Long id
    ) {
        User user = usersService.getUserById(id);
        if (user == null) return ResponseEntity.notFound().build();

        User currentUser = getAuthenticatedUser();
        if (!isAdmin() && !currentUser.getId().equals(id)) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(userMapper.toReadDto(user));
    }

    @Operation(summary = "Обновить текущего пользователя")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Пользователь обновлён", content = @Content(schema = @Schema(implementation = UserDto.class))),
            @ApiResponse(responseCode = "401", description = "Не авторизован", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PutMapping("/me")
    public ResponseEntity<UserDto> updateCurrentUser(
            @RequestBody(
                    description = "Данные для обновления текущего пользователя",
                    required = true,
                    content = @Content(schema = @Schema(implementation = UserDto.class))
            )
            @org.springframework.web.bind.annotation.RequestBody UserDto userDto
    ) {
        User currentUser = getAuthenticatedUser();
        if (currentUser == null) return ResponseEntity.status(401).build();

        userMapper.updateUserFromSelfDto(userDto, currentUser);
        User updatedUser = usersService.saveUser(currentUser);
        return ResponseEntity.ok(userMapper.toReadDto(updatedUser));
    }

    @Operation(summary = "Обновить пользователя (только текущий или админ)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Пользователь обновлён", content = @Content(schema = @Schema(implementation = UserDto.class))),
            @ApiResponse(responseCode = "401", description = "Не авторизован", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "Нет доступа", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Пользователь не найден", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(
            @Parameter(description = "ID пользователя") @PathVariable Long id,
            @RequestBody(
                    description = "Данные для обновления пользователя",
                    required = true,
                    content = @Content(schema = @Schema(implementation = UserDto.class))
            )
            @org.springframework.web.bind.annotation.RequestBody UserDto userDto
    ) {
        User existingUser = usersService.getUserById(id);
        if (existingUser == null) return ResponseEntity.notFound().build();

        User currentUser = getAuthenticatedUser();
        boolean admin = isAdmin();
        if (!admin && !currentUser.getId().equals(id)) return ResponseEntity.status(403).build();

        if (admin) {
            userMapper.updateUserFromAdminDto(userDto, existingUser);
        } else {
            userMapper.updateUserFromSelfDto(userDto, existingUser);
        }

        User updatedUser = usersService.saveUser(existingUser);
        return ResponseEntity.ok(userMapper.toReadDto(updatedUser));
    }

    @Operation(summary = "Создать нового пользователя (только админ)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Пользователь создан", content = @Content(schema = @Schema(implementation = UserDto.class))),
            @ApiResponse(responseCode = "403", description = "Нет доступа", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "409", description = "Username уже существует", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping
    public ResponseEntity<UserDto> createUser(
            @RequestBody(
                    description = "Данные нового пользователя",
                    required = true,
                    content = @Content(schema = @Schema(implementation = UserDto.class))
            )
            @org.springframework.web.bind.annotation.RequestBody UserDto userDto
    ) {
        if (!isAdmin()) return ResponseEntity.status(403).build();
        if (usersService.getUserByUsername(userDto.getUsername()) != null) return ResponseEntity.status(409).build();

        User newUser = new User();
        newUser.setUsername(userDto.getUsername());
        newUser.setPassword(userDto.getPassword());
        newUser.setRole(userDto.getRole() != null ? userDto.getRole() : Role.USER);
        newUser.setStatus(userDto.getStatus() != null ? userDto.getStatus() : true);

        User saved = usersService.saveUser(newUser);
        return ResponseEntity.ok(userMapper.toReadDto(saved));
    }

    @Operation(summary = "Удалить текущего пользователя")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Пользователь удалён"),
            @ApiResponse(responseCode = "401", description = "Не авторизован", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteCurrentUser() {
        User currentUser = getAuthenticatedUser();
        if (currentUser == null) return ResponseEntity.status(401).build();

        usersService.deleteUser(currentUser.getId());
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Удалить пользователя (только админ)")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Пользователь удалён"),
            @ApiResponse(responseCode = "401", description = "Не авторизован", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "Нет доступа", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Пользователь не найден", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(
            @Parameter(description = "ID пользователя") @PathVariable Long id
    ) {
        if (!isAdmin()) return ResponseEntity.status(403).build();
        User user = usersService.getUserById(id);
        if (user == null) return ResponseEntity.notFound().build();

        usersService.deleteUser(id);
        return ResponseEntity.noContent().build();
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
//import ru.mmvit.garudar.dto.UserDto;
//import ru.mmvit.garudar.mapper.UserMapper;
//import ru.mmvit.garudar.model.Role;
//import ru.mmvit.garudar.model.User;
//import ru.mmvit.garudar.service.UsersService;
//
//import java.util.List;
//import java.util.stream.Collectors;
//
//@RestController
//@RequestMapping("/api/users")
//public class UsersController {
//
//    @Autowired
//    private UsersService usersService;
//
//    @Autowired
//    private UserMapper userMapper;
//
//    @GetMapping
//    @PreAuthorize("isAuthenticated()")
//    public ResponseEntity<?> getUsers(@RequestParam(required = false) String username) {
//        if (isAdmin()) {
//            // 🔹 Админ видит всех
//            List<UserDto> users = usersService.getAllUsers()
//                    .stream()
//                    .map(userMapper::toReadDto)
//                    .collect(Collectors.toList());
//            return ResponseEntity.ok(users);
//        } else {
//            // 🔹 Обычный пользователь
//            if (username == null || username.trim().isEmpty()) {
//                return ResponseEntity.badRequest().build();
//            }
//            User user = usersService.getUserByUsername(username.trim());
//            if (user == null) return ResponseEntity.notFound().build();
//            return ResponseEntity.ok(userMapper.toFindDto(user));
//        }
//    }
//
//    // 🔹 Получить информацию о текущем пользователе
//    @GetMapping("/me")
//    public ResponseEntity<UserDto> getCurrentUser() {
//        User user = getAuthenticatedUser();
//        if (user == null) {
//            return ResponseEntity.status(401).build();
//        }
//        return ResponseEntity.ok(userMapper.toReadDto(user));
//    }
//
//    // 🔹 Получить пользователя по ID (только текущий или админ)
//    @GetMapping("/{id}")
//    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
//        User user = usersService.getUserById(id);
//        if (user == null) {
//            return ResponseEntity.notFound().build();
//        }
//
//        User currentUser = getAuthenticatedUser();
//        if (!isAdmin() && !currentUser.getId().equals(id)) {
//            return ResponseEntity.status(403).build();
//        }
//
//        return ResponseEntity.ok(userMapper.toReadDto(user));
//    }
//
//    // 🔹 Обновить информацию текущего пользователя
//    @PutMapping("/me")
//    public ResponseEntity<UserDto> updateCurrentUser(@RequestBody UserDto userDto) {
//        User currentUser = getAuthenticatedUser();
//        if (currentUser == null) {
//            return ResponseEntity.status(401).build();
//        }
//
//        // Разрешаем обновление только своих данных (имя, email, пароль)
//        userMapper.updateUserFromSelfDto(userDto, currentUser);
//
//        User updatedUser = usersService.saveUser(currentUser);
//        return ResponseEntity.ok(userMapper.toReadDto(updatedUser));
//    }
//
//    // 🔹 Обновить пользователя (только текущий или админ)
//    @PutMapping("/{id}")
//    public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @RequestBody UserDto userDto) {
//        User existingUser = usersService.getUserById(id);
//        if (existingUser == null) {
//            return ResponseEntity.notFound().build();
//        }
//
//        User currentUser = getAuthenticatedUser();
//        boolean admin = isAdmin();
//
//        if (!admin && !currentUser.getId().equals(id)) {
//            return ResponseEntity.status(403).build();
//        }
//
//        if (admin) {
//            userMapper.updateUserFromAdminDto(userDto, existingUser);
//        } else {
//            userMapper.updateUserFromSelfDto(userDto, existingUser);
//        }
//
//        User updatedUser = usersService.saveUser(existingUser);
//        return ResponseEntity.ok(userMapper.toReadDto(updatedUser));
//    }
//
//    @PostMapping
//    public ResponseEntity<UserDto> createUser(@RequestBody UserDto userDto) {
//        if (!isAdmin()) {
//            return ResponseEntity.status(403).build();
//        }
//
//        // Проверяем что username уникальный
//        if (usersService.getUserByUsername(userDto.getUsername()) != null) {
//            return ResponseEntity.status(409).build(); // Conflict
//        }
//
//        User newUser = new User();
//        newUser.setUsername(userDto.getUsername());
//        newUser.setPassword(userDto.getPassword()); // пароль потом можно зашифровать
//        newUser.setRole(userDto.getRole() != null ? userDto.getRole() : Role.USER);
//        newUser.setStatus(userDto.getStatus() != null ? userDto.getStatus() : true);
//
//        User saved = usersService.saveUser(newUser);
//
//        return ResponseEntity.ok(userMapper.toReadDto(saved));
//    }
//
//
//    // 🔹 Удалить текущего пользователя
//    @DeleteMapping("/me")
//    public ResponseEntity<Void> deleteCurrentUser() {
//        User currentUser = getAuthenticatedUser();
//        if (currentUser == null) {
//            return ResponseEntity.status(401).build();
//        }
//
//        usersService.deleteUser(currentUser.getId());
//        return ResponseEntity.noContent().build();
//    }
//
//    // 🔹 Удалить пользователя (только админ)
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
//        if (!isAdmin()) {
//            return ResponseEntity.status(403).build();
//        }
//
//        User user = usersService.getUserById(id);
//        if (user == null) {
//            return ResponseEntity.notFound().build();
//        }
//
//        usersService.deleteUser(id);
//        return ResponseEntity.noContent().build();
//    }
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
//}
//
