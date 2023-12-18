**Live Preview:** [Catch the Rabbit Game](https://imfantin.github.io/Catch-the-Rabbit-Game/)

## Game Guide

### Basic Movement:
- To add moves to "Fox" (the player), press the arrow keys (up, down, left, or right).
- To drop a mine at the player's location, press the "t" key. You can only have one mine at a time.
- The player can change the mine's location by pressing the "t" key again.
- Both the player and the enemy will only move when there are five moves added.
- To move, click the "Go!" button.
- Neither the player nor the enemy can move over "Trees" (obstacles) or go beyond the map boundaries.
- There is a 10% chance of a "Grapes" (super power) spawn with every move.
- If the player reaches the super power, enemies won't be able to move for 10 turns.
- The user can check the number of power moves left below the player's moves.

### Resetting:
- The user can decide to reset the game at any time by pressing the "reset" button.
- A completely new game will be generated.

### Scoring:
- If the player reaches the rabbit ("Goal"), +100 points are added to the score, and the goal is respawned in a different location.
- If the "Hunter" (enemy) reaches the goal, -100 points are subtracted from the score, and the goal is respawned in a different location.
- If the enemy steps on the player's trap, +100 points are added to the score. The enemy is respawned in a different location, and the player's trap is destroyed.
- Difficulty levels increase every 200 points (e.g., 200, 400, 600...).
- If the user reaches a level and loses points, reaching the same score won't increase the level.
- When the level increases, a new enemy is spawned.

### Game Over:
- If the enemy and player occupy the same "square" (location), the game will end.

### Restrictions on Methods:
No methods were allowed to be used besides `.length`, `.charAt()`, `.indexOf()`, `Math.random()`, `Math.floor()` and `Math.sqrt()`.