const supertest = require('supertest')
const app = require("../index.js");
const mongoose = require('mongoose');
const request = supertest(app);
const User = require("../User/models/user");
const Chat = require("../Chat/models/Chat");
const TripStore = require("../Trip/models/Trip");
const ridertrip1 = require("./sampletrips/ridertrip1");
const ridertrip2 = require("./sampletrips/ridertrip2");
const ridertrip3 = require("./sampletrips/ridertrip3");
const taggedridertrip1 = require("./sampletrips/ridertrip1_tagged");
const taggeddrivertrip1 = require("./sampletrips/drivertrip1_tagged");
const taggedrider = require("./sampletrips/rider_tagged_user");
const taggeddriver = require("./sampletrips/driver_tagged_user");

jest.mock("../triprecommender/recommender.js");

const databaseName = 'triproutestest';

beforeAll(async () => {
	const url = `mongodb://127.0.0.1/${databaseName}`;
  	await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

})

async function removeAllCollections () {
	const collections = Object.keys(mongoose.connection.collections);
	for (const collectionName of collections) {
    	const collection = mongoose.connection.collections[collectionName];
    	await collection.deleteMany();
  	}
}

afterEach(async () => {
	await removeAllCollections();
})


async function dropAllCollections() {
    const collections = Object.keys(mongoose.connection.collections)
    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName]
        try {
            await collection.drop();
        } catch (error) {
            // This error happens when you try to drop a collection that's already dropped. Happens infrequently. 
            // Safe to ignore. 
            if (error.message === 'ns not found') return

            // This error happens when you use it.todo.
            // Safe to ignore. 
            if (error.message.includes('a background operation is currently running')) return

            console.log(error.message);
        }
    }
}

// Disconnect Mongoose
afterAll(async () => {
    await dropAllCollections();
    await mongoose.connection.close();
})

