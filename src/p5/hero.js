import { EventBus } from '../bus'
export default class Hero {
  constructor(p) {
    this.height = 30;
    this.width = 30;
    this.pos = p.createVector(15, 0);
    this.vel = p.createVector(0, 0);
    this.acc = p.createVector(0, 0);
    this.minHeight = p.height - this.height - 50 + 15;
    this.p = p;
    this.friction = 0.075;
    this.fricRight = p.createVector(-this.friction, 0);
    this.fricLeft = p.createVector(this.friction, 0);
    this.gravity = p.createVector(0, 0.15);
    this.maxSpeed = 5;
    this.jumping = false;
    this.colMat = null;
    this.dead = false;
  }
  jump() {
    // Check if it's already jumping
    if (!this.jumping) {
      this.jumping = true;
      this.applyForce(this.p.createVector(0, -7));
      setTimeout(() => {
        this.jumping = false;
      }, 850)
    }
  }
  move(x) {
    if ((x > 0 && this.vel.x <= this.maxSpeed) || (x < 0 && this.vel.x >= -this.maxSpeed)) {
      this.applyForce(this.p.createVector(x, 0));
    }
  }
  update(colMat) {
    // Gravity
    this.applyForce(this.gravity)
    // Friction
    if (this.vel.x > this.friction) {
      this.applyForce(this.fricRight)
    } else if (this.vel.x < -this.friction) {
      this.applyForce(this.fricLeft)
    } else {
      this.vel.x = 0;
    }

    this.vel.add(this.acc);
    this.edges(colMat);
    this.pos.add(this.vel);
    this.acc.set(0, 0);

    this.display();
  }
  edges(colMat) {
    let r = Math.floor((this.pos.x + (this.width / 2)) / 50);
    let l = Math.floor((this.pos.x - (this.width / 2)) / 50);

    let d = Math.floor((this.pos.y + (this.height / 2)) / 50);
    let u = Math.floor((this.pos.y - (this.height / 2)) / 50);

    let cy = Math.floor(this.pos.y / 50);
    let cx = Math.floor(this.pos.x / 50);

    if (colMat[cy]) {
      if (this.vel.x > 0) {
        // colliding on the right? stop going right
        let sq = colMat[cy][r]
        this.vel.x = sq && sq.collide ? 0 : this.vel.x;

      } else if (this.vel.x < 0) {
        // colliding on the left? stop going left
        let sq = colMat[cy][l]
        this.vel.x = sq && sq.collide ? 0 : this.vel.x;
      }
    }

    if (colMat[d] && this.vel.y > 0) {
      // colliding down? stop going 
      let sq = colMat[d][cx]
      this.vel.y = sq && sq.collide ? 0 : this.vel.y;
    } else if (colMat[u] && this.vel.y < 0) {
      // colliding on the up? stop going left
      let sq = colMat[u][cx]
      this.vel.y = sq && sq.collide ? 0 : this.vel.y;
    }

    // Top of the ball is out of the matrix
    if (u > colMat.length) {
      EventBus.$emit('died')
    }
    if (colMat[cy] && colMat[cy][cx]) {
      let cell = colMat[cy][cx];
      if (cell.goal) {
        EventBus.$emit('goal')
      }
      if (cell.coin) {
        EventBus.$emit('coin', { x: cx, y: cy, score: cell.coin });
      }
    }
  }
  applyForce(force) {
    this.acc.add(force);
  }
  display() {
    this.p.fill('#bbeeff');
    this.p.ellipse(this.pos.x, this.pos.y, this.width, this.height);
  }

}