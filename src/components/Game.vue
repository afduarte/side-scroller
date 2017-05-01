<template lang="pug">
  #game
</template>

<script>
import settings from '../settings'
import p5 from 'p5';
import 'p5/lib/addons/p5.dom';
import 'p5/lib/addons/p5.sound';
import g from '../p5/sketch';
import { EventBus } from '../bus';
const Game = {
  name: 'game',
  props: ['difficulty'],
  data() {
    return {
      lives: settings.lives,
      game: null
    }
  },
  methods: {
    newGame() {
      this.game = new p5(g, 'game');
    }
  },
  mounted() {
    this.newGame();
  }
}
// EventBus.$on('died', Game.methods.newGame);
export default Game;
</script>


<style scoped>

</style>
