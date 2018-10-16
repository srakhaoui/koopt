package com.harington.cooptit.web.rest;

import com.harington.cooptit.CooptitApp;

import com.harington.cooptit.domain.Recruter;
import com.harington.cooptit.repository.RecruterRepository;
import com.harington.cooptit.repository.search.RecruterSearchRepository;
import com.harington.cooptit.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.Collections;
import java.util.List;


import static com.harington.cooptit.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the RecruterResource REST controller.
 *
 * @see RecruterResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = CooptitApp.class)
public class RecruterResourceIntTest {

    private static final String DEFAULT_PHONE_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_PHONE_NUMBER = "BBBBBBBBBB";

    @Autowired
    private RecruterRepository recruterRepository;

    /**
     * This repository is mocked in the com.harington.cooptit.repository.search test package.
     *
     * @see com.harington.cooptit.repository.search.RecruterSearchRepositoryMockConfiguration
     */
    @Autowired
    private RecruterSearchRepository mockRecruterSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restRecruterMockMvc;

    private Recruter recruter;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final RecruterResource recruterResource = new RecruterResource(recruterRepository, mockRecruterSearchRepository);
        this.restRecruterMockMvc = MockMvcBuilders.standaloneSetup(recruterResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Recruter createEntity(EntityManager em) {
        Recruter recruter = new Recruter()
            .phoneNumber(DEFAULT_PHONE_NUMBER);
        return recruter;
    }

    @Before
    public void initTest() {
        recruter = createEntity(em);
    }

    @Test
    @Transactional
    public void createRecruter() throws Exception {
        int databaseSizeBeforeCreate = recruterRepository.findAll().size();

        // Create the Recruter
        restRecruterMockMvc.perform(post("/api/recruters")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(recruter)))
            .andExpect(status().isCreated());

        // Validate the Recruter in the database
        List<Recruter> recruterList = recruterRepository.findAll();
        assertThat(recruterList).hasSize(databaseSizeBeforeCreate + 1);
        Recruter testRecruter = recruterList.get(recruterList.size() - 1);
        assertThat(testRecruter.getPhoneNumber()).isEqualTo(DEFAULT_PHONE_NUMBER);

        // Validate the Recruter in Elasticsearch
        verify(mockRecruterSearchRepository, times(1)).save(testRecruter);
    }

    @Test
    @Transactional
    public void createRecruterWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = recruterRepository.findAll().size();

        // Create the Recruter with an existing ID
        recruter.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restRecruterMockMvc.perform(post("/api/recruters")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(recruter)))
            .andExpect(status().isBadRequest());

        // Validate the Recruter in the database
        List<Recruter> recruterList = recruterRepository.findAll();
        assertThat(recruterList).hasSize(databaseSizeBeforeCreate);

        // Validate the Recruter in Elasticsearch
        verify(mockRecruterSearchRepository, times(0)).save(recruter);
    }

    @Test
    @Transactional
    public void getAllRecruters() throws Exception {
        // Initialize the database
        recruterRepository.saveAndFlush(recruter);

        // Get all the recruterList
        restRecruterMockMvc.perform(get("/api/recruters?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(recruter.getId().intValue())))
            .andExpect(jsonPath("$.[*].phoneNumber").value(hasItem(DEFAULT_PHONE_NUMBER.toString())));
    }
    
    @Test
    @Transactional
    public void getRecruter() throws Exception {
        // Initialize the database
        recruterRepository.saveAndFlush(recruter);

        // Get the recruter
        restRecruterMockMvc.perform(get("/api/recruters/{id}", recruter.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(recruter.getId().intValue()))
            .andExpect(jsonPath("$.phoneNumber").value(DEFAULT_PHONE_NUMBER.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingRecruter() throws Exception {
        // Get the recruter
        restRecruterMockMvc.perform(get("/api/recruters/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateRecruter() throws Exception {
        // Initialize the database
        recruterRepository.saveAndFlush(recruter);

        int databaseSizeBeforeUpdate = recruterRepository.findAll().size();

        // Update the recruter
        Recruter updatedRecruter = recruterRepository.findById(recruter.getId()).get();
        // Disconnect from session so that the updates on updatedRecruter are not directly saved in db
        em.detach(updatedRecruter);
        updatedRecruter
            .phoneNumber(UPDATED_PHONE_NUMBER);

        restRecruterMockMvc.perform(put("/api/recruters")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedRecruter)))
            .andExpect(status().isOk());

        // Validate the Recruter in the database
        List<Recruter> recruterList = recruterRepository.findAll();
        assertThat(recruterList).hasSize(databaseSizeBeforeUpdate);
        Recruter testRecruter = recruterList.get(recruterList.size() - 1);
        assertThat(testRecruter.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);

        // Validate the Recruter in Elasticsearch
        verify(mockRecruterSearchRepository, times(1)).save(testRecruter);
    }

    @Test
    @Transactional
    public void updateNonExistingRecruter() throws Exception {
        int databaseSizeBeforeUpdate = recruterRepository.findAll().size();

        // Create the Recruter

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRecruterMockMvc.perform(put("/api/recruters")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(recruter)))
            .andExpect(status().isBadRequest());

        // Validate the Recruter in the database
        List<Recruter> recruterList = recruterRepository.findAll();
        assertThat(recruterList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Recruter in Elasticsearch
        verify(mockRecruterSearchRepository, times(0)).save(recruter);
    }

    @Test
    @Transactional
    public void deleteRecruter() throws Exception {
        // Initialize the database
        recruterRepository.saveAndFlush(recruter);

        int databaseSizeBeforeDelete = recruterRepository.findAll().size();

        // Get the recruter
        restRecruterMockMvc.perform(delete("/api/recruters/{id}", recruter.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Recruter> recruterList = recruterRepository.findAll();
        assertThat(recruterList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Recruter in Elasticsearch
        verify(mockRecruterSearchRepository, times(1)).deleteById(recruter.getId());
    }

    @Test
    @Transactional
    public void searchRecruter() throws Exception {
        // Initialize the database
        recruterRepository.saveAndFlush(recruter);
        when(mockRecruterSearchRepository.search(queryStringQuery("id:" + recruter.getId())))
            .thenReturn(Collections.singletonList(recruter));
        // Search the recruter
        restRecruterMockMvc.perform(get("/api/_search/recruters?query=id:" + recruter.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(recruter.getId().intValue())))
            .andExpect(jsonPath("$.[*].phoneNumber").value(hasItem(DEFAULT_PHONE_NUMBER.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Recruter.class);
        Recruter recruter1 = new Recruter();
        recruter1.setId(1L);
        Recruter recruter2 = new Recruter();
        recruter2.setId(recruter1.getId());
        assertThat(recruter1).isEqualTo(recruter2);
        recruter2.setId(2L);
        assertThat(recruter1).isNotEqualTo(recruter2);
        recruter1.setId(null);
        assertThat(recruter1).isNotEqualTo(recruter2);
    }
}
