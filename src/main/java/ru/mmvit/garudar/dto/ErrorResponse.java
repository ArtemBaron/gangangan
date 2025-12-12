package ru.mmvit.garudar.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Ошибка авторизации")
public class ErrorResponse {

    @Schema(example = "Invalid credentials")
    private String error;
}
