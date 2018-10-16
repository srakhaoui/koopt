package com.harington.cooptit.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.harington.cooptit.domain.Coopted;
import com.harington.cooptit.repository.CooptedRepository;
import com.harington.cooptit.repository.search.CooptedSearchRepository;
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
 * REST controller for managing Coopted.
 */
@RestController
@RequestMapping("/api")
public class CooptedResource {

    private final Logger log = LoggerFactory.getLogger(CooptedResource.class);

    private static final String ENTITY_NAME = "coopted";

    private CooptedRepository cooptedRepository;

    private CooptedSearchRepository cooptedSearchRepository;

    public CooptedResource(CooptedRepository cooptedRepository, CooptedSearchRepository cooptedSearchRepository) {
        this.cooptedRepository = cooptedRepository;
        this.cooptedSearchRepository = cooptedSearchRepository;
    }

    /**
     * POST  /coopteds : Create a new coopted.
     *
     * @param coopted the coopted to create
     * @return the ResponseEntity with status 201 (Created) and with body the new coopted, or with status 400 (Bad Request) if the coopted has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/coopteds")
    @Timed
    public ResponseEntity<Coopted> createCoopted(@RequestBody Coopted coopted) throws URISyntaxException {
        log.debug("REST request to save Coopted : {}", coopted);
        if (coopted.getId() != null) {
            throw new BadRequestAlertException("A new coopted cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Coopted result = cooptedRepository.save(coopted);
        cooptedSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/coopteds/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /coopteds : Updates an existing coopted.
     *
     * @param coopted the coopted to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated coopted,
     * or with status 400 (Bad Request) if the coopted is not valid,
     * or with status 500 (Internal Server Error) if the coopted couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/coopteds")
    @Timed
    public ResponseEntity<Coopted> updateCoopted(@RequestBody Coopted coopted) throws URISyntaxException {
        log.debug("REST request to update Coopted : {}", coopted);
        if (coopted.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Coopted result = cooptedRepository.save(coopted);
        cooptedSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, coopted.getId().toString()))
            .body(result);
    }

    /**
     * GET  /coopteds : get all the coopteds.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of coopteds in body
     */
    @GetMapping("/coopteds")
    @Timed
    public List<Coopted> getAllCoopteds() {
        log.debug("REST request to get all Coopteds");
        return cooptedRepository.findAll();
    }

    /**
     * GET  /coopteds/:id : get the "id" coopted.
     *
     * @param id the id of the coopted to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the coopted, or with status 404 (Not Found)
     */
    @GetMapping("/coopteds/{id}")
    @Timed
    public ResponseEntity<Coopted> getCoopted(@PathVariable Long id) {
        log.debug("REST request to get Coopted : {}", id);
        Optional<Coopted> coopted = cooptedRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(coopted);
    }

    /**
     * DELETE  /coopteds/:id : delete the "id" coopted.
     *
     * @param id the id of the coopted to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/coopteds/{id}")
    @Timed
    public ResponseEntity<Void> deleteCoopted(@PathVariable Long id) {
        log.debug("REST request to delete Coopted : {}", id);

        cooptedRepository.deleteById(id);
        cooptedSearchRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/coopteds?query=:query : search for the coopted corresponding
     * to the query.
     *
     * @param query the query of the coopted search
     * @return the result of the search
     */
    @GetMapping("/_search/coopteds")
    @Timed
    public List<Coopted> searchCoopteds(@RequestParam String query) {
        log.debug("REST request to search Coopteds for query {}", query);
        return StreamSupport
            .stream(cooptedSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
