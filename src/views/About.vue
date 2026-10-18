<template>
  <div class="container my-5 about-container">
    <!-- Header -->
    <div class="mb-4 pb-2 border-bottom">
      <h1 class="display-6 fw-bold text-dark">Knight's Tour Visualizer</h1>
      <p class="lead text-muted mb-0">Design &amp; Analysis of Algorithms (DAA) Laboratory Project</p>
    </div>

    <!-- Section A: About the Project -->
    <section class="card shadow-sm border-0 mb-4 p-4">
      <h2 class="h4 text-success fw-bold border-bottom pb-2 mb-3">A. About the Project</h2>
      <p>
        The <strong>Knight's Tour Problem</strong> is a classic algorithmic challenge in combinatorial mathematics and graph theory:
        given a standard 8 × 8 chessboard, can a knight visit every square on the board <strong>exactly once</strong>?
      </p>
      <p>
        This web application combines an <strong>interactive chessboard</strong> with algorithmic problem-solving and real-time visualization.
        Users can place the knight on any initial square, step through moves manually, or execute automated solvers while watching the knight's sequence and visit numbers unfold.
      </p>
      <div class="alert alert-light border my-3">
        <h6 class="fw-bold mb-1">Formal Tour Definition</h6>
        <p class="mb-0 small">
          A tour of length <em>N</em>² = 64 is represented as an ordered sequence of squares ⟨<em>s</em>₁, <em>s</em>₂, …, <em>s</em>₆₄⟩.
          A valid complete tour satisfies two invariant conditions:
        </p>
        <ul class="small mb-0 mt-1">
          <li><strong>Bijectivity (Completeness):</strong> ∀ <em>i</em> ≠ <em>j</em>, <em>s<sub>i</sub></em> ≠ <em>s<sub>j</sub></em>, ensuring all 64 chessboard squares are visited without duplicates.</li>
          <li><strong>Legality:</strong> For every transition <em>s<sub>i</sub></em> → <em>s</em><sub><em>i</em>+1</sub> (1 ≤ <em>i</em> &lt; 64), the move obeys the knight's L-shaped displacement rule: (Δ<em>x</em>, Δ<em>y</em>) ∈ {(±1, ±2), (±2, ±1)}.</li>
        </ul>
      </div>
      <div class="row g-3">
        <div class="col-md-6">
          <div class="border rounded p-3 h-100 bg-light">
            <span class="badge bg-primary mb-2">Open Tour</span>
            <p class="small mb-0">
              The tour ends on a square <em>s</em>₆₄ that is <strong>not</strong> a legal knight move away from the starting square <em>s</em>₁. The knight visits all 64 squares but cannot immediately loop back to the start.
            </p>
          </div>
        </div>
        <div class="col-md-6">
          <div class="border rounded p-3 h-100 bg-light">
            <span class="badge bg-success mb-2">Closed Tour (Re-entrant)</span>
            <p class="small mb-0">
              The tour ends on a square <em>s</em>₆₄ from which the starting square <em>s</em>₁ is reachable in exactly one legal knight move. This forms a continuous Hamiltonian cycle on the knight's graph.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Section B: Backtracking Algorithm -->
    <section class="card shadow-sm border-0 mb-4 p-4">
      <h2 class="h4 text-success fw-bold border-bottom pb-2 mb-3">B. Backtracking Algorithm</h2>
      <p>
        <strong>Backtracking</strong> is a systematic, depth-first search (DFS) algorithmic technique used to find solutions to constraint satisfaction problems.
        Instead of generating all possible permutations blindly, backtracking constructs candidate solutions step-by-step and immediately abandons a candidate ("pruning" the branch) as soon as it determines that the candidate cannot lead to a valid full solution.
      </p>
      <h6>Algorithmic Execution Process</h6>
      <ol class="small mb-3">
        <li><strong>Initialization:</strong> Place the knight at the user-selected starting square <em>s</em>₁ and mark it as visited (depth = 1).</li>
        <li><strong>Move Generation:</strong> From the current square <em>s<sub>k</sub></em>, generate all 8 potential knight offsets and filter out off-board positions and previously visited squares.</li>
        <li><strong>Candidate Selection:</strong> Pick an unvisited candidate square according to an ordering policy.</li>
        <li><strong>Recursive Exploration:</strong> Place the knight on the candidate square, mark it visited with index <em>k</em> + 1, and recursively call the solver.</li>
        <li><strong>Backtracking (Undo):</strong> If the search path reaches a dead end (no unvisited legal moves remain and depth &lt; 64), backtrack: unmark the current square and return to the parent node to evaluate the next alternative candidate.</li>
        <li><strong>Termination:</strong> The algorithm halts when a complete path of length 64 is reached (success) or when all possible branches from the root are exhausted (failure).</li>
      </ol>

      <h6>State-Space Search Tree &amp; Combinatorial Explosion</h6>
      <p class="small">
        The state-space tree represents every sequence of candidate moves. At each square, a knight has up to 8 candidate moves.
        In the worst-case naive depth-first search, the size of the state-space tree grows on the order of <em>O</em>(8⁶⁴).
        Because this search tree is astronomical, naive backtracking without heuristic pruning quickly becomes computationally infeasible on an 8 × 8 board.
      </p>

      <h6>Backtracking Pseudocode</h6>
      <pre class="bg-dark text-light p-3 rounded small mb-0"><code>function solveKnightTour(currentSquare, moveIndex, visitedPath):
    if moveIndex == 64:
        return true // All 64 squares successfully visited

    candidates = getLegalUnvisitedMoves(currentSquare, visitedPath)
    
    // Sort candidates using Warnsdorff heuristic degree
    sortCandidatesByFewestOnwardMoves(candidates)

    for nextSquare in candidates:
        visitedPath.append(nextSquare)
        
        if solveKnightTour(nextSquare, moveIndex + 1, visitedPath):
            return true // Solution found down this branch
            
        visitedPath.remove(nextSquare) // Backtrack: undo move

    return false // Dead end reached; trigger backtracking to caller</code></pre>
    </section>

    <!-- Section C: Warnsdorff's Heuristic -->
    <section class="card shadow-sm border-0 mb-4 p-4">
      <h2 class="h4 text-success fw-bold border-bottom pb-2 mb-3">C. Warnsdorff's Heuristic</h2>
      <p>
        Introduced in 1823 by H. C. von Warnsdorff, <strong>Warnsdorff's Rule</strong> is a greedy heuristic that dramatically optimizes move ordering:
      </p>
      <blockquote class="border-start border-4 border-success ps-3 py-2 bg-light fst-italic">
        "At each step, always move the knight to the unvisited legal square that has the <strong>fewest onward unvisited moves</strong> (minimum accessibility degree)."
      </blockquote>

      <h6>Why Warnsdorff's Heuristic Works</h6>
      <p class="small">
        Corner and edge squares on a chessboard have naturally low accessibility (e.g., a corner square like <code>a1</code> has at most 2 legal moves, whereas a center square like <code>d4</code> has up to 8).
        If the knight visits center squares first, corner squares become isolated "islands" with zero remaining entry and exit paths.
        By prioritizing squares with low onward degrees, the algorithm visits the most constrained squares early, keeping high-degree squares available as escape routes for later stages of the tour.
      </p>

      <h6>Implementation in this Application</h6>
      <p class="small mb-0">
        In this application's engine (<code>src/warnsdorff/index.js</code>), Warnsdorff's heuristic is coupled with edge tie-breaking and backtracking fallback.
        While pure greedy Warnsdorff can occasionally encounter dead-end ties on specific squares (such as <code>d6</code>), combining Warnsdorff's degree ranking with backtracking ensures that all 64 chessboard squares are solved successfully in milliseconds.
      </p>
    </section>

    <!-- Section D: DAA Complexity Analysis -->
    <section class="card shadow-sm border-0 mb-4 p-4">
      <h2 class="h4 text-success fw-bold border-bottom pb-2 mb-3">D. DAA Complexity Analysis</h2>
      <div class="table-responsive">
        <table class="table table-bordered table-sm align-middle mb-3">
          <thead class="table-light">
            <tr>
              <th scope="col">Metric</th>
              <th scope="col">Theoretical Naive Backtracking</th>
              <th scope="col">Warnsdorff-Guided Backtracking (This Project)</th>
            </tr>
          </thead>
          <tbody class="small">
            <tr>
              <td class="fw-semibold">Time Complexity</td>
              <td>Worst-case <em>O</em>(8<sup><em>N</em>²</sup>) where <em>N</em> = 8</td>
              <td>Empirically <em>O</em>(<em>N</em>²) on average with occasional minimal backtracking</td>
            </tr>
            <tr>
              <td class="fw-semibold">Space Complexity</td>
              <td><em>O</em>(<em>N</em>²) recursion stack depth &amp; visited lookup (64 levels)</td>
              <td><em>O</em>(<em>N</em>²) = <em>O</em>(64) memory footprint</td>
            </tr>
            <tr>
              <td class="fw-semibold">Search-Tree Size</td>
              <td>Up to 8⁶⁴ ≈ 6.27 × 10⁵⁷ potential states</td>
              <td>Pruned to near-linear search paths (typically 64 to 70 node evaluations)</td>
            </tr>
            <tr>
              <td class="fw-semibold">Practical Runtime</td>
              <td>Can run for hours or stall without completing on 8 × 8</td>
              <td>Typically <strong>1 to 15 milliseconds</strong> across all starting squares</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h6>Distinguishing Theoretical Upper Bounds from Measured Results</h6>
      <p class="small mb-0">
        In viva examinations, it is essential to distinguish between theoretical worst-case analysis and observed empirical performance.
        The theoretical worst-case upper bound remains exponential because backtracking might encounter hostile graphs.
        However, when heuristic move-ordering (Warnsdorff's rule) is applied, the effective branching factor is pruned from near 8 down close to 1, reducing the practical execution time from hours to single-digit milliseconds.
      </p>
    </section>

    <!-- Section E: Correctness and Validation -->
    <section class="card shadow-sm border-0 mb-4 p-4">
      <h2 class="h4 text-success fw-bold border-bottom pb-2 mb-3">E. Correctness and Validation</h2>
      <p class="small">
        Every tour produced by this visualizer is programmatically checked by a validation function (<code>validateTour</code>) before being presented to the user.
        The validation verifies 5 strict mathematical criteria:
      </p>
      <div class="row g-2 small">
        <div class="col-md-6">
          <div class="border rounded p-2 bg-light">
            <strong>1. Exact Length:</strong> The tour array must contain exactly 64 elements.
          </div>
        </div>
        <div class="col-md-6">
          <div class="border rounded p-2 bg-light">
            <strong>2. Origin Accuracy:</strong> <code>tour[0]</code> must match the selected starting square.
          </div>
        </div>
        <div class="col-md-6">
          <div class="border rounded p-2 bg-light">
            <strong>3. Unique Visits:</strong> <code>Set(tour).size === 64</code> proves zero revisited or omitted squares.
          </div>
        </div>
        <div class="col-md-6">
          <div class="border rounded p-2 bg-light">
            <strong>4. Move Legality:</strong> Every step <em>i</em> → <em>i</em> + 1 satisfies |Δ<em>x</em> · Δ<em>y</em>| = 2.
          </div>
        </div>
        <div class="col-12">
          <div class="border rounded p-2 bg-light">
            <strong>5. Cycle Classification:</strong> Evaluates if <em>s</em>₆₄ → <em>s</em>₁ is a legal knight move to classify the tour as <em>Closed</em> or <em>Open</em>.
          </div>
        </div>
      </div>
    </section>

    <!-- Section F: Educational Value -->
    <section class="card shadow-sm border-0 mb-4 p-4">
      <h2 class="h4 text-success fw-bold border-bottom pb-2 mb-3">F. Educational Value (Viva Reference)</h2>
      <p class="small">
        For computer science and IT engineering students, this visualizer serves as a live pedagogical laboratory demonstrating key DAA concepts:
      </p>
      <ul class="small mb-0">
        <li><strong>Visualizing Recursion &amp; DFS:</strong> Bridges abstract recursive call stacks with tangible spatial movements on a grid.</li>
        <li><strong>Heuristics vs. Brute-Force:</strong> Demonstrates how intelligent problem-specific heuristics can transform an intractable <em>O</em>(8⁶⁴) search into an interactive real-time tool.</li>
        <li><strong>State Representation:</strong> Illustrates 0x88 board coordinate mappings, bitwise validations, and constant-time visited set lookups.</li>
        <li><strong>Algorithm Verification:</strong> Reinforces the software engineering practice of programmatic post-condition assertion over visual assumptions.</li>
      </ul>
    </section>
  </div>
</template>

<script>
export default {
  name: "About"
}
</script>

<style scoped>
.about-container {
  max-width: 900px;
}
</style>
