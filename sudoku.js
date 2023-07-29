
/*

Things to Add:
1. 10 puzzles to do, and way to swap between them
2. Gradient Background w/ light and dark?

*/
//var check = 0;

var numSelected = null;
var tileSelected = null;

var numLocations = [];

var count = 0;
const FULL = 81;

var errors = 10;

var INDEX = 0;
var boards = ["--8-42----2------74--3----6-43-5------5---8----2-1-47-8----7--45------1----1687--",
			  "492------6---3--95-8-6----------5--8-5684927-9--3----------3-2-72--8---9------647",
			  "-4---3695-1--2--8-----8-7----35--4--6-------9--7--48----1-9-----7--5--1-2698---7-",
			  "92-58-----5---7---74-21------93---2---5-2-3---7---15------94-31---7---9-----53-64",
			  "4-51----3-6---781--3---5--6------1--9-4-3-5-7--2------8--5---7--219---8-6----23-1",
			  "89-2-----2---148--1-5---4-------7---7-16-35-2---8-------2---1-4--349---8-----2-76",
			  "--5-8----6972-3---3--56--9----8--6-9---------8-2--4----5--41--7---6-8324----3-9--",
			  "-5--34--1-4-------1-3--94----23-5----3--4--8----8-75----92--3-5-------6-8--97--1-",
			  "-5--73-4-71-9----64-----8---2--6-7-5----3----1-7-9--3---1-----29----2-78-6-84--9-",
			  "--1---9--74---3---5-917-3---1---62---7--8--1---62---4---2-394-1---5---89--5---7--",
			  "--8--42-6-----7-----76------24-9---5-59-7-34-1---8-92------28-----1-----2-69--4--"];
var solution = [];

const bgColors = ["#B2FFFF","#0039a6"];

window.onload = function(){
	setGame();
}

// Convert between Index and Coordinates
function ctoi(row, col){
	return row * 9 + col;
}
function itoc(index){
	return {row: Math.floor(index/9), col: index % 9};
}

function setGame(){

	document.getElementById("left-site").classList.add("light-bg");
	document.getElementById("right-site").classList.add("light-bg");
	//Digit Buttons
	for(let i = 1; i < 10; i++){
		numLocations.push([]);
		//<div id = "i" class="number">i</div>
		let number = document.createElement('div');
		number.id = i;
		number.innerText = i;
		number.addEventListener("click",selectNumber);
		number.classList.add("number");
		number.classList.add("light-bg");
		document.getElementById("digits").appendChild(number);
	}

	//Board
	let board = boards[INDEX];
	for(let r = 0; r < 9; r++){
		for(let c = 0; c < 9; c++){
			let tile = document.createElement('div');
			tile.id = r.toString() + "-" + c.toString();
			let x = board[ctoi(r,c)];
			if(board[ctoi(r,c)] != "-"){
				numLocations[Number(x) - 1].push(tile.id);
				tile.innerText = x;
				count += 1;
			}

			if(r == 2 || r == 5){
				tile.classList.add("horizontal-line");
			}

			if(c == 2 || c == 5){
				tile.classList.add("vertical-line");
			}

			tile.addEventListener("click",selectTile);
			tile.classList.add("tile");
			tile.classList.add("light-bg");
			document.getElementById("board").append(tile);
		}
	}

	solveBoard();
	swapMode();
	document.getElementById("solve-button").addEventListener("click",showSolution);
	document.getElementById("view-mode").addEventListener("click",swapMode);
	document.getElementById("next-game").addEventListener("click",nextGame);
}


//Game Play Buttons
function selectNumber(){
	if(numSelected != null){
		if(lightMode){
			bg = bgColors[0];
		}else{
			bg = bgColors[1];
		}
		for(let i of numLocations[parseInt(numSelected.id)-1]){
			document.getElementById(i).style.backgroundColor = bg;
		}
		if(numSelected.classList.contains("light-bg")){
			numSelected.style.backgroundColor = bg;
		}
	}
	numSelected = this;
	this.style.backgroundColor = "rgba(154,205,50,0.5)";
	//numSelected.classList.add("number-selected");

	for(let i of numLocations[parseInt(this.id)-1]){
		document.getElementById(i).style.backgroundColor = "rgba(154,205,50,0.5)";
	}

}

