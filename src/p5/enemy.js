import { EventBus } from '../bus'
export default class Enemy {
  constructor(p,x,y) {
    this.height = 30;
    this.width = 30;
    this.pos = p.createVector(x, y);
    this.vel = p.createVector(0.3, 0);

    this.p = p;
    this.gravity = p.createVector(0, 0.15);
  }
  update(colMat) {
    // Gravity
    this.applyForce(this.gravity)

    this.edges(colMat);
    this.pos.add(this.vel);

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
        this.vel.x = sq && sq.collide ? -this.vel.x : this.vel.x;

      } else if (this.vel.x < 0) {
        // colliding on the left? stop going left
        let sq = colMat[cy][l]
        this.vel.x = sq && sq.collide ? -this.vel.x : this.vel.x;
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

  display() {
    this.p.fill('#684e36');
    this.p.ellipse(this.pos.x, this.pos.y, this.width, this.height);
  }

}