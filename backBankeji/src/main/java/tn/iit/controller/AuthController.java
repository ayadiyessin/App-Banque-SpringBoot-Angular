package tn.iit.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import tn.iit.dto.AuthResponse;
import tn.iit.dto.LoginRequest;
import tn.iit.dto.RegisterRequest;
import tn.iit.entity.Utilisateur;
import tn.iit.service.JwtService;
import tn.iit.service.TokenBlacklistService;
import tn.iit.service.UtilisateurService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class AuthController {
	private final AuthenticationManager authenticationManager;
	private final UtilisateurService utilisateurService;
	private final JwtService jwtService;
	private final PasswordEncoder passwordEncoder;
	private final TokenBlacklistService tokenBlacklistService;

	@PostMapping("/register")
	public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
		Utilisateur user = new Utilisateur(request.getUsername(), passwordEncoder.encode(request.getPassword()));
		utilisateurService.save(user);
		String token = jwtService.generateToken(user.getUsername());
		return ResponseEntity.ok(new AuthResponse(token, user.getUsername()));
	}

	@PostMapping("/login")
	public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
		authenticationManager
				.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
		String token = jwtService.generateToken(request.getUsername());
		return ResponseEntity.ok(new AuthResponse(token, request.getUsername()));
	}

	@PostMapping("/logout")
	public ResponseEntity<?> logout(@RequestHeader(value = "Authorization", required = false) String authHeader) {
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			String token = authHeader.substring(7);
			tokenBlacklistService.blacklistToken(token);
			return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
		}
		return ResponseEntity.badRequest().body(Map.of("message", "No token provided"));
	}
}