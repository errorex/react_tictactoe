import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {  
    let classes = "square";

    if(props.winnerSquare){
      classes += " winner-square";
    }

    return (
      <button className={classes} onClick={props.onClick}>
        {props.value}
      </button>
    );  
}

class Row extends React.Component {

  renderSquare(row,col) {
    let winnerSquare = false;

    if(this.props.winnerLine !== null){
      winnerSquare = this.props.winnerLine.some( current => {
        return current[0] === row && current[1] === col;
      });
    }

    return (
      <Square
        key={col}
        value={this.props.squares[row][col]}
        onClick={() => this.props.onClick(row,col)}
        winnerSquare={winnerSquare}
      />
    );
  }

  renderRow(row){

    let out = Array(this.props.size).fill(null).map((current,index) => {
      return this.renderSquare(row,index);
    });

    return (
      <div key={row} className="board-row">
        {out}
      </div>
    )
  }

  render(){
    let out = Array(this.props.size).fill(null).map((current,index) => {
      return this.renderRow(index);
    });

    return (
      <div>
        {out}
      </div>    
    );
  }  
}

class Board extends React.Component {  

  render() {        
    return (
      <Row 
        winnerLine={this.props.winnerLine}
        squares={this.props.squares}
        onClick={this.props.onClick}
        size={this.props.size}
      />
    );
  }
}


class ToggleMovesOrderButton extends React.Component{

  render(){
    let description = this.props.reversed ? "reversed order" : "normal order";
    return(
      <button 
        className="toggle-button"
        href="#"
        onClick={this.props.onClick}>          
        {description}
      </button>
    );
  }
}

class Game extends React.Component {

  constructor(props){
    super(props);
    this.state = {      
      history: [{
        squares: 
          [  
            [null,null,null],
            [null,null,null],
            [null,null,null],
          ],
      }],
      stepNumber: 0,
      xIsNext: true,
      movesOrderReversed: false,
    };
  }

  reverseMovesOrder(){
    this.setState({
      movesOrderReversed: !this.state.movesOrderReversed,      
    });
  }

  handleClick(row,col) {        
    const history = this.state.history.slice(0,this.state.stepNumber + 1);
    const current = history[history.length-1];
    const board = current.squares.map(r => r.map(c => c));

    if (calculateWinner(board) || board[row][col]) {
      return;
    }

    board[row][col] = this.state.xIsNext ? 'X' : 'O'; 
    
    this.setState({
      history: history.concat([{
        squares: board,
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  includeMove(move){
    const desc = move ? 'go to move #' + move : 'go to start';
      return(
        <li key={move}>
          <button 
            onClick={() => this.jumpTo(move)}
            className={ (move === this.state.stepNumber ? "selected" : "")}
          >
            {desc}  
          </button>
        </li>
     );
  }

  render() {
    var history = this.state.history;
    const current = history[this.state.stepNumber];
    const winnerLine = calculateWinner(current.squares);
    var winner = null;

    if(winnerLine !== null){
      winner = current.squares[winnerLine[0][0]][winnerLine[0][1]];      
    }    

    let moves = history.map((step, move) => {
      return this.includeMove(move);
    });

    if(this.state.movesOrderReversed){
      moves.reverse();
    }

    let status;
    if(winner){
      status = 'Winner ' + winner;
    }else{
      status = 'Next player ' + (this.state.xIsNext ? 'X' : '0');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            winnerLine={winnerLine}
            squares={current.squares}
            onClick={ (row,col) => {this.handleClick(row,col)}}
            size={3}
          />
        </div>
        <div className="game-info">          
          <div>{status}</div>
          <div>{this.state.stepNumber}</div>
          <p/>
          <ToggleMovesOrderButton 
            reversed = {this.state.movesOrderReversed}
            onClick = {() => this.reverseMovesOrder()}
          />
          <ul>{moves}</ul>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {

  const lines = [
    [[0,0],[0,1],[0,2]],
    [[1,0],[1,1],[1,2]],
    [[2,0],[2,1],[2,2]],
    [[0,0],[1,0],[2,0]],
    [[0,1],[1,1],[2,1]],
    [[0,2],[1,2],[2,2]],
    [[0,0],[1,1],[2,2]],
    [[0,2],[1,1],[2,0]],    
  ];

  for (let i = 0; i < lines.length; i++) {    
    const [row_a, col_a] = lines[i][0];
    const [row_b, col_b] = lines[i][1];
    const [row_c, col_c] = lines[i][2];

    if (squares[row_a][col_a] && 
        squares[row_a][col_a] === squares[row_b][col_b] && 
        squares[row_a][col_a] === squares[row_c][col_c]) {
      return lines[i];
    }
  }
  return null;
}