package com.harington.cooptit.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.harington.cooptit.domain.Recruter;
import com.harington.cooptit.repository.RecruterRepository;
import com.harington.cooptit.repository.search.RecruterSearchRepository;
import com.harington.cooptit.web.rest.errors.BadRequestAlertException;
import com.harington.cooptit.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Recruter.
 */
@RestController
@RequestMapping("/api")
public class RecruterResource {

    private final Logger log = LoggerFactory.getLogger(RecruterResource.class);

    private static final String ENTITY_NAME = "recruter";

    private RecruterRepository recruterRepository;

    private RecruterSearchRepository recruterSearchRepository;

    public RecruterResource(RecruterRepository recruterRepository, RecruterSearchRepository recruterSearchRepository) {
        this.recruterRepository = recruterRepository;
        this.recruterSearchRepository = recruterSearchRepository;
    }

    /**
     * POST  /recruters : Create a new recruter.
     *
     * @param recruter the recruter to create
     * @return the ResponseEntity with status 201 (Created) and with body the new recruter, or with status 400 (Bad Request) if the recruter has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/recruters")
    @Timed
    public ResponseEntity<Recruter> createRecruter(@RequestBody Recruter recruter) throws URISyntaxException {
        log.debug("REST request to save Recruter : {}", recruter);
        if (recruter.getId() != null) {
            throw new BadRequestAlertException("A new recruter cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Recruter result = recruterRepository.save(recruter);
        recruterSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/recruters/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /recruters : Updates an existing recruter.
     *
     * @param recruter the recruter to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated recruter,
     * or with status 400 (Bad Request) if the recruter is not valid,
     * or with status 500 (Internal Server Error) if the recruter couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/recruters")
    @Timed
    public ResponseEntity<Recruter> updateRecruter(@RequestBody Recruter recruter) throws URISyntaxException {
        log.debug("REST request to update Recruter : {}", recruter);
        if (recruter.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Recruter result = recruterRepository.save(recruter);
        recruterSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, recruter.getId().toString()))
            .body(result);
    }

    /**
     * GET  /recruters : get all the recruters.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of recruters in body
     */
    @GetMapping("/recruters")
    @Timed
    public List<Recruter> getAllRecruters() {
        log.debug("REST request to get all Recruters");
        return recruterRepository.findAll();
    }

    /**
     * GET  /recruters/:id : get the "id" recruter.
     *
     * @param id the id of the recruter to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the recruter, or with status 404 (Not Found)
     */
    @GetMapping("/recruters/{id}")
    @Timed
    public ResponseEntity<Recruter> getRecruter(@PathVariable Long id) {
        log.debug("REST request to get Recruter : {}", id);
        Optional<Recruter> recruter = recruterRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(recruter);
    }

    /**
     * DELETE  /recruters/:id : delete the "id" recruter.
     *
     * @param id the id of the recruter to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/recruters/{id}")
    @Timed
    public ResponseEntity<Void> deleteRecruter(@PathVariable Long id) {
        log.debug("REST request to delete Recruter : {}", id);

        recruterRepository.deleteById(id);
        recruterSearchRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/recruters?query=:query : search for the recruter corresponding
     * to the query.
     *
     * @param query the query of the recruter search
     * @return the result of the search
     */
    @GetMapping("/_search/recruters")
    @Timed
    public List<Recruter> searchRecruters(@RequestParam String query) {
        log.debug("REST request to search Recruters for query {}", query);
        return StreamSupport
            .stream(recruterSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
