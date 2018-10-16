package com.harington.cooptit.repository.search;

import com.harington.cooptit.domain.Recruter;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Recruter entity.
 */
public interface RecruterSearchRepository extends ElasticsearchRepository<Recruter, Long> {
}
