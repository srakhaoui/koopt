package com.harington.cooptit.web.rest;

import io.github.jhipster.web.util.ResponseUtil;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.codahale.metrics.annotation.Timed;
import com.harington.cooptit.domain.Cooptation;
import com.harington.cooptit.service.CooptationService;
import com.harington.cooptit.web.rest.errors.BadRequestAlertException;
import com.harington.cooptit.web.rest.util.HeaderUtil;
import com.harington.cooptit.web.rest.util.PaginationUtil;

/**
 * REST controller for managing Cooptation.
 */
@RestController
@RequestMapping("/api")
public class CooptationResource {

    private final Logger log = LoggerFactory.getLogger(CooptationResource.class);

    private static final String ENTITY_NAME = "cooptation";

    private CooptationService cooptationService;

    public CooptationResource(CooptationService cooptationService) {
        this.cooptationService = cooptationService;
    }

    /**
     * POST  /cooptations : Create a new cooptation.
     *
     * @param cooptation the cooptation to create
     * @return the ResponseEntity with status 201 (Created) and with body the new cooptation, or with status 400 (Bad Request) if the cooptation has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/cooptations")
    @Timed
    public ResponseEntity<Cooptation> createCooptation(@RequestBody Cooptation cooptation) throws URISyntaxException {
        log.debug("REST request to save Cooptation : {}", cooptation);
        if (cooptation.getId() != null) {
            throw new BadRequestAlertException("A new cooptation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Cooptation result = cooptationService.save(cooptation);
        return ResponseEntity.created(new URI("/api/cooptations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /cooptations : Updates an existing cooptation.
     *
     * @param cooptation the cooptation to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated cooptation,
     * or with status 400 (Bad Request) if the cooptation is not valid,
     * or with status 500 (Internal Server Error) if the cooptation couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/cooptations")
    @Timed
    public ResponseEntity<Cooptation> updateCooptation(@RequestBody Cooptation cooptation) throws URISyntaxException {
        log.debug("REST request to update Cooptation : {}", cooptation);
        if (cooptation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Cooptation result = cooptationService.save(cooptation);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, cooptation.getId().toString()))
            .body(result);
    }

    /**
     * GET  /cooptations : get all the cooptations.
     *
     * @param pageable the pagination information
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many)
     * @return the ResponseEntity with status 200 (OK) and the list of cooptations in body
     */
    @GetMapping("/cooptations")
    @Timed
    public ResponseEntity<List<Cooptation>> getAllCooptations(Pageable pageable, @RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get a page of Cooptations");
        Page<Cooptation> page;
        if (eagerload) {
            page = cooptationService.findAllWithEagerRelationships(pageable);
        } else {
            page = cooptationService.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, String.format("/api/cooptations?eagerload=%b", eagerload));
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /cooptations/:id : get the "id" cooptation.
     *
     * @param id the id of the cooptation to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the cooptation, or with status 404 (Not Found)
     */
    @GetMapping("/cooptations/{id}")
    @Timed
    public ResponseEntity<Cooptation> getCooptation(@PathVariable Long id) {
        log.debug("REST request to get Cooptation : {}", id);
        Optional<Cooptation> cooptation = cooptationService.findOne(id);
        return ResponseUtil.wrapOrNotFound(cooptation);
    }

    /**
     * DELETE  /cooptations/:id : delete the "id" cooptation.
     *
     * @param id the id of the cooptation to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/cooptations/{id}")
    @Timed
    public ResponseEntity<Void> deleteCooptation(@PathVariable Long id) {
        log.debug("REST request to delete Cooptation : {}", id);
        cooptationService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/cooptations?query=:query : search for the cooptation corresponding
     * to the query.
     *
     * @param query the query of the cooptation search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/cooptations")
    @Timed
    public ResponseEntity<List<Cooptation>> searchCooptations(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Cooptations for query {}", query);
        Page<Cooptation> page = cooptationService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/cooptations");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
