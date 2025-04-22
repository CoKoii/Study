"use strict";
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Down"] = 1] = "Down";
    Direction[Direction["Left"] = 2] = "Left";
    Direction[Direction["Right"] = 3] = "Right";
})(Direction || (Direction = {}));
const walk = (str) => {
    switch (str) {
        case Direction.Up:
            console.log("Going up");
            break;
        case Direction.Down:
            console.log("Going down");
            break;
        case Direction.Left:
            console.log("Going left");
            break;
        case Direction.Right:
            console.log("Going right");
            break;
    }
};
walk(Direction.Up);
