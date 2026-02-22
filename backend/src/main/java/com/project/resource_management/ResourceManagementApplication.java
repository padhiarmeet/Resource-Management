package com.project.resource_management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ResourceManagementApplication {

	public static void main(String[] args) {
		// Trigger DevTools reload to recreate dropped tables
		SpringApplication.run(ResourceManagementApplication.class, args);
	}

}
