package com.tagalong.tagalong;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Switch;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.google.gson.Gson;

import org.json.JSONException;
import org.json.JSONObject;

public class UpdateProfileActivity extends AppCompatActivity {

    private EditText age,gen,interest,fn,ln,carcap;
    private Button submit;
    private Switch isDriver;
    private Context context;
    private boolean allSet;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_update_profile);
        context = getApplicationContext();

        fn = (EditText) findViewById(R.id.firstName);
        ln = (EditText) findViewById(R.id.lastName);
        age = (EditText) findViewById(R.id.age);
        gen = (EditText) findViewById(R.id.gender);
        interest = (EditText) findViewById(R.id.intrests);
        carcap = (EditText) findViewById(R.id.carCapacity);
        isDriver = (Switch) findViewById(R.id.isDriver);
        submit = (Button) findViewById(R.id.submit);

    }

    @Override
    protected void onStart() {
        super.onStart();

        final Profile newUserProfile = new Profile();
        submit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                allSet = true;

                if (!fn.getText().toString().isEmpty()) {
                    newUserProfile.setFirstName(fn.getText().toString());
                } else {
                    Toast.makeText(context, "Please Enter First Name", Toast.LENGTH_LONG).show();
                    allSet = false;
                }

                if (!ln.getText().toString().isEmpty()){
                    newUserProfile.setLastName(ln.getText().toString());
                } else {
                    Toast.makeText(context, "Please Enter Last Name", Toast.LENGTH_LONG).show();
                    allSet = false;
                }

                if (!age.getText().toString().isEmpty()){
                    newUserProfile.setAge(Integer.parseInt(age.getText().toString()));
                } else {
                    newUserProfile.setAge(0);
                    Toast.makeText(context, "Please Enter Age", Toast.LENGTH_LONG).show();
                    allSet = false;
                }

                if (!gen.getText().toString().isEmpty()){
                    newUserProfile.setGender(gen.getText().toString());
                } else {
                    Toast.makeText(context, "Please Enter Gender", Toast.LENGTH_LONG).show();
                    allSet = false;
                }

                newUserProfile.setDriver(false);
                newUserProfile.setCarCapacity(0);
                if(isDriver.isChecked()){
                    newUserProfile.setDriver(true);
                    if (!carcap.getText().toString().isEmpty()){
                        newUserProfile.setCarCapacity(Integer.parseInt(carcap.getText().toString()));
                    } else {
                        Toast.makeText(context, "Please Enter Car Capacity", Toast.LENGTH_LONG).show();
                        allSet = false;
                    }
                }


                if (!interest.getText().toString().isEmpty()){
                    newUserProfile.setInterest(interest.getText().toString());
                } else {
                    Toast.makeText(context, "Please Enter Interests", Toast.LENGTH_LONG).show();
                    allSet = false;
                }

                if (allSet) {
                    sendProfile(newUserProfile);
                }

            }
        });
    }

    void sendProfile(Profile profile) {

        RequestQueue queue = Volley.newRequestQueue(context);
        String url = "http://206.87.96.130:3000/users/register";
        Gson gson = new Gson();
        String profileJson = gson.toJson(profile);
        JSONObject profileJsonObject;

        System.out.println(profileJson.toString());

        try {
            profileJsonObject = new JSONObject((profileJson));

            JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, url, profileJsonObject, new Response.Listener<JSONObject>() {
                @Override
                public void onResponse(JSONObject response) {
                    Toast.makeText(context, "Successfully signed up", Toast.LENGTH_LONG).show();
                    final Profile received_profile = new Profile();
                    try {
                        received_profile.setUserName(response.getString("username"));
                        received_profile.setInterest(response.getString("interests"));
                        received_profile.setFirstName(response.getString("firstName"));
                        received_profile.setLastName(response.getString("lastName"));
                        received_profile.setAge(response.getInt("age"));
                        received_profile.setGender(response.getString("gender"));
                        received_profile.setEmail(response.getString("email"));
                        received_profile.setPassword(response.getString("password"));
                        received_profile.setDriver(response.getBoolean("isDriver"));
                        received_profile.set_id(response.getString("_id"));
                        received_profile.setJoinedDate(response.getString("joinedDate"));
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                    Intent intent = new Intent(UpdateProfileActivity.this, HomeActivity.class);
                    intent.putExtra("profile", received_profile);
                    startActivity(intent);
                    UpdateProfileActivity.this.finish();

                }

            }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    System.out.println(error.toString());
                    Toast.makeText(context, "Please try again", Toast.LENGTH_LONG).show();
                }
            });

            queue.add(jsonObjectRequest);

        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
}