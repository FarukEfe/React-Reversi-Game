import React from 'react'
import ReactDOM from 'react-dom'
import Master from './components/gameComponent'
import './index.css'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            gameOn: false,
            gameMode: null,
            player: null
        }
    }

    childCallback(newVal){
        this.setState({
            gameMode: newVal
        })
    }

    displayPlayerSelect(){
        return <div id="player-selection">
                <h1 className="neon">Choose Player:</h1>
                    <div>
                        <span width="100" height="100" onClick={()=>{
                            this.setState({
                                player: "black"
                            })
                        }}>Black</span>
                        <span>/</span>
                        <span width="100" height="100" onClick={()=>{
                            this.setState({
                                player: "white"
                            })
                        }}>White</span>
                    </div>
                </div>
    }

    returnGameBoard(){
        return <Master gameMode={this.state.gameMode} ourPlayer={(this.state.gameMode !== "2-Player") ? this.state.player : "undef"} dataToParent={(data)=>{this.childCallback(data)}} />
    }

    displayContent(){
        if ((this.state.gameMode && this.state.player) || (this.state.gameMode === '2-Player')) {
            return <>
                {this.returnGameBoard()}
            </>
        } else if (!this.state.gameMode) {
            return <div id="main-menu">
                <h1 id="main-title" className="neon">Reversi</h1>
                <div id="button-container">
                    <button onClick={()=>{this.setGameMode("2-Player")}}>2 Player</button>
                    <button onClick={()=>{this.setGameMode("AI-Easy")}}>AI(Easy)</button>
                    <button onClick={()=>{this.setGameMode("AI-Medium")}}>AI(Medium)</button>
                    <button onClick={()=>{this.setGameMode("AI-Hard")}}>AI(Hard)</button>
                </div>
            </div>
        } else {
            return <>
            {this.displayPlayerSelect()}
            </>
        }
        //2-Player, AI-Easy, AI-Medium, AI-Hard
    }

    setGameMode(mode){
        this.setState({
            gameMode: mode,
        })
    }

    render() {
        return (
            <div id="page-container">
                {this.displayContent()}
            </div>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);

/*
What to contain:
- Game Documentation
- What is Reversi/Othello
- Local Game Mode (2 Players) Game Scene
- Leaderboard
- Online Game(?)

For Documentation & How to Play Pages:
- Documentation & About the Game: http://www.flyordie.com/games/help/reversi/en/games_rules_reversi.html
- Strategies & Tactics: https://www.coolmathgames.com/blog/how-to-play-reversi-basics-and-best-strategies
*/

