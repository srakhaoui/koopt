package com.harington.cooptit.repository;

import com.harington.cooptit.domain.Cooptation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the Cooptation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CooptationRepository extends JpaRepository<Cooptation, Long> {

    @Query(value = "select distinct cooptation from Cooptation cooptation left join fetch cooptation.skills",
        countQuery = "select count(distinct cooptation) from Cooptation cooptation")
    Page<Cooptation> findAllWithEagerRelationships(Pageable pageable);

    @Query(value = "select distinct cooptation from Cooptation cooptation left join fetch cooptation.skills")
    List<Cooptation> findAllWithEagerRelationships();

    @Query("select cooptation from Cooptation cooptation left join fetch cooptation.skills where cooptation.id =:id")
    Optional<Cooptation> findOneWithEagerRelationships(@Param("id") Long id);

}
