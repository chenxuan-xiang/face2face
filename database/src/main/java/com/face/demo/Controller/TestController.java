package com.face.demo.Controller;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import com.example.app.service.CustomVision;
import com.face.demo.dao.DataRepository;
import com.face.demo.dao.DataSqlDb;
import com.face.demo.entity.Image;
import com.face.demo.entity.Person;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import jakarta.websocket.server.PathParam;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.TransactionCallback;
import org.springframework.transaction.support.TransactionCallbackWithoutResult;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import redis.clients.jedis.DefaultJedisClientConfig;
import redis.clients.jedis.Jedis;

import java.io.*;
import java.nio.file.Files;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "${FRONTEND_HOST:*}")
public class TestController {
    private static final String CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=faceimageschenxuanxiang;AccountKey=OoSmrCB2kmY1vf3EZRTGmejkpq1dEGn6yb7tO9aoI/9YiJNJBHG9Dgp9Z1GMinQJvs/FH61wLwhy+ASti3fcQA==;EndpointSuffix=core.windows.net";
    @Autowired
    private DataSqlDb DataSqldb;
    @Autowired
    TransactionTemplate transactionTemplate;

    @Autowired
    private StringRedisTemplate stringRedisTemplate;


//    @GetMapping("/users/{name}")
//    public String helloworld(@PathVariable String name){
//        return "hello world" + name;
//    }

    @PostMapping("/users")
    public ResponseEntity<String> saveUser(@RequestBody String data) throws Exception{
        JSONObject jsonObject= new JSONObject(data);
//        System.out.println(jsonObject);
        String name = jsonObject.getString("name");
        String email = jsonObject.getString("email");
//        System.out.println(email);
        String base64 = jsonObject.getString("image").replace("data:image/png;base64,", "");
        byte[] rawBytes = Base64.getDecoder().decode(base64);
        String userId = UUID.randomUUID().toString();
        Person person = new Person(userId, name, email);

        Image image = new Image(UUID.randomUUID().toString(), userId, rawBytes);
        Boolean result = transactionTemplate.execute(new TransactionCallback<Boolean>() {
            public Boolean doInTransaction(TransactionStatus status) {
                try {
                    DataSqldb.savePerson(person);
                    DataSqldb.saveImage(image);
                    return Boolean.TRUE;
                } catch (Exception ex) {
                    status.setRollbackOnly();
                    return Boolean.FALSE;
                }
            }
        });

        if(result){
            saveCache(person);
            return new ResponseEntity<String>("success", HttpStatus.OK);
        } else {
            return new ResponseEntity<String>("fail", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping("/users/name/{name}")
    public ResponseEntity getUserByName(@PathVariable String name){
        try {
            List<Person> persons = DataSqldb.getPersonByName(name);
            System.out.println(persons);
            return new ResponseEntity<List<Person>>(persons, HttpStatus.OK);
        } catch (Exception e){
            System.out.println(e);
            return new ResponseEntity<String>("faill", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity getUser(@PathVariable String userId){
        try {
            Person person = readCache(userId);
//            Person person = DataSqldb.getPerson(userId);
            System.out.println(userId);
            return new ResponseEntity<Person>(person, HttpStatus.OK);
        } catch (Exception e){
            System.out.println(e);
            return new ResponseEntity<String>("fail", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private void saveCache(Person person) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(person);
        ValueOperations<String, String> ops = stringRedisTemplate.opsForValue();
        String key = person.getUserID();
        ops.set(key, json);
    }

    private Person readCache(String id) throws Exception{
        ValueOperations<String, String> ops = stringRedisTemplate.opsForValue();
        Person person = null;
        if(!stringRedisTemplate.hasKey(id)){
            person = DataSqldb.getPerson(id);
            System.out.println("cache miss!");
            saveCache(person);
        } else {
            ObjectMapper mapper = new ObjectMapper();
            String json = ops.get(id);
            person = mapper.readValue(json, Person.class);
            System.out.println("cache hit!");
        }
        return person;
    }

    private void test(){
        System.out.println("test redis");
        ValueOperations<String, String> ops = stringRedisTemplate.opsForValue();
        String key = "testkey";
        if(!stringRedisTemplate.hasKey(key)){
            ops.set(key, "Hello World");
        }
        System.out.println(ops.get(key));
    }
}


