package edu.hadith.vis.main;

import edu.hadith.vis.main.database.ArabicHadith;
import edu.hadith.vis.main.database.ArabicHadithCorpus;
import edu.hadith.vis.main.tokenizer.Commons;
import edu.hadith.vis.main.tokenizer.TokenizedHadith;
import edu.hadith.vis.main.tokenizer.Tokenizer;
import edu.hadith.vis.main.tokenizer.TokenizerController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * Created by mh4047 on 12/4/16.
 */
@RestController
@RequestMapping("/")
public class HadithController {

    @Autowired
    private ArabicHadithCorpus allHadiths;

    private TokenizerController tokenizerController = new TokenizerController();

    @RequestMapping("/hadithTexts")
    public List<ArabicHadith> getHadiths() {
        int i=0;
        List<ArabicHadith> hadiths = new ArrayList<ArabicHadith>();
        for(ArabicHadith hadith: allHadiths.findAll()){
            hadiths.add(hadith);
            i++;
            if(i>100){
                break;
            }
        }
        return hadiths;
    }

    @RequestMapping("/tokenizedHadith")
    public List<TokenizedHadith> getTokenizedHadith(){
        return new Tokenizer().tokenizeHadiths(getHadiths(), tokenizerController.getChainDelimiters(), tokenizerController.getHadithDelimiters());
    }


}
