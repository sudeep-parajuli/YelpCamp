const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utilities/catcherror");
const ExpressError = require("../utilities/expresserror");
const CampingGround = require("../models/yelpcamp");
const Review = require("../models/review");
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const reviews = require('../controllers/reviews');


// router.post("/", isLoggedIn, validateReview, catchAsync(async (req, res, next) => {
//     const campground = await CampingGround.findById(req.params.id);
//     const review = new Review(req.body.review);
//     review.author = req.user._id;
//     campground.reviews.push(review);
//     await review.save();
//     await campground.save();
//     req.flash("success", "Review has been successfully added")
//     res.redirect(`/allcampground/${campground._id}`)
// }))

// router.delete("/:reviewid", isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
//     const { id, reviewid } = req.params;
//     await CampingGround.findByIdAndUpdate(id);
//     await Review.findByIdAndDelete(reviewid);
//     req.flash("success", "Review is successfully deleted")
//     res.redirect(`/allcampground/${id}`);
// }))

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))


module.exports = router;