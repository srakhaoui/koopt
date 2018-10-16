package com.harington.cooptit.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of CooptationSearchRepository to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class CooptationSearchRepositoryMockConfiguration {

    @MockBean
    private CooptationSearchRepository mockCooptationSearchRepository;

}
