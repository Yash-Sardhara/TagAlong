const supertest = require('supertest')
const app = require("../index.js");
const mongoose = require('mongoose');
const request = supertest(app);
const bcrypt = require("bcryptjs");
const User = require("../User/models/user");


const databaseName = 'userroutestest'

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


describe('testing registration', () => {


	it('should succeeds with appropriate credentials', async (done) => {

		const demouser1 = {
			username: "demo1",
			email: "demo1@demo.com",
			password: "demodemodemo"
		}

		const res = await request.post("/users/register")
			.send(demouser1)
			.expect(200);

		const user = await User.findOne({email: demouser1.email});
		expect(user.username).toBe(demouser1.username);
		expect(user.email).toBe(demouser1.email);
		expect(user.password).toBeTruthy();
		expect(res.body).toBeTruthy();
		expect(res.body.username).toBe(demouser1.username);
		expect(res.body.email).toBe(demouser1.email);

		done();
	})

	it('second registration should fail with duplicate email', async (done) => {

		user = new User({
			username: "demo2",
			email: "demo2@demo.com",
			password: "demodemodemo"
		});

		await user.save();

		const demouser2_dup = {
			username: "demo2dup",
			email: "demo2@demo.com",
			password: "demodemodemo"
		}

		const res = await request.post("/users/register")
			.send(demouser2_dup)
			.expect(400);

		const user2 = await User.findOne({username: "demo1"});
		expect(user2).toBeNull();
		expect(res.text).toBe("User already exists.");

		done();

	})

	it('should fail with no credential provided', async (done) => {
		const res = await request.post("/users/register")
			.send({username: "demo"})
			.expect(400);

		const user = await User.findOne({username: "demo"});
		expect(user).toBeNull();

		done();
	})

})

describe('testing login', () => {

	it('should succeeds with correct credentials', async (done) => {
		user = new User({
			username: "demo3",
			email: "demo3@demo.com",
			password: bcrypt.hashSync("demodemodemo", 10)
		});

		await user.save();

		const res = await request.post("/users/login")
			.send({
				username: "demo3",
				password: "demodemodemo"
			})
			.expect(200);

		expect(res.body).toBeTruthy();
		expect(res.body.username).toBe("demo3");
		expect(res.body.email).toBe("demo3@demo.com");


		done();
	});


	it('should fail with incorrect credentials', async (done) => {


		user = new User({
			username: "demo4",
			email: "demo4@demo.com",
			password: bcrypt.hashSync("demodemodemo", 10)
		});

		await user.save();

		const res = await request.post("/users/login")
			.send({
				username: "demo4",
				password: "incorrectpassword"
			})
			.expect(400);

		expect(res.text).toBe("Incorrect email or password");

		done();
	})

	it('it should fail with no credentials', async (done) => {
		const res = await request.post("/users/login")
			.send({})
			.expect(400);

		expect(res.text).toBe("Incorrect email or password");

		done();
	})

	it('should fail with no email provided', async (done) => {

		const demouser5 = {
			username: "demo5",
			password: "demodemodemo"
		}

		const res = await request.post("/users/register")
			.send(demouser5)
			.expect(400);

		expect(res.text).toBe("ERROR MISSING FIELD");

		done();
	})

	it('update profile of new user', async (done) => {
		
		user1 = new User({
			username: "demo6",
			email: "demo6@demo.com",
			password: "demodemodemo"
		});

		await user1.save();

		const user = await User.findOne({email: "demo6@demo.com"});

		const res = await request.put("/users/updateProfile")
			.send({
				userID: user._id,
				interests: [0,0,0,0,0],
				firstName: "demo",
				lastName: "demo",
				age: 20,
				gender: "male",
				email: "demo@demo.com",
				carCapacity: 4,
				fbToken: "a",
				isDriver: false
			})
			.expect(200);

		expect(res.body._id).toEqual(user._id.toString());
		expect(res.body.firstName).toBe("demo");
		expect(res.body.lastName).toBe("demo");
		expect(res.body.age).toBe(20);
		expect(res.body.gender).toBe("male");
		expect(res.body.email).toBe("demo@demo.com");
		expect(res.body.carCapacity).toBe(4);
		expect(res.body.fbToken).toBe("a");
		expect(res.body.isDriver).toBe(false);

		done();
	})

	it('updating profile of invalid userID', async (done) => {
		const res = await request.put("/users/updateProfile")
			.send({
				userID: "1",
				interests: [0,0,0,0,0],
				firstName: "demo",
				lastName: "demo",
				age: 20,
				gender: "male",
				email: "demo@demo.com",
				carCapacity: 4,
				fbToken: "",
				isDriver: false
			})
			.expect(400);

		expect(res.text).toBe("Invalid userID");

		done();
	})

	it('getProfile of a valid user', async (done) => {
		user1 = new User({
			username: "demo6",
			email: "demo6@demo.com",
			password: "demodemodemo"
		});

		await user1.save();

		const res = await request.get("/users/getProfile")
			.set({
				username: "demo6"
			})
			.expect(200);

		expect(res.body).toBeTruthy();
		expect(res.body.username).toBe("demo6");
		expect(res.body.email).toBe("demo6@demo.com");

		done();
	})

	it('getProfile of an invalid user', async (done) => {
		const res = await request.get("/users/getProfile")
			.set({
				username: "demo6"
			})
			.expect(400);

		expect(res.text).toBe("User not found");
		done();
	})

	it('logs out a registered user', async (done) => {
		user1 = new User({
			username: "demo6",
			email: "demo6@demo.com",
			password: "demodemodemo",
			fbToken: "1234"
		});

		const updateduser = await user1.save();
		const res = await request.post("/users/logout")
			.send({
				userID: updateduser._id
			})
			.expect(200);

		expect(res.body.fbToken).toBe("");
		expect(res.body.username).toBe(user1.username);
		expect(res.body.email).toBe(user1.email);

		done();
	})

	it('logs out with invalid userID', async (done) => {
		
		const res = await request.post("/users/logout")
			.send({
				userID: "1234"
			})
			.expect(400);

		expect(res.text).toBe("Invalid userID");

		done();
	})



})
