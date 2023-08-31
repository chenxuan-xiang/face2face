package com.face.demo.Controller;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import com.example.app.service.CustomVision;
import jakarta.websocket.server.PathParam;
import org.json.JSONException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.nio.file.Files;
import java.util.Base64;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "${FRONTEND_HOST:*}")
public class TestController {
    private static final String CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=faceimageschenxuanxiang;AccountKey=OoSmrCB2kmY1vf3EZRTGmejkpq1dEGn6yb7tO9aoI/9YiJNJBHG9Dgp9Z1GMinQJvs/FH61wLwhy+ASti3fcQA==;EndpointSuffix=core.windows.net";

    @GetMapping("/users/{name}")
    public String helloworld(@PathVariable String name){
        return "hello world" + name;
    }

    @PostMapping("/images")
    public String uploadImage(@RequestBody String image) throws IOException, JSONException {
        String base64 = image.replace("data:image/png;base64,", "");
        byte[] decodedString = Base64.getDecoder().decode(base64);
        String imageName = UUID.randomUUID().toString() + ".png";
//        saveImageToFile(decodedString, imageName);
//        saveToCloud(decodedString, imageName);
        CustomVision.uploadShineImage(decodedString);
        return "success";
    }
    @PostMapping("/validate")
    public ResponseEntity<String> validate(@RequestBody String image){
        String base64 = image.replace("data:image/png;base64,", "");
        byte[] decodedString = Base64.getDecoder().decode(base64);
        return CustomVision.validate(decodedString);
    }
    private void saveImageToFile(byte[] image, String imageName) throws IOException {
        File path = new File("./images/");
        if (!path.exists()) {
            path.mkdir();
        }
        Files.write(new File("./images/" + imageName).toPath(), image);
    }

    private void saveToCloud(byte[] image, String imageName){
        BlobServiceClient client = new BlobServiceClientBuilder().connectionString(CONNECTION_STRING).buildClient();
        // Create a unique name for the container
        String containerName = "images";

        // Create the container and return a container client object
        BlobContainerClient blobContainerClient = client.createBlobContainerIfNotExists(containerName);

        // Get a reference to a blob
        BlobClient blobClient = blobContainerClient.getBlobClient(imageName);

        // Upload the blob
        // blobClient.uploadFromFile(localPath + fileName);
        InputStream targetStream = new ByteArrayInputStream(image);
        blobClient.upload(targetStream);
    }
}


