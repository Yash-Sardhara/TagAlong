package com.tagalong.tagalong;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
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

public class SignupActivity extends AppCompatActivity {
    private String TAG = "Signup Activity";
    private EditText un;
    private EditText pswd;
    private EditText email;
    private Button nxt;
    private Context context;
    private boolean allSet;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_signup);
        context = getApplicationContext();
        un = (EditText) findViewById(R.id.username);
        pswd = (EditText) findViewById(R.id.password);
        nxt = (Button) findViewById(R.id.nextbutton);
        email = (EditText) findViewById(R.id.Email);
    }

    @Override
    protected void onStart() {
        super.onStart();

        final Login newUserLogin = new Login();
        nxt.setOnClickListener(new View.OnClickListener() {
                   @Override
                   public void onClick(View v) {
                       allSet = true;

                       if (!un.getText().toString().isEmpty()) {
                           newUserLogin.setUsername(un.getText().toString());
                       } else {
                           Toast.makeText(context, "Please Enter Username", Toast.LENGTH_LONG).show();
                           allSet = false;
                       }

                       if (!pswd.getText().toString().isEmpty()) {
                           newUserLogin.setPassword(pswd.getText().toString());
                       } else {
                           Toast.makeText(context, "Please Enter Password", Toast.LENGTH_LONG).show();
                           allSet = false;
                       }

                       if (allSet) {

                       }

                   }
               }
            );
    }

    private void sendLogin(Login loginProfile){
        RequestQueue queue = Volley.newRequestQueue(this);
        String url = "http://206.87.96.130:3000/users/login";
        final Gson gson = new Gson();
        final String loginProfileJson = gson.toJson(loginProfile);
        JSONObject profileJsonObject;

        try {
            profileJsonObject = new JSONObject((loginProfileJson));
            JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, url, profileJsonObject, new Response.Listener<JSONObject>() {
                @Override
                public void onResponse(JSONObject response) {
                    Log.d(TAG, "Login Verification Successful");
                    Profile receivedProfile = new Profile();
                    Toast.makeText(context, "Successfully Logged in", Toast.LENGTH_LONG).show();

                    Intent intent = new Intent(context, Login.class);
                    intent.putExtra("profile", receivedProfile);
                    startActivity(intent);
                }

            }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Log.d(TAG, "Registration Un-Successful");
                    Toast.makeText(context, "Please Try Again", Toast.LENGTH_LONG).show();
                }
            });

            queue.add(jsonObjectRequest);

        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
}