function selectTile(){
	
	if(numSelected){
		
		if(this.innerText != ""){
			return;
		}
		//this.innerText = numSelected.id;

		let coords = this.id.split("-");
		let r = parseInt(coords[0]);
		let c = parseInt(coords[1]);

		if(solution[ctoi(r,c)] == numSelected.id){
			this.innerText = numSelected.id;
			x = Number(numSelected.id) - 1;


			numLocations[x].push(this.id);

			this.style.backgroundColor = "rgba(154,205,50,0.5)";

			count += 1;
			
			if(numLocations[x].length > 8){
				//for(let i of numLocations[parseInt(numSelected.id)-1]){
				//	document.getElementById(i).classList.remove("tile-start");
				//}
				numSelected.removeEventListener("click",selectNumber);
				numSelected.classList.remove("number-selected");
				numSelected.classList.remove("light-bg");
				numSelected.classList.add("number-finished");
				numSelected.style.backgroundColor = null;

				//numSelected = null;
				
			}
			
			if(count > 80){
				document.getElementById("errors").innerText = "You Win!";
				document.getElementById("board").classList.add("board-victory");
			}
		}else{
			errors -= 1;
			document.getElementById("errors").innerText = "Error Chances: " +  errors.toString();
			if(errors < 1){
				document.getElementById("errors").innerText = "You Lost";
				for(let i=1;i<10;i++){
					n = document.getElementById(i.toString());
					n.removeEventListener("click",selectNumber);
				}
				numSelected = null;
				for(let e of document.getElementsByClassName("tile")){
					e.style.backgroundColor = null;
				}
				document.getElementById("board").classList.add("board-loss");
			}
		}

	}
}

// Solve the Board 
function solveBoard(){
	solution = [];
	for(let i of boards[INDEX]){
		if(i == "-")
			solution.push(0);
		else
			solution.push(parseInt(i));
	}
	
	if(solve(solution)){
		console.log("success")

	}else
		console.log("Failure");
}

function solve(board){
	let {index, moves} = optimum(board);
	if(index == null)
		return true;
	for(let m of moves){
		board[index] = m;
		if(solve(board))
			return true;
	}
	board[index] = 0;
	return false;
}

function optimum(board){
	let index, moves, bestLen = 100;
	for(let i = 0; i < 81; i++){
		if(!board[i]){
			let m = getPossible(board,i);
			if(m.length < bestLen){
				bestLen = m.length;
				moves = m;
				index = i;
				if(bestLen < 1)
					break;
			}
		}
	}
	return {index, moves};
}

function getPossible(board, index){
	let choices = [];
	
	for(let value = 1; value <=9; ++value){
		if(verifyNum(board,index,value)){
			choices.push(value);
		}
	}
	
	return choices;
}
function verifyNum(board, index, value){
	let {row, col} = itoc(index);

	for(let i = 0; i < 9; ++i){
		if(board[ctoi(i,col)] == value.toString()){
			return false;
		}
		if(board[ctoi(row,i)] == value.toString()){
			return false;
		}

	}
	let r1 = Math.floor(row/3) * 3;
	let c1 = Math.floor(col/3) * 3;
	for (let r = r1; r < r1 + 3; r++){
		for(let c = c1; c < c1 + 3; c++){
			if(board[ctoi(r,c)] == value){
				//console.log(board[ctoi])
				return false;
			}
		}
	}
	return true;
}

function nextGame(){
	INDEX += 1;
	if(INDEX > 9){
		INDEX = 0;
	}

	errors = 10;
	count = 0;
	numLocations = [];
	numSelected = null;
    tileSelected = null;

    let board = boards[INDEX];

    for(let r = 0; r < 9; r++){
    	for(let c = 0; c < 9; c++){
    		x = board[ctoi(r,c)];
    		if(x == "-"){
    			document.getElementById(r.toString()+"-"+c.toString()).innerText = " ";
    		}else{
    			document.getElementById(r.toString()+"-"+c.toString()).innerText = board[ctoi(r,c)];
    		}
    		
    	}
    }

    solveBoard();


}


// Show Solution Button
var solution_Shown = false;

function showSolution(){
	if (!solution_Shown){
		for(let r = 0; r < 9; r++){
			for(let c = 0; c < 9; c++){
				document.getElementById(r.toString()+"-"+c.toString()).innerText = solution[ctoi(r,c)];
			}
		}
		
	}else{
		for(let r = 0; r < 9; r++){
			for(let c = 0; c < 9; c++){
				x = boards[INDEX][ctoi(r,c)];
				if(x == "-"){
					document.getElementById(r.toString()+"-"+c.toString()).innerText = " ";
				}else{
					document.getElementById(r.toString()+"-"+c.toString()).innerText = x;
				}
				
			}
		}
	}
	solution_Shown = !solution_Shown;
}

// Light and Dark Mode
var lightMode = false;
function swapMode(){
	if(lightMode){
		document.body.style.backgroundColor = "#00008B";
		document.getElementById("view-mode").innerText = "Switch to Light";
		document.getElementById("title-card").style.color = "#B2FFFF";
		for(let e of document.getElementsByClassName("light-bg")){
			e.style.backgroundColor= "#0039a6";
			e.style.color= "#B2FFFF";
		}
	}else{
		document.body.style.backgroundColor = "#66d3fa";
		document.getElementById("view-mode").innerText = "Switch to Dark";
		document.getElementById("title-card").style.color = "black";
		for(let e of document.getElementsByClassName("light-bg")){
			e.style.backgroundColor= "#B2FFFF";
			e.style.color= "black";
		}
	}
	lightMode = !lightMode;
}