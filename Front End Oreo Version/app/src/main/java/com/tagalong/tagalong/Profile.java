package com.tagalong.tagalong;

import java.io.Serializable;

public class Profile implements Serializable {

    public static final int minAgeDriver = 19;
    public static final int minAgeRider = 15;
    public static final int maxAge = 100;

    private String userID;
    private String username;
    private String password;
    private String email;
    private String firstName;
    private String lastName;
    private String gender;
    private String joinedDate;
    private String fbToken;
    private Boolean isDriver;
    private int age;
    private int carCapacity;
    private int[] interests;


    public Profile() {
        this.userID = "Not Set";
        this.firstName = "Not Set";
        this.lastName = "Not Set";
        this.username = "Not Set";
        this.password = "Not Set";
        this.email = "Not Set";
        this.joinedDate = "Not Set";
        this.gender = "Not Set";
        this.isDriver = false;
        this.age = 0;
        this.carCapacity = 0;
        this.interests = new int[5];
    }


    // Getters
    public String getUserID() {
        return userID;
    }

    public String getJoinedDate() {
        return joinedDate;
    }

    public String getFirstName() {
        return firstName;
    }

    public int[] getInterests() {
        return interests;
    }

    public int getCarCapacity() {
        return carCapacity;
    }

    public String getLastName() {
        return lastName;
    }

    public String getUserName() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public String getEmail() {
        return email;
    }

    public Boolean getDriver() {
        return isDriver;
    }

    public String getGender() {
        return gender;
    }

    public int getAge() {
        return age;
    }

    public String getFbToken() {
        return fbToken;
    }

    //Setters
    public void setInterests(int[] interests) {
        this.interests = interests;
    }

    public void setCarCapacity(int carCapacity) {
        this.carCapacity = carCapacity;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setUserName(String userName) {
        this.username = userName;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setDriver(Boolean driver) {
        isDriver = driver;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public void setUserID(String userID) {
        this.userID = userID;
    }

    public void setJoinedDate(String joinedDate) {
        this.joinedDate = joinedDate;
    }

    public void setFbToken(String fbToken) {
        this.fbToken = fbToken;
    }

}
