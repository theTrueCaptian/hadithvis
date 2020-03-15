package edu.hadith.vis.main.database;

import org.springframework.data.repository.CrudRepository;

/**
 * Created by mh4047 on 12/4/16.
 */
public interface ArabicHadithCorpus extends CrudRepository<ArabicHadith, Long>{
    Iterable<ArabicHadith>  findAll();
}
