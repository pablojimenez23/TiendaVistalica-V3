package com.tiendavistalica.backend.config;

import com.tiendavistalica.backend.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    
    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                //Endpoints Publicos
                .requestMatchers("/api/usuarios/registro", "/api/usuarios/login").permitAll()
                
                // productos - Solo lectura
                .requestMatchers(HttpMethod.GET, "/api/productos/**").permitAll()
                
                // categorías - Solo lectura
                .requestMatchers(HttpMethod.GET, "/api/categorias/**").permitAll()
                
                //Endpoints Administrador
                //productos - Escritura
                .requestMatchers(HttpMethod.POST, "/api/productos/**").hasRole("ADMINISTRADOR")
                .requestMatchers(HttpMethod.PUT, "/api/productos/**").hasRole("ADMINISTRADOR")
                .requestMatchers(HttpMethod.PATCH, "/api/productos/**").hasRole("ADMINISTRADOR")
                .requestMatchers(HttpMethod.DELETE, "/api/productos/**").hasRole("ADMINISTRADOR")
                
                //categorias - Escritura
                .requestMatchers(HttpMethod.POST, "/api/categorias/**").hasRole("ADMINISTRADOR")
                .requestMatchers(HttpMethod.PUT, "/api/categorias/**").hasRole("ADMINISTRADOR")
                .requestMatchers(HttpMethod.PATCH, "/api/categorias/**").hasRole("ADMINISTRADOR")
                .requestMatchers(HttpMethod.DELETE, "/api/categorias/**").hasRole("ADMINISTRADOR")
                
                //gestion de usuarios
                .requestMatchers("/api/usuarios/**").hasRole("ADMINISTRADOR")
                .requestMatchers("/api/roles/**").hasRole("ADMINISTRADOR")
                
                //pedidos - Ver todos
                .requestMatchers("/api/pedidos/todos").hasRole("ADMINISTRADOR")
                .requestMatchers("/api/pedidos/estado/**").hasRole("ADMINISTRADOR")
                .requestMatchers(HttpMethod.DELETE, "/api/pedidos/**").hasRole("ADMINISTRADOR")
                
                //Endpoints Autenticados (usuarios con token)
                // Carrito
                .requestMatchers("/api/carrito/**").authenticated()
                
                // Pedidos - Operaciones de usuario normal
                .requestMatchers(HttpMethod.POST, "/api/pedidos").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/pedidos").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/pedidos/usuario/**").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/pedidos/{id}").authenticated()
                
                //Culquier otro requerimiento
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(Arrays.asList("Authorization"));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}