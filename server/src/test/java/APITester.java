import edu.hadith.vis.main.HadithController;
import edu.hadith.vis.main.MainServerApplication;
import edu.hadith.vis.main.database.ArabicHadith;
import edu.hadith.vis.main.tokenizer.TokenizedHadith;
import org.jboss.jandex.Main;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Created by mh4047 on 12/5/16.
 */
@RunWith(SpringRunner.class)
@WebMvcTest(MainServerApplication.class)
@SpringBootTest(classes=HadithController.class)
public class APITester {

    //@Test
    /*public void hadithAPI(){
        try{
            List<ArabicHadith> hadiths =  new HadithController().getHadiths();
            for(ArabicHadith h: hadiths){
                System.out.println(h.toString());
            }
        }catch(NullPointerException ex){
            ex.printStackTrace();
        }
    }*/

    @Autowired
    private MockMvc mvc;

    //@MockBean
    //private HadithController ctrl;

    @Test
    public void tokenizedHadith() throws Exception{
        /*SpringApplication.run(MainServerApplication.class, new String[0]);


        List<TokenizedHadith> tk = new HadithController().getTokenizedHadith();
        for(TokenizedHadith t: tk){
            System.out.println(t.toString());
        }
        */

        this.mvc.perform(get("/tokenizedHadith").accept(MediaType.TEXT_PLAIN))
                .andExpect(status().isOk()).andExpect(content().string("Honda Civic"));


    }
}