describe('testing trips', () => {
    it('should create a new rider trip', async (done) => {
        const user1 = new User({
            username: "chatdemouser13",
            email: "chatdemouser13@demo.com",
            password: "demodemodemo",
            fbToken: "examplefbToken"
        });

        let newuser;

        await user1.save()
            .then((user) => {
                newuser = user;
            });

        const res = await request.post("/trips/newTrip")
            .send({ 
               "arrivalPlace":"not assigned",
               "arrivalTime":"Nov 29, 2019 08:00:00",
               "departurePlace":"not assigned",
               "departureTime":"Nov 18, 2019 23:46:11",
               "isDriverTrip":false,
               "roomID":"not assigned",
               "taggedUsers":[ 
                  "not assigned"
               ],
               "tripID":"not assigned",
               "tripRoute":{ 
                  "nameValuePairs":{ 
                     "origin":"49.2621563,-123.2501125",
                     "destination":"49.21278372465756,-123.15078578889369"
                  }
               },
               "userID": user1._id,
               "username": user1.username
            })
            .expect(200);


        expect(res.body).toBeTruthy();
        expect(res.body.isFulfilled).toBe(false);
        expect(res.body.tripRoute).toBeTruthy();
        expect(res.body.tripRoute.status).toBe("OK");
        expect(res.body.isDriverTrip).toBe(false);


        done();
    })

    it('should create a new driver trip', async (done) => {
        const user1 = new User({
            username: "chatdemouser14",
            email: "chatdemouser14@demo.com",
            password: "demodemodemo",
            fbToken: ""
        });

        let newuser;

        await user1.save()
            .then((user) => {
                newuser = user;
            });

        const res = await request.post("/trips/newTrip")
            .send({ 
               "arrivalPlace":"not assigned",
               "arrivalTime":"Nov 30, 2019 06:00:00",
               "departurePlace":"not assigned",
               "departureTime":"Nov 18, 2019 23:58:44",
               "isDriverTrip":true,
               "roomID":"not assigned",
               "taggedUsers":[ 
                  "not assigned"
               ],
               "tripID":"not assigned",
               "tripRoute":{ 
                  "nameValuePairs":{ 
                     "origin":"49.2621715,-123.250049",
                     "destination":"49.33266018909084,-123.08990802615881"
                  }
               },
               "userID": newuser._id,
               "username": newuser.username
            })
            .expect(200);

        expect(res.body).toBeTruthy();
        expect(res.body.isFulfilled).toBe(true);
        expect(res.body.tripRoute).toBeTruthy();
        expect(res.body.tripRoute.status).toBe("OK");
        expect(res.body.isDriverTrip).toBe(true);

        done();
    })

    it('should fail to create new drivertrip with invalid userID', async (done) => {

        const res = await request.post("/trips/newTrip")
            .send({ 
               "arrivalPlace":"not assigned",
               "arrivalTime":"Nov 30, 2019 06:00:00",
               "departurePlace":"not assigned",
               "departureTime":"Nov 18, 2019 23:58:44",
               "isDriverTrip":true,
               "roomID":"not assigned",
               "taggedUsers":[ 
                  "not assigned"
               ],
               "tripID":"not assigned",
               "tripRoute":{ 
                  "nameValuePairs":{ 
                     "origin":"49.2621715,-123.250049",
                     "destination":"49.33266018909084,-123.08990802615881"
                  }
               },
               "userID": "",
               "username": ""
            })
            .expect(400);

        expect(res.text).toBe("Invalid userID");

        done();
    })

    it('should fail to create new drivertrip with valid userID but unknown user', async (done) => {

        const res = await request.post("/trips/newTrip")
            .send({ 
               "arrivalPlace":"not assigned",
               "arrivalTime":"Nov 30, 2019 06:00:00",
               "departurePlace":"not assigned",
               "departureTime":"Nov 18, 2019 23:58:44",
               "isDriverTrip":true,
               "roomID":"not assigned",
               "taggedUsers":[ 
                  "not assigned"
               ],
               "tripID":"not assigned",
               "tripRoute":{ 
                  "nameValuePairs":{ 
                     "origin":"49.2621715,-123.250049",
                     "destination":"49.33266018909084,-123.08990802615881"
                  }
               },
               "userID": "5dd36a75b458db53e031818e",
               "username": ""
            })
            .expect(400);

        expect(res.text).toBe("Unable to find user");

        done();
    })


    it('gettrips for valid user', async (done) => {
        const user1 = new User({
            _id: "5dd36c81b458db53e031819b",
            username: "bwong5",
            email: "bwong5@demo.com",
            password: "demodemodemo",
            fbToken: "",
            isDriverTrip: false,
            interests: [5,5,5,5,5]

        });

        await user1.save();

        const riderTrip1 = new TripStore(ridertrip1);
        await riderTrip1.save();

        const res = await request.get("/trips/myTrips")
            .set({
                userID: user1._id
            })
            .expect(200);

        expect(res.body).toBeTruthy();
        expect(res.body.trips).toHaveLength(1);

        done();

    });

    it('gettrips for invalid userid', async (done) => {
        const res = await request.get("/trips/myTrips")
            .set({
                userID: "f"
            })
            .expect(400);

        expect(res.text).toBe("Invalid userID");

        done();
    });

    it('gettrips for user with no trips', async (done) => {

        const user1 = new User({
            _id: "5dd36c81b458db53e031819b",
            username: "bwong5",
            email: "bwong5@demo.com",
            password: "demodemodemo",
            fbToken: "",
            isDriverTrip: false,
            interests: [5,5,5,5,5]

        });

        await user1.save();

        const res = await request.get("/trips/myTrips")
            .set({
                userID: "5dd36c81b458db53e031819b"
            })
            .expect(200);

        expect(res.body.trips).toHaveLength(0);

        done();
    })

    it('gettrips for valid userid but user not found', async (done) => {
        const res = await request.get("/trips/myTrips")
            .set({
                userID: "5dd36c81b458db53e031819b"
            })
            .expect(400);

        expect(res.text).toBe("Unable to find user");

        done();
    })

    it('deltrips for valid user', async (done) => {

      const user1 = new User({
          _id: "5dd36c81b458db53e031819b",
          username: "bwong5",
          email: "bwong5@demo.com",
          password: "demodemodemo",
          fbToken: "",
          isDriver: true,
          interests: [5,5,5,5,5]

      });

      await user1.save();

      const riderTrip1 = new TripStore(ridertrip1);
      const updatedRiderTrip = await riderTrip1.save();

      const res = await request.del("/trips/delTrip")
            .set({
                userID: user1._id,
                tripID: updatedRiderTrip._id
            })
            .expect(200);

      expect(res.body.message).toBe("trip successfully deleted");

      done();
    });

    it('deltrip for valid user id but no user found', async (done) => {
      const res = await request.del("/trips/delTrip")
            .set({
                userID: "5dd3aaa00389fd5bf3b6a528",
                tripID: "5dd3aaa00389fd5bf3b6a528"
            })
            .expect(400);

      expect(res.text).toBe("Unable to find user");

      done();
    });

    it('deltrip for a invalid trip', async (done) => {
      const user1 = new User({
          _id: "5dd36c81b458db53e031819b",
          username: "bwong5",
          email: "bwong5@demo.com",
          password: "demodemodemo",
          fbToken: "",
          isDriverTrip: false,
          interests: [5,5,5,5,5]

      });

      await user1.save();

      const res = await request.del("/trips/delTrip")
        .set({
            userID: user1._id
        })
        .expect(400);

      expect(res.text).toBe("Invalid userID or tripID");
      done();

    });

    it('deltrip with invalid userID', async (done) => {
      const res = await request.del("/trips/delTrip")
        .set({
            userID: "",
            tripID: ""
        })
        .expect(400);

      expect(res.text).toBe("Invalid userID or tripID");
      done();
    })

    it('deltrip for a driver that has attached user trip', async (done) => {
      const rider = new User(taggedrider);
      await rider.save();
      const driver = new User(taggeddriver);
      await driver.save();
      const ridertrip = new TripStore(taggedridertrip1);
      await ridertrip.save();
      const drivertrip = new TripStore(taggeddrivertrip1);
      await drivertrip.save();

      const res = await request.del("/trips/delTrip")
        .set({
          userID: driver._id,
          tripID: drivertrip._id
        })
        .expect(200);

        expect(res.body.status).toBe("OK");
        expect(res.body.message).toBe("trip successfully deleted");

        trip = await TripStore.findById(drivertrip._id);
        expect(trip).toBeNull();

        done();
    })

    it('deltrip for a rider that has attached driver trip', async (done) => {
      const rider = new User(taggedrider);
      await rider.save();
      const driver = new User(taggeddriver);
      driver.fbToken = undefined;
      await driver.save();
      const ridertrip = new TripStore(taggedridertrip1);
      await ridertrip.save();
      const drivertrip = new TripStore(taggeddrivertrip1);
      await drivertrip.save();

      const res = await request.del("/trips/delTrip")
        .set({
          userID: rider._id,
          tripID: ridertrip._id
        })
        .expect(200);

        expect(res.body.status).toBe("OK");
        expect(res.body.message).toBe("trip successfully deleted");

        trip = await TripStore.findById(ridertrip._id);
        expect(trip).toBeNull();

        done();
    })

    it('deltrip on a valid tripid but nonexistent trip', async (done) => {

      const rider = new User(taggedrider);
      await rider.save();

      const res = await request.del("/trips/delTrip")
        .set({
          userID: rider._id,
          tripID: rider._id
        })
        .expect(400);

      expect(res.text).toBe("trip not found");

      done();
    })

    it('deltrip for a rider that has attached driver trip, however, drivertrip is nonexistent', async (done) => {
      const rider = new User(taggedrider);
      await rider.save();
      const driver = new User(taggeddriver);
      await driver.save();
      const ridertrip = new TripStore(taggedridertrip1);
      await ridertrip.save();

      const res = await request.del("/trips/delTrip")
        .set({
          userID: rider._id,
          tripID: ridertrip._id
        })
        .expect(400);

        expect(res.text).toBe("Unable to find driver trip");

        done();

    })

    it('deltrip for a rider that has attached driver trip, however, driver is nonexistent', async (done) => {
      const rider = new User(taggedrider);
      await rider.save();
      const ridertrip = new TripStore(taggedridertrip1);
      await ridertrip.save();
      const drivertrip = new TripStore(taggeddrivertrip1);
      await drivertrip.save();

      const res = await request.del("/trips/delTrip")
        .set({
          userID: rider._id,
          tripID: ridertrip._id
        })
        .expect(400);

        expect(res.text).toBe("Unable to find driver");

        done();

    })

    it('deltrip for a driver that has no tagged users', async (done) => {

      const driver = new User(taggeddriver);
      await driver.save();
      const drivertrip = new TripStore(taggeddrivertrip1);
      drivertrip.taggedTrips = [];
      await drivertrip.save();

      const res = await request.del("/trips/delTrip")
        .set({
          userID: driver._id,
          tripID: drivertrip._id
        })
        .expect(200);

        expect(res.body.status).toBe("OK");
        expect(res.body.message).toBe("trip successfully deleted");

        trip = await TripStore.findById(drivertrip._id);
        expect(trip).toBeNull();

        done();
    })

    it('driver accepting a trip from a rider ', async (done) => {
      const rider = new User(taggedrider);
      await rider.save();
      const driver = new User(taggeddriver);
      await driver.save();
      const ridertrip = new TripStore(taggedridertrip1);
      await ridertrip.save();
      const drivertrip = new TripStore(taggeddrivertrip1);
      drivertrip.taggedUsers = [];
      await drivertrip.save();

      const chat = new Chat({
        _id: drivertrip.chatroomID,
        users: [driver.username],
        message: []
      })
      await chat.save();

      const res = await request.post("/trips/acceptTrip")
        .send({
          userID: driver._id,
          tripID: drivertrip._id,
          usertripID: ridertrip._id
        })
        .expect(200);

      expect(res.body.status).toBe("OK");
      expect(res.body.message).toBe("user successfully added to trip");

      const updateddrivertrip = await TripStore.findById(taggeddrivertrip1._id);
      expect(updateddrivertrip.taggedUsers).toEqual(expect.arrayContaining([ridertrip.username]));
    
      done();
    })

    it('attempting to accept with invalid userid and drivertripID and usertripID', async (done) => {
      const res = await request.post("/trips/acceptTrip")
        .send({
          userID: "1234",
          tripID: "1234",
          usertripID: "1234"
        })
        .expect(400);

      expect(res.text).toBe("Invalid user ID or drivertripID or usertripID");
      done();
    })

    it('attempting to accept with nonexistent driver user', async (done) => {
      const res = await request.post("/trips/acceptTrip")
        .send({
          userID: "5dd5d1cfa91303a30fc2fe58",
          tripID: "5dd5d1cfa91303a30fc2fe58",
          usertripID: "5dd5d1cfa91303a30fc2fe58"
        })
        .expect(400);

      expect(res.text).toBe("Unable to find user");
      done();
    })

    it('attempting to accpet with valid driver but nonexistent driver trip', async (done) => {
      const driver = new User(taggeddriver);
      driver.save();
      const res = await request.post("/trips/acceptTrip")
        .send({
          userID: driver._id,
          tripID: "5dd5d1cfa91303a30fc2fe58",
          usertripID: "5dd5d1cfa91303a30fc2fe58"
        })
        .expect(400);

      expect(res.text).toBe("driver trip not found");
      done();
    })

    it('attempting to accept with valid driver but non existent ridertrip', async (done) => {
      const driver = new User(taggeddriver);
      driver.save();
      const drivertrip = new TripStore(taggeddrivertrip1);
      drivertrip.save();

      const res = await request.post("/trips/acceptTrip")
        .send({
          userID: driver._id,
          tripID: drivertrip._id,
          usertripID: "5dd5d1cfa91303a30fc2fe58"
        })
        .expect(400);

      expect(res.text).toBe("rider trip not found");

      done();
    })

    it('attempting to accept with valid driver but non existent user associated with accepting user trip', async (done) => {

      const driver = new User(taggeddriver);
      driver.save();
      const ridertrip = new TripStore(taggedridertrip1);
      ridertrip.save();
      const drivertrip = new TripStore(taggeddrivertrip1);
      drivertrip.save();

      const res = await request.post("/trips/acceptTrip")
        .send({
          userID: driver._id,
          tripID: drivertrip._id,
          usertripID: ridertrip._id
        })
        .expect(400);

      expect(res.text).toBe("rider user not found");

      done();
    })

    it('driver accepting a trip from a rider nonexistent chatroom / fbtoken ', async (done) => {
      const rider = new User(taggedrider);
      rider.fbToken = "";
      await rider.save();
      const driver = new User(taggeddriver);
      await driver.save();
      const ridertrip = new TripStore(taggedridertrip1);
      await ridertrip.save();
      const drivertrip = new TripStore(taggeddrivertrip1);
      drivertrip.taggedUsers = [];
      await drivertrip.save();

      const res = await request.post("/trips/acceptTrip")
        .send({
          userID: driver._id,
          tripID: drivertrip._id,
          usertripID: ridertrip._id
        })
        .expect(200);

      expect(res.body.status).toBe("OK");
      expect(res.body.message).toBe("user successfully added to trip");

      const updateddrivertrip = await TripStore.findById(taggeddrivertrip1._id);
      expect(updateddrivertrip.taggedUsers).toEqual(expect.arrayContaining([ridertrip.username]));
    
      done();
    })

    it('driver gets recommended trips', async (done) => {
      const driver = new User(taggeddriver);
      await driver.save();

      const drivertrip = new TripStore(taggeddrivertrip1);
      await drivertrip.save();

      const res = await request.get("/trips/getRecommendedTrips")
        .set({
          userid: driver._id
        })
        .expect(200);

      expect(res.body.trips[0].riderTrips).toHaveLength(3);
      expect(res.body.trips[0].drivertrip.tripRoute).toEqual(drivertrip.tripRoute);
      expect(res.body.trips).toHaveLength(1);
      done();
    })

    it('attempt to get recommended trip with invalid userID', async (done) => {
      const res = await request.get("/trips/getRecommendedTrips")
        .set({
          userid: "12341234123"
        })
        .expect(400);

      expect(res.text).toBe("Invalid userID");

      done();
    })

    it('attempt to get recommended trip with non existent user', async (done) => {
      const res = await request.get("/trips/getRecommendedTrips")
        .set({
          userid: "5dd36a75b458db53e031818e"
        })
        .expect(400);

      expect(res.text).toBe("User not found with corresponding userID");

      done();
    })

    it('attempt to get recommended trip for a driver that has no trips', async (done) => {
      const driver = new User(taggeddriver);
      await driver.save();

      const res = await request.get("/trips/getRecommendedTrips")
        .set({
          userid: driver._id
        })
        .expect(400);

      expect(res.text).toBe("Driver has no trips");

      done();
    })

    it('attempt to get recommended trip with a rider not a driver', async (done) => {
      const rider = new User(taggedrider);
      await rider.save();

      const res = await request.get("/trips/getRecommendedTrips")
        .set({
          userid: rider._id
        })
        .expect(400);

      expect(res.text).toBe("User is not a driver");

      done();
    })

    it('should fail on invalid trip', async (done) => {
      const user1 = new User({
          username: "chatdemouser13",
          email: "chatdemouser13@demo.com",
          password: "demodemodemo",
          fbToken: "examplefbToken"
      });

      let newuser;

      await user1.save()
          .then((user) => {
              newuser = user;
          });

      const res = await request.post("/trips/newTrip")
          .send({ 
             "arrivalPlace":"not assigned",
             "arrivalTime":"Nov 29, 2019 08:00:00",
             "departurePlace":"not assigned",
             "departureTime":"Nov 18, 2019 23:46:11",
             "isDriverTrip":false,
             "roomID":"not assigned",
             "taggedUsers":[ 
                "not assigned"
             ],
             "tripID":"not assigned",
             "tripRoute":{ 
                "nameValuePairs":{ 
                   "origin":"THROWERROR",
                   "destination":"49.21278372465756,-123.15078578889369"
                }
             },
             "userID": user1._id,
             "username": user1.username
          })
          .expect(400);

      done();
  })

})
