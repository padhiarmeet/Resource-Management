package com.project.resource_management.Repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.resource_management.Model.Resources;

@Repository
public interface ResourcesRepo extends JpaRepository<Resources,Integer>{

}
