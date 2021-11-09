const express = require("express");
const logger = require("morgan");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(
    process.env.MONGODB_URI || 'mongodb://localhost/workout',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    }
  );

const db = require("./models");

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "./public/index.html"));
});

app.get("/exercise", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/exercise.html"));
});

app.get("/stats", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/stats.html"));
});

app.post("/api/workouts", (req, res) => {

    db.Workout.create(
        {
            day: new Date()
        },
        (error, data) => {
            if (error) {
                res.send(error);
            } else {
                res.send(data);
            }
        }
    );
});

app.get("/api/workouts", (req, res) => {

    db.Workout.aggregate([{
        $addFields: {
            totalDuration: { $sum: "$exercises.duration" }
        }
    }], (error, data) => {
        if (error) {
            res.send(error);
        } else {
            res.json(data);
        }
    });

});

app.get("/api/workouts/range", (req, res) => {
    db.Workout.aggregate([{
        $addFields: {
            totalDuration: { $sum: "$exercises.duration" }
        }
    }], (error, data) => {
        if (error) {
            res.send(error);
        } else {
            res.json(data);
        }
    });
});

app.get("/find/:id", (req, res) => {
    db.Workout.findOne(
        {
            _id: mongoose.Types.ObjectId(req.params.id)
        },
        (error, data) => {
            if (error) {
                res.send(error);
            } else {
                res.send(data);
            }
        }
    );
});

app.put("/api/workouts/:id", (req, res) => {
    // console.log(req.params.id);
    // console.log(req.body);
    // console.log(mongoose.Types.ObjectId(req.params.id));
    db.Workout.findByIdAndUpdate(
        
        req.params.id  ,
        {
            $push: {
                exercises: req.body
            }
            
        }, {
            upsert: true
        },
        (error, data) => {
            if (error) {
                console.log(error);
                res.send(error);
            } else {
                console.log(data)
                res.send(data);
            }
        }
    );
});

app.delete("/delete/:id", (req, res) => {
    db.Workout.remove(
        {
            _id: mongoose.Types.ObjectId(req.params.id)
        },
        (error, data) => {
            if (error) {
                res.send(error);
            } else {
                res.send(data);
            }
        }
    );
});

app.delete("/clearall", (req, res) => {
    db.Workout.remove({}, (error, response) => {
        if (error) {
            res.send(error);
        } else {
            res.send(response);
        }
    });
});

app.listen(3000, () => {
    console.log("App running on port 3000!");
});
