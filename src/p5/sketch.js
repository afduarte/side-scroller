import Hero from './hero'
import levels from '../../levels/main';
import { EventBus } from '../bus'
import p5 from 'p5';
import 'p5/lib/addons/p5.dom';
import 'p5/lib/addons/p5.sound';

const funcs = {
  'o': (p, x, y) => {
    p.fill('#3c6633');
    p.rect(x, y, 50, 50);
    return { collide: true };
  },
  'g': (p, x, y) => {
    p.fill('blue');
    p.ellipseMode(p.CORNER)
    p.ellipse(x, y, 50, 50);
    p.ellipseMode(p.CENTER)
    return { collide: false, goal: true }
  },
  '1': (p, x, y) => {
    p.fill('#a85a03');
    p.ellipse(x + 25, y + 25, 10, 10);

    return { collide: false, coin: 1 }
  },
  '3': (p, x, y) => {
    p.fill('#616161');
    p.ellipse(x + 25, y + 25, 10, 10);

    return { collide: false, coin: 3 }
  },
  '5': (p, x, y) => {
    p.fill('#c3ae00');
    p.ellipse(x + 25, y + 25, 10, 10);

    return { collide: false, coin: 5 }
  },
  'k':(p,x,y)=>{

  },
  ' ': { collide: false }
}

const createMatrix = (l) => {
  if (!levels[l]) {
    l = 0;
  }
  return levels[l].split('\n')
    .filter(l => l.substring(0, 1) == '|' && l.substring(l.length - 1, l.length) == '|')
    .map(l => l.split('').filter(c => c != '|').map(c => funcs[c]));
}

// takes in a matrix of render functions and returns a collision matrix
function drawMap(p, matrix, h) {
  let spacing = 50;
  let hero = Math.floor(h.pos.x / 50);
  let tolerance = Math.floor(((p.width + 4 * spacing) / spacing) / 2);
  let upperL = hero + tolerance;
  let lowerL = hero - tolerance;
  lowerL = lowerL > 0 ? lowerL : 0;
  return matrix.map((line, y) => {
    let arr = [].fill(false, 0, line.length);
    for (let i = lowerL; i < upperL; i++) {
      let col = line[i];
      if (col && typeof col == 'function') {
        arr[i] = col(p, i * spacing, y * spacing);
      }
    }
    return arr;
  })
}

function gridLines(p, maxX, maxY, spacing) {
  for (let i = 0; (i * spacing) < maxX; i++) {
    p.stroke(i % 5 == 0 ? '#ff0000' : 255);
    p.line(i * spacing, 0, i * spacing, maxY);
  }
  for (let i = 0; i < maxY; i += spacing) {
    p.line(0, i, maxX, i);
  }
}

function createGame(matrix, selector) {
  const game = (p) => {
    const cvWidth = 800;
    const cvHeight = 600;
    let h;

    EventBus.$on('coin', ({ x, y }) => {
      matrix[y][x] = funcs[' '];
    });

    EventBus.$on('died', () => {
      h = resetSketch(p, h)
    });
    EventBus.$on('goal', () => {
      h = resetSketch(p, h)
    });
    p.setup = () => {
      p.createCanvas(cvWidth, cvHeight);
      h = resetSketch(p, h);

    };

    p.draw = () => {

      p.translate((-h.pos.x + p.width / 2), 0);
      // console.log((h.pos.x))
      p.background(0);
      p.fill(255);
      p.stroke(255);
      // gridLines(p,5000, p.height, 50);

      const colMat = drawMap(p, matrix, h);

      if (p.keyIsDown(p.LEFT_ARROW)) {
        h.move(-0.5)
      } else if (p.keyIsDown(p.RIGHT_ARROW)) {
        h.move(0.5)
      }

      if (p.keyIsDown(p.UP_ARROW)) {
        h.jump();
      }
      h.update(colMat);

    };
  }
  return new p5(game, selector)
}

function resetSketch(p, h) {
  return new Hero(p);
}

export default class Game {
  constructor(l, d) {
    this.matrix = createMatrix(l)
    this.game = createGame(this.matrix, 'game')
  }
};