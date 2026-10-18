<template>
  <chess-board draggable-pieces drop-off-board="snapback"></chess-board>
</template>

<script>
import { mapGetters } from "vuex"
import { markupSquare, unmarkupSquare } from "@/helpers"
import warnsdorff from "@/warnsdorff"

export default {
  name: "Chessboard",
  data() {
    return {
      boardEl: null,
      playTimer: null
    }
  },
  computed: {
    ...mapGetters([
      "boardState",
      "playbackMode",
      "currentMoveIndex",
      "solutionTour",
      "tourInfo",
      "delayTime",
      "hasSolution",
      "isPlaying"
    ])
  },
  mounted() {
    this.boardEl = document.querySelector("chess-board")
    if (this.boardEl) {
      this.boardEl.addEventListener("drop", this.droped)
    }
    this.reset()
  },
  beforeUnmount() {
    this.stopTimer()
  },
  methods: {
    stopTimer() {
      if (this.playTimer) {
        clearTimeout(this.playTimer)
        this.playTimer = null
      }
    },
    currentPosition() {
      if (!this.boardEl || !this.boardEl.position) return null
      return Object.keys(this.boardEl.position)[0] || null
    },
    selectInBoard(selector) {
      if (!this.boardEl || !this.boardEl.shadowRoot) return []
      return this.boardEl.shadowRoot.querySelectorAll(selector)
    },
    markupSquare(sq, num) {
      if (!sq) return
      const [squareEl] = this.selectInBoard("#square-" + sq)
      if (squareEl) {
        markupSquare(num, squareEl)
      }
    },
    unmarkupSquare(sq) {
      if (!sq) return
      const [squareEl] = this.selectInBoard("#square-" + sq)
      if (squareEl) {
        unmarkupSquare(squareEl)
      }
    },
    clearAllBoardMarkups() {
      this.selectInBoard("#moveNumberContainer").forEach(el => el.remove())
      this.selectInBoard(".square").forEach(el => (el.style = ""))
    },
    reset() {
      this.stopTimer()
      this.clearAllBoardMarkups()
      if (this.boardEl) {
        this.boardEl.setPosition({ c6: "bN" })
      }
    },
    boardReady() {
      const startPos = this.currentPosition()
      if (!startPos || !/^[a-h][1-8]$/.test(startPos)) {
        this.$store.dispatch(
          "updateInstruction",
          "⚠️ Please place the knight on a valid chessboard square (a1 to h8) before clicking I'm ready."
        )
        return
      }

      if (this.boardState === "searching" || this.boardState === "playing") {
        return
      }

      this.stopTimer()
      this.clearAllBoardMarkups()

      // Set state to searching
      this.$store.dispatch("updateBoardState", "searching")
      this.$store.dispatch(
        "updateInstruction",
        `Calculating legal Knight's Tour from ${startPos}...`
      )

      setTimeout(() => {
        const result = warnsdorff.solveKnightsTour(startPos)
        if (!result.success || !result.tour || result.tour.length !== 64) {
          this.$store.dispatch("updateBoardState", "stuck")
          this.$store.dispatch(
            "updateInstruction",
            `Search limit reached: No complete tour found from starting square ${startPos}.`
          )
          return
        }

        const validation = warnsdorff.validateTour(result.tour, startPos)
        if (!validation.valid) {
          this.$store.dispatch("updateBoardState", "stuck")
          this.$store.dispatch(
            "updateInstruction",
            `Validation failed: ${validation.reason}`
          )
          return
        }

        // Store solution and set move index to 0
        this.$store.dispatch("setSolution", {
          tour: result.tour,
          info: validation
        })
        this.$store.dispatch("setCurrentMoveIndex", 0)
        this.$store.dispatch("updateBoardState", "ready")

        // Render Move 1 on the board
        this.boardEl.setPosition({ [result.tour[0]]: "bN" })
        this.markupSquare(result.tour[0], 1)

        this.$store.dispatch(
          "updateInstruction",
          `Valid ${validation.tourType} found in ${result.executionTimeMs} ms (${result.backtracks} backtracks)! Select playback mode and press Play or Next Move.`
        )
      }, 50)
    },
    stepForward() {
      if (!this.hasSolution || this.currentMoveIndex >= 63) return

      const nextIndex = this.currentMoveIndex + 1
      const nextSquare = this.solutionTour[nextIndex]

      this.boardEl.setPosition({ [nextSquare]: "bN" })
      this.markupSquare(nextSquare, nextIndex + 1)
      this.$store.dispatch("setCurrentMoveIndex", nextIndex)

      if (nextIndex === 63) {
        this.stopTimer()
        this.$store.dispatch("updateBoardState", "completed")
        const tourType = this.tourInfo ? this.tourInfo.tourType : "Tour"
        this.$store.dispatch(
          "updateInstruction",
          `Success: Valid Knight's Tour completed! All 64 squares visited (${tourType}).`
        )
      } else if (this.boardState !== "playing") {
        this.$store.dispatch(
          "updateInstruction",
          `Move ${nextIndex + 1} of 64: ${nextSquare}.`
        )
      }
    },
    stepBackward() {
      if (!this.hasSolution || this.currentMoveIndex <= 0) return

      if (this.isPlaying) {
        this.pause()
      }

      const currentSquare = this.solutionTour[this.currentMoveIndex]
      this.unmarkupSquare(currentSquare)

      const prevIndex = this.currentMoveIndex - 1
      const prevSquare = this.solutionTour[prevIndex]

      this.boardEl.setPosition({ [prevSquare]: "bN" })
      this.$store.dispatch("setCurrentMoveIndex", prevIndex)

      if (this.boardState === "completed") {
        this.$store.dispatch("updateBoardState", "paused")
      }

      this.$store.dispatch(
        "updateInstruction",
        `Stepped back to Move ${prevIndex + 1} of 64: ${prevSquare}.`
      )
    },
    play() {
      if (!this.hasSolution) return

      if (this.currentMoveIndex >= 63) {
        this.restart()
      }

      this.$store.dispatch("updateBoardState", "playing")
      this.$store.dispatch(
        "updateInstruction",
        `Playing tour animation (Delay: ${this.delayTime} ms)...`
      )

      this.stopTimer()

      const tick = () => {
        if (this.boardState !== "playing") return
        if (this.currentMoveIndex >= 63) {
          this.stopTimer()
          return
        }
        this.stepForward()
        if (this.currentMoveIndex < 63 && this.boardState === "playing") {
          this.playTimer = setTimeout(tick, this.delayTime)
        }
      }

      this.playTimer = setTimeout(tick, this.delayTime)
    },
    pause() {
      this.stopTimer()
      if (this.boardState === "playing") {
        this.$store.dispatch("updateBoardState", "paused")
        this.$store.dispatch(
          "updateInstruction",
          `Playback paused at Move ${this.currentMoveIndex + 1} of 64.`
        )
      }
    },
    resume() {
      this.play()
    },
    restart() {
      this.stopTimer()
      if (!this.hasSolution) return

      this.clearAllBoardMarkups()
      const startSquare = this.solutionTour[0]
      this.boardEl.setPosition({ [startSquare]: "bN" })
      this.markupSquare(startSquare, 1)

      this.$store.dispatch("setCurrentMoveIndex", 0)
      this.$store.dispatch("updateBoardState", "ready")
      const tourType = this.tourInfo ? this.tourInfo.tourType : ""
      this.$store.dispatch(
        "updateInstruction",
        `Restarted at Move 1 of 64 (${tourType}). Ready to play.`
      )
    },
    resetBoard() {
      this.stopTimer()
      this.clearAllBoardMarkups()
      this.reset()
      this.$store.dispatch("resetTour")
      this.$store.dispatch(
        "updateInstruction",
        "Place the knight at an initial position and press I'm ready"
      )
    },
    setMode(mode) {
      if (this.isPlaying) {
        this.pause()
      }
      this.$store.dispatch("setPlaybackMode", mode)
      if (mode === "manual") {
        this.$store.dispatch(
          "updateInstruction",
          "Manual Step-by-Step mode selected. Use Next Move and Previous Move to navigate."
        )
      } else {
        this.$store.dispatch(
          "updateInstruction",
          "Automatic Playback mode selected. Press Play to animate."
        )
      }
    },
    droped({ detail }) {
      const { target, setAction } = detail

      if (this.boardState === "unready") {
        if (target === "offboard" || !/^[a-h][1-8]$/.test(target)) {
          return setAction("snapback")
        }
        this.boardEl.setPosition({ [target]: "bN" })
        this.$store.dispatch(
          "updateInstruction",
          `Knight placed on ${target}. Click "I'm ready" to compute solution.`
        )
        return
      }

      // During solution playback, manual drag-and-drop is locked
      return setAction("snapback")
    }
  }
}
</script>

<style scoped>
chess-board {
  --dark-color: #61774B;
  --light-color: #EEEED2;
  width: 550px;
  margin: auto;
  padding: 3rem 0 0 0;
}
@media only screen and (max-width: 816px) {
  chess-board {
    width: 95%;
  }
}
</style>
