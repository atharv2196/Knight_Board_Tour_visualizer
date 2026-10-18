<template>
  <section>
    <!-- Left Article: Status Panel -->
    <article class="p-3">
      <div class="card border-0 shadow-sm p-3 status-card" :class="'status-' + boardState">
        <div class="d-flex align-items-center justify-content-between mb-2">
          <span class="small text-uppercase fw-bold text-muted">Status</span>
          <span class="badge" :class="badgeClass">{{ badgeText }}</span>
        </div>

        <!-- Move Counter & Progress -->
        <div v-if="hasSolution" class="my-2 p-2 bg-white rounded border">
          <div class="d-flex justify-content-between align-items-baseline mb-1">
            <span class="fw-bold text-dark fs-5">Move {{ currentMoveNumber }}</span>
            <span class="text-muted small">of {{ totalMoves }}</span>
          </div>
          <div class="progress" style="height: 6px;">
            <div
              class="progress-bar bg-success"
              role="progressbar"
              :style="{ width: progressPercent + '%' }"
              :aria-valuenow="currentMoveNumber"
              aria-valuemin="1"
              aria-valuemax="64"
            ></div>
          </div>
          <div v-if="tourInfo" class="mt-2 pt-1 border-top d-flex justify-content-between align-items-center">
            <span class="badge" :class="tourInfo.isClosed ? 'bg-success' : 'bg-primary'">
              {{ tourInfo.tourType }}
            </span>
            <span class="text-muted small">{{ tourInfo.executionTimeMs }} ms</span>
          </div>
        </div>

        <p class="mb-0 instruction-text mt-2">
          {{ instruction }}
        </p>
      </div>
    </article>

    <!-- Center Article: Chessboard -->
    <article>
      <Chessboard ref="chessboard" />
    </article>

    <!-- Right Article: Playback & Mode Controls -->
    <article class="p-2">
      <Dashboard @chessboard-event="handleChessboardEvent" />
    </article>
  </section>
</template>

<script>
import { mapGetters } from "vuex"
import Chessboard from "@/components/Chessboard.vue"
import Dashboard from "@/components/Dashboard.vue"

export default {
  name: "Home",
  components: {
    Chessboard,
    Dashboard
  },
  computed: {
    ...mapGetters([
      "instruction",
      "boardState",
      "hasSolution",
      "currentMoveNumber",
      "totalMoves",
      "tourInfo"
    ]),
    progressPercent() {
      if (!this.hasSolution) return 0
      return Math.round((this.currentMoveNumber / 64) * 100)
    },
    badgeClass() {
      switch (this.boardState) {
        case "completed":
        case "solved":
          return "bg-success text-white"
        case "playing":
          return "bg-primary text-white"
        case "paused":
          return "bg-warning text-dark"
        case "stuck":
          return "bg-danger text-white"
        case "ready":
          return "bg-info text-dark"
        case "searching":
          return "bg-secondary text-white"
        default:
          return "bg-secondary text-white"
      }
    },
    badgeText() {
      switch (this.boardState) {
        case "completed":
        case "solved":
          return "Completed"
        case "playing":
          return "Playing"
        case "paused":
          return "Paused"
        case "stuck":
          return "Dead End"
        case "ready":
          return "Ready"
        case "searching":
          return "Calculating"
        default:
          return "Setup"
      }
    }
  },
  methods: {
    handleChessboardEvent(data) {
      const eventName = typeof data === "string" ? data : data.event
      const payload = typeof data === "object" ? data.payload : undefined
      if (this.$refs.chessboard && typeof this.$refs.chessboard[eventName] === "function") {
        this.$refs.chessboard[eventName](payload)
      }
    }
  }
}
</script>

<style scoped>
section {
  display: flex;
}

article:nth-child(1) {
  flex: 0.85;
}
article:nth-child(2) {
  flex: 3;
}
article:nth-child(3) {
  flex: 1.15;
}

.status-card {
  background-color: #f8f9fa;
  border-left: 4px solid #61774B !important;
  border-radius: 6px;
}

.status-card.status-completed,
.status-card.status-solved {
  border-left-color: #198754 !important;
  background-color: #f0fff4;
}

.status-card.status-stuck {
  border-left-color: #dc3545 !important;
  background-color: #fff5f5;
}

.status-card.status-playing {
  border-left-color: #0d6efd !important;
  background-color: #f0f7ff;
}

.status-card.status-paused {
  border-left-color: #ffc107 !important;
  background-color: #fffdf0;
}

.instruction-text {
  font-size: 0.95rem;
  line-height: 1.45;
  color: #2c3e50;
  font-weight: 500;
}

@media screen and (max-width: 815px) {
  section {
    flex-direction: column-reverse;
  }
}
</style>
