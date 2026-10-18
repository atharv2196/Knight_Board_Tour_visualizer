<template>
  <aside class="p-2">
    <!-- State 1: Unready / Setup Phase -->
    <template v-if="!hasSolution">
      <div class="card p-3 shadow-sm border-0 bg-light">
        <h6 class="fw-bold mb-2 text-dark">Starting Position</h6>
        <p class="small text-muted mb-3">
          Drag the knight to any square on the board, or leave it at <strong>c6</strong>. Click below to calculate the solution and unlock playback modes.
        </p>
        <button
          @click="chessboardEvent('boardReady')"
          :disabled="boardState === 'searching'"
          class="btn btn-lg w-100 btn-tour text-white shadow-none border-0 fw-semibold"
        >
          <span v-if="boardState === 'searching'" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          {{ boardState === 'searching' ? "Calculating Solution..." : "I'm ready" }}
        </button>
      </div>
    </template>

    <!-- State 2: Solution Ready - Playback Controls -->
    <template v-else>
      <div class="card p-3 shadow-sm border-0 bg-light mb-3">
        <!-- Mode Selector -->
        <label class="form-label small fw-bold text-uppercase text-muted mb-2">Playback Mode</label>
        <div class="btn-group w-100 mb-3" role="group">
          <button
            type="button"
            class="btn btn-sm fw-semibold"
            :class="playbackMode === 'auto' ? 'btn-tour text-white' : 'btn-outline-secondary bg-white'"
            @click="chessboardEvent('setMode', 'auto')"
          >
            ⚡ Automatic
          </button>
          <button
            type="button"
            class="btn btn-sm fw-semibold"
            :class="playbackMode === 'manual' ? 'btn-tour text-white' : 'btn-outline-secondary bg-white'"
            @click="chessboardEvent('setMode', 'manual')"
          >
            👆 Manual
          </button>
        </div>

        <!-- Automatic Mode Settings & Play Button -->
        <div v-if="playbackMode === 'auto'" class="mb-3">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <label class="form-label small text-muted mb-0">Delay between moves</label>
            <span class="badge bg-secondary">{{ delayTime }} ms</span>
          </div>
          <div class="d-flex align-items-center gap-2 mb-3">
            <input
              type="range"
              class="form-range flex-grow-1"
              min="50"
              max="2000"
              step="50"
              v-model.number="delayTime"
            >
            <input
              type="number"
              class="form-control form-control-sm text-center"
              style="width: 75px;"
              min="50"
              max="2000"
              step="50"
              v-model.number="delayTime"
            >
          </div>

          <!-- Play / Pause / Resume / Replay -->
          <button
            v-if="isPlaying"
            @click="chessboardEvent('pause')"
            class="btn btn-lg w-100 btn-warning text-dark fw-bold shadow-none border-0 mb-2"
          >
            ⏸ Pause
          </button>
          <button
            v-else-if="isPaused"
            @click="chessboardEvent('resume')"
            class="btn btn-lg w-100 btn-tour text-white fw-bold shadow-none border-0 mb-2"
          >
            ▶ Resume
          </button>
          <button
            v-else-if="isCompleted"
            @click="chessboardEvent('restart')"
            class="btn btn-lg w-100 btn-tour text-white fw-bold shadow-none border-0 mb-2"
          >
            ↺ Replay Tour
          </button>
          <button
            v-else
            @click="chessboardEvent('play')"
            class="btn btn-lg w-100 btn-tour text-white fw-bold shadow-none border-0 mb-2"
          >
            ▶ Play
          </button>
        </div>

        <!-- Step Controls (Always available in Manual, also available in Auto when not playing) -->
        <label class="form-label small fw-bold text-uppercase text-muted mb-2">Step Navigation</label>
        <div class="btn-group w-100 mb-3" role="group">
          <button
            @click="chessboardEvent('stepBackward')"
            :disabled="!canStepBackward"
            class="btn btn-lg btn-move shadow-none border-0"
            title="Previous Move"
          >
            ◀ Previous
          </button>
          <button
            @click="chessboardEvent('stepForward')"
            :disabled="!canStepForward"
            class="btn btn-lg btn-move shadow-none border-0"
            title="Next Move"
          >
            Next ▶
          </button>
        </div>

        <!-- Utility Reset Controls -->
        <div class="d-flex gap-2">
          <button
            @click="chessboardEvent('restart')"
            :disabled="isPlaying || currentMoveIndex === 0"
            class="btn btn-sm btn-outline-secondary flex-grow-1"
          >
            ↺ Restart
          </button>
          <button
            @click="chessboardEvent('resetBoard')"
            class="btn btn-sm btn-secondary flex-grow-1"
          >
            ⟲ Reset Board
          </button>
        </div>
      </div>
    </template>
  </aside>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  name: "Dashboard",
  computed: {
    ...mapGetters([
      "boardState",
      "playbackMode",
      "currentMoveIndex",
      "delayTime",
      "hasSolution",
      "isPlaying",
      "isPaused",
      "isCompleted",
      "canStepForward",
      "canStepBackward"
    ]),
    delayTime: {
      get() {
        return this.$store.getters.delayTime
      },
      set(delay) {
        this.$store.dispatch("updateDelayTime", Number(delay) || 300)
      }
    }
  },
  methods: {
    chessboardEvent(e, payload) {
      this.$emit("chessboard-event", { event: e, payload })
    }
  }
}
</script>

<style scoped>
.btn-tour {
  background-color: #40916c;
}
.btn-tour:hover:not(:disabled) {
  background-color: #2d6a4f;
}

.btn-move {
  background-color: #EEF4BD;
  color: #2b2b2b;
}
.btn-move:hover:not(:disabled) {
  background-color: #DCE3AC;
}
</style>
