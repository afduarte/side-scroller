<template lang="pug">
  #app
    h1 Super Mario Clone
    game(:difficulty="difficulty",:lives="lives")
    #diff-selector
      button(v-for="d, i in difficulties", @click="changeDif(i)", :class="{active:d == difficulty}") {{ d.name }}
</template>

<script>
import Game from './components/Game'
import settings from './settings'
import { EventBus } from './bus';
const App = {
  name: 'app',
  components: {
    Game
  },
  data() {
    return {
      difficulties: [{ name: 'Easy', mul: 2 }, { name: 'Normal', mul: 1 }, { name: 'Hard', mul: 0.5 }],
      difficulty: null
    }
  },
  methods: {
    changeDif(d) {
      this.difficulty = this.difficulties[d];
    }
  },
  computed: {
    lives() {
      if (this.difficulty) {
        return Math.floor(this.difficulty.mul * settings.lives)
      }
    }
  },
  mounted() {
    this.changeDif(1)
  }
}

export default App;
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#diff-selector {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

#diff-selector button {
  background-color: rgba(0, 0, 0, 0);
  border: 5px solid #a0a0ff;
  padding: 10px;
  color: #333;
}

#diff-selector button:hover,
#diff-selector button.active {
  background-color: rgba(160, 160, 255, 0.8);
  border: 5px solid #333;
}
</style>
