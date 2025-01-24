package tn.iit.filter;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import tn.iit.service.JwtService;
import tn.iit.service.TokenBlacklistService;
import tn.iit.service.UtilisateurService;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {
	private final JwtService jwtService;
	private final UtilisateurService utilisateurService;
	private final TokenBlacklistService tokenBlacklistService;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		final String authHeader = request.getHeader("Authorization");

		if (authHeader == null || !authHeader.startsWith("Bearer ")) {
			filterChain.doFilter(request, response);
			return;
		}

		String jwt = authHeader.substring(7);

		if (tokenBlacklistService.isBlacklisted(jwt)) {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			return;
		}

		String username = jwtService.extractUsername(jwt);

		if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
			UserDetails userDetails = utilisateurService.loadUserByUsername(username);
			if (jwtService.isTokenValid(jwt)) {
				UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails,
						null, userDetails.getAuthorities());
				authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
				SecurityContextHolder.getContext().setAuthentication(authToken);
			}
		}
		filterChain.doFilter(request, response);
	}
}