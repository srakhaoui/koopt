package com.harington.cooptit.repository.search;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import com.harington.cooptit.domain.es.SkillEs;

/**
 * Spring Data Elasticsearch repository for the Skill entity.
 */
public interface SkillSearchRepository extends ElasticsearchRepository<SkillEs, Long> {
}
