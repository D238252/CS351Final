/*
	TODO: Fill out information panel
		- Have buttons reveal information about each page upon pressing
		- Use html buttons for Index page
		- Have paragraph on page introducing project
*/

var info_text = "The Information page should provide you with data about the Sudoku game's code.\n";
info_text += "Each Tab will display a description of applicable section";

var game_text = "The Sudoku page should allow you to play one of ten sudoku puzzles\n";
game_text += "Rules: Each Row, Column, and 3 by 3 cage can only have a single instance of the integers 1 through 9.\n";
game_text += " You should also be able to see the solution with the Solve Button and Switch between a light and dark mode."

function infoClick(){
	document.getElementById("info-panel").innerText = info_text;
}

function gameClick(){
	document.getElementById("info-panel").innerText = game_text;
}