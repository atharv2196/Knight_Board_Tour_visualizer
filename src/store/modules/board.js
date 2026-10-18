const state = {
  board: {
    state: "unready" // 'unready', 'searching', 'ready', 'playing', 'paused', 'completed', 'stuck'
  },
  playbackMode: "auto", // 'auto' | 'manual'
  currentMoveIndex: 0, // 0 to 63
  solutionTour: [], // Array of 64 squares
  tourInfo: null, // { tourType, isClosed, executionTimeMs, backtracks }
  delayTime: 300 // default 300ms
}

const mutations = {
  UPDATE_BOARD_STATE(state, boardState) {
    state.board.state = boardState
  },
  SET_PLAYBACK_MODE(state, mode) {
    state.playbackMode = mode
  },
  SET_SOLUTION(state, { tour, info }) {
    state.solutionTour = tour || []
    state.tourInfo = info || null
    state.currentMoveIndex = 0
  },
  SET_CURRENT_MOVE_INDEX(state, index) {
    state.currentMoveIndex = index
  },
  SET_DELAY_TIME(state, delay) {
    state.delayTime = Number(delay) || 300
  },
  RESET_TOUR(state) {
    state.solutionTour = []
    state.tourInfo = null
    state.currentMoveIndex = 0
    state.board.state = "unready"
  }
}

const actions = {
  updateBoardState({ commit }, boardState) {
    commit("UPDATE_BOARD_STATE", boardState)
  },
  setPlaybackMode({ commit }, mode) {
    commit("SET_PLAYBACK_MODE", mode)
  },
  setSolution({ commit }, payload) {
    commit("SET_SOLUTION", payload)
  },
  setCurrentMoveIndex({ commit }, index) {
    commit("SET_CURRENT_MOVE_INDEX", index)
  },
  updateDelayTime({ commit }, delay) {
    commit("SET_DELAY_TIME", delay)
  },
  resetTour({ commit }) {
    commit("RESET_TOUR")
  }
}

const getters = {
  boardState: (state) => state.board.state,
  playbackMode: (state) => state.playbackMode,
  currentMoveIndex: (state) => state.currentMoveIndex,
  currentMoveNumber: (state) => {
    if (state.solutionTour.length === 0) {
      return state.board.state === "unready" ? 0 : 1
    }
    return state.currentMoveIndex + 1
  },
  totalMoves: (state) => state.solutionTour.length || 64,
  solutionTour: (state) => state.solutionTour,
  tourInfo: (state) => state.tourInfo,
  delayTime: (state) => state.delayTime,
  hasSolution: (state) => state.solutionTour.length === 64,
  isPlaying: (state) => state.board.state === "playing",
  isPaused: (state) => state.board.state === "paused",
  isCompleted: (state) => state.board.state === "completed" || (state.solutionTour.length === 64 && state.currentMoveIndex === 63),
  canStepForward: (state) => state.solutionTour.length === 64 && state.currentMoveIndex < 63 && state.board.state !== "playing",
  canStepBackward: (state) => state.solutionTour.length === 64 && state.currentMoveIndex > 0 && state.board.state !== "playing"
}

export default {
  state,
  mutations,
  actions,
  getters
}
