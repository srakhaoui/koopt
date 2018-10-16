package com.harington.cooptit.repository.search;

import com.harington.cooptit.domain.Coopter;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Coopter entity.
 */
public interface CoopterSearchRepository extends ElasticsearchRepository<Coopter, Long> {
}
