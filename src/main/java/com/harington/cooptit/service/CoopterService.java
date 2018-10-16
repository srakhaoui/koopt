package com.harington.cooptit.service;

import com.harington.cooptit.domain.Coopter;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Service Interface for managing Coopter.
 */
public interface CoopterService {

    /**
     * Save a coopter.
     *
     * @param coopter the entity to save
     * @return the persisted entity
     */
    Coopter save(Coopter coopter);

    /**
     * Get all the coopters.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    Page<Coopter> findAll(Pageable pageable);


    /**
     * Get the "id" coopter.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Optional<Coopter> findOne(Long id);

    /**
     * Delete the "id" coopter.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the coopter corresponding to the query.
     *
     * @param query the query of the search
     * 
     * @param pageable the pagination information
     * @return the list of entities
     */
    Page<Coopter> search(String query, Pageable pageable);
}
