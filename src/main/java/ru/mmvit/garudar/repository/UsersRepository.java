package ru.mmvit.garudar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.mmvit.garudar.model.User;

@Repository
public interface UsersRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
}