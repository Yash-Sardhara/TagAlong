package com.tagalong.tagalong.models;

/**
 * Data structure conversation - a single monologue / one way conversation.
 */
public class Conversation {
    private String userID;
    private String message;
    private String roomID;
    private String userName;

    public Conversation(String message) {
        this.message = message;
    }

    public String getUserID() {
        return userID;
    }

    public void setUserID(String userID) {
        this.userID = userID;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getRoomID() {
        return roomID;
    }

    public void setRoomID(String roomID) {
        this.roomID = roomID;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }
}
