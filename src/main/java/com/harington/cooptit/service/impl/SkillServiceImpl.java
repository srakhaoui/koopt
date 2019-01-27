package com.harington.cooptit.service.impl;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import io.searchbox.client.JestClient;
import io.searchbox.core.Suggest;
import io.searchbox.core.SuggestResult;
import io.searchbox.core.SuggestResult.Suggestion;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.harington.cooptit.domain.Skill;
import com.harington.cooptit.domain.es.SkillEs;
import com.harington.cooptit.mapper.SkillMapper;
import com.harington.cooptit.repository.SkillRepository;
import com.harington.cooptit.repository.search.SkillSearchRepository;
import com.harington.cooptit.service.SkillService;

/**
 * Service Implementation for managing Skill.
 */
@Service
@Transactional
public class SkillServiceImpl implements SkillService {

    private static final String LABEL_SUGGEST = "label-suggest";

	private final Logger log = LoggerFactory.getLogger(SkillServiceImpl.class);

    private SkillRepository skillRepository;

    private SkillSearchRepository skillSearchRepository;
    
    private JestClient jestClient;

    public SkillServiceImpl(SkillRepository skillRepository, SkillSearchRepository skillSearchRepository, JestClient jestClient) {
        this.skillRepository = skillRepository;
        this.skillSearchRepository = skillSearchRepository;
        this.jestClient = jestClient;
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
        Skill savedSkill = skillRepository.save(skill);
        final SkillEs skillEs = SkillMapper.INSTANCE.skillToSkillEs(savedSkill);
        skillSearchRepository.save(skillEs);
		return savedSkill;
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
            .map(skillEs -> SkillMapper.INSTANCE.skillEsToSkill(skillEs))
            .collect(Collectors.toList());
    }
    
    /**
     * Suggest labels starting with the given prefix
     *
     * @param prefix the prefix of the suggestion
     * 
     * @return the list of labels
     */
    @Override
    @Transactional(readOnly = true)
    public List<Skill> suggestLabels(String prefix) throws Exception {
        log.debug("Request to search Skills' labels for prefix {}", prefix);
        
        final String suggestQuery = String.format("{ \"%s\": {  \"prefix\" : \"%s\", \"completion\" : { \"field\" : \"%s\"  }}}", LABEL_SUGGEST, prefix, SkillEs.COMPLETION_FIELD);
        log.debug("Suggest query {}",suggestQuery);
        final Suggest suggest = new Suggest.Builder(suggestQuery).addIndex(SkillEs.INDEX_NAME).build();

        final SuggestResult result = jestClient.execute(suggest);
        
        final List<Skill> labelSuggestions = new ArrayList<>();
        final Optional<Suggestion> suggestionOptional = Optional.ofNullable(result.getSuggestions(LABEL_SUGGEST))
        		.filter(aSuggestion -> !aSuggestion.isEmpty())
        		.map(aSuggestion -> aSuggestion.get(0));
        suggestionOptional.ifPresent(suggestion -> 
        	suggestion.options.stream().forEach(option -> {
        			final Skill skill = new Skill();
        			skill.setId(Long.parseLong((String) option.get("_id")));
        			skill.setLabel((String) option.get("text"));
        			labelSuggestions.add(skill);
        		}
        	)	
        );
        return labelSuggestions;
    }
}