package com.face.demo.dao;

import com.face.demo.entity.Image;
import com.face.demo.entity.Person;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class DataSqlDb implements DataRepository{
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public int savePerson(Person person) {
        System.out.println(person);
        return jdbcTemplate.update(
                "insert into Person (userid, fullName, email) values(?,?,?)",
                person.getUserID(), person.getFullName(), person.getEmail());
    }

    @Override
    public int saveImage(Image image) {
        return jdbcTemplate.update(
                "insert into Image (imageid, userid, image) values(?,?,?)",
                image.getImageID(), image.getUserID(), image.getImage());
    }

    @Override
    public Person getPerson(String userId) {
        String sql = "SELECT * FROM Person WHERE userid = ?";
        try {
            Person target = jdbcTemplate.queryForObject(sql, (rs, rowNum) ->
                    new Person(
                            rs.getString("userid"),
                            rs.getString("fullName"),
                            rs.getString("email")
                    ), new Object[] { userId });
            return target;
        } catch (Exception e){
            System.out.println(e);
            return null;
        }

    }
    @Override
    public List<Person> getPersonByName(String name) {
        String sql = "SELECT * FROM Person WHERE fullName = ?";
        System.out.println("test");
        List<Person> target = jdbcTemplate.query(sql, (rs, rowNum) ->
                new Person(
                        rs.getString("userid"),
                        rs.getString("fullName"),
                        rs.getString("email")
                ), new Object[] { name });
        System.out.println(target);
        System.out.println("test end");
        return target;
    }
    @Override
    public Image getImage(String userId) {
        String sql = "SELECT * FROM Image WHERE userid = ?";
        Image target = jdbcTemplate.queryForObject(sql, (rs, rowNum) ->
                new Image(
                        rs.getString("imageid"),
                        rs.getString("userid"),
                        rs.getBytes("image")
                ),new Object[]{userId});
        return target;

    }

}
