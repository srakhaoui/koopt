package com.harington.cooptit.repository.search;

import com.harington.cooptit.domain.Coopted;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Coopted entity.
 */
public interface CooptedSearchRepository extends ElasticsearchRepository<Coopted, Long> {
}
