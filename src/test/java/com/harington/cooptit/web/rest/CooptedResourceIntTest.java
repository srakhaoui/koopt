package com.harington.cooptit.web.rest;

import com.harington.cooptit.CooptitApp;

import com.harington.cooptit.domain.Coopted;
import com.harington.cooptit.repository.CooptedRepository;
import com.harington.cooptit.repository.search.CooptedSearchRepository;
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
 * Test class for the CooptedResource REST controller.
 *
 * @see CooptedResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = CooptitApp.class)
public class CooptedResourceIntTest {

    private static final String DEFAULT_PHONE_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_PHONE_NUMBER = "BBBBBBBBBB";

    private static final String DEFAULT_LINKED_IN = "AAAAAAAAAA";
    private static final String UPDATED_LINKED_IN = "BBBBBBBBBB";

    @Autowired
    private CooptedRepository cooptedRepository;

    /**
     * This repository is mocked in the com.harington.cooptit.repository.search test package.
     *
     * @see com.harington.cooptit.repository.search.CooptedSearchRepositoryMockConfiguration
     */
    @Autowired
    private CooptedSearchRepository mockCooptedSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restCooptedMockMvc;

    private Coopted coopted;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CooptedResource cooptedResource = new CooptedResource(cooptedRepository, mockCooptedSearchRepository);
        this.restCooptedMockMvc = MockMvcBuilders.standaloneSetup(cooptedResource)
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
    public static Coopted createEntity(EntityManager em) {
        Coopted coopted = new Coopted()
            .phoneNumber(DEFAULT_PHONE_NUMBER)
            .linkedIn(DEFAULT_LINKED_IN);
        return coopted;
    }

    @Before
    public void initTest() {
        coopted = createEntity(em);
    }

    @Test
    @Transactional
    public void createCoopted() throws Exception {
        int databaseSizeBeforeCreate = cooptedRepository.findAll().size();

        // Create the Coopted
        restCooptedMockMvc.perform(post("/api/coopteds")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(coopted)))
            .andExpect(status().isCreated());

        // Validate the Coopted in the database
        List<Coopted> cooptedList = cooptedRepository.findAll();
        assertThat(cooptedList).hasSize(databaseSizeBeforeCreate + 1);
        Coopted testCoopted = cooptedList.get(cooptedList.size() - 1);
        assertThat(testCoopted.getPhoneNumber()).isEqualTo(DEFAULT_PHONE_NUMBER);
        assertThat(testCoopted.getLinkedIn()).isEqualTo(DEFAULT_LINKED_IN);

