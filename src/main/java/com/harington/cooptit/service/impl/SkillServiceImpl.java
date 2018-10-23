package com.harington.cooptit.service.impl;

import com.harington.cooptit.service.SkillService;
import com.harington.cooptit.domain.Skill;
import com.harington.cooptit.repository.SkillRepository;
import com.harington.cooptit.repository.search.SkillSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing Skill.
 */
@Service
@Transactional
public class SkillServiceImpl implements SkillService {

    private final Logger log = LoggerFactory.getLogger(SkillServiceImpl.class);

    private SkillRepository skillRepository;

    private SkillSearchRepository skillSearchRepository;

    public SkillServiceImpl(SkillRepository skillRepository, SkillSearchRepository skillSearchRepository) {
        this.skillRepository = skillRepository;
        this.skillSearchRepository = skillSearchRepository;
    }

    /**
     * Save a skill.
     *
     * @param skill the entity to save
     * @return the persisted entity
     */
    @Override
    public Skill save(Skill skill) {
        log.debug("Request to save Skill : {}", skill);
        Skill result = skillRepository.save(skill);
        skillSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the skills.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<Skill> findAll() {
        log.debug("Request to get all Skills");
        return skillRepository.findAll();
    }


    /**
     * Get one skill by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Skill> findOne(Long id) {
        log.debug("Request to get Skill : {}", id);
        return skillRepository.findById(id);
    }

    /**
     * Delete the skill by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Skill : {}", id);
        skillRepository.deleteById(id);
        skillSearchRepository.deleteById(id);
    }

    /**
     * Search for the skill corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<Skill> search(String query) {
        log.debug("Request to search Skills for query {}", query);
        return StreamSupport
            .stream(skillSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
