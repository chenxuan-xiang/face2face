package com.face.demo.dao;

import com.face.demo.entity.Image;
import com.face.demo.entity.Person;

import java.util.List;

public interface DataRepository {
    int savePerson(Person person);

    int saveImage(Image image);

    Person getPerson(String userId);
    List<Person> getPersonByName(String name);
    Image getImage(String userId);
}
