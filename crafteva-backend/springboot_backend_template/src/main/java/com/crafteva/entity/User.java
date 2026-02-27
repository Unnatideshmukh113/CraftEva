package com.crafteva.entity;



import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;
    @Column(name="user_name", nullable=false)
    private String name;
    @Column(name="user_email", nullable=false)
    private String email;
    @Column(name="user_password", nullable=false)
    private String password;
    @Column(name="mobile_no", nullable=false)
    private String mobile;
    @Column(name="user_address", nullable=false)
    private String address;

    @Enumerated(EnumType.STRING)
    private Role role;

	
   
}