        // Validate the Coopted in Elasticsearch
        verify(mockCooptedSearchRepository, times(1)).save(testCoopted);
    }

    @Test
    @Transactional
    public void createCooptedWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = cooptedRepository.findAll().size();

        // Create the Coopted with an existing ID
        coopted.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCooptedMockMvc.perform(post("/api/coopteds")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(coopted)))
            .andExpect(status().isBadRequest());

        // Validate the Coopted in the database
        List<Coopted> cooptedList = cooptedRepository.findAll();
        assertThat(cooptedList).hasSize(databaseSizeBeforeCreate);

        // Validate the Coopted in Elasticsearch
        verify(mockCooptedSearchRepository, times(0)).save(coopted);
    }

    @Test
    @Transactional
    public void getAllCoopteds() throws Exception {
        // Initialize the database
        cooptedRepository.saveAndFlush(coopted);

        // Get all the cooptedList
        restCooptedMockMvc.perform(get("/api/coopteds?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(coopted.getId().intValue())))
            .andExpect(jsonPath("$.[*].phoneNumber").value(hasItem(DEFAULT_PHONE_NUMBER.toString())))
            .andExpect(jsonPath("$.[*].linkedIn").value(hasItem(DEFAULT_LINKED_IN.toString())));
    }
    
    @Test
    @Transactional
    public void getCoopted() throws Exception {
        // Initialize the database
        cooptedRepository.saveAndFlush(coopted);

        // Get the coopted
        restCooptedMockMvc.perform(get("/api/coopteds/{id}", coopted.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(coopted.getId().intValue()))
            .andExpect(jsonPath("$.phoneNumber").value(DEFAULT_PHONE_NUMBER.toString()))
            .andExpect(jsonPath("$.linkedIn").value(DEFAULT_LINKED_IN.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingCoopted() throws Exception {
        // Get the coopted
        restCooptedMockMvc.perform(get("/api/coopteds/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCoopted() throws Exception {
        // Initialize the database
        cooptedRepository.saveAndFlush(coopted);

        int databaseSizeBeforeUpdate = cooptedRepository.findAll().size();

        // Update the coopted
        Coopted updatedCoopted = cooptedRepository.findById(coopted.getId()).get();
        // Disconnect from session so that the updates on updatedCoopted are not directly saved in db
        em.detach(updatedCoopted);
        updatedCoopted
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .linkedIn(UPDATED_LINKED_IN);

        restCooptedMockMvc.perform(put("/api/coopteds")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedCoopted)))
            .andExpect(status().isOk());

        // Validate the Coopted in the database
        List<Coopted> cooptedList = cooptedRepository.findAll();
        assertThat(cooptedList).hasSize(databaseSizeBeforeUpdate);
        Coopted testCoopted = cooptedList.get(cooptedList.size() - 1);
        assertThat(testCoopted.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
        assertThat(testCoopted.getLinkedIn()).isEqualTo(UPDATED_LINKED_IN);

        // Validate the Coopted in Elasticsearch
        verify(mockCooptedSearchRepository, times(1)).save(testCoopted);
    }

    @Test
    @Transactional
    public void updateNonExistingCoopted() throws Exception {
        int databaseSizeBeforeUpdate = cooptedRepository.findAll().size();

        // Create the Coopted

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCooptedMockMvc.perform(put("/api/coopteds")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(coopted)))
            .andExpect(status().isBadRequest());

        // Validate the Coopted in the database
        List<Coopted> cooptedList = cooptedRepository.findAll();
        assertThat(cooptedList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Coopted in Elasticsearch
        verify(mockCooptedSearchRepository, times(0)).save(coopted);
    }

    @Test
    @Transactional
    public void deleteCoopted() throws Exception {
        // Initialize the database
        cooptedRepository.saveAndFlush(coopted);

        int databaseSizeBeforeDelete = cooptedRepository.findAll().size();

        // Get the coopted
        restCooptedMockMvc.perform(delete("/api/coopteds/{id}", coopted.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Coopted> cooptedList = cooptedRepository.findAll();
        assertThat(cooptedList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Coopted in Elasticsearch
        verify(mockCooptedSearchRepository, times(1)).deleteById(coopted.getId());
    }

    @Test
    @Transactional
    public void searchCoopted() throws Exception {
        // Initialize the database
        cooptedRepository.saveAndFlush(coopted);
        when(mockCooptedSearchRepository.search(queryStringQuery("id:" + coopted.getId())))
            .thenReturn(Collections.singletonList(coopted));
        // Search the coopted
        restCooptedMockMvc.perform(get("/api/_search/coopteds?query=id:" + coopted.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(coopted.getId().intValue())))
            .andExpect(jsonPath("$.[*].phoneNumber").value(hasItem(DEFAULT_PHONE_NUMBER.toString())))
            .andExpect(jsonPath("$.[*].linkedIn").value(hasItem(DEFAULT_LINKED_IN.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Coopted.class);
        Coopted coopted1 = new Coopted();
        coopted1.setId(1L);
        Coopted coopted2 = new Coopted();
        coopted2.setId(coopted1.getId());
        assertThat(coopted1).isEqualTo(coopted2);
        coopted2.setId(2L);
        assertThat(coopted1).isNotEqualTo(coopted2);
        coopted1.setId(null);
        assertThat(coopted1).isNotEqualTo(coopted2);
    }
}
