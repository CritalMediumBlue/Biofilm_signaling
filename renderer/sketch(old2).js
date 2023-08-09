var Engine=Matter.Engine,
	Bodies=Matter.Bodies,
	Body=Matter.Body,
	Composite=Matter.Composite,
	//Runner=Matter.Runner,
	engine=Engine.create(),
	bacteria_array=[], 
	walls_array=[],
	Velocity=0,//0.2,
	salto=0,
	M=1, //5
	K=5, //Diffusion loops  //20
	A=100,  //Difussion + matter.js loops //500
	u0=[], //Initial concentration
	u1=[], //final concentration
	n0=[],
	n1=[],
	N=2050,  // 620x620 canvas + 1 black pixel on the edge (917)
	loops=0,  // simulation steps
	//dif_coef=0.5,  // pix²/loop  // No cambiar!!! 1/2 es el maximo valor 
	objects=Composite.create(),
	next_color="pink",
	Cursor="noCursor",
	ctx ,
	chart,
	chart_exists=false,
	Number_of_pixels=30,  //5 microns * 40 pixels = 200 microns
	pixel_size=2000/Number_of_pixels, //5 micrometers
	

	kill_em=false,
	paused =true;
	show_nutrients=2;
  //  p5.disableFriendlyErrors = true;
  
function setup(){
	kill_em=false;
	noLoop();
	let c1 = color(255,0,255,255);
 	let c2 = color(255);
	createCanvas(N+101,N);
	pixelDensity(1);
	world = engine.world;
	//Runner.run(engine);
	Composite.add(world, objects);
	engine.gravity.y =0;

	Matter.Engine.enableSleeping=true,
	//Runner.isFixed=true,
	//Runner.delta = 5,
	Engine.positionIterations=1;
	Engine.constraintIterations=1;
	Engine.velocityIterations=1; //the lower the faster it runs and the less quality the mechanical simulation has


	for (var i=0;i<=Number_of_pixels;i++){
    u0[i]=[];
    u1[i]=[];
    for (var j=0;j<=Number_of_pixels;j++){
    	u0[i][j]=0;
    	u1[i][j]=0;
    }
  }

  for (var i=0;i<=Number_of_pixels;i++){
    n0[i]=[];
    n1[i]=[];
    for (var j=0;j<=Number_of_pixels;j++){
    	n0[i][j]=0;
    	n1[i][j]=0;
    }
  }




 	 background(255);
	 strokeWeight(1);
	 noLoop();
	buttons();

	//let new_wall=new Walls(1000, 5,2200,20);
	//walls_array.push(new_wall);

	//let new_wall2=new Walls(5, 1000,20,2200);
	//walls_array.push(new_wall2);

	let new_wall3=new Walls(pixel_size/2, pixel_size/2,pixel_size,pixel_size);
	walls_array.push(new_wall3);
}

	 function buttons(){
		
	 
	 fill(255);
	 rect(N+60,1,40,40);
	 rect(N+60,41,40,40);

	 rect(N+60,81,40,40);

	 rect(N+60,121,40,40);

	 rect(N+60,161,40,40);

	 rect(N+60,201,40,40);

	 rect(N+60,241,40,40);

	 rect(N+60,281,40,40);

	 rect(N+60,321,40,40);


		push();
		fill(204,50,153,120);
		stroke(104,34,139);
		rectMode(CENTER);
		translate(N+80,100);
		rotate(-PI/4);
		strokeWeight(3);
		rect(0,0,30,10,10);  
		pop();
		

    
   fill(0);
   stroke(0);
	 triangle(N+60+12, 10, N+60+30, 20, N+60+12, 30);	

	 strokeWeight(3);
   line(N+60+20, 46, N+60+20, 51);
   line(N+60+20, 69, N+60+20, 74);

   line(N+60+7, 60, N+60+11, 60);
   line(N+60+29, 60, N+60+33, 60);

   line(N+60+6, 46, N+60+12, 52);
 	 line(N+60+28, 52, N+60+34, 46);


 	 line(N+60+6, 74, N+60+12, 68);
 	 line(N+60+28, 68, N+60+34, 74);


 	 fill(204,50,153,120); 
		strokeWeight(0);
		ellipse(N+60+20,140,20,20);

		fill(255);
		stroke(0);
		strokeWeight(1);
		rect(N+60,161,40,40); 
		Cursor="noCursor"; 
		push();
		fill(0);
		strokeWeight(0);
		rectMode(CENTER);
		translate(N+60+21,185);
		rotate((PI/4)*1.4);
		rect(0,0,15,5);  
		pop();
		fill(0);

		strokeWeight(0);
		triangle(N+60+15, 171, N+60+28, 183, N+60+15, 189);

	noStroke();
	//frameRate(15);
	 }


	 class Walls {
		constructor(x, y, l, a) {

			var options = {
				restitution: 1,
				friction:0,
				frictionStatic:0,
				slop:0.01,
				isStatic: true 
			};

			this.body = Bodies.rectangle(x, y, l, a, options);
			Composite.add(objects, this.body);

			this.show_1 = function () {

				fill(0,0,0);
				push();
				rectMode(CENTER);
				translate(this.body.position.x, this.body.position.y);
				strokeWeight(3);
				rect(0, 0, l, a);
				pop();
	
			};


		}
}



