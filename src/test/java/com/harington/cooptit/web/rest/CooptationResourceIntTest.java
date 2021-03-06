package com.harington.cooptit.web.rest;

import static com.harington.cooptit.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import javax.persistence.EntityManager;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
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

import com.harington.cooptit.CooptitApp;
import com.harington.cooptit.domain.Cooptation;
import com.harington.cooptit.domain.User;
import com.harington.cooptit.repository.CooptationRepository;
import com.harington.cooptit.repository.UserRepository;
import com.harington.cooptit.repository.search.CooptationSearchRepository;
import com.harington.cooptit.service.CooptationService;
import com.harington.cooptit.service.UserService;
import com.harington.cooptit.service.dto.UserDTO;
import com.harington.cooptit.web.rest.errors.ExceptionTranslator;

/**
 * Test class for the CooptationResource REST controller.
 *
 * @see CooptationResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = CooptitApp.class)
public class CooptationResourceIntTest {

    private static final String DEFAULT_PROFILE = "AAAAAAAAAA";
    private static final String UPDATED_PROFILE = "BBBBBBBBBB";

    private static final Instant DEFAULT_PERFORMED_ON = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_PERFORMED_ON = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_PHONE_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_PHONE_NUMBER = "BBBBBBBBBB";

    private static final String DEFAULT_LINKED_IN = "AAAAAAAAAA";
    private static final String UPDATED_LINKED_IN = "BBBBBBBBBB";

    private static final String DEFAULT_FIRST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FIRST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LAST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    @Autowired
    private CooptationRepository cooptationRepository;

    @Mock
    private CooptationRepository cooptationRepositoryMock;
    
    @Autowired
    private UserRepository userRepository;
    
    @Mock
    private CooptationService cooptationServiceMock;
    
    @Autowired
    private CooptationService cooptationService;
    
    /**
     * This repository is mocked in the com.harington.cooptit.service test package.
     *
     * @see com.harington.cooptit.service.UserServiceMockConfiguration
     */
    @Mock
    private UserService userService;

    /**
     * This repository is mocked in the com.harington.cooptit.repository.search test package.
     *
     * @see com.harington.cooptit.repository.search.CooptationSearchRepositoryMockConfiguration
     */
    @Autowired
    private CooptationSearchRepository mockCooptationSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restCooptationMockMvc;

    private Cooptation cooptation;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CooptationResource cooptationResource = new CooptationResource(cooptationService);
        this.restCooptationMockMvc = MockMvcBuilders.standaloneSetup(cooptationResource)
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
    public static Cooptation createEntity(EntityManager em) {
    	User coopter = new User();
    	coopter.setFirstName("firstName");
    	coopter.setLastName("lastName");
    	coopter.setLogin("login");
    	coopter.setEmail("email@email.fr");
    	coopter.setPassword("pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp");
        Cooptation cooptation = new Cooptation()
            .profile(DEFAULT_PROFILE)
            .performedOn(DEFAULT_PERFORMED_ON)
            .phoneNumber(DEFAULT_PHONE_NUMBER)
            .linkedIn(DEFAULT_LINKED_IN)
            .firstName(DEFAULT_FIRST_NAME)
            .lastName(DEFAULT_LAST_NAME)
            .email(DEFAULT_EMAIL)
            .coopter(coopter);
        return cooptation;
    }

    @Before
    public void initTest() {
        cooptation = createEntity(em);
    }

    @Test
    @Transactional
    public void createCooptation() throws Exception {
        int databaseSizeBeforeCreate = cooptationRepository.findAll().size();

        final User coopter = userRepository.save(cooptation.getCoopter());
    	when(userService.getUserWithAuthorities()).thenReturn(Optional.ofNullable(coopter));
    	cooptationService.setUserService(userService);
        // Create the Cooptation
        restCooptationMockMvc.perform(post("/api/cooptations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(cooptation)))
            .andExpect(status().isCreated());

        // Validate the Cooptation in the database
        List<Cooptation> cooptationList = cooptationRepository.findAll();
        assertThat(cooptationList).hasSize(databaseSizeBeforeCreate + 1);
        Cooptation testCooptation = cooptationList.get(cooptationList.size() - 1);
        assertThat(testCooptation.getProfile()).isEqualTo(DEFAULT_PROFILE);
        assertThat(testCooptation.getPerformedOn()).isAfterOrEqualTo(DEFAULT_PERFORMED_ON);
        assertThat(testCooptation.getPhoneNumber()).isEqualTo(DEFAULT_PHONE_NUMBER);
        assertThat(testCooptation.getLinkedIn()).isEqualTo(DEFAULT_LINKED_IN);
        assertThat(testCooptation.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testCooptation.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
        assertThat(testCooptation.getEmail()).isEqualTo(DEFAULT_EMAIL);

        // Validate the Cooptation in Elasticsearch
        verify(mockCooptationSearchRepository, times(1)).save(testCooptation);
    }

    @Test
    @Transactional
    public void createCooptationWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = cooptationRepository.findAll().size();

        // Create the Cooptation with an existing ID
        cooptation.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCooptationMockMvc.perform(post("/api/cooptations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(cooptation)))
            .andExpect(status().isBadRequest());

        // Validate the Cooptation in the database
        List<Cooptation> cooptationList = cooptationRepository.findAll();
        assertThat(cooptationList).hasSize(databaseSizeBeforeCreate);

        // Validate the Cooptation in Elasticsearch
        verify(mockCooptationSearchRepository, times(0)).save(cooptation);
    }

    @Test
    @Transactional
    public void getAllCooptations() throws Exception {
        // Initialize the database
    	final User coopter = userService.createUser(new UserDTO(cooptation.getCoopter()));
    	cooptation.setCoopter(coopter);
        cooptationRepository.saveAndFlush(cooptation);

        // Get all the cooptationList
        restCooptationMockMvc.perform(get("/api/cooptations?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(cooptation.getId().intValue())))
            .andExpect(jsonPath("$.[*].profile").value(hasItem(DEFAULT_PROFILE.toString())))
            .andExpect(jsonPath("$.[*].performedOn").value(hasItem(DEFAULT_PERFORMED_ON.toString())))
            .andExpect(jsonPath("$.[*].phoneNumber").value(hasItem(DEFAULT_PHONE_NUMBER.toString())))
            .andExpect(jsonPath("$.[*].linkedIn").value(hasItem(DEFAULT_LINKED_IN.toString())))
            .andExpect(jsonPath("$.[*].firstName").value(hasItem(DEFAULT_FIRST_NAME.toString())))
            .andExpect(jsonPath("$.[*].lastName").value(hasItem(DEFAULT_LAST_NAME.toString())))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL.toString())));
    }
    
    public void getAllCooptationsWithEagerRelationshipsIsEnabled() throws Exception {
        CooptationResource cooptationResource = new CooptationResource(cooptationServiceMock);
        when(cooptationServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        MockMvc restCooptationMockMvc = MockMvcBuilders.standaloneSetup(cooptationResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restCooptationMockMvc.perform(get("/api/cooptations?eagerload=true"))
        .andExpect(status().isOk());

        verify(cooptationServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    public void getAllCooptationsWithEagerRelationshipsIsNotEnabled() throws Exception {
        CooptationResource cooptationResource = new CooptationResource(cooptationServiceMock);
            when(cooptationServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));
            MockMvc restCooptationMockMvc = MockMvcBuilders.standaloneSetup(cooptationResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restCooptationMockMvc.perform(get("/api/cooptations?eagerload=true"))
        .andExpect(status().isOk());

            verify(cooptationServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    public void getCooptation() throws Exception {
        // Initialize the database
    	final User coopter = userService.createUser(new UserDTO(cooptation.getCoopter()));
    	cooptation.setCoopter(coopter);
        cooptationRepository.saveAndFlush(cooptation);

        // Get the cooptation
        restCooptationMockMvc.perform(get("/api/cooptations/{id}", cooptation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(cooptation.getId().intValue()))
            .andExpect(jsonPath("$.profile").value(DEFAULT_PROFILE.toString()))
            .andExpect(jsonPath("$.performedOn").value(DEFAULT_PERFORMED_ON.toString()))
            .andExpect(jsonPath("$.phoneNumber").value(DEFAULT_PHONE_NUMBER.toString()))
            .andExpect(jsonPath("$.linkedIn").value(DEFAULT_LINKED_IN.toString()))
            .andExpect(jsonPath("$.firstName").value(DEFAULT_FIRST_NAME.toString()))
            .andExpect(jsonPath("$.lastName").value(DEFAULT_LAST_NAME.toString()))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingCooptation() throws Exception {
        // Get the cooptation
        restCooptationMockMvc.perform(get("/api/cooptations/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCooptation() throws Exception {
        // Initialize the database
    	final User coopter = userRepository.save(cooptation.getCoopter());
    	when(userService.getUserWithAuthorities()).thenReturn(Optional.ofNullable(coopter));
    	cooptationService.setUserService(userService);
        cooptationService.save(cooptation);

        // As the test used the service layer, reset the Elasticsearch mock repository
        reset(mockCooptationSearchRepository);

        int databaseSizeBeforeUpdate = cooptationRepository.findAll().size();

        // Update the cooptation
        Cooptation updatedCooptation = cooptationRepository.findById(cooptation.getId()).get();
        // Disconnect from session so that the updates on updatedCooptation are not directly saved in db
        em.detach(updatedCooptation);
        updatedCooptation
            .profile(UPDATED_PROFILE)
            .performedOn(UPDATED_PERFORMED_ON)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .linkedIn(UPDATED_LINKED_IN)
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .email(UPDATED_EMAIL);

        restCooptationMockMvc.perform(put("/api/cooptations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedCooptation)))
            .andExpect(status().isOk());

        // Validate the Cooptation in the database
        List<Cooptation> cooptationList = cooptationRepository.findAll();
        assertThat(cooptationList).hasSize(databaseSizeBeforeUpdate);
        Cooptation testCooptation = cooptationList.get(cooptationList.size() - 1);
        assertThat(testCooptation.getProfile()).isEqualTo(UPDATED_PROFILE);
        assertThat(testCooptation.getPerformedOn()).isAfterOrEqualTo(UPDATED_PERFORMED_ON);
        assertThat(testCooptation.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
        assertThat(testCooptation.getLinkedIn()).isEqualTo(UPDATED_LINKED_IN);
        assertThat(testCooptation.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testCooptation.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testCooptation.getEmail()).isEqualTo(UPDATED_EMAIL);

        // Validate the Cooptation in Elasticsearch
        verify(mockCooptationSearchRepository, times(1)).save(testCooptation);
    }

    @Test
    @Transactional
    public void updateNonExistingCooptation() throws Exception {
        int databaseSizeBeforeUpdate = cooptationRepository.findAll().size();

        // Create the Cooptation

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCooptationMockMvc.perform(put("/api/cooptations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(cooptation)))
            .andExpect(status().isBadRequest());

        // Validate the Cooptation in the database
        List<Cooptation> cooptationList = cooptationRepository.findAll();
        assertThat(cooptationList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Cooptation in Elasticsearch
        verify(mockCooptationSearchRepository, times(0)).save(cooptation);
    }

    @Test
    @Transactional
    public void deleteCooptation() throws Exception {
        // Initialize the database
    	final User coopter = userRepository.save(cooptation.getCoopter());
    	when(userService.getUserWithAuthorities()).thenReturn(Optional.ofNullable(coopter));
    	cooptationService.setUserService(userService);
        cooptationService.save(cooptation);

        int databaseSizeBeforeDelete = cooptationRepository.findAll().size();

        // Get the cooptation
        restCooptationMockMvc.perform(delete("/api/cooptations/{id}", cooptation.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Cooptation> cooptationList = cooptationRepository.findAll();
        assertThat(cooptationList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Cooptation in Elasticsearch
        verify(mockCooptationSearchRepository, times(1)).deleteById(cooptation.getId());
    }

    @Test
    @Transactional
    public void searchCooptation() throws Exception {
        // Initialize the database
    	when(userService.getUserWithAuthorities()).thenReturn(Optional.ofNullable(cooptation.getCoopter()));
    	cooptationService.setUserService(userService);
    	cooptationService.save(cooptation);
    	
        when(mockCooptationSearchRepository.search(queryStringQuery("id:" + cooptation.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(cooptation), PageRequest.of(0, 1), 1));
        // Search the cooptation
        restCooptationMockMvc.perform(get("/api/_search/cooptations?query=id:" + cooptation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(cooptation.getId().intValue())))
            .andExpect(jsonPath("$.[*].profile").value(hasItem(DEFAULT_PROFILE.toString())))
            .andExpect(jsonPath("$.[*].performedOn").exists())
            .andExpect(jsonPath("$.[*].phoneNumber").value(hasItem(DEFAULT_PHONE_NUMBER.toString())))
            .andExpect(jsonPath("$.[*].linkedIn").value(hasItem(DEFAULT_LINKED_IN.toString())))
            .andExpect(jsonPath("$.[*].firstName").value(hasItem(DEFAULT_FIRST_NAME.toString())))
            .andExpect(jsonPath("$.[*].lastName").value(hasItem(DEFAULT_LAST_NAME.toString())))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Cooptation.class);
        Cooptation cooptation1 = new Cooptation();
        cooptation1.setId(1L);
        Cooptation cooptation2 = new Cooptation();
        cooptation2.setId(cooptation1.getId());
        assertThat(cooptation1).isEqualTo(cooptation2);
        cooptation2.setId(2L);
        assertThat(cooptation1).isNotEqualTo(cooptation2);
        cooptation1.setId(null);
        assertThat(cooptation1).isNotEqualTo(cooptation2);
    }
}
