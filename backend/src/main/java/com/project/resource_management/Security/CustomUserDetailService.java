package com.project.resource_management.Security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.project.resource_management.Repository.UsersRepo;

import lombok.RequiredArgsConstructor;

//Spring boot will automatically detects it as our service cause its implements UserDetailsService and has annotation @Service
@Service
// This is Lomboks annotation, will geneartes contructor for requried fields (fields will final keyword or @Notnull annotation)
// IN this case UserRepo variable !!
@RequiredArgsConstructor
public class CustomUserDetailService implements UserDetailsService{

    private final UsersRepo usersRepo;
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return usersRepo.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("Invalid Email or Password, User not found !!"));
    }
    
}
