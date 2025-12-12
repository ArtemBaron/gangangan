package ru.mmvit.garudar.controller.v1;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.mmvit.garudar.dto.ErrorResponse;
import ru.mmvit.garudar.dto.LoginRequestDto;
import ru.mmvit.garudar.dto.TokenResponse;
import ru.mmvit.garudar.service.AuthService;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication", description = "Auth endpoints")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    @Operation(
            summary = "Авторизация и получение JWT токена",
            description = "Принимает логин и пароль, возвращает JWT токен при успешной аутентификации"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Успешная авторизация",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = TokenResponse.class))
    )
    @ApiResponse(
            responseCode = "401",
            description = "Неверные логин или пароль",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = ErrorResponse.class))
    )
    public ResponseEntity<?> login( @RequestBody LoginRequestDto dto ) {
        try {
            String token = authService.authenticate(dto.getUsername(), dto.getPassword());
            return ResponseEntity.ok(Map.of("token", token));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }
    }

//    @PostMapping("/register")
//    public ResponseEntity<?> register(@RequestBody UserDto dto) {
//        try {
//            User user = new User(); // создаём пустую сущность
//            userMapper.registrationUserFromDto(dto, user); // заполняем поля из DTO
//            User registeredUser = authService.register(user); // передаём уже готовый User
//            return ResponseEntity.ok(userMapper.toReadDto(registeredUser));
//        } catch (Exception e) {
//            return ResponseEntity
//                    .badRequest()
//                    .body(Map.of("error", e.getMessage() != null ? e.getMessage() : "Registration failed"));
//        }
//    }
}
