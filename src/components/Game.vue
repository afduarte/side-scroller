<template lang="pug">
  .container
    span.lives(v-for="n in lvs") {{ n }}
    p Score: {{ score }}
    #game
</template>

<script>
import Game from '../p5/sketch';
import levels from '../../levels/main'
import { EventBus } from '../bus';
const VueGame = {
  name: 'game',
  props: ['difficulty', 'lives'],
  data() {
    return {
      lvs: this.lives || 3,
      game: null,
      level: 0,
      score: 0
    }
  },
  methods: {
    newGame() {
      // delete the old game first
      if (this.game) {
        this.game = null;
        let canvas = document.querySelector('canvas');
        canvas.parentNode.removeChild(canvas);
      }
      this.level = this.level - 1 >= levels.length ? 0 : this.level;
      this.game = new Game(this.level, this.level);
    },
    takeLive() {
      this.lvs--;
      if (this.lvs <= 0) {
        this.score = 0;
        this.level = 0;
        this.newGame();
      }
    },
    reachedGoal() {
      this.level++;
      this.newGame();
    },
    coin({ score }) {
      this.score += score;
    }
  },
  computed: {
    posString() {
      return this.l + ',' + this.r + ',' + this.d + ',' + this.u;
    }
  },
  mounted() {
    this.newGame();
  },
  created() {
    EventBus.$on('goal', this.reachedGoal);
    EventBus.$on('died', this.takeLive);
    EventBus.$on('coin', this.coin);
  }
}
export default VueGame;
</script>


<style scoped>
.lives {
  width: 30px;
  height: 30px;
  background-color: #dd8888
}
</style>
