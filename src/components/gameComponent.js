import React,{ useEffect, useState, useMemo } from 'react'
import '../styles/gameComponent.css'
import stone_white from '../images/stone_white.svg'
import stone_black from '../images/stone_black.svg'
import placeholder_stone from '../images/placeholder_stone.svg'

function Square(props) {
    // Elements that will display the game stones
    var srcToDisplay = ""
    if (props.value === "white") {
        srcToDisplay = stone_white
    } else if (props.value === "black") {
        srcToDisplay = stone_black
    } else if (props.value === "valid") {
        srcToDisplay = placeholder_stone
    } else {
        srcToDisplay = null
    }

    function callImg() {
        if (srcToDisplay) {return <img src={srcToDisplay} alt="" />}
        else {return}
    }

    return (
        <button
        className="squares"
        onClick={props.onClick}>
        {callImg()}
        </button>
    )
}

class GameBoard extends React.Component {
    // The component that will render the squares and maintain them
    renderSquares(rowNumber) {
        const displaySquares = []
        for (let i=1;i<9;i++) {
            const keyVal = 8 * rowNumber + i
            const val = this.props.squares[rowNumber][i - 1]
            const square = <Square key={keyVal} value={val}
            onClick={()=>{this.props.onClick(rowNumber,i - 1)}}/>
            displaySquares.push(square)
        }
        return displaySquares
    }
    
    renderRows() {
        const displayRows = []
        for (let cr=0;cr<8;cr++) {
            const row = <div key={`row${cr}`} className="board-row">{this.renderSquares(cr)}</div>
            displayRows.push(row)
        }
        return displayRows
    }

    render() {
        return (
            <div id="board-container">
                <div id="boundary-setter">
                    {this.renderRows()}
                </div>
            </div>
        )
    }
}


