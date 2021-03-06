package com.tagalong.tagalong.activity;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.text.Html;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import com.tagalong.tagalong.models.Profile;
import com.tagalong.tagalong.R;

/**
 * View for the displaying profile
 */
public class ViewProfileActivity extends AppCompatActivity {

    private TextView name;
    private TextView username;
    private TextView age;
    private TextView email;
    private TextView interests;
    private TextView carCap;
    private TextView registeredAs;
    private TextView gender;
    private TextView joinedDate;
    private TextView profileHeader;
    private Button edit;
    private Context context;

    private Profile userProfile;
    private boolean isUserAlongProfile;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_view_profile);
        context = getApplicationContext();
        userProfile = (Profile) getIntent().getSerializableExtra("profile") ;
        isUserAlongProfile = (boolean) getIntent().getSerializableExtra("isUserAlongProfile");

        name = (TextView) findViewById(R.id.name);
        username = (TextView) findViewById(R.id.userName);
        email = (TextView) findViewById(R.id.email);
        age = (TextView) findViewById(R.id.age);
        interests = (TextView) findViewById(R.id.inter);
        carCap = (TextView) findViewById(R.id.carCapacity);
        registeredAs = (TextView) findViewById(R.id.registeredAs);
        gender = (TextView) findViewById(R.id.gender);
        joinedDate = (TextView) findViewById(R.id.joinedDate);
        profileHeader = (TextView) findViewById(R.id.profileHeader);
        edit = (Button) findViewById(R.id.edit);
    }

    @Override
    protected void onStart() {
        super.onStart();
        if(!isUserAlongProfile){
            profileHeader.setText("YOUR PROFILE");
        }
        else {
            profileHeader.setText("USER ALONG PROFILE");
        }
        if (userProfile != null){
            // Display user details
            name.setText(Html.fromHtml("<b>Name: </b>" + userProfile.getFirstName()+ " " + userProfile.getLastName()));
            username.setText(Html.fromHtml("<b>Username: </b>" + userProfile.getUsername()));
            email.setText(Html.fromHtml("<b>Email address: </b>" + userProfile.getEmail()));
            age.setText(Html.fromHtml("<b>Age: </b>" + userProfile.getAge()));
            gender.setText(Html.fromHtml("<b>Gender: </b>" + userProfile.getGender()));
            if(userProfile.getDriver()){
                registeredAs.setText(Html.fromHtml("<b>Registered as:</b> Driver"));
                carCap.setText(Html.fromHtml("<b>Car Capacity: </b>" + userProfile.getCarCapacity()));
            } else {
                registeredAs.setText(Html.fromHtml("<b>Registered as: </b>Rider"));
                carCap.setText(Html.fromHtml("<b>Car Capacity: </b>" + "Not Applicable"));
            }
            interests.setText(Html.fromHtml("<b>Preference:</b><br>" +
                    "&emsp&emsp&emsp&emsp&emsp<b>1) Music: </b>" + (userProfile.getInterests()[0]+1) +"/5<br>" +
                    "&emsp&emsp&emsp&emsp&emsp<b>2) Chatting: </b>" + (userProfile.getInterests()[1]+1) +"/5<br>" +
                    "&emsp&emsp&emsp&emsp&emsp<b>3) Speed: </b>" + (userProfile.getInterests()[2]+1) +"/5<br>" +
                    "&emsp&emsp&emsp&emsp&emsp<b>4) Fragrance: </b>" + (userProfile.getInterests()[3]+1) +"/5<br>" +
                    "&emsp&emsp&emsp&emsp&emsp<b>5) Smoking: </b>" + (userProfile.getInterests()[4]+1) +"/5"));
            joinedDate.setText(Html.fromHtml("<b>Joined Date: </b>" + userProfile.getJoinedDate()));
        }
        //edit button disabled when showing UserAlong profile
        if (!isUserAlongProfile) {
            edit.setEnabled(true);
            edit.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent intent = new Intent(context, UpdateProfileActivity.class);
                    intent.putExtra("profile", userProfile);
                    intent.putExtra("New Sign Up", false);
                    startActivity(intent);
                }
            });
        }
        else {
            edit.setEnabled(false);
        }
    }
}
