package com.project.resource_management.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.project.resource_management.Model.Shelf;

@Repository
public interface ShelfRepo extends JpaRepository<Shelf, Integer> {
    
    // "Find all shelves in Cupboard ID X"
    @Query("SELECT s FROM Shelf s WHERE s.cupboard.cupboard_id = :id")
    List<Shelf> findByCupboard_Cupboard_id(@Param("id") int cupboardId);
}