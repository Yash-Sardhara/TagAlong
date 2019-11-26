package com.tagalong.tagalong;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

//import java.util.HashMap;

public class DataParser {

    /*
    private HashMap<String,String> getPlace(JSONObject googlePlaceJson){
        HashMap<String,String> googlePlaceMap = new HashMap<>();
        String placeName = "-NA-";
        String latitude = "";
        String logitude = "";
        String reference = "";
        try {
            if (!googlePlaceJson.isNull("name")) {
                placeName = googlePlaceJson.getString("name");
            }
            latitude = googlePlaceJson.getJSONObject("geometry").getJSONObject("location").getString("lat");
            logitude = googlePlaceJson.getJSONObject("geometry").getJSONObject("location").getString("lng");
            reference = googlePlaceJson.getString("reference");

            googlePlaceMap.put("place_name", placeName);
            googlePlaceMap.put("lat", latitude);
            googlePlaceMap.put("lng", logitude);
            googlePlaceMap.put("reference", reference );
        }
        catch (JSONException e) {
            e.printStackTrace();
        }

        return googlePlaceMap;
    }

     */


    public String[] parseDirections(String jsonData){
        JSONArray jsonArray = null;
        JSONObject jsonObject;

        try {
            jsonObject = new JSONObject(jsonData);
            for(int i = 0; i < jsonObject.getJSONArray("routes").getJSONObject(0).getJSONArray("legs").length(); i++) {
                if (i == 0) {
                    jsonArray = jsonObject.getJSONArray("routes").getJSONObject(0).getJSONArray("legs").getJSONObject(i).getJSONArray("steps");
                } else {
                    for (int j = 0; j < jsonObject.getJSONArray("routes").getJSONObject(0).getJSONArray("legs").getJSONObject(i).getJSONArray("steps").length(); j++) {
                        jsonArray.put(jsonObject.getJSONArray("routes").getJSONObject(0).getJSONArray("legs").getJSONObject(i).getJSONArray("steps").getJSONObject(j));
                    }
                }
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }


        if (jsonArray != null) {
            return getPaths(jsonArray);
        }
        return null;
    }

    public String[] getPaths(JSONArray googleStepsJson){
        int count = googleStepsJson.length();
        String [] polylines = new String[count];

        for (int i = 0; i < count; i++){
            try {
                polylines[i] = getPath(googleStepsJson.getJSONObject(i));
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }

        return polylines;
    }

    public String getPath(JSONObject googlePathJson){
        String polyline = "";
        try {
            polyline = googlePathJson.getJSONObject("polyline").getString("points");
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return polyline;
    }
}
