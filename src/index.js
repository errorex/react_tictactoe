import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Row extends React.Component {

  renderSquare(row,col) {
    return (
      <Square
        key={col}
        value={this.props.squares[row][col]}
        onClick={() => this.props.onClick(row,col)}
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
        squares={this.props.squares}
        onClick={this.props.onClick}
        size={this.props.size}
      />
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
    };
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

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let moves = history.map((step, move) => {
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
    });

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
            squares={current.squares}
            onClick={ (row,col) => {this.handleClick(row,col)}}
            size={3}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>{this.state.stepNumber}</div>
          <ol>{moves}</ol>
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


/**
 *  |(0,0)(0,1)(0,2) 
 *  |(1,0)(1,1)(1,2) 
 *  |(2,0)(2,1)(2,2) 
 **/
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
      return squares[row_a][col_a];
    }
  }
  return null;
}