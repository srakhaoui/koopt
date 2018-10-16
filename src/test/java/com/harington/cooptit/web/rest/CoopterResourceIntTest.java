package com.harington.cooptit.web.rest;

import com.harington.cooptit.CooptitApp;

import com.harington.cooptit.domain.Coopter;
import com.harington.cooptit.repository.CoopterRepository;
import com.harington.cooptit.repository.search.CoopterSearchRepository;
import com.harington.cooptit.service.CoopterService;
import com.harington.cooptit.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
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
 * Test class for the CoopterResource REST controller.
 *
 * @see CoopterResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = CooptitApp.class)
public class CoopterResourceIntTest {

    private static final String DEFAULT_PHONE_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_PHONE_NUMBER = "BBBBBBBBBB";

    @Autowired
    private CoopterRepository coopterRepository;
    
    @Autowired
    private CoopterService coopterService;

    /**
     * This repository is mocked in the com.harington.cooptit.repository.search test package.
     *
     * @see com.harington.cooptit.repository.search.CoopterSearchRepositoryMockConfiguration
     */
    @Autowired
    private CoopterSearchRepository mockCoopterSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restCoopterMockMvc;

    private Coopter coopter;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CoopterResource coopterResource = new CoopterResource(coopterService);
        this.restCoopterMockMvc = MockMvcBuilders.standaloneSetup(coopterResource)
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
    public static Coopter createEntity(EntityManager em) {
        Coopter coopter = new Coopter()
            .phoneNumber(DEFAULT_PHONE_NUMBER);
        return coopter;
    }

    @Before
    public void initTest() {
        coopter = createEntity(em);
    }

    @Test
    @Transactional
    public void createCoopter() throws Exception {
        int databaseSizeBeforeCreate = coopterRepository.findAll().size();

        // Create the Coopter
        restCoopterMockMvc.perform(post("/api/coopters")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(coopter)))
            .andExpect(status().isCreated());

        // Validate the Coopter in the database
        List<Coopter> coopterList = coopterRepository.findAll();
        assertThat(coopterList).hasSize(databaseSizeBeforeCreate + 1);
        Coopter testCoopter = coopterList.get(coopterList.size() - 1);
        assertThat(testCoopter.getPhoneNumber()).isEqualTo(DEFAULT_PHONE_NUMBER);

        // Validate the Coopter in Elasticsearch
        verify(mockCoopterSearchRepository, times(1)).save(testCoopter);
    }

    @Test
    @Transactional
    public void createCoopterWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = coopterRepository.findAll().size();

        // Create the Coopter with an existing ID
        coopter.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCoopterMockMvc.perform(post("/api/coopters")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(coopter)))
            .andExpect(status().isBadRequest());

        // Validate the Coopter in the database
        List<Coopter> coopterList = coopterRepository.findAll();
        assertThat(coopterList).hasSize(databaseSizeBeforeCreate);

        // Validate the Coopter in Elasticsearch
        verify(mockCoopterSearchRepository, times(0)).save(coopter);
    }

    @Test
    @Transactional
    public void getAllCoopters() throws Exception {
        // Initialize the database
        coopterRepository.saveAndFlush(coopter);

        // Get all the coopterList
        restCoopterMockMvc.perform(get("/api/coopters?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(coopter.getId().intValue())))
            .andExpect(jsonPath("$.[*].phoneNumber").value(hasItem(DEFAULT_PHONE_NUMBER.toString())));
    }
    
    @Test
    @Transactional
    public void getCoopter() throws Exception {
        // Initialize the database
        coopterRepository.saveAndFlush(coopter);

        // Get the coopter
        restCoopterMockMvc.perform(get("/api/coopters/{id}", coopter.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(coopter.getId().intValue()))
            .andExpect(jsonPath("$.phoneNumber").value(DEFAULT_PHONE_NUMBER.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingCoopter() throws Exception {
        // Get the coopter
        restCoopterMockMvc.perform(get("/api/coopters/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCoopter() throws Exception {
        // Initialize the database
        coopterService.save(coopter);
        // As the test used the service layer, reset the Elasticsearch mock repository
        reset(mockCoopterSearchRepository);

        int databaseSizeBeforeUpdate = coopterRepository.findAll().size();

        // Update the coopter
        Coopter updatedCoopter = coopterRepository.findById(coopter.getId()).get();
        // Disconnect from session so that the updates on updatedCoopter are not directly saved in db
        em.detach(updatedCoopter);
        updatedCoopter
            .phoneNumber(UPDATED_PHONE_NUMBER);

        restCoopterMockMvc.perform(put("/api/coopters")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedCoopter)))
            .andExpect(status().isOk());

        // Validate the Coopter in the database
        List<Coopter> coopterList = coopterRepository.findAll();
        assertThat(coopterList).hasSize(databaseSizeBeforeUpdate);
        Coopter testCoopter = coopterList.get(coopterList.size() - 1);
        assertThat(testCoopter.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);

        // Validate the Coopter in Elasticsearch
        verify(mockCoopterSearchRepository, times(1)).save(testCoopter);
    }

    @Test
    @Transactional
    public void updateNonExistingCoopter() throws Exception {
        int databaseSizeBeforeUpdate = coopterRepository.findAll().size();

        // Create the Coopter

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCoopterMockMvc.perform(put("/api/coopters")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(coopter)))
            .andExpect(status().isBadRequest());

        // Validate the Coopter in the database
        List<Coopter> coopterList = coopterRepository.findAll();
        assertThat(coopterList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Coopter in Elasticsearch
        verify(mockCoopterSearchRepository, times(0)).save(coopter);
    }

    @Test
    @Transactional
    public void deleteCoopter() throws Exception {
        // Initialize the database
        coopterService.save(coopter);

        int databaseSizeBeforeDelete = coopterRepository.findAll().size();

        // Get the coopter
        restCoopterMockMvc.perform(delete("/api/coopters/{id}", coopter.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Coopter> coopterList = coopterRepository.findAll();
        assertThat(coopterList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Coopter in Elasticsearch
        verify(mockCoopterSearchRepository, times(1)).deleteById(coopter.getId());
    }

    @Test
    @Transactional
    public void searchCoopter() throws Exception {
        // Initialize the database
        coopterService.save(coopter);
        when(mockCoopterSearchRepository.search(queryStringQuery("id:" + coopter.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(coopter), PageRequest.of(0, 1), 1));
        // Search the coopter
        restCoopterMockMvc.perform(get("/api/_search/coopters?query=id:" + coopter.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(coopter.getId().intValue())))
            .andExpect(jsonPath("$.[*].phoneNumber").value(hasItem(DEFAULT_PHONE_NUMBER.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Coopter.class);
        Coopter coopter1 = new Coopter();
        coopter1.setId(1L);
        Coopter coopter2 = new Coopter();
        coopter2.setId(coopter1.getId());
        assertThat(coopter1).isEqualTo(coopter2);
        coopter2.setId(2L);
        assertThat(coopter1).isNotEqualTo(coopter2);
        coopter1.setId(null);
        assertThat(coopter1).isNotEqualTo(coopter2);
    }
}
