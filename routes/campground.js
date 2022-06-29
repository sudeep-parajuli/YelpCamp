const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catcherror");
const ExpressError = require("../utilities/expresserror");
const CampingGround = require("../models/yelpcamp");
const { isLoggedIn } = require("../middleware");

router.get("/", async (req, res) => {
    const allcamp = await CampingGround.find({});
    res.render("campground/index", { allcamp })
})

router.get("/new", isLoggedIn, (req, res) => {
    res.render("campground/new");
})

router.post("/", catchAsync(async (req, res, next) => {
    const campground = new CampingGround(req.body.campground)
    await campground.save();
    req.flash("success", "successfully made a new campground")
    res.redirect(`/allcampground/${campground._id}`)
}))

router.get("/:id", catchAsync(async (req, res, next) => {
    const campground = await CampingGround.findById(req.params.id).populate("reviews");
    if (!campground) {
        req.flash("error", "Cannot find the Campground");
        return res.redirect("/allcampground")
    }
    res.render("campground/show", { campground });
}))

router.get("/:id/edit", catchAsync(async (req, res, next) => {
    const camping = await CampingGround.findById(req.params.id)
    if (!campground) {
        req.flash("error", "Cannot find the Campground");
        return res.redirect("/allcampground")
    }
    res.render("campground/edit", { camping });
}))

router.put("/:id", catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await CampingGround.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash("success", "Successfully updated Campground")
    res.redirect(`/allcampground/${campground._id}`)

}))

router.delete("/:id", catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await CampingGround.findByIdAndDelete(id);
    req.flash("success", "Campground is deleted successfully")
    res.redirect("/allcampground");
}))

module.exports = router;