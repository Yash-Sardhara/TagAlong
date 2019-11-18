const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const TripSchema = mongoose.Schema({
	arrivalTime: {
		type: Date,
		required: true
	},
	tripRoute: {
		type: mongoose.Schema.Types.Mixed,
		required: true
	},
	taggedUsers: [{
		type: String,
		required: true
	}],
	isDriverTrip: {
		type: Boolean,
		required: true
	},
	userID: {
		type: ObjectId,
		required: true
	},
	isFulfilled: {
		type: Boolean,
		required: true
	},
	username: {
		type: String,
		required: true
	}
	

});


module.exports = mongoose.model("TripStore", TripSchema);



