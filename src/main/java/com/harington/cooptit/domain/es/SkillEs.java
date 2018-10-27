package com.harington.cooptit.domain.es;

import java.util.Arrays;
import java.util.Objects;

import org.springframework.data.elasticsearch.annotations.CompletionField;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.core.completion.Completion;

import com.harington.cooptit.domain.Skill;

/**
 * A Skill.
 */
@Document(indexName = "skill", type="skill")
public class SkillEs {
	
	public static final String INDEX_NAME = Skill.class.getSimpleName().toLowerCase();
	public static final String DOCUMENT_NAME = INDEX_NAME;
	public static final String COMPLETION_FIELD = "completion";
	
    private Long id;

    private String code;

    private String label;

    @CompletionField(maxInputLength = 100)
    private Completion completion;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
		this.completion = new Completion(new String[]{label});
	}

	public Completion getCompletion() {
		return completion;
	}

	public void setCompletion(Completion completion) {
		this.completion = completion;
	}
	
	@Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Skill{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", label='" + getLabel() + "'" +
            ", suggest='" + getSuggestAsString() + "'" +
            "}";
    }

	private String getSuggestAsString() {
		final StringBuilder suggestStringBuilder = new StringBuilder();
		Arrays.stream(getCompletion().getInput()).forEach(aSuggest -> suggestStringBuilder.append(aSuggest));
		return suggestStringBuilder.toString();
	}
}
