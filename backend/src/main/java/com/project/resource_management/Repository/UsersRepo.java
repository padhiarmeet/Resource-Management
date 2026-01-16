package com.project.resource_management.Repository;

import java.util.Optional;

import org.apache.catalina.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.resource_management.Model.Users;

@Repository
public interface UsersRepo extends JpaRepository<Users,Integer>{

    Optional<User> findByEmail(String email);
}
