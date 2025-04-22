enum Direction {
  Up,
  Down,
  Left,
  Right,
}

const walk = (str: Direction) => {
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
