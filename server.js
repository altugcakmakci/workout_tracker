const express = require("express");
const mongojs = require("mongojs");
const logger = require("morgan");
const path = require("path");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

const databaseUrl = "workout";
const collections = ["workouts"];

const db = mongojs(databaseUrl, collections);

db.on("error", error => {
    console.log("Database Error:", error);
});

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

    db.workouts.insert(
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

    db.workouts.aggregate([{
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
    db.workouts.aggregate([{
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
    db.workouts.findOne(
        {
            _id: mongojs.ObjectId(req.params.id)
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
    db.workouts.update(
        {
            _id: mongojs.ObjectId(req.params.id)
        },
        {
            $push: {
                exercises: req.body
            }
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

app.delete("/delete/:id", (req, res) => {
    db.workouts.remove(
        {
            _id: mongojs.ObjectID(req.params.id)
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
    db.workouts.remove({}, (error, response) => {
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
