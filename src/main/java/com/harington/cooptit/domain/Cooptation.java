package com.harington.cooptit.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Cooptation.
 */
@Entity
@Table(name = "cooptation")
@Document(indexName = "cooptation")
public class Cooptation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "jhi_profile")
    private String profile;

    @Column(name = "performed_on")
    private Instant performedOn;

    @OneToOne    
    @JoinColumn(unique = true)
    private Coopted coopted;

    @ManyToOne
    @JsonIgnoreProperties("")
    private Coopter coopter;

    @ManyToMany
    @JoinTable(name = "cooptation_skills",
               joinColumns = @JoinColumn(name = "cooptations_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "skills_id", referencedColumnName = "id"))
    private Set<Skill> skills = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProfile() {
        return profile;
    }

    public Cooptation profile(String profile) {
        this.profile = profile;
        return this;
    }

    public void setProfile(String profile) {
        this.profile = profile;
    }

    public Instant getPerformedOn() {
        return performedOn;
    }

    public Cooptation performedOn(Instant performedOn) {
        this.performedOn = performedOn;
        return this;
    }

    public void setPerformedOn(Instant performedOn) {
        this.performedOn = performedOn;
    }

    public Coopted getCoopted() {
        return coopted;
    }

    public Cooptation coopted(Coopted coopted) {
        this.coopted = coopted;
        return this;
    }

    public void setCoopted(Coopted coopted) {
        this.coopted = coopted;
    }

    public Coopter getCoopter() {
        return coopter;
    }

    public Cooptation coopter(Coopter coopter) {
        this.coopter = coopter;
        return this;
    }

    public void setCoopter(Coopter coopter) {
        this.coopter = coopter;
    }

    public Set<Skill> getSkills() {
        return skills;
    }

    public Cooptation skills(Set<Skill> skills) {
        this.skills = skills;
        return this;
    }

    public Cooptation addSkills(Skill skill) {
        this.skills.add(skill);
        return this;
    }

    public Cooptation removeSkills(Skill skill) {
        this.skills.remove(skill);
        return this;
    }

    public void setSkills(Set<Skill> skills) {
        this.skills = skills;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Cooptation cooptation = (Cooptation) o;
        if (cooptation.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), cooptation.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Cooptation{" +
            "id=" + getId() +
            ", profile='" + getProfile() + "'" +
            ", performedOn='" + getPerformedOn() + "'" +
            "}";
    }
}
