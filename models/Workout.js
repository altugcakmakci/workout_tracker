const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const WorkoutSchema = new Schema({
  day: {
    type: Date,
    unique: true
  },
  exercises: [
    {
        type:{
            type: String,
            required: true
        },
        name:{
            type:String,
            required: true
        },
        distance:{
            type:Number,
        },
        duration:{
            type:Number,
        },
        weight:{
            type:Number,
        },
        sets:{
            type:Number,
        },
        reps:{
            type:Number,
        },
    }
  ]
});

const Workout = mongoose.model("Workout", WorkoutSchema);

module.exports = Workout;