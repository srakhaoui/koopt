package com.harington.cooptit.repository;

import com.harington.cooptit.domain.Coopter;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Coopter entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CoopterRepository extends JpaRepository<Coopter, Long> {

}
