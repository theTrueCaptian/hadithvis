package edu.hadith.vis.main.database;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * Created by mh4047 on 12/4/16.
 */
@Entity
@Table(name="ArabicHadithTable")
public class ArabicHadith {
    @Id
    @Column
    private String arabicURN;

    @Column
    private String collection;

    @Column
    private String hadithText;

    public ArabicHadith(){
        //Required
    }

    public String getHadithText() {
        return hadithText;
    }

    public void setHadithText(String hadithText) {
        this.hadithText = hadithText;
    }

    public String getCollection() {
        return collection;
    }

    public void setCollection(String collection) {
        this.collection = collection;
    }


    public String getArabicURN() {
        return arabicURN;
    }

    public void setArabicURN(String arabicURN) {
        this.arabicURN = arabicURN;
    }

    public String toString(){
        return arabicURN +" - "+collection+": "+hadithText;
    }
}
