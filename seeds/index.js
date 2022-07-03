const mongoose = require("mongoose");
const Camping = require("../models/yelpcamp");
const { places, descriptors } = require("./seeddata");
const cities = require("./cities")



mongoose.connect("mongodb://localhost:27017/sudeepdb");
// .then(() => {
//     console.log("Mongoose connection open")
// })
// .catch(err => {
//     console.log("!!!error from the mongoose~!!!")
//     console.log(err)
// })


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connection is open and ready to use")
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Camping.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Camping({
            author: "62b9a7a19a9a418b49f3b534",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "Hello everyone, this is the defult image description",
            price: price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dbkbbjzl6/image/upload/v1656742736/YelpCamp/zjwo8nsizx5iukhxcccd.jpg',
                    filename: 'YelpCamp/zjwo8nsizx5iukhxcccd'
                },
                {
                    url: 'https://res.cloudinary.com/dbkbbjzl6/image/upload/v1656588987/YelpCamp/m49laynv7vuc59eg0wvj.jpg',
                    filename: 'YelpCamp/m49laynv7vuc59eg0wvj'
                }
            ]
        })
        await camp.save();
    }
}


seedDB().then(() => {
    mongoose.connection.close();
})