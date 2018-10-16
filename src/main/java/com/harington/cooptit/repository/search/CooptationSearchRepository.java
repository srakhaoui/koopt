package com.harington.cooptit.repository.search;

import com.harington.cooptit.domain.Cooptation;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Cooptation entity.
 */
public interface CooptationSearchRepository extends ElasticsearchRepository<Cooptation, Long> {
}
