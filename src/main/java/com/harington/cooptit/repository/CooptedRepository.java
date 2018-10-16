package com.harington.cooptit.repository;

import com.harington.cooptit.domain.Coopted;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Coopted entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CooptedRepository extends JpaRepository<Coopted, Long> {

}
