package ru.mmvit.garudar.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ru.mmvit.garudar.repository.UsersRepository;
//import ru.mmvit.garudar.model.Role;
import ru.mmvit.garudar.model.User;

@Service
public class AuthService {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public String authenticate(String username, String password) throws Exception {
        User user = usersRepository.findByUsername(username);
        if (user == null) {
            throw new Exception("User not found");
        }
        if (!user.getStatus()) {
            throw new Exception("User disable");
        }
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new Exception("Invalid credentials");
        }
        // Генерация токена (минимальный stub)
        return jwtService.generateToken(user);
    }



//    public User register(User user) throws Exception {
//        if (usersRepository.findByUsername(user.getUsername()) != null) {
//            throw new Exception("Username already exists");
//        }
//        user.setPassword(passwordEncoder.encode(user.getPassword()));
//
//        user.setStatus(false);
//        user.setRole(Role.USER);
//        return usersRepository.save(user);
//    }
}
