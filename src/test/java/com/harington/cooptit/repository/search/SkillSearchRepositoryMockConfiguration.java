package com.harington.cooptit.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of SkillSearchRepository to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class SkillSearchRepositoryMockConfiguration {

    @MockBean
    private SkillSearchRepository mockSkillSearchRepository;

}
