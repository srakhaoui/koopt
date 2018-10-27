package com.harington.cooptit.service;

import com.harington.cooptit.domain.Skill;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing Skill.
 */
public interface SkillService {

    /**
     * Save a skill.
     *
     * @param skill the entity to save
     * @return the persisted entity
     */
    Skill save(Skill skill);

    /**
     * Get all the skills.
     *
     * @return the list of entities
     */
    List<Skill> findAll();


    /**
     * Get the "id" skill.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Optional<Skill> findOne(Long id);

    /**
     * Delete the "id" skill.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the skill corresponding to the query.
     *
     * @param query the query of the search
     * 
     * @return the list of entities
     */
    List<Skill> search(String query);
    
    /**
     * Suggest labels starting with the given prefix
     *
     * @param prefix the prefix of the suggestion
     * 
     * @return the list of labels
     */
    List<String> suggestLabels(String prefix) throws Exception;
}
