package com.harington.cooptit.repository;

import com.harington.cooptit.domain.Cooptation;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Cooptation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CooptationRepository extends JpaRepository<Cooptation, Long> {

}
