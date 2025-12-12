package ru.mmvit.garudar.service;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mmvit.garudar.repository.UsersRepository;
import ru.mmvit.garudar.model.User;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Service
public class UsersService {

    private final UsersRepository usersRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;



    @Autowired
    public UsersService(
            UsersRepository usersRepository
    ) {
        this.usersRepository = usersRepository;
    }

    public List<User> getAllUsers() {
        return usersRepository.findAll();
    }

    public User getUserById(Long id) {
        return usersRepository.findById(id).orElse(null);
    }

    public User getUserByUsername(String username) {
        return usersRepository.findByUsername(username);
    }

    public User saveUser(User user) {
        // Проверяем, что пароль не пустой и не выглядит как уже захешированный
        // Пароли, зашифрованные BCrypt, всегда начинаются с "$2a$", "$2b$", или "$2y$".
        if (user.getPassword() != null && !user.getPassword().startsWith("$2a$")) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        return usersRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long id) {

        // 3️⃣ Удаляем пользователя
        usersRepository.deleteById(id);
    }
}
