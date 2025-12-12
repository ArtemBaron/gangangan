package ru.mmvit.garudar.controller.v1;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import ru.mmvit.garudar.model.Role;
import ru.mmvit.garudar.model.User;
import ru.mmvit.garudar.service.UsersService;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/v1/pages")
public class PageController {

//    @Autowired
//    private JwtService jwtService;

    @Autowired
    private ResourceLoader resourceLoader;

    @Autowired
    private UsersService usersService;

    @GetMapping("/{page}")
    public ResponseEntity<String> getPage(
            @PathVariable String page
//            @RequestHeader(value = "Authorization", required = false) String auth
    ) throws IOException {

        User user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).body(loadPageSafe("login"));
        }

        // 3 - защита от попыток ../
        if (!page.matches("[a-zA-Z0-9_-]+")) {
            return ResponseEntity.badRequest().body("Invalid page name");
        }

        // 4 - если admin
        if (isAdmin()) {
            String htmlAdminMenu = loadPageSafe("admin-menu");
            String htmlAdminBody = loadPageSafe(page);
            if (htmlAdminBody == null) {
                htmlAdminBody = loadPageSafe("admin-404");
            }
            return ResponseEntity.ok(htmlAdminMenu + htmlAdminBody);
        }
        else {
            if (page.startsWith("admin")) {
                return ResponseEntity.status(403).body("Forbidden");
            }
            String htmlMenu = loadPageSafe("menu");
            String htmlBody = loadPageSafe(page);
            if (htmlBody == null) {
                htmlBody = loadPageSafe("404");
            }
            return ResponseEntity.ok(htmlMenu + htmlBody);
        }
    }

    /**
     * Загружает HTML, возвращает null если файла нет
     */
    private String loadPageSafe(String name) throws IOException {
        Resource resource = resourceLoader.getResource("classpath:pages/" + name + ".html");
        if (!resource.exists()) {
            return null;
        }
        String str = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
        return str;
    }

    /**
     * Прямой загрузчик страницы (для login)
     */
//    private String loadPage(String name) throws IOException {
//        return loadPageSafe(name);
//    }

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
