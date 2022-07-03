if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


const express = require("express");
const app = express();
const path = require("path")
const ejsMate = require("ejs-mate");
const { validateSchema } = require("./validateschema")
const ExpressError = require("./utilities/expresserror");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const user = require("./models/user");

const MongoStore = require("connect-mongo");
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/sudeepdb';


// app.use(session({
//     secret: 'foo',
//     store: MongoDBStore.create(options)
// }));

//defining routes

const allcampground = require("./routes/campground")
const reviewRoute = require("./routes/reviewRoute");
const userRoute = require("./routes/authuser");


// mongoose.connect('mongodb://localhost:27017/sudeepdb',
//     {
//         // useNewUrlParser: true,
//         // useCreateIndex: true,
//         // useUnifiedTopology: true
//     }
// );

mongoose.connect(dbUrl, {
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useUnifiedTopology: true,
    // useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database is connected");
});

//defining view engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, 'public')))

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = new MongoStore({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});



const sessionConfig = {
    store,
    secret: "secret message",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //converting millisecond to weeks
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());




app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());





app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

//routes configuration
app.use("/allcampground", allcampground)
app.use("/allcampground/:id/review", reviewRoute)
app.use("/", userRoute);


app.get("/", (req, res) => {
    res.render("home")
})


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})


app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something Went Wrong. Please Check"
    res.status(statusCode).render("error", { err })
})

app.listen(3000, () => {
    console.log("serving on port 3000")
})