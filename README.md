# Knight's Tour Visualizer

An interactive visualization of the **Knight's Tour problem**, demonstrating algorithmic problem-solving, heuristic search, and chessboard traversal.

## 1. Introduction

The Knight's Tour is a classical problem in computer science and combinatorial mathematics. It involves moving a knight across a chessboard so that every square is visited exactly once.

A knight moves in an L-shaped pattern: two squares in one direction and one square perpendicular to it. Finding a valid sequence of moves becomes increasingly challenging as the board size grows.

This project provides a visual representation of the Knight's Tour, allowing users to observe the movement of the knight and understand the relationship between chessboard traversal and algorithmic problem-solving.

## 2. Problem Statement

Given an \(N \times N\) chessboard and a starting position, find a sequence of legal knight moves that visits every square exactly once.

The tour can be classified into two types:

- **Open Knight's Tour:** The final square is not reachable from the starting square in one knight's move.
- **Closed Knight's Tour:** The final square is reachable from the starting square in one knight's move, forming a closed cycle.

The objective is to generate a valid tour while ensuring that no square is visited more than once.

## 3. Objectives

- Visualize the Knight's Tour problem on a chessboard.
- Demonstrate legal knight movements and square visitation.
- Understand heuristic-based decision-making in algorithm design.
- Explore the relationship between graph traversal and combinatorial search.
- Observe how a sequence of moves forms a complete tour.
- Study the computational challenges associated with finding valid tours.

## 4. DAA Concepts Involved

### 4.1 Graph Representation

The chessboard can be represented as an undirected graph \(G=(V,E)\).

- **Vertices (\(V\)):** Each square on the chessboard represents a vertex.
- **Edges (\(E\)):** An edge connects two vertices if a knight can legally move between their corresponding squares.

For an \(N \times N\) board, the graph contains \(N^2\) vertices.

A Knight's Tour corresponds to a path that visits every vertex exactly once. Such a path is a Hamiltonian path. A closed tour corresponds to a Hamiltonian cycle.

### 4.2 Heuristic Search

Heuristics use practical rules to guide the search toward a potential solution. They can reduce unnecessary exploration, although they do not always guarantee a solution.

The particular algorithm used by this repository must be identified from its source code before attributing a specific heuristic to the implementation.

## 5. Algorithm Used

This project is based on an existing Knight's Tour visualization repository.

The original implementation must be examined to determine the exact tour-generation algorithm. A visualization may use a constructive algorithm, divide-and-conquer techniques, Warnsdorff's Rule, backtracking, or another approach.

These methods should not be treated as interchangeable.

### Warnsdorff's Rule — Theoretical Background

Warnsdorff's Rule is a heuristic for selecting the knight's next move. It prefers the unvisited square with the fewest onward moves available.

The procedure is:

1. Identify all legal moves from the knight's current position.
2. Remove squares that have already been visited.
3. Calculate the accessibility of each remaining square.
4. Select a square with the minimum number of onward moves.
5. Mark the selected square as visited and repeat.

**Important:** Warnsdorff's Rule is included here as a DAA concept. It should only be described as the algorithm used by the application if the repository's implementation confirms this.

## 6. Algorithmic Complexity

The complexity depends on the actual implementation.

For a backtracking-based Knight's Tour solver, a loose worst-case upper bound is \(O(8^{N^2})\), since each square has at most eight possible knight moves. This bound is intentionally coarse and does not describe the exact running time of every instance.

The board and visitation information typically require \(O(N^2)\) space, excluding additional implementation-specific overhead.

A constructive algorithm or heuristic-based implementation may have different complexity characteristics. The final complexity analysis should therefore match the algorithm actually used in the repository.

## 7. Features

The application provides a visual environment for exploring the Knight's Tour.

Depending on the features implemented in the cloned repository, these may include:

- Chessboard visualization.
- Knight movement representation.
- Display of visited squares.
- Step-by-step tour progression.
- Interactive playback controls.
- Support for selected board dimensions.

Only features verified in the running application should be listed as implemented.

## 8. Technology Stack

The project uses the technologies and build tools provided by the original repository.

Inspect the source code and configuration files to identify the actual technologies, which may include:

- HTML and CSS for presentation.
- JavaScript for interaction and visualization.
- C or another language for the solver.
- WebAssembly or a compiled JavaScript module, if used.
- Build tools and dependencies specified in the project configuration.

The final README should list only the technologies actually present in the repository.

## 9. How to Run the Project

Clone the repository:

```bash
git clone https://github.com/sgalal/knights-tour-visualization.git
```

Navigate to the project directory:

```bash
cd knights-tour-visualization
```

Inspect the available scripts and setup instructions in `package.json` and the existing documentation.

Install dependencies using the package manager appropriate to the repository, if required, and run the documented development or build command.

Do not assume that a particular command works until it has been verified against the project's configuration.

## 10. Applications and Learning Outcomes

The project demonstrates concepts relevant to the Design and Analysis of Algorithms course:

- Graph modelling and Hamiltonian paths.
- State-space exploration.
- Heuristic decision-making.
- Algorithmic complexity.
- Interactive algorithm visualization.
- The trade-off between exhaustive search and heuristic guidance.

It helps students connect a formal algorithmic problem with its visual execution.

## 11. Limitations

The ability to generate a tour depends on the implemented algorithm, supported board dimensions, starting position, and tour type.

Heuristics may make useful choices without guaranteeing a solution in every situation. Some algorithms support only specific board sizes or generate only particular types of tours.

The implementation's actual limitations should be documented after testing the solver.

## 12. Acknowledgement

This project is based on the existing [Knight's Tour Visualization repository](https://github.com/sgalal/knights-tour-visualization).

The original implementation and algorithmic approach are credited to the repository's author. Any subsequent modifications to the interface, visualization, or functionality should be documented separately.

## 13. Conclusion

The Knight's Tour is a useful example of how graph theory and algorithm design can be applied to a classical computational problem.

By visualizing the movement of a knight across a chessboard, this project provides an opportunity to study Hamiltonian paths, heuristic search, and the computational challenges involved in constructing a valid tour.