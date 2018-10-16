package com.harington.cooptit.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.harington.cooptit.domain.Coopter;
import com.harington.cooptit.service.CoopterService;
import com.harington.cooptit.web.rest.errors.BadRequestAlertException;
import com.harington.cooptit.web.rest.util.HeaderUtil;
import com.harington.cooptit.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Coopter.
 */
@RestController
@RequestMapping("/api")
public class CoopterResource {

    private final Logger log = LoggerFactory.getLogger(CoopterResource.class);

    private static final String ENTITY_NAME = "coopter";

    private CoopterService coopterService;

    public CoopterResource(CoopterService coopterService) {
        this.coopterService = coopterService;
    }

    /**
     * POST  /coopters : Create a new coopter.
     *
     * @param coopter the coopter to create
     * @return the ResponseEntity with status 201 (Created) and with body the new coopter, or with status 400 (Bad Request) if the coopter has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/coopters")
    @Timed
    public ResponseEntity<Coopter> createCoopter(@RequestBody Coopter coopter) throws URISyntaxException {
        log.debug("REST request to save Coopter : {}", coopter);
        if (coopter.getId() != null) {
            throw new BadRequestAlertException("A new coopter cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Coopter result = coopterService.save(coopter);
        return ResponseEntity.created(new URI("/api/coopters/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /coopters : Updates an existing coopter.
     *
     * @param coopter the coopter to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated coopter,
     * or with status 400 (Bad Request) if the coopter is not valid,
     * or with status 500 (Internal Server Error) if the coopter couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/coopters")
    @Timed
    public ResponseEntity<Coopter> updateCoopter(@RequestBody Coopter coopter) throws URISyntaxException {
        log.debug("REST request to update Coopter : {}", coopter);
        if (coopter.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Coopter result = coopterService.save(coopter);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, coopter.getId().toString()))
            .body(result);
    }

    /**
     * GET  /coopters : get all the coopters.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of coopters in body
     */
    @GetMapping("/coopters")
    @Timed
    public ResponseEntity<List<Coopter>> getAllCoopters(Pageable pageable) {
        log.debug("REST request to get a page of Coopters");
        Page<Coopter> page = coopterService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/coopters");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /coopters/:id : get the "id" coopter.
     *
     * @param id the id of the coopter to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the coopter, or with status 404 (Not Found)
     */
    @GetMapping("/coopters/{id}")
    @Timed
    public ResponseEntity<Coopter> getCoopter(@PathVariable Long id) {
        log.debug("REST request to get Coopter : {}", id);
        Optional<Coopter> coopter = coopterService.findOne(id);
        return ResponseUtil.wrapOrNotFound(coopter);
    }

    /**
     * DELETE  /coopters/:id : delete the "id" coopter.
     *
     * @param id the id of the coopter to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/coopters/{id}")
    @Timed
    public ResponseEntity<Void> deleteCoopter(@PathVariable Long id) {
        log.debug("REST request to delete Coopter : {}", id);
        coopterService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/coopters?query=:query : search for the coopter corresponding
     * to the query.
     *
     * @param query the query of the coopter search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/coopters")
    @Timed
    public ResponseEntity<List<Coopter>> searchCoopters(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Coopters for query {}", query);
        Page<Coopter> page = coopterService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/coopters");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