export default function Master(props) {
    // This is the component that displays the scene, stores the data and distributes it
    // The Game Data Comes Here
    const gameMode = props.gameMode
    const ourPlayer = props.ourPlayer
    const [history, setHistory] = useState(
        [[
            Array(8).fill(null),
            Array(8).fill(null),
            [null,null,null,null,'valid',null,null,null],
            [null,null,null,'black','white','valid',null,null],
            [null,null,'valid','white','black',null,null,null],
            [null,null,null,'valid',null,null,null,null],
            Array(8).fill(null),
            Array(8).fill(null)
    ]])
    const [blackStones, setBlackStones] = useState(2)
    const [whiteStones, setWhiteStones] = useState(2)
    const [stepNumber, setStepNumber] = useState(0)
    const [blackIsNext, setBlackIsNext] = useState(true)
    const [winner, setWinner] = useState(null)
    const [playAgain, setPlayAgain] = useState(0)
    const [inspection, setInspection] = useState(false)

    // Returns Empty Spaces
    function checkEmptySpaces(hist=history[history.length - 1].slice()){
        const squares = hist;

        // Get all the empty spaces
        const emptySpaces  = []

        for (var row=0;row<squares.length;row++) {
            for (var col=0;col<squares[row].length;col++) {
                if (!squares[row][col] || squares[row][col] === "valid") {
                    emptySpaces.push([row,col])
                }
            }
        }
    
        return emptySpaces
    }

    // Returns Playable Squares(Sort of)
    function checkElementsAround(spaces, hist=history[history.length - 1].slice()){
        const squares = hist;

        const emptySpaces = spaces
        const cordAndDirs = []

        // Get the directions of the elements(don't even add if there's no element near it)
        for (var sp=0;sp<emptySpaces.length;sp++) {
            const element = emptySpaces[sp]
            const elObject = {
                coordinates: element,
                directions: []
            }
                
            // You apply the same methods for all the other squares here (can't use constant numbers in 'squares' now...)
            const crdsY = emptySpaces[sp][0]
            const crdsX = emptySpaces[sp][1]
            var i;
            //Check up
            if (crdsY !== 0 && squares[crdsY - 1][crdsX]) {
                const upEls = []
                i = 1
                while (crdsY - i >= 0) {
                    upEls.push([crdsY - i,crdsX])
                    i++;
                }
                elObject.directions.push(upEls)
            }

            // Check up right
            if (crdsX !== 7 && crdsY !== 0 && squares[crdsY - 1][crdsX + 1]) {
                const urEls = []
                i = 1
                while (crdsY - i >= 0 && crdsX + i <= 7) {
                    urEls.push([crdsY - i,crdsX + i])
                    i++;
                }
                elObject.directions.push(urEls)
            }
            // Check right
            if (crdsX !== 7 && squares[crdsY][crdsX + 1]) {
                const rightEls = []
                i = 1
                while (crdsX + i <= 7) {
                    rightEls.push([crdsY,crdsX + i])
                    i++;
                }
                    elObject.directions.push(rightEls)
            }
            // Check down right
            if (crdsX !== 7 && crdsY !== 7 && squares[crdsY + 1][crdsX + 1]) {
                const rightEls = []
                i = 1
                while (crdsY + i <= 7 && crdsX + i <= 7) {
                    rightEls.push([crdsY + i,crdsX + i])
                    i++;
                }
                elObject.directions.push(rightEls)
            }
            // Check down
            if (crdsY !== 7 && squares[crdsY + 1][crdsX]) {
                const rightEls = []
                i = 1
                while (crdsY + i <= 7) {
                    rightEls.push([crdsY + i,crdsX])
                    i++;
                }
                elObject.directions.push(rightEls)
            }
            // Check down left
            if (crdsY !== 7 && crdsX !== 0 && squares[crdsY + 1][crdsX - 1]) {
                const rightEls = []
                i = 1
                while (crdsY + i <= 7 && crdsX - i >= 0) {
                    rightEls.push([crdsY + i,crdsX - i])
                    i++;
                }
                elObject.directions.push(rightEls)
            }
            // Check left
            if (crdsX !== 0 && squares[crdsY][crdsX - 1]) {
                const rightEls = []
                i = 1
                while (crdsX - i >= 0) {
                    rightEls.push([crdsY,crdsX - i])
                    i++;
                }
                elObject.directions.push(rightEls)
            }
            // Check up left
            if (crdsX !== 0 && crdsY !== 0 && squares[crdsY  - 1][crdsX - 1]) {
                const rightEls = []
                i = 1
                while (crdsY - i >= 0 && crdsX - i >= 0) {
                    rightEls.push([crdsY - i,crdsX - i])
                    i++;
                }
                elObject.directions.push(rightEls)
            }
            

            if (elObject.directions.length !== 0) {
                cordAndDirs.push(elObject)
            }
        }

        // You'll switch the state of all the other elements according to the move here
        // Figure out something by the help of this youtube video: https://www.youtube.com/watch?v=7zkl31VtHG4
        // Don't forget, this should be executed before onClick happens.

        return cordAndDirs
    }

    // Returns Stones To Turn With A Move
    function checkTurningStones(directions, isBlack=blackIsNext, hist=history[history.length - 1].slice()){
        const squares = hist;
        /*
        How you should return your data?
        [[[row,col],[row,col],[row,col]],etc.]
        */
        var ourElem = (isBlack) ? "black" : "white"
        var opponent = (!isBlack) ? "black" : "white"
        
        // Array to return the elements that'll change state
        let changingState = []

        for (var d=0;d<directions.length;d++) {
            const corBase = directions[d]
            let dirEls = []
            for (var elcrd=0;elcrd<corBase.length;elcrd++) {
                const currentCoords = corBase[elcrd]
                const currentElem = squares[currentCoords[0]][currentCoords[1]]
                if (currentElem === opponent && elcrd !== corBase.length - 1) {
                    dirEls.push([currentCoords[0],currentCoords[1]])
                } else {
                    if (currentElem !== ourElem) {
                        dirEls = []
                    }
                    break
                }
            }
            if (dirEls.length !== 0) {
                changingState = changingState.concat(dirEls)
            }
        }
        return changingState
    }

    // Valid Moves Evaluation
    function checkSquaresForSides(squares=history[history.length - 1].slice()){
        const valids = checkElementsAround(checkEmptySpaces(squares),squares)
        let movesAvailable = [[],[]]
    
        for (var t=0;t<2;t++) {
            const isBlack = (t === 0) ? true : false
            for (var v=0;v<valids.length;v++) {
                const valid = valids[v]
                const turned = checkTurningStones(valid.directions, isBlack, squares)
                if (turned.length !== 0) {
                    movesAvailable[t].push({coordinates: valid.coordinates, turned: turned});
                }
            }
        }
        return movesAvailable
    }

    // Player Move - Perform
    function handleMove(cords, squares=history[history.length - 1].slice(), color=blackIsNext ? "black" : "white",returnHist=true,validAllowed=true){
        const hist = removeValids()
        // You'll return if the game is already over or the value of the square is NOT null
        if (winner) {
            return
        }
        // Handle the recently made move here
        // Remove the previous valid stones in the array
        // Handle click
        const nextSquares = squares.map((row, y) =>
            row.map((square, x) =>
                cords.some((cord) => cord[0] === y && cord[1] === x) ? color : square
            )
        );

        let squaresWithValids = nextSquares.map((row, _) =>
            row.map((square, _) =>
                (square === "valid") ? null : square
            )
        );

        const movesAvailable = checkSquaresForSides(squaresWithValids)

        var isBlack = null
        if (movesAvailable[0].length === 0) {
            isBlack = false
        } else if (movesAvailable[1].length === 0){
            isBlack = true
        } else {
            isBlack = !blackIsNext
        }

        if (validAllowed && ((ourPlayer === 'white' && !isBlack) || (ourPlayer === 'black' && isBlack) || gameMode === '2-Player')) {
            //// Valid Square Handling
            const elemsToCheck = checkElementsAround(checkEmptySpaces(squaresWithValids),squaresWithValids)
            const validCoords = []
            for (var el=0;el<elemsToCheck.length;el++) {
                const elem = elemsToCheck[el]
                const stonesT = checkTurningStones(elem.directions, isBlack, squaresWithValids)
                if (stonesT.length !== 0) {
                    validCoords.push(elem.coordinates)
                }
            }
            squaresWithValids = squaresWithValids.map((row, y) =>
                row.map((square, x) =>
                    validCoords.some((cord) => cord[0] === y && cord[1] === x && cord) ? "valid" : square
                )
            );
            ////
        }
        if (returnHist) {
            const newHist = hist.concat([squaresWithValids])
            return newHist
        } else {
            return nextSquares
        }
    }

    // AI Easy - Perform(Random)
    function easyAI(){
        const elemsAI = checkElementsAround(checkEmptySpaces())
        const validsAI = []
        for (let elAI=0;elAI<elemsAI.length;elAI++) {
            const turningAI = checkTurningStones(elemsAI[elAI].directions, blackIsNext)
            if (turningAI.length !== 0) {
                validsAI.push(elemsAI[elAI])
            }
        }
        if (validsAI.length !== 0) {
            var elementToTurnAI = null
            try{
                elementToTurnAI = validsAI[Math.floor(Math.random()*validsAI.length)]
            } catch {
                console.log(null)
            }
            const turningAI = checkTurningStones(elementToTurnAI.directions)
            const selfAI = elementToTurnAI.coordinates
            turningAI.unshift([selfAI[0],selfAI[1]])
            const upcomingAI = handleMove(turningAI)
            setHistory(upcomingAI)
            setStepNumber(upcomingAI.length - 1)
        }
    }

    // AI Medium - Return Maximizer
    function maximizerAI(){
        // Re-construct the board with minimax evaluation values
        const sq_val = [
            [120, -20,  20,   5,   5,  20, -20, 120],
            [-20, -40,  -5,  -5,  -5,  -5, -40, -20],
            [20,  -5,  15,   3,   3,  15,  -5,  20],
            [5,  -5,   3,   3,   3,   3,  -5,   5],
            [5,  -5,   3,   3,   3,   3,  -5,   5],
            [20,  -5,  15,   3,   3,  15,  -5,  20], 
            [-20, -40,  -5,  -5,  -5,  -5, -40, -20],   
            [120, -20,  20,   5,   5,  20, -20, 120],
        ]
        const options = checkElementsAround(checkEmptySpaces())
        // Return coordinates value of options
        const evaluating = options.map(x=>{
            return x.coordinates
        })
        let highestVal = -100
        var selected = null
        for (var val=0;val<evaluating.length;val++) {
            const no_playable = (checkTurningStones(options[val].directions).length === 0)
            if (no_playable) {
                continue
            }
            for (var row=0;row<8;row++) {
                for (var col=0;col<8;col++) {
                    const currentVal = sq_val[row][col]
                    if (row === evaluating[val][0] && col === evaluating[val][1] && currentVal > highestVal) {
                        highestVal = currentVal
                        selected = options[val]
                    }
                }
            }
        }
        var turningAI = []
        try {
            turningAI = checkTurningStones(selected.directions)
            turningAI.unshift(selected.coordinates)
        } catch {
            console.log('Error check')
        }
        const upcomingAI = handleMove(turningAI)
        setHistory(upcomingAI)
        setStepNumber(upcomingAI.length - 1)
    }

    function minimax(board, depth, isMaximizing) {
        const AI = (ourPlayer === "white") ? "black" : "white"
        const stones = setStoneCount(board)
        /*
        let indent = ''
        for (var i=0;i<depth;i++) {
            indent += "                "
        }
        */
        //console.log(indent + `${isMaximizing}`)
        if (stones[0] === 0 || stones[1] === 0 || stones[0] + stones[1] === 64) {
            // Return the score of the move if the game is over
            let score = (stones[(AI === "black") ? 1 : 0] === 0) ? Infinity : (stones[stones[0] === stones[1]]) ? 0 : -Infinity
            //console.log(score)
            //console.log(indent + `${score}`)
            return score
        } else if (depth === 0) {
            let score = 0
            const sq_val = [
                [250, -20,  20,   5,   5,  20, -20, 250],
                [-20, -40,  -5,  -5,  -5,  -5, -40, -20],
                [20,  -5,  15,   3,   3,  15,  -5,  20],
                [5,  -5,   3,   3,   3,   3,  -5,   5],
                [5,  -5,   3,   3,   3,   3,  -5,   5],
                [20,  -5,  15,   3,   3,  15,  -5,  20], 
                [-20, -40,  -5,  -5,  -5,  -5, -40, -20],   
                [250, -20,  20,   5,   5,  20, -20, 250]
            ]

            for (var row=0;row<8;row++) {
                for (var col=0;col<8;col++) {
                    if (board[row][col] === AI) {
                        score += sq_val[row][col]
                    } else if (board[row][col] === ourPlayer) {
                        score -= sq_val[row][col]
                    }
                }
            }
            //console.log(indent + `${score}`)
            return score
        }
        if (isMaximizing) {
            let alphaVal = null
            // Perform minimax if depth !== 0 and isMaximizing
            // Declare bestScore for minimizing player
            let bestScore = -Infinity
            const AIValidMoves = checkSquaresForSides()[(AI === "black") ? 0 : 1 ] // AI Moves because isMaximizing = true
            for (var AIMove=0;AIMove<AIValidMoves.length;AIMove++){
                const crds = AIValidMoves[AIMove].turned
                crds.unshift(AIValidMoves[AIMove].coordinates)
                const newBoard = handleMove(crds,board,AI,false,false)
                // check for isMaximizing
                let maximizingNext = !isMaximizing
                
                const available = checkSquaresForSides(newBoard)
                if (available[0].length === 0) {
                    if (AI === "white") {
                        maximizingNext = true
                    } else {
                        maximizingNext = false
                    }
                } else if (available[1].length === 0){
                    if (AI === "black") {
                        maximizingNext = true
                    } else {
                        maximizingNext = false
                    }
                }

                const score = minimax(newBoard,depth - 1,maximizingNext)

                // Prune to save efficiency
                if (alphaVal && alphaVal > score) {
                    break
                }

                // Depth - 1 so it comes down to 0, the root of the algorithm tree
                if (score > bestScore) {
                    bestScore = score
                    alphaVal = score
                }
            }
            //console.log(indent + `${bestScore}`)
            return bestScore
        } else {
            let betaVal = null
            // Perform minimax if depth !== 0 and isMaximizing
            // Declare bestScore for minimizing player
            let bestScore = Infinity
            const PlayerValidMoves = checkSquaresForSides()[(AI === "black") ? 1 : 0 ] // Player Moves because isMaximizing = false
            for (var playerMove=0;playerMove<PlayerValidMoves.length;playerMove++) {
                const crds = PlayerValidMoves[playerMove].turned
                crds.unshift(PlayerValidMoves[playerMove].coordinates)
                const newBoard = handleMove(crds,board,ourPlayer,false,false)
                // check for isMaximizing
                let maximizingNext = !isMaximizing
                const available = checkSquaresForSides(newBoard)
                if (available[0].length === 0) {
                    if (AI === "white") {
                        maximizingNext = true
                    } else {
                        maximizingNext = false
                    }
                } else if (available[1].length === 0){
                    if (AI === "black") {
                        maximizingNext = true
                    } else {
                        maximizingNext = false
                    }
                }
                
                const score = minimax(newBoard,depth - 1,maximizingNext)

                // Prune to save efficiency
                if (betaVal && betaVal < score) {
                    break
                }

                if (score < bestScore) {
                    bestScore = score
                    betaVal = score
                }
            }
            //console.log(indent + `${bestScore}`)
            return bestScore
        }
    }

    // AI Hard - Return Minimax
    function minimaxAI(){
        const AI = (ourPlayer === "white") ? "black" : "white"
        const squares = history[history.length - 1].slice()

        let bestScore = -Infinity
        let bestMove = null
        // Perform minimax algorithm for each valid move and pick the best score
        const AIValidMoves = checkSquaresForSides()[(ourPlayer === "white") ? 0 : 1 ]

        let depthFactor = 6
        if (AIValidMoves.length >= 6) {
            depthFactor = 4
        }
        for (var AIMove=0;AIMove<AIValidMoves.length;AIMove++){
            const crds = AIValidMoves[AIMove].turned
            crds.unshift(AIValidMoves[AIMove].coordinates)
            const newBoard = handleMove(crds, squares,AI,false,false)
            const score = minimax(newBoard,depthFactor,false)
            if (score > bestScore || AIMove === 0) {
                bestScore = score
                bestMove = crds
            }
        }
        console.log('Final Value:')
        console.log(bestScore)
        const upcomingAI = handleMove(bestMove)
        setHistory(upcomingAI)
        setStepNumber(upcomingAI.length - 1)
    }

    // Set Stone Count Data
    function setStoneCount(squares){
        let blackSquares = 0
        let whiteSquares = 0
        // Check for a winner
        for (var row=0;row<squares.length;row++) {
            for (var col=0;col<squares[row].length;col++) {
                if (squares[row][col] === 'black') {
                    blackSquares++
                } else if (squares[row][col] === 'white') {
                    whiteSquares++
                }
            }
        }
        return [blackSquares,whiteSquares]
    }

    // Set Game Data
    function setWinnerAndTurn(isTest=false,squares=history[history.length - 1].slice()){
        const countData = setStoneCount(squares)
        const blackSquares = countData[0]
        const whiteSquares = countData[1]
        setBlackStones(blackSquares)
        setWhiteStones(whiteSquares)

        // Debug
        const totalSq = squares.length * squares[0].length
        var returnVal = null
        if (blackSquares + whiteSquares === totalSq || blackSquares === 0 || whiteSquares === 0) {
            // Declare a winner
            if (blackSquares !== whiteSquares) {
                if (gameMode === '2-Player') {
                    returnVal = (blackSquares > whiteSquares) ? 'BLACK' : 'WHITE'
                } else {
                    const isBlack = (ourPlayer === "black") ? true : false
                    if (isBlack) {
                        returnVal = (blackSquares > whiteSquares) ? 'YOU' : 'AI'
                    } else {
                        returnVal = (blackSquares > whiteSquares) ? 'AI' : 'YOU'
                    }
                }
            } else {
                returnVal = "TIE"
            }
        } else {
            const movesAvailable = checkSquaresForSides()

            // Change turn
            if (movesAvailable[0].length === 0) {
                returnVal = false
            } else if (movesAvailable[1].length === 0){
                returnVal = true
            } else {
                returnVal = !blackIsNext
            }
        }

        if (!isTest && typeof returnVal === "string") {
            setWinner(returnVal)
        } else if (!isTest) {
            setBlackIsNext(returnVal)
        } else {
            return returnVal
        }
    }

    // Remove Valid Images When The Game Is Over
    function removeValids(){
        const hist = history.slice()
        const newHist = []
        for (var h=0;h<hist.length;h++) {
            let squaresWithValids = hist[h].map((row, _) =>
                row.map((square, _) =>
                    (square === "valid") ? null : square
                )
            );
            newHist.push(squaresWithValids)
        }
        //console.log(newHist)
        
        return newHist
        
    }

    // Flick Through The Game
    function jumpTo(step){
        const squares = [...history][step].slice()
        const countData = setStoneCount(squares)
        const blackSquares = countData[0]
        const whiteSquares = countData[1]
        setBlackIsNext((step % 2) === 0)
        setStepNumber(step)
        setBlackStones(blackSquares)
        setWhiteStones(whiteSquares)
    }

    // Display Winner or Player Turn
    function displayWinnerAndTurn(){
        if (gameMode === '2-Player') {
            return <div className="turn-win">{(!winner) ? "PLAYER TURN: " + `${(blackIsNext) ? 'BLACK' : 'WHITE'}` : 'WINNER: ' + winner}<span></span></div>
        } else {
            const isBlack = (ourPlayer === "black") ? true : false
            return <div className={`turn-win ${(blackIsNext === isBlack) ? null : "animating"}`}>{(!winner) ? "PLAYER TURN: " + `${(blackIsNext === isBlack) ? 'YOU' : 'AI'}` : 'WINNER: ' + winner}</div>
        }
    }

    // Global - Display Moves Input Section
    function displayMoves(){
        if (inspection) {
            return <div id="moves-container">GO TO:<input id="move-menu" type="number" min="0" max="60" onClick={(event) => event.preventDefault()} onKeyDown={(event) => event.preventDefault()} value={stepNumber} onChange={event=>{
                    const newVal = (event.target.value <= history.length - 1) ? ((event.target.value) ? event.target.value : 0) : history.length - 1
                    jumpTo(newVal)
                }} />
            </div>
        } else {
            return null
        }
    }

    // Global - Display Number of Stones of each Players
    function displayStoneCount(){
        return <ul id="stones-counter">
            <li><img src={stone_black} width="100" height="100" alt="" />{blackStones}</li>
            <li><img src={stone_white} width="100" height="100" alt="" />{whiteStones}</li>
        </ul>
    }

    // Global - Update The Game Board
    // datas that will be rendered regularly come here
    const current = history[stepNumber]

    useMemo(()=>{
        if (playAgain === 1) {
            setHistory(
                [[
                    Array(8).fill(null),
                    Array(8).fill(null),
                    [null,null,null,null,'valid',null,null,null],
                    [null,null,null,'black','white','valid',null,null],
                    [null,null,'valid','white','black',null,null,null],
                    [null,null,null,'valid',null,null,null,null],
                    Array(8).fill(null),
                    Array(8).fill(null)
            ]])
            setBlackStones(2)
            setWhiteStones(2)
            setStepNumber(0)
            setBlackIsNext(true)
            setWinner(null)
            setPlayAgain(0)
            setInspection(false)
            
            // Set synchronous timeout
            const date = Date.now()
            var millis = 0
            while (millis < 1) {
                const newDate = Date.now()
                millis = newDate - date
            }
        }
    },[playAgain])
    
    useEffect(()=>{
        if (((ourPlayer === 'white' && blackIsNext) || (ourPlayer === 'black' && !blackIsNext)) && !winner) {
            setTimeout(()=>{
                if (gameMode === "AI-Easy") {
                    easyAI()
                } else if (gameMode === "AI-Medium") {    
                    maximizerAI()
                } else if (gameMode === "AI-Hard") {
                    minimaxAI()
                }
            }, 1500)
        }
    },[stepNumber])
    
    useMemo(()=>{
        if (history.length !== 1 && !winner) {
            setWinnerAndTurn()
        }
    },[stepNumber])

    // Return the game scene here
    return (
        <>
            <div id="topRight-bar">
                <button onClick={()=>{props.dataToParent(null)}}>X</button>
                <button onClick={()=>{setPlayAgain(1)}}>R</button>
            </div>
            <div id="reducing-size">
                <div id="gameboard-container">
                    <GameBoard squares={current} onClick={(row,col) => {
                        //console.log(this.state.stepNumber)
                        const turnColor = (blackIsNext) ? 'black' : 'white'
                        if (!winner && (turnColor === ourPlayer || gameMode === '2-Player')) {
                            const elems = checkElementsAround(checkEmptySpaces())
                            for (let el=0;el<elems.length;el++) {
                                const turning = checkTurningStones(elems[el].directions)
                                if (turning.length !== 0) {
                                    turning.unshift([row,col])
                                    if (row === elems[el].coordinates[0] && col === elems[el].coordinates[1]) {
                                        const upcoming = handleMove(turning)
                                        setHistory(upcoming)
                                        setStepNumber(upcoming.length - 1)
                                        break
                                    }
                                }                        
                            }
                        }
                    }}/>
                    {(!winner || inspection) ? displayWinnerAndTurn() : null}
                </div>
                <div id="side-menu">
                    {displayMoves()}
                    {displayStoneCount()}
                </div>
            </div>
            <div id="gameOver" className={(winner && !inspection) ? "open" : ""}>
                <div>
                    <h1>{"WINNER: " + `${winner}`}</h1>
                    <div>
                        <div className="flex-item"><button onClick={()=>{props.dataToParent(null)}}>Main Menu</button></div>
                        <div className="flex-item"><button onClick={()=>{setPlayAgain(1)}}>Play Again</button></div>
                        <div className="flex-item"><button onClick={()=>{setInspection(true)}}>Inspect</button></div>
                    </div>
                </div>
            </div>
        </>
    )
}

