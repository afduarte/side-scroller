import Hero from './hero'
import level from '../../levels/simple';

const funcs = {
  'o': (p, x, y) => {
    p.fill(255);
    p.rect(x, y, 50, 50);
    return true;
  },
  ' ': false
}

const matrix = level.split('\n')
  .filter(l => l.substring(0, 1) == '|' && l.substring(l.length - 1, l.length) == '|')
  .map(l => l.split('').filter(c => c != '|').map(c => funcs[c]));
console.log(matrix)
const game = (p) => {
  const cvWidth = 800;
  const cvHeight = 600;
  let x = cvWidth / 2;
  let y = cvHeight / 2;
  let moveX = 0;
  let moveY = 0;
  let speed = 3;
  let isJumping = false;
  let h;
  let translateX = 0;
  const lines = [400, 800, 1200, 1600, 2000, 2400, 2800]
  p.setup = () => {
    p.createCanvas(cvWidth, cvHeight);
    h = new Hero(p, (p.width / 2), p.height - 50);
    // drawMap(p,matrix)

  };

  p.draw = () => {

    p.translate(((-h.pos.x + p.width / 2) * 0.95), 0);
    p.background(0);
    p.fill(255);
    p.stroke(255);
    gridLines(5000, p.height, 50);

    const colMat = drawMap(p, matrix);

    if (p.keyIsDown(p.LEFT_ARROW)) {
      h.move(-0.5)
    } else if (p.keyIsDown(p.RIGHT_ARROW)) {
      h.move(0.5)
    }

    if (p.keyIsDown(p.UP_ARROW)) {
      h.jump();
    }
    h.update(colMat);
    if (h.pos.x >= (p.width / 2 + (100 + translateX))) {
      translateX -= h.vel.x;
    } else if (h.pos.x <= (p.width / 2 - (100 - translateX))) {
      translateX -= h.vel.x;
    }
  };

  function gridLines(maxX, maxY, spacing) {
    for (let i = 0; (i * spacing) < maxX; i++) {
      p.stroke(i % 5 == 0 ? 0 : 255);
      p.line(i * spacing, 0, i * spacing, maxY);
    }
    for (let i = 0; i < maxY; i += spacing) {
      p.line(0, i, maxX, i);
    }
  }
}

function drawMap(p, matrix) {
  let spacing = 50;
  return matrix.map((line, y) => {
    let x = 0;
    return line.map((col, x) => {
      let v = false;
      if (col && typeof col == 'function') {
        v = col(p, x * spacing, y * spacing);
      }
      return v;
    })
  })
}


export default game;