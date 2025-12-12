package ru.mmvit.garudar.mapper;

import org.springframework.stereotype.Component;
import ru.mmvit.garudar.dto.UserDto;
import ru.mmvit.garudar.model.User;

@Component
public class UserMapper {

    // -----------------------------------------------------
    // ✅ Entity → DTO (toReadDto)
    // пароль не включается в DTO
    // -----------------------------------------------------
    public UserDto toReadDto(User user) {
        if (user == null) return null;

        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        // password игнорируем
        dto.setStatus(user.getStatus());
        dto.setRole(user.getRole());

        return dto;
    }


    // -----------------------------------------------------
    // ✅ Entity → DTO (toFindDto)
    // status, role, password — игнорируются
    // -----------------------------------------------------
    public UserDto toFindDto(User user) {
        if (user == null) return null;

        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        // без password, status, role

        return dto;
    }


    // -----------------------------------------------------
    // ✅ Регистрация пользователя
    // dto → entity
    // id, status, role — игнорируются
    // username + password — копируются
    // -----------------------------------------------------
    public void registrationUserFromDto(UserDto dto, User user) {
        if (dto == null || user == null) return;

        // id, status, role не меняем
        user.setUsername(dto.getUsername());
        user.setPassword(dto.getPassword());
    }


    // -----------------------------------------------------
    // ✅ Обновление данных пользователем
    // можно менять: username?, password? (или только password?)
    //
    // В MapStruct версии у вас было:
    //  - username IGNORE
    //  - менять только password
    //
    // null значения — игнорируются (IGNORE)
    // -----------------------------------------------------
    public void updateUserFromSelfDto(UserDto dto, User user) {
        if (dto == null || user == null) return;

        // username менять нельзя
        // status менять нельзя
        // role менять нельзя

        if (dto.getPassword() != null)
            user.setPassword(dto.getPassword());
    }


    // -----------------------------------------------------
    // ✅ Обновление админом
    // админ может менять:
    //  - username
    //  - status
    //  - role
    // пароль админ НЕ меняет
    // null значения — игнорируются
    // -----------------------------------------------------
    public void updateUserFromAdminDto(UserDto dto, User user) {
        if (dto == null || user == null) return;

        // id не трогаем

        if (dto.getUsername() != null)
            user.setUsername(dto.getUsername());

        if (dto.getStatus() != null)
            user.setStatus(dto.getStatus());

        if (dto.getRole() != null)
            user.setRole(dto.getRole());

        if (dto.getPassword() != null)
            user.setPassword(dto.getPassword());
    }
}
