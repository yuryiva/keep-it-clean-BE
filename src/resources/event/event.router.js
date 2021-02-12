const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const User = require("../user/user.model");
const Event = require("../event/event.model");

const get = require("../message/message.router");

//Private
// GET /event
// gets user events

router.get("/my_events", auth, async (req, res) => {
  try {
    const events = await Event.find({
      user: req.user.id,
    }).populate("User", ["name"]);

    if (!events) {
      res.status(404).json({ msg: "There is no events for this user" });
    }

    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Public
// GET /all_events
// gets all exists events

router.get("/all_events", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Private
// POST /event
// Creates event

router.post(
  "/",
  [
    auth,
    check("description", "Description is required").isLength({
      min: 4,
    }),
    check("address", "Address is required").isLength({
      min: 4,
    }),
    check("city", "City is required").isLength({
      min: 4,
    }),
    check("date", "Date is required").isLength({
      min: 10,
    }),
    check("time", "Time is required").not().isEmpty(),
    check("event_name", "Title is required").isLength({
      min: 4,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // console.log(req.user)
    // const eventFields = {
    //         user: req.user.id,
    //         name: req.user.info[0],
    //     ...req.body,
    // }
    try {
      const { event_name, city, date, time } = req.body;
      const event = await Event.create({
        user: req.user.id,
        name: req.user.info[0],
        ...req.body,
      });

      const user = await User.findOne({
        _id: req.user.id,
      });

      console.log(req.user.id);

      user["user_events"].push(event);
      user["subscribed_events"].push(event);
      await user.save();
      get(event_name, city, date, time);
      res.status(201).json(event);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  }
);

// Public
// GET /event/:event_id
// gets event based on its id

router.post("/events/:event_id", auth, async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.event_id,
    });

    if (!event) {
      return res.status(404).json({ msg: "There is no event found" });
    }
    const user = await User.findOne({
      _id: req.user.id,
    });

    user["subscribed_events"].push(event);
    console.log(user["subscribed_events"])

    await user.save();
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
