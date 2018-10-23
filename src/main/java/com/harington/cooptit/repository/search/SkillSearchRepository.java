package com.harington.cooptit.repository.search;

import com.harington.cooptit.domain.Skill;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Skill entity.
 */
public interface SkillSearchRepository extends ElasticsearchRepository<Skill, Long> {
}
