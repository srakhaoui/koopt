package com.harington.cooptit.service;

import com.harington.cooptit.domain.Cooptation;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Service Interface for managing Cooptation.
 */
public interface CooptationService {

    /**
     * Save a cooptation.
     *
     * @param cooptation the entity to save
     * @return the persisted entity
     */
    Cooptation save(Cooptation cooptation);

    /**
     * Get all the cooptations.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    Page<Cooptation> findAll(Pageable pageable);


    /**
     * Get the "id" cooptation.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Optional<Cooptation> findOne(Long id);

    /**
     * Delete the "id" cooptation.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the cooptation corresponding to the query.
     *
     * @param query the query of the search
     * 
     * @param pageable the pagination information
     * @return the list of entities
     */
    Page<Cooptation> search(String query, Pageable pageable);
}
