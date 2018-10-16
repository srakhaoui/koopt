package com.harington.cooptit.service.impl;

import com.harington.cooptit.service.CoopterService;
import com.harington.cooptit.domain.Coopter;
import com.harington.cooptit.repository.CoopterRepository;
import com.harington.cooptit.repository.search.CoopterSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing Coopter.
 */
@Service
@Transactional
public class CoopterServiceImpl implements CoopterService {

    private final Logger log = LoggerFactory.getLogger(CoopterServiceImpl.class);

    private CoopterRepository coopterRepository;

    private CoopterSearchRepository coopterSearchRepository;

    public CoopterServiceImpl(CoopterRepository coopterRepository, CoopterSearchRepository coopterSearchRepository) {
        this.coopterRepository = coopterRepository;
        this.coopterSearchRepository = coopterSearchRepository;
    }

    /**
     * Save a coopter.
     *
     * @param coopter the entity to save
     * @return the persisted entity
     */
    @Override
    public Coopter save(Coopter coopter) {
        log.debug("Request to save Coopter : {}", coopter);
        Coopter result = coopterRepository.save(coopter);
        coopterSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the coopters.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Coopter> findAll(Pageable pageable) {
        log.debug("Request to get all Coopters");
        return coopterRepository.findAll(pageable);
    }


    /**
     * Get one coopter by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Coopter> findOne(Long id) {
        log.debug("Request to get Coopter : {}", id);
        return coopterRepository.findById(id);
    }

    /**
     * Delete the coopter by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Coopter : {}", id);
        coopterRepository.deleteById(id);
        coopterSearchRepository.deleteById(id);
    }

    /**
     * Search for the coopter corresponding to the query.
     *
     * @param query the query of the search
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Coopter> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Coopters for query {}", query);
        return coopterSearchRepository.search(queryStringQuery(query), pageable);    }
}
