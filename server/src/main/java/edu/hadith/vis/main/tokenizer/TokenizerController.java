package edu.hadith.vis.main.tokenizer;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Created by mh4047 on 12/5/16.
 */
@RestController
@RequestMapping("/")
public class TokenizerController {


    @RequestMapping(value="/saveTokens", method= RequestMethod.POST)
    public void saveTokens(@RequestBody Delimiters delimiters){
        System.out.println("Save delimiters: "+delimiters.toString());
        Commons.saveChainDelimiters(delimiters.getChainDelimiters());
        Commons.saveHadithDelimiters(delimiters.getHadithDelimiters());
    }

    @RequestMapping(value="/tokens", method=RequestMethod.GET)
    public Delimiters getDelimiters(){
        Delimiters delimiters = new Delimiters(Commons.getChainDelimiters(), Commons.getHadithDelimiters());
        System.out.println("Sending delimiters:"+delimiters);
        return delimiters;
    }

    public List<String> getChainDelimiters(){
        return Commons.getChainDelimiters();
    }
    public List<String> getHadithDelimiters() {
        return Commons.getHadithDelimiters();
    }

}
