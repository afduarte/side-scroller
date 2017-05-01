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
  }
  jump() {
    // Check if it's already jumping
    if (!this.jumping) {
      this.jumping = true;
      this.applyForce(this.p.createVector(0, -5));
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

    // console.log(`${lx},${rx},${dy},${uy}`)
    if (colMat[cy]) {
      if (this.vel.x > 0) {
        // colliding on the right? stop going right

        this.vel.x = colMat[cy][r] ? 0 : this.vel.x;

      } else if (this.vel.x < 0) {
        // colliding on the left? stop going left
        this.vel.x = colMat[cy][l] ? 0 : this.vel.x;
      }
    }
    if (colMat[cx]) {
      if (this.vel.y > 0) {
        // colliding on the right? stop going right
        this.vel.y = colMat[d][cx] ? 0 : this.vel.y;
      } else if (this.vel.x < 0) {
        // colliding on the left? stop going left
        this.vel.y = colMat[u][cx] ? 0 : this.vel.y;
      }

    }
    console.log(l, r, d, u);
    if (this.pos.y > 0) {
      EventBus.$emit('died')
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