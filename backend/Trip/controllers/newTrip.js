const TripStore = require("../models/Trip");
const User = require("../../User/models/user");
const mongoose = require("mongoose");
const debug = require("debug")("http /newTrip");
const tripRecommender = require("../../triprecommender/recommender");
const Chat = require("../../Chat/models/Chat");
const firebase = require("firebase-admin");

/**
 * sendNotif: send a notifcation to the given user that the user has successfully
 *			  created a trip.
 */

const sendNotif = async (user) => {
	const firebaseToken = user.fbToken;
	if (firebaseToken){
		const payload = {
			notification: {
				title: "New Trip Created",
				body: "You have created a new trip",
			}, 
			data: {
				type: "Trip"
			}
		};
	
		const options = {
			priority: "high",
			timeToLive: 60 * 60 * 24, // 1 day
		};

		firebase.messaging().sendToDevice(firebaseToken, payload, options);
	}
	else {
		debug("invalid firebaseToken");
	}
};

/**
 * createNewRoom: Creates a new chatroom with one user
 *				  which is given by the username and returns
 * 				  the chatroom id
 */

const createNewRoom = async (username) => {
	const users = [username];
	const chat = new Chat({
		users,
		messages: []
	});

	const updatedchat = await chat.save();
	return updatedchat._id;
};

/**
 * handleCreateTrip: Checks the userID and creates a new Trip object to store in the database.
 * 					 If the trip was created by a driver, a new chat room is created along with
 * 					 the trip.
 *
 */

const handleCreateTrip = async (req, res) => {
		
	debug("/newTrip hit");

	const { userID, username, arrivalTime, tripRoute, isDriverTrip } = req.body;

	debug(req.body);

	if (!mongoose.Types.ObjectId.isValid(userID)) {
		debug("Invalid userID");
		return res.status(400).send("Invalid userID");
	}

	const user = await User.findById(userID);

	if (!user) {
		debug("Unable to find user");
		return res.status(400).send("Unable to find user");
	}

	let trip = new TripStore({
		username,
		taggedUsers: [],
		userID,
		arrivalTime,
		tripRoute,
		isDriverTrip,
		isFulfilled: false
	});

	tripRecommender.tripHandler(tripRoute.nameValuePairs, async (resp, err) => {

		if (err) {
			return res.status(400).send("Invalid trip");
		}

		trip.tripRoute = resp;

		if (isDriverTrip) {
			debug("Trip is a DRIVER TRIP");
			trip.chatroomID = await createNewRoom(username);
			debug("created chatroom, id: ", trip.chatroomID);
			trip.isFulfilled = true;
		}

		trip.save();
		res.send(trip);
		sendNotif(user);

	});

	

};

module.exports = {
	handleCreateTrip
};
