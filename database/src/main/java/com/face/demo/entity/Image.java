package com.face.demo.entity;

public class Image {
    private String imageID;
    private String userID;
    private byte[] image;


    public Image(String imageID, String userID, byte[] image) {
        this.imageID = imageID;
        this.userID = userID;
        this.image = image;
    }

    public String getUserID() {
        return userID;
    }

    public byte[] getImage() {
        return image;
    }

    public void setUserID(String userID) {
        this.userID = userID;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getImageID() {
        return imageID;
    }

    public void setImageID(String imageID) {
        this.imageID = imageID;
    }
}
