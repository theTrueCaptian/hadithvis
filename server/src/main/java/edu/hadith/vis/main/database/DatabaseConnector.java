package edu.hadith.vis.main.database;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Created by mh4047 on 12/4/16.
 */

public class DatabaseConnector {
    private Connection conn = null;

    private static String HOST = "localhost";
    private static String USER = "root";
    private static String PASSWORD = "*****";
    private static String DATABASE = "hadith";

    public DatabaseConnector(){

    }

    public void connect(){
        try{
            conn = DriverManager.getConnection("jdbc:mysql://"+HOST+"/"+DATABASE+"?user="+USER+"&password="+PASSWORD);
        }catch(SQLException ex){
            System.out.println("SQLException:"+ex.getMessage());
            System.out.println("SQLState: "+ex.getSQLState());
            System.out.println("Vendor Error: "+ex.getErrorCode());
        }
    }
}