function mouseClicked() {
  if (mouseX>N+60&&mouseX<N+60+41&&mouseY>0&&mouseY<40&&paused==false) {
  	paused=true;
  //	clearInterval(refresh);
  	noLoop();
    console.log("Paused");
    stroke(0);
    strokeWeight(1);
    fill(255);
    rect(N+60,1,40,40);
    fill(0);
		triangle(N+60+12, 10, N+60+30, 20, N+60+12, 30);	
		strokeWeight(0.2);
	 	/*		stroke(0);
		strokeWeight(1);
		rect(N,161,40,40); */

		/*stroke(100);
		strokeWeight(2);
		rect(N+2,161+2,38,38);*/

	 	//
  } else if  (mouseX>N+60&&mouseX<N+60+41&&mouseY>0&&mouseY<40&&paused==true) {
		//loops=0;
  	paused=false;
  	loop();
    console.log("Running...");
    strokeWeight(2);
    stroke(100);
    fill(255);
    rect(N+60+2,3,38,38);  
    fill(0);
    stroke(0);
    rect(N+60+12,10,5,20);
	 	rect(N+60+24,10,5,20); 

    strokeWeight(0);
  } else if  (mouseX>N+60&&mouseX<N+60+41&&mouseY>40&&mouseY<80) {
    console.log(bacteria_array.length+" bacteria have been deleted");
		for (var i =0;  i < bacteria_array.length; i++){
			bacteria_array[i].removeFromWorld();
			bacteria_array.splice(i,1);
			i--;
		}
		
	

  } else if (mouseX<N&&mouseY<N&&mouseX>0+1&&mouseY>0+1&&next_color!="no_color :)"&&Cursor=="noCursor"){
	for  (var y =0;  y < 1; y++){
		let new_bac=new Bacteria(mouseX ,mouseY ,40,random(0,PI),next_color, 2.5, 0.5, 1, 1);
		bacteria_array.push(new_bac);
		new_bac.show_1();
		console.log("1 bacteria has been added");
	}
  		
  	
		
		
	} else if (mouseX>N+60&&mouseX<N+60+41&&mouseY>80&&mouseY<120&&next_color=="green"){
		next_color="pink";
		push();
		fill(255);
		strokeWeight(1);
		rect(N+60,81,40,40);
		fill(204,50,153,120);
		stroke(104,34,139);
		rectMode(CENTER);
		translate(N+60+20,100);
		rotate(-PI/4);
		strokeWeight(3);
		rect(0,0,30,10,10);  
		pop();
		Cursor="noCursor"
		fill(255);
		stroke(0);
		strokeWeight(1);
		rect(N+60,161,40,40); 
		Cursor="noCursor"; 
		push();
		fill(0);
		strokeWeight(0);
		rectMode(CENTER);
		translate(N+60+21,185);
		rotate((PI/4)*1.4);
		rect(0,0,15,5);  
		pop();
		fill(0);

		strokeWeight(0);
		triangle(N+60+15, 171, N+60+28, 183, N+60+15, 189);

	} else if (mouseX>N+60&&mouseX<N+60+41&&mouseY>80&&mouseY<120&&next_color=="pink"){
		next_color="green";
		push();
		fill(255);
		strokeWeight(1);
		rect(N+60,81,40,40);
		fill(6,164,12,120); //gren
		stroke(2,84,5); 
		rectMode(CENTER);
		translate(N+60+20,100);
		rotate(-PI/4);
		strokeWeight(3);
		rect(0,0,30,10,10);  
		pop();
		fill(255);
		stroke(0);
		strokeWeight(1);
		rect(N+60,161,40,40); 
		Cursor="noCursor"; 
		push();
		fill(0);
		strokeWeight(0);
		rectMode(CENTER);
		translate(N+60+21,185);
		rotate((PI/4)*1.4);
		rect(0,0,15,5);  
		pop();
		fill(0);

		strokeWeight(0);
		triangle(N+60+15, 171, N+60+28, 183, N+60+15, 189);

	} else if (mouseX>N+60&&mouseX<N+60+41&&mouseY>120&&mouseY<160&&show_nutrients==1){
		show_nutrients=2;
		fill(255);
		strokeWeight(1);
		rect(N+60,121,40,40);
		fill(204,50,153,120); 
		strokeWeight(0);
		ellipse(N+60+20,140,20,20);
		
	} else if (mouseX>N+60&&mouseX<N+60+41&&mouseY>120&&mouseY<160&&show_nutrients==0){
		show_nutrients=1;
		fill(255);
		strokeWeight(1);
		rect(N+60,121,40,40);
		fill(220,220,0); 
		strokeWeight(0);
		ellipse(N+60+20,140,20,20);
	}	else if (mouseX>N+60&&mouseX<N+60+41&&mouseY>120&&mouseY<160&&show_nutrients==2){
			show_nutrients=0;
			fill(255);
			strokeWeight(1);
			rect(N+60,121,40,40);
			fill(220,220,0); 
			strokeWeight(0);
			ellipse(N+60+20,140,20,20);
		
	} else if (mouseX>N+60&&mouseX<N+60+41&&mouseY>160&&mouseY<200&&Cursor=="yesCursor"){
		fill(255);
		stroke(0);
		strokeWeight(1);
		rect(N+60,161,40,40); 
		Cursor="noCursor"; 
		push();
		fill(0);
		strokeWeight(0);
		rectMode(CENTER);
		translate(N+60+21,185);
		rotate((PI/4)*1.4);
		rect(0,0,15,5);  
		pop();
		fill(0);

		strokeWeight(0);
		triangle(N+60+15, 171, N+60+28, 183, N+60+15, 189);
		 
	}
	else if (mouseX>N+60&&mouseX<N+60+41&&mouseY>160&&mouseY<200&&Cursor=="noCursor"){
		
		fill(255);
		stroke(100);
		strokeWeight(2);
		rect(N+60+2,161+2,38,38); 
		Cursor="yesCursor"; 
		push();
		fill(0);
		strokeWeight(0);
		rectMode(CENTER);
		translate(N+60+21,185);
		rotate((PI/4)*1.4);
		rect(0,0,15,5);  
		pop();
		fill(0);
		stroke(0);
		strokeWeight(0);
		triangle(N+60+15, 171, N+60+28, 183, N+60+15, 189);
		 
	}
	if (Cursor=="yesCursor"){
	for (var i =0;  i < bacteria_array.length; i++){
		bacteria_array[i].deselect();
		bacteria_array[i].clicked();

	}
	}

}
  
 function diffusion1(u0) {

	for(var k=0;k<=K;k++){
		for(var i=1;i<=Number_of_pixels-1;i++){
			for(var j=1;j<=Number_of_pixels-1;j++){
					u1[i][j]=u0[i][j]+
					(0.5)*(1/2)*(0.5)* //We need to left something (half) in the original square! (0.5*0.5*0.5)  
					((

										u0[i][j-1]

						+u0[i-1][j]			+			u0[i+1][j]+
						
										 u0[i][j+1]
						

						)-4*u0[i][j]
					
					
					
					); 
			}
		}
		for(var j=1;j<=Number_of_pixels-1;j++){
			u1[0][j]=u0[0][j]+
			(0.5)*(1/2)*(0.5)* //We need to left something (half) in the original square! (0.5*0.5*0.5)  
			((						u0[0][j-1]

				
				+u0[j][0]				+				u0[0+1][j]+


									u0[0][j+1]
				
				)-4*u0[0][j]);
			u1[Number_of_pixels][j]=0;
		}
		for (var i=1; i<=Number_of_pixels-1; i++){
			u1[i][0]=u0[i][0]+
			(0.5)*(1/2)*(0.5)* //We need to left something (half) in the original square! (0.5*0.5*0.5)  
			((						u0[0][i]

				
				+u0[i-1][0]				+				u0[i+1][0]+


									u0[i][0+1]
				
				)-4*u0[i][0]);
			u1[i][Number_of_pixels]=0;
		}
	u1[Number_of_pixels][Number_of_pixels]=0;
	u1[0][Number_of_pixels]=0;
	u1[0][0]=(u1[0][1]+u1[1][0])/2;
	u1[Number_of_pixels][0]=0;

		for(var j=0;j<=Number_of_pixels;j++){
			u0[0][j]=(1-Velocity)*u1[0][j];
			for (var i=1;i<=Number_of_pixels;i++){
				u0[i][j]=(1-Velocity)*u1[i][j]+(Velocity)*u1[i-1][j];
			}
		}
	} 
	 return u0;
} 
function diffusion2(n0) {
	

	for(var k=0;k<=K;k++){
		for(var i=1;i<=Number_of_pixels-1;i++){
			for(var j=1;j<=Number_of_pixels-1;j++){
					n1[i][j]=n0[i][j]+
					(0.5)*(1/2)*(0.5)* //We need to left something (half) in the original square! (0.5*0.5*0.5)  
					((
						
										n0[i][j-1]

						+n0[i-1][j]			+			n0[i+1][j]+
						
										 n0[i][j+1]
						
						
						)-4*n0[i][j]); 
			}
		}
		for(var j=1;j<=Number_of_pixels-1;j++){
			n1[0][j]=n0[0][j]+
			(0.5)*(1/2)*(0.5)* //We need to left something (half) in the original square! (0.5*0.5*0.5)  
			((						n0[0][j-1]

				
				+n0[j][0]				+				n0[0+1][j]+


									n0[0][j+1]
				
				)-4*n0[0][j]);
			n1[Number_of_pixels][j]=0;
		}
		for (var i=1; i<=Number_of_pixels-1; i++){
			n1[i][0]=n0[i][0]+
			(0.5)*(1/2)*(0.5)* //We need to left something (half) in the original square! (0.5*0.5*0.5)  
			((						n0[0][i]

				
				+n0[i-1][0]				+				n0[i+1][0]+


									n0[i][0+1]
				
				)-4*n0[i][0]);
			n1[i][Number_of_pixels]=0;
		}
		n1[Number_of_pixels][Number_of_pixels]=0;
		n1[0][Number_of_pixels]=0;
		n1[0][0]=(n1[0][1]+n1[1][0])/2;
		n1[Number_of_pixels][0]=0;

		for(var j=0;j<=Number_of_pixels;j++){
			n0[0][j]=(1-Velocity)*n1[0][j];
			for (var i=1;i<=Number_of_pixels;i++){
				n0[i][j]=(1-Velocity)*n1[i][j]+(Velocity)*n1[i-1][j];
			}
		}
	} 
	 return n0;
}

