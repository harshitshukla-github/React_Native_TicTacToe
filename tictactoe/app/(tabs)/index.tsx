// App.js
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Alert } from 'react-native';

export default function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState({ X: 0, O: 0 });

  // Calculate the winner
  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], // top row
      [3, 4, 5], // middle row
      [6, 7, 8], // bottom row
      [0, 3, 6], // left column
      [1, 4, 7], // middle column
      [2, 5, 8], // right column
      [0, 4, 8], // diagonal \
      [2, 4, 6]  // diagonal /
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    
    // Check if the board is full (draw)
    if (!squares.includes(null)) {
      return 'Draw';
    }
    
    return null;
  };

  // Handle square press
  const handlePress = (index) => {
    // Don't allow moves if game is over or square is already filled
    if (gameOver || board[index]) return;

    // Create a copy of the board
    const newBoard = [...board];
    
    // Place X or O in the square
    newBoard[index] = xIsNext ? 'X' : 'O';
    
    // Update the board
    setBoard(newBoard);
    
    // Switch turns
    setXIsNext(!xIsNext);
    
    // Check for winner
    const winner = calculateWinner(newBoard);
    
    if (winner) {
      setGameOver(true);
      
      // Update score if there's a winner (not a draw)
      if (winner !== 'Draw') {
        setScore(prevScore => ({
          ...prevScore,
          [winner]: prevScore[winner] + 1
        }));
      }
      
      // Delay the alert slightly to allow state to update and UI to render
      setTimeout(() => {
        if (winner === 'Draw') {
          Alert.alert('Game Over', 'It\'s a draw!', [
            { text: 'Play Again', onPress: resetGame },
          ]);
        } else {
          Alert.alert('Game Over', `Player ${winner} wins!`, [
            { text: 'Play Again', onPress: resetGame },
          ]);
        }
      }, 100);
    }
  };

  // Reset the game (but keep the score)
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setGameOver(false);
  };

  // Reset both game and score
  const resetAll = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setGameOver(false);
    setScore({ X: 0, O: 0 });
  };

  // Render each square
  const renderSquare = (index) => {
    return (
      <TouchableOpacity
        style={styles.square}
        onPress={() => handlePress(index)}
        activeOpacity={0.8}
      >
        <Text style={styles.squareText}>{board[index]}</Text>
      </TouchableOpacity>
    );
  };

  // Game status message
  const getStatus = () => {
    const winner = calculateWinner(board);
    if (winner === 'Draw') return 'Draw!';
    if (winner) return `Winner: ${winner}`;
    return `Next player: ${xIsNext ? 'X' : 'O'}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>Tic Tac Toe</Text>
      
      {/* Score Display */}
      <View style={styles.scoreContainer}>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreLabel}>Player X</Text>
          <Text style={styles.scoreValue}>{score.X}</Text>
        </View>
        <Text style={styles.scoreSeparator}>-</Text>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreLabel}>Player O</Text>
          <Text style={styles.scoreValue}>{score.O}</Text>
        </View>
      </View>
      
      <Text style={styles.status}>{getStatus()}</Text>
      
      <View style={styles.board}>
        <View style={styles.row}>
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </View>
        <View style={styles.row}>
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </View>
        <View style={styles.row}>
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.resetButton} 
          onPress={resetGame}
          activeOpacity={0.8}
        >
          <Text style={styles.resetButtonText}>New Game</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.resetButton, styles.resetScoreButton]} 
          onPress={resetAll}
          activeOpacity={0.8}
        >
          <Text style={styles.resetButtonText}>Reset All</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  scoreItem: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  scoreLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#495057',
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  scoreSeparator: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6c757d',
  },
  status: {
    fontSize: 18,
    marginBottom: 20,
  },
  board: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    height: 100,
  },
  square: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: '#999',
    alignItems: 'center',
    justifyContent: 'center',
  },
  squareText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  resetButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  resetScoreButton: {
    backgroundColor: '#e74c3c',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});