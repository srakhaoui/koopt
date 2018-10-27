package com.harington.cooptit.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import com.harington.cooptit.domain.Skill;
import com.harington.cooptit.domain.es.SkillEs;

@Mapper
public interface SkillMapper {

	SkillMapper INSTANCE = Mappers.getMapper( SkillMapper.class );
	
	@Mapping(target="suggest", ignore=true)
	SkillEs skillToSkillEs(Skill car);

	Skill skillEsToSkill(SkillEs skillEs);
}