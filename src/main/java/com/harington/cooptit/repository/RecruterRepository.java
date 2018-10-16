package com.harington.cooptit.repository;

import com.harington.cooptit.domain.Recruter;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Recruter entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RecruterRepository extends JpaRepository<Recruter, Long> {

}
