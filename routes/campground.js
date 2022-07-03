const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catcherror");
const ExpressError = require("../utilities/expresserror");
const CampingGround = require("../models/yelpcamp");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

// router.get("/", async (req, res) => {
//     const allcamp = await CampingGround.find({});
//     res.render("campground/index", { allcamp })
// })

// router.get("/new", isLoggedIn, (req, res) => {
//     res.render("campground/new");
// })

// router.post("/", isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
//     const campground = new CampingGround(req.body.campground);
//     campground.author = req.user._id;
//     await campground.save();
//     req.flash("success", "successfully made a new campground")
//     res.redirect(`/allcampground/${campground._id}`)
// }))

// router.get("/:id", catchAsync(async (req, res, next) => {
//     const campground = await CampingGround.findById(req.params.id).populate({
//         path: 'reviews',
//         populate: {
//             path: 'author'
//         }
//     }).populate("author");
//     if (!campground) {
//         req.flash("error", "Cannot find the Campground");
//         return res.redirect("/allcampground")
//     }
//     res.render("campground/show", { campground });
// }))

// router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(async (req, res, next) => {
//     const { id } = req.params;
//     const camping = await CampingGround.findById(id)
//     if (!camping) {
//         req.flash("error", "Cannot find the Campground");
//         return res.redirect("/allcampground")
//     }
//     res.render("campground/edit", { camping });
// }))

// router.put("/:id", isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res, next) => {
//     const { id } = req.params;
//     const campground = await CampingGround.findByIdAndUpdate(id, { ...req.body.campground });
//     req.flash("success", "Successfully updated Campground")
//     res.redirect(`/allcampground/${campground._id}`)

// }))

// router.delete("/:id", isLoggedIn, isAuthor, catchAsync(async (req, res, next) => {
//     const { id } = req.params;
//     await CampingGround.findByIdAndDelete(id);
//     req.flash("success", "Campground is deleted successfully")
//     res.redirect("/allcampground");
// }))

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array("image"), validateCampground, catchAsync(campgrounds.createCampground))

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

module.exports = router;