package com.harington.cooptit.service.impl;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import java.time.Instant;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.harington.cooptit.domain.Cooptation;
import com.harington.cooptit.domain.Skill;
import com.harington.cooptit.domain.User;
import com.harington.cooptit.repository.CooptationRepository;
import com.harington.cooptit.repository.CooptedRepository;
import com.harington.cooptit.repository.search.CooptationSearchRepository;
import com.harington.cooptit.service.CooptationService;
import com.harington.cooptit.service.SkillService;
import com.harington.cooptit.service.UserService;
import com.harington.cooptit.service.dto.UserDTO;

/**
 * Service Implementation for managing Cooptation.
 */
@Service
@Transactional
public class CooptationServiceImpl implements CooptationService {

    private final Logger log = LoggerFactory.getLogger(CooptationServiceImpl.class);

    private CooptationRepository cooptationRepository;

    private CooptationSearchRepository cooptationSearchRepository;
    
    @Autowired
    private CooptedRepository cooptedRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private SkillService skillService;

    public CooptationServiceImpl(CooptationRepository cooptationRepository, CooptationSearchRepository cooptationSearchRepository) {
        this.cooptationRepository = cooptationRepository;
        this.cooptationSearchRepository = cooptationSearchRepository;
    }

    /**
     * Save a cooptation.
     *
     * @param cooptation the entity to save
     * @return the persisted entity
     */
    @Override
    public Cooptation save(Cooptation cooptation) {
        log.debug("Request to save Cooptation : {}", cooptation);
        User cooptedUser = cooptation.getCoopted().getUser();
		cooptedUser = userService.createUser(new UserDTO(cooptedUser));
        cooptation.getCoopted().setUser(cooptedUser);
        cooptedRepository.save(cooptation.getCoopted());
        cooptation.setPerformedOn(Instant.now());
        final Set<Skill> skills = cooptation.getSkills().stream().map(skill -> skill.getId() == null ? skillService.save(skill) : skill).collect(Collectors.toSet());
        cooptation.setSkills(skills);
        final Cooptation savedCooptation = cooptationRepository.save(cooptation);
        cooptationSearchRepository.save(savedCooptation);
        return savedCooptation;
    }
    
    /**
     * Get all the cooptations.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Cooptation> findAll(Pageable pageable) {
        log.debug("Request to get all Cooptations");
        return cooptationRepository.findAll(pageable);
    }

    /**
     * Get all the Cooptation with eager load of many-to-many relationships.
     *
     * @return the list of entities
     */
    public Page<Cooptation> findAllWithEagerRelationships(Pageable pageable) {
        return cooptationRepository.findAllWithEagerRelationships(pageable);
    }
    

    /**
     * Get one cooptation by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Cooptation> findOne(Long id) {
        log.debug("Request to get Cooptation : {}", id);
        return cooptationRepository.findOneWithEagerRelationships(id);
    }

    /**
     * Delete the cooptation by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Cooptation : {}", id);
        cooptationRepository.deleteById(id);
        cooptationSearchRepository.deleteById(id);
    }

    /**
     * Search for the cooptation corresponding to the query.
     *
     * @param query the query of the search
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Cooptation> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Cooptations for query {}", query);
        return cooptationSearchRepository.search(queryStringQuery(query), pageable);    }
}
