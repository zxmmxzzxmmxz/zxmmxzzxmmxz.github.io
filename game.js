dead = 'white'
alive = 'black'
rectSize = 10
rects = new Array();{
	for(var i = 0;i<40;i++){
		rects[i] = new Array()
	}
}

class filledRect{
	filledRect(){
		this.filled = false;
	}
}

$(document).ready(function(){
	paper = Raphael("drawing",400,400);
	var border = paper.rect(0,0,400,400);
	border.attr({'border':alive});
	init_rects();

	$("#start").click(function(){
		timeOut = $("select[id=time_type]").val();
		if(timeOut == "infinite"){
			timeOut = -1;
		}
		window.setTimeout(timeoutStartLive,1000);
	})

	$("#stop").click(function(){
		timeOut = 0;
	})

	$("#clear").click(function(){
		if(timeOut != 0){
			alert("Please Stop before Clearing!");
			return;
		}
		for(var x = 0;x<40;x++){
			for(var y = 0;y<40;y++){
				var rect = rects[x][y];
				rect.filled = false;
				rect.rect.attr({'fill':dead})
			}
		}
	})

	$("#add").click(function(){
		timeOut = 0;
		var numLifeForStart = $("input[id=num_lives_start]").val();
		while(numLifeForStart > 0){
			var randomX = Math.floor(Math.random()*40),
				randomY = Math.floor(Math.random()*40);
			if(!rects[randomX][randomY].filled){
				rects[randomX][randomY].filled = true
				rects[randomX][randomY].rect.attr({'fill':alive})
				numLifeForStart -= 1;
			}
		}
	})
})

function init_rects(){
	for(var x = 0;x<40*rectSize;x+=rectSize){
		for(var y = 0;y<40*rectSize;y+=rectSize){
			drawA16PixelRect(x,y)
		}
	}
}

function initLives(){
	lives = 0
	for(var x = 0;x<40;x++){
		for(var y = 0;y<40;y++){
			var rect = rects[x][y];
			if(rect.filled){
				lives++;
			}
		}
	}
}

function drawA16PixelRect(x,y){
	var newRect = new filledRect();
	newRect.rect = paper.rect(x,y,rectSize,rectSize)
	newRect.rect.attr({'border':'black','fill':dead})
	newRect.rect.click(function(){
		this.attr({'fill':alive})
		rects[(this.getBBox().x)/10][(this.getBBox().y)/10].filled = true;
	})
	newRect.x_index = x/rectSize;
	newRect.y_index = y/rectSize;
	rects[newRect.x_index][newRect.y_index] = newRect;
}


function timeoutStartLive(){
	if(timeOut > 0){
		timeOut -= 1;
		startLive();
		window.setTimeout(timeoutStartLive,1000);
	}
	else if(timeOut == -1){
		startLive();
		window.setTimeout(timeoutStartLive,1000);
	}
}

function startLive(){
	for(var x = 0;x<40;x++){
		for(var y = 0;y<40;y++){
			var rect = rects[x][y];
			if(rect.filled){
				switch(countNeighbour(rect)){
					case 0:
	          		case 1: {rect.filled = false; rect.rect.attr({'fill':dead});break;}
	          		case 2: 
	          		case 3: break;
	          		case 4:
	          		case 5:
	          		case 6:
	          		case 7:
	          		case 8: {rect.filled = false;rect.rect.attr({'fill':dead});break;}
				}
			}
			else{//it's a dead cell
				if(countNeighbour(rect)==3){
					rect.filled = true;
					rect.rect.attr({'fill':alive});
				}
			}
		}
	}
	update_stats();

}

function countNeighbour(rect){
	var counter=0;
  	var tempx,tempy;
  	var cols = 40, rows = 40;
  	var x = rect.x_index, y = rect.y_index;
  	//checking 8 neighbours
  	if(x<1){tempx=cols+x-1;} else{tempx=x-1;}
  	if(y<1){tempy=rows+y-1;}else{tempy=y-1;}
  	if(rects[tempx][tempy].filled) {counter++;}

  	if(x<1){tempx=cols+x-1;}else{tempx=x-1;}
  	tempy=y;
  	if(rects[tempx][tempy].filled){counter++;}

  	if(x<1){tempx=cols+x-1;} else{tempx=x-1;}
	if(y+1>=rows){tempy=y+1-rows;}else{tempy=y+1;}
  	if(rects[tempx][tempy].filled){counter++;}

  	tempx=x;
  	if(y<1){ tempy=rows+y-1;} else{ tempy=y-1;}
  	if(rects[tempx][tempy].filled){ counter++;}

  	tempx=x;
  	if(y+1>=rows){ tempy=y+1-rows;} else{ tempy=y+1;}
  	if(rects[tempx][tempy].filled){ counter++;}

  	if(x+1>=cols){ tempx=x+1-cols;} else{ tempx=x+1;}
  	if(y<1){ tempy=rows+y-1;} else{ tempy=y-1;}
  	if(rects[tempx][tempy].filled){ counter++;}

  	if(x+1>=cols){ tempx=x+1-cols;} else{ tempx=x+1;}
  	tempy=y;
  	if(rects[tempx][tempy].filled){ counter++;}

  	if(x+1>=cols){ tempx=x+1-cols;} else{ tempx=x+1;}
  	if(y+1>=rows){ tempy=y+1-rows;} else{ tempy=y+1;}
  	if(rects[tempx][tempy].filled){ counter++;}
  
  	return counter;
}


var update_stats = function(){
	initLives();
	$("#lives").text(lives);
}