function draw() {
for(var m = 0; m<=M; m++){
for(var a = 0; a<=A; a++){
	
	u0=diffusion1(u0);
	n0=diffusion2(n0);
}

}

stroke(150);
strokeWeight(0.1);

if (show_nutrients==1){
for(var j=0;j<=Number_of_pixels;j++){
	for (var i=0;i<=Number_of_pixels;i++){


		fill(255-n0[i][j]*(255/2),255,255-n0[i][j]*(255/1),255);
		rect(pixel_size*i+1,pixel_size*j+1,pixel_size,pixel_size);


	}
} 
}

if (show_nutrients==0){
	for(var j=0;j<=Number_of_pixels;j++){
		for (var i=0;i<=Number_of_pixels;i++){
	
	
			fill(255,255-u0[i][j]*(255/1),255,255);
			rect(pixel_size*i+1,pixel_size*j+1,pixel_size,pixel_size);
	
	
		}
	} 
	}

	if (show_nutrients==2){
		for(var j=0;j<=Number_of_pixels;j++){
			for (var i=0;i<=Number_of_pixels;i++){
		
		
				fill(255,255,255,255);
				rect(pixel_size*i+1,pixel_size*j+1,pixel_size,pixel_size);
		
		
			}
		} 
		}

	for (var i =0;  i < bacteria_array.length; i++){

		let One_area = bacteria_array[i].Rearrange();

		if (One_area==0){

			bacteria_array[i].removeFromWorld();
			bacteria_array.splice(i,1);
			console.log("deleted");
				i--;
		}}

		

		for (var i =0;  i < bacteria_array.length; i++){

			let One_area = bacteria_array[i].Rearrange();
		
		if (One_area==1){
			console.log("from left to up");
			bacteria_array[i].Move_from_left_to_up();
			
		} else if (One_area==2){
			console.log("from up to left");
			bacteria_array[i].Move_from_up_to_left();

		} else if (One_area==3){
			console.log("nothing");
		} else if (One_area==4){
			console.log("something is wrong");
		}

	}
		/* if( bacteria_array[i].isOffScreen()){
			bacteria_array[i].removeFromWorld();
			bacteria_array.splice(i,1);
			if(salto==0){
				i--;
			}
			else if(salto==1){
				i--;
				salto=0;
			}
			} */

			
			for (var i =0;  i < bacteria_array.length; i++){
	bacteria_array[i].internal_circuit();
	bacteria_array[i].show_1(); 
	bacteria_array[i].move();
	bacteria_array[i].reproduce();
	bacteria_array[i].grow();
	bacteria_array[i].signaling_response_to_pink();
	bacteria_array[i].signaling_response_to_surfactin();
	bacteria_array[i].show_internal_circuit();
	bacteria_array[i].produce_pink(); // stays
		bacteria_array[i].produce_surfactin();
		bacteria_array[i].Area_category();
	}

	

	
	
  let hours = Math.floor(loops*112.5/3600);
  let minutes = Math.floor((loops*112.5/60/60-hours)*60); //Math.floor(loops*2.25/60);
  let seconds = Math.floor(((loops*112.5/60-minutes)*60)-hours*3600);
  for (var i =0;  i < 2; i++){
	Engine.update(engine,1);
  }
  //if(loops%3==0){
	for (var i =0;  i < bacteria_array.length; i++){

	if(kill_em==true && bacteria_array[i].kill_em()){
			bacteria_array[i].removeFromWorld();
			bacteria_array.splice(i,1);
			i--;
			//
			}
	}
	kill_em=false;
	console.log(hours.toString().padStart(2, '0')+":"+minutes.toString().padStart(2, '0')+":"+seconds.toString().padStart(2, '0'));
	
	
//}
	//text(hours.toString().padStart(2, '0')+":"+minutes.toString().padStart(2, '0')+":"+seconds.toString().padStart(2, '0'), 20, N-20);
  loops++;

 
 
  fill(0);
  stroke(0);
  rect(pixel_size/2,pixel_size/2,2000,1);
  rect(pixel_size/2,pixel_size/2,1,2000);
  stroke(0);
 // for (var i=0; i< walls_array.length; i++){this.show_1};


  }





const plugin = {
  id: 'customCanvasBackgroundColor',
  beforeDraw: (chart, args, options) => {
    const {ctx} = chart;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = options.color || '#99ffff';
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  }
};


