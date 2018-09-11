import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';


class Box extends React.Component{
    selectBox = () => {
        this.props.selectBox(this.props.row, this.props.col)
    }

    render(){
        return (
           <div
           className={this.props.boxClass}
           id={this.props.id}
           onClick={this.selectBox}
           />
        );
    }
}

class Grid extends React.Component{

    render(){
        const width = (this.props.columns * 16) + 1 ;
        var rowsArr = [];

        var boxClass = '';
        for (var i=0; i < this.props.rows; i++) {
            for (var j=0; j < this.props.columns; j++) {

                let boxId = i + '_' + j;

                boxClass = this.props.gridFull[i][j] ? "box on" : "box off"; //add class on click
                rowsArr.push(
                    <Box
                        boxClass = {boxClass}
                        key= {boxId}
                        boxId= {boxId}
                        row= {i}
                        col= {j}
                        selectBox={this.props.selectBox}
                    />
                );
            }
        }

        return (

            <div className='grid' style={{width: width}}>
                {rowsArr}
            </div>
        );
    }
}

class Buttons extends React.Component {

    render() {
        return (
            <div className="center">
                    <button className="button" onClick={this.props.playButton}>
                        Play
                    </button>
                    <button className="button" onClick={this.props.pauseButton}>
                        Pause
                    </button>
                    <button className="button" onClick={this.props.clear}>
                        Clear
                    </button>
                    <button className="button" onClick={this.props.slow}>
                        Slow
                    </button>
                    <button className="button" onClick={this.props.fast}>
                        Fast
                    </button>
                    <button className="button" onClick={this.props.seed}>
                        Seed
                    </button>
            </div>
        )
    }
}

class Main extends React.Component {

    constructor(){

        super();

        this.speed = 100;
        this.rows = 30; //how many rows
        this.columns = 50; //how many columns




        this.state = {

            generation: 0,
            gridFull: Array(this.rows).fill().map(() => Array(this.columns).fill(false))
        }

    }

    selectBox = (row, col) => {

        let gridCopy = arrayClone(this.state.gridFull);
        gridCopy[row][col] = !gridCopy[row][col];
        this.setState({
            gridFull: gridCopy
        });

    };

    seed = () => {
        let gridCopy = arrayClone(this.state.gridFull);
        for (let i=0; i < this.rows; i++) {
            for(let j=0; j< this.columns; j++) {

                if(Math.floor(Math.random()* 4) === 1){
                    gridCopy[i][j] = true;
                }

            }

        }
        this.setState({
            gridFull: gridCopy

        });
    };

    playButton = () => {
        clearInterval(this.intervalId);
        this.intervalId = setInterval(this.play, this.speed);

    }
    pauseButton = () => {
        clearInterval(this.intervalId);
    };

    slow = () => {
        this.speed = 1000;
        this.playButton();

    };

    fast = () => {
        this.speed = 100;
        this.playButton();

    };

    clear = () => {
       var grid = Array(this.rows).fill().map(() => Array(this.columns).fill(false));
        this.setState({
            gridFull:grid,
            generation: 0

        });
    };

    play = () => {
        let g= this.state.gridFull;
        let g2 = arrayClone(this.state.gridFull);

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                let count = 0; //live neighbors
                if (i > 0) if (g[i - 1][j]) count++;
                if (i > 0 && j > 0) if (g[i - 1][j - 1]) count++;
                if (i > 0 && j < this.columns - 1) if (g[i - 1][j + 1]) count++;
                if (j < this.columns - 1) if (g[i][j + 1]) count++;
                if (j > 0) if (g[i][j - 1]) count++;
                if (i < this.rows - 1) if (g[i + 1][j]) count++;
                if (i < this.rows - 1 && j > 0) if (g[i + 1][j - 1]) count++;
                if (i < this.rows - 1 && this.columns - 1) if (g[i + 1][j + 1]) count++;
                if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = false; //Any live cell with more than three live neighbors dies, as if by overpopulation, any live cell with fewer than two live neighbors dies, as if by under population.
                if (!g[i][j] && count === 3) g2[i][j] = true; //Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
            }
        }
        this.setState({
            gridFull: g2,
            generation: this.state.generation + 1
        });


    };

    componentDidMount() {
        this.seed(); //seed cells in random places
        this.playButton();


    }

    render () {

        return (

            <div>
                <h1>THE GAME <span>OF</span> LIFE</h1>
                <Buttons
                    playButton={this.playButton}
                    pauseButton={this.pauseButton}
                    slow={this.slow}
                    fast={this.fast}
                    clear={this.clear}
                    seed={this.seed}

                    />

                <Grid
                    gridFull={this.state.gridFull}
                    rows ={this.rows}
                    columns = {this.columns}
                    selectBox = {this.selectBox}
                />
                <h2>GENERATIONS: {this.state.generation}</h2>

            </div>

        );
    }
}

function arrayClone(arr){

    return JSON.parse(JSON.stringify(arr))

}

document.addEventListener("DOMContentLoaded", function(){

    ReactDOM.render(
        <Main />,
        document.querySelector('#app')
    )
});