const Home = require("../models/home");
const User = require("../models/user");

exports.getIndex = (req, res, next) => {
  console.log("Session Value: ", req.session);
  Home.find().then((registeredHomes) => {
    res.render("store/index", {
      registeredHomes: registeredHomes,
      pageTitle: "airbnb Home",
      currentPage: "index",
      isLoggedIn: req.isLoggedIn, 
      user: req.session.user,
    });
  });
};

exports.getHomes = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("store/home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Homes List",
      currentPage: "Home",
      isLoggedIn: req.isLoggedIn, 
      user: req.session.user,
    });
  });
};

// exports.getBookings = (req, res, next) => {
//   res.render("store/bookings", {
//     pageTitle: "My Bookings",
//     currentPage: "bookings",
//     isLoggedIn: req.isLoggedIn, 
//     user: req.session.user,
//   });
// };
exports.getBookings = async function (req, res) {
    try {
        let user = await User.findById(req.session.user._id).populate("bookings");

        res.render("store/bookings.ejs", {
            bookings: user.bookings || [],
            pageTitle: "My Bookings",
            currentPage: "bookings",
            isLoggedIn: req.isLoggedIn,
            user: req.session.user,
        });
    } catch (err) {
        console.log(err);
        res.render("store/bookings.ejs", {
            bookings: [],
            pageTitle: "My Bookings",
            currentPage: "bookings",
            isLoggedIn: req.isLoggedIn,
            user: req.session.user,
        });
    }
};


exports.getFavouriteList = async (req, res, next) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId).populate('favourites');
  res.render("store/favourite-list", {
    favouriteHomes: user.favourites,
    pageTitle: "My Favourites",
    currentPage: "favourites",
    isLoggedIn: req.isLoggedIn, 
    user: req.session.user,
  });
};

exports.postAddToFavourite = async (req, res, next) => {
  const homeId = req.body.id;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (!user.favourites.includes(homeId)) {
    user.favourites.push(homeId);
    await user.save();
  }
  res.redirect("/favourites");
};

exports.postRemoveFromFavourite = async (req, res, next) => {
  const homeId = req.params.homeId;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (user.favourites.includes(homeId)) {
    user.favourites = user.favourites.filter(fav => fav != homeId);
    await user.save();
  }
  res.redirect("/favourites");
};

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId).then((home) => {
    if (!home) {
      console.log("Home not found");
      res.redirect("/homes");
    } else {
      res.render("store/home-detail", {
        home: home,
        pageTitle: "Home Detail",
        currentPage: "Home",
        isLoggedIn: req.isLoggedIn, 
        user: req.session.user,
      });
    }
  });
};

exports.bookHome = async function (req, res) {
    try {
        let homeId = req.params.id;
        let user = await User.findById(req.session.user._id);  // req.user must come from session/passport

        if (!user.bookings.includes(homeId)) {
            user.bookings.push(homeId);
            await user.save();
        }

        res.redirect("/bookings"); // redirect to bookings page
    } catch (err) {
        console.log(err);
        res.redirect("/");
    }
};

// exports.getstoreBookings = async function (req, res) {
//     try {
//         let user = await User.findById(req.user._id).populate("bookings");
//         res.render("store/bookings.ejs", { bookings: user.bookings });
//     } catch (err) {
//         console.log(err);
//         res.render("store/bookings.ejs", { bookings: [] }); 
//     }
// };


