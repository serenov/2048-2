if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("serviceworker.js")
    .then((Registration) => {
      console.log("SW Registered");
      console.log(Registration);
    })
    .catch((error) => {
      console.log("SW Registration Failed!");
      console.log(error);
    });
}

board = [
  [null, null, null, null],
  [null, null, null, null],
  [null, null, null, null],
  [null, null, null, null],
];

var offset = [
  [0, -1],
  [0, +1],
  [+1, 0],
  [-1, 0],
];
var start = [0, 0],
  end = [0, 0];
var fingerCount;

function tileGenerator(value, x, y) {
  const div = document.createElement("div");
  div.classList.add("card", `n${value}`);
  div.innerHTML = value;
  div.value = value;
  if (board[y][x] === null) {
    div.style = `--x: ${x}; --y: ${y}; animation: show 500ms;`;
    board[y][x] = div;
  } else div.style = `--x: ${x}; --y: ${y}; animation: merge 200ms`;
  return div;
}
function randomTileGenerator() {
  var rand;
  do {
    rand = Math.floor(Math.random() * 16);
  } while (board[Math.floor(rand / 4)][rand % 4] !== null);
  document
    .querySelector(".tileholder")
    .append(tileGenerator(2, rand % 4, Math.floor(rand / 4)));
}
function testTileGenerator(x, y, value) {
  document.querySelector(".tileholder").append(tileGenerator(value, x, y));
}

function move(direction) {
  var effy, effx, coord;
  var stateChange = false;
  var newTiles = [];

  function destination() {
    var of = offset[direction],
      x = effx + of[0],
      y = effy + of[1];
    for (; x < 4 && x > -1 && y < 4 && y > -1; ) {
      if (board[y][x] !== null) {
        for (var i = 0; i < newTiles.length; i++)
          if (x === newTiles[0] && y === newTiles[1]) break;
        if (board[y][x].value === board[effy][effx].value) {
          return {
            x: x,
            y: y,
            flag: true,
            value: board[y][x].value + board[effy][effx].value,
          };
        }
        return { x: x - of[0], y: y - of[1] };
      }
      (x += of[0]), (y += of[1]);
    }
    if (of[0] !== 0) return { x: x - of[0], y: y };
    return { x: x, y: y - of[1] };
  }

  for (var y = 1; y < 4; y++) {
    for (var x = 0; x < 4; x++) {
      if (direction === 1) (effy = 3 - y), (effx = x); // down
      else if (direction === 2) (effy = x), (effx = 3 - y); // right
      else if (direction === 3) (effy = x), (effx = y); // left
      else (effy = y), (effx = x); // up

      if (board[effy][effx] !== null) {
        coord = destination();
        if (effy !== coord.y || effx !== coord.x) {
          board[effy][effx].style = `--x: ${coord.x} ; --y: ${coord.y};`;
          if (coord.flag) {
            const div = tileGenerator(coord.value, coord.x, coord.y);
            document.querySelector(".tileholder").appendChild(div);
            newTiles.push([
              coord.x,
              coord.y,
              board[coord.y][coord.x],
              board[effy][effx],
            ]);
            board[coord.y][coord.x] = div;
          } else {
            board[coord.y][coord.x] = board[effy][effx];
          }
          board[effy][effx] = null;
          stateChange = true;
        }
      }
    }
  }
  setTimeout(() => {
    for (var i = 0; i < newTiles.length; i++) {
      newTiles[i][2].remove();
      newTiles[i][3].remove();
    }
  }, 110);
  return stateChange;
}

document.addEventListener("keydown", (e) => handler(e.key));
el = document.querySelector(".tiles-container");
el.addEventListener("touchstart", (e) => {
  fingerCount = e.touches.length;
  start[0] = e.changedTouches[0].clientX;
  start[1] = e.changedTouches[0].clientY;
});
el.addEventListener("touchend", (e) => {
  end[0] = e.changedTouches[0].clientX;
  end[1] = e.changedTouches[0].clientY;
  if (fingerCount === 1) {
    checkDirection();
  }
});
const checkDirection = () => {
  const distance = 30;
  if (Math.abs(start[0] - end[0]) > Math.abs(start[1] - end[1])) {
    if (start[0] - end[0] > distance) {
      handler("ArrowLeft");
    } else if (end[0] - start[0] > distance) {
      handler("ArrowRight");
    }
  } else {
    if (start[1] - end[1] > distance) {
      handler("ArrowUp");
    } else if (end[1] - start[1] > distance) {
      handler("ArrowDown");
      e.preventDefault();
    }
  }
};

function handler(event) {
  var offset;
  switch (event) {
    case "ArrowUp":
      offset = 0;
      break;
    case "ArrowDown":
      offset = 1;
      break;
    case "ArrowRight":
      offset = 2;
      break;
    case "ArrowLeft":
      offset = 3;
      break;
    default:
      return;
  }
  if (move(offset)) randomTileGenerator();
}

randomTileGenerator(3, 0, 8);
randomTileGenerator(3, 2, 4);
randomTileGenerator(3, 3, 4);
