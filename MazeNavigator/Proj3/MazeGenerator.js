"use strict";

var gl;


var vertices=[];
var walls=[];
var mazefinished=false;
var x=10;
var y=10;
var left=Math.floor(Math.random()*y);
var right=Math.floor(Math.random()*y);
window.onload = function init()
{
    var canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    //
    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //  Load shaders and initialize attribute buffers

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram( program );

    // Load the data into the GPU

    dfs();
    //var triangle=[ vec2(0, 0.02), vec2(0, 0.08), vec2(0.1, 0.5)];
    vertices.push(vec2(0.01, 0.02+left*0.1));
    vertices.push(vec2(0.01, 0.08+left*0.1));
    //vertices.push(vec2(0.01, 0.08));
    vertices.push(vec2(0.09, 0.05+left*0.1));
    //vertices.push(vec2(0.09, 0.05));
    //vertices.push(vec2(0.01, 0.02));
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer

    var positionLoc = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( positionLoc, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray(positionLoc);

    //thetaLoc = gl.getUniformLocation(program, "uTheta");

    // Initialize event handlers
    var rotating=[vec2(0.01, 0.02), vec2(0.01, 0.08), vec2(0.09, 0.05),
      vec2(0.08, 0.01), vec2(0.02, 0.01), vec2(0.05, 0.09),
      vec2(0.09, 0.02), vec2(0.09, 0.08), vec2(0.01, 0.05),
      vec2(0.08, 0.09), vec2(0.02, 0.09), vec2(0.05, 0.01) ];
      var currX=0;
      var currY=left*0.1;
      var gridX=0;
      var gridY=left;
      var rotation=0;

    document.addEventListener("keypress", function(event){
      console.log("pressed key");
      //vertices.splice(vertices.length-3,3);
      if (!mazefinished){

      if (event.key=="a"){
          vertices.splice(vertices.length-3,3);
          rotation=rotation+1;
          var rotate=rotation%4
          vertices.push(vec2(rotating[3*rotate][0]+currX, rotating[3*rotate][1]+currY));
          vertices.push(vec2(rotating[3*rotate+1][0]+currX, rotating[3*rotate+1][1]+currY));
          vertices.push(vec2(rotating[3*rotate+2][0]+currX, rotating[3*rotate+2][1]+currY));
          console.log(rotate+" "+(3*rotate+1)+" "+(3*rotate+2));
          var bufferId = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
          gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

          // Associate out shader variables with our data buffer

          var positionLoc = gl.getAttribLocation( program, "aPosition" );
          gl.vertexAttribPointer( positionLoc, 2, gl.FLOAT, false, 0, 0 );
          gl.enableVertexAttribArray(positionLoc);
          render();
      } else if (event.key=="d"){
          vertices.splice(vertices.length-3,3);
          rotation=rotation+3;
          var rotate=rotation%4
          vertices.push(vec2(rotating[3*rotate][0]+currX, rotating[3*rotate][1]+currY));
          vertices.push(vec2(rotating[3*rotate+1][0]+currX, rotating[3*rotate+1][1]+currY));
          vertices.push(vec2(rotating[3*rotate+2][0]+currX, rotating[3*rotate+2][1]+currY));
          var bufferId = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
          gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

          // Associate out shader variables with our data buffer

          var positionLoc = gl.getAttribLocation( program, "aPosition" );
          gl.vertexAttribPointer( positionLoc, 2, gl.FLOAT, false, 0, 0 );
          gl.enableVertexAttribArray(positionLoc);
          render();
      } else if (event.key=="w"){

          var travel=true;
          console.log ("cell number "+(x*gridY+gridX)+ " 10currY is "+gridY+" 10currX is "+gridX);
          if (rotation%4==0){
            //console.log(walls[x*gridY+gridX+2]);
            if(x*gridY+gridX==(right+1)*(x)-1) {
              mazefinished=true;
              document.getElementById("maze").innerHTML="Maze finished";
            }
            if (walls[4*(x*gridY+gridX)+2]==0) {
              travel=false;
            }
            else {
              if (gridX==x-1){
                travel=false;
              } else {
              currX=currX+0.1;
              gridX=gridX+1;
              }
            }

          } else if (rotation%4==1){
            //console.log(walls[x*gridY+gridX+3]);
            if (walls[4*(x*gridY+gridX)+3]==0) {
              travel=false;
            }
            else {
              if (gridY==y-1){
                travel=false;
              } else {
              currY=currY+0.1;
              gridY=gridY+1;
              }
            }
          } else if (rotation%4==2){
            //console.log(walls[x*gridY+gridX]);
            if (walls[4*(x*gridY+gridX)]==0) {
              travel=false;
            }
            else {
              if (gridX==0){
                travel=false;
              } else {
              currX=currX-0.1;
              gridX=gridX-1;
              }
            }
          } else if (rotation%4==3){
            //console.log(walls[x*gridY+gridX+1]);
            if (walls[4*(x*gridY+gridX)+1]==0) {
              travel=false;
            }
            else {
              if (gridY==0){
                travel=false;
              } else {
              currY=currY-0.1;
              gridY=gridY-1;
              }
            }
          }
          //console.log(walls[x*10*currY+10*currX+1]);
          if (travel){
          vertices.splice(vertices.length-3,3);
          var rotate=rotation%4
          vertices.push(vec2(rotating[3*rotate][0]+currX, rotating[3*rotate][1]+currY));
          vertices.push(vec2(rotating[3*rotate+1][0]+currX, rotating[3*rotate+1][1]+currY));
          vertices.push(vec2(rotating[3*rotate+2][0]+currX, rotating[3*rotate+2][1]+currY));
          var bufferId = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
          gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

          // Associate out shader variables with our data buffer

          var positionLoc = gl.getAttribLocation( program, "aPosition" );
          gl.vertexAttribPointer( positionLoc, 2, gl.FLOAT, false, 0, 0 );
          gl.enableVertexAttribArray(positionLoc);
          render();
          }
      }
    } else {
      document.getElementById("maze").innerHTML="Maze finished";
    }
    });

    /*document.getElementById("slider").onchange = function(event) {
        speed = 100 - event.target.value;
    };*/
    document.getElementById("ResetPos").onclick = function (event) {
        vertices.splice(vertices.length-3,3);
        vertices.push(vec2(0.01, 0.02+left*0.1));
        vertices.push(vec2(0.01, 0.08+left*0.1));
        //vertices.push(vec2(0.01, 0.08));
        vertices.push(vec2(0.09, 0.05+left*0.1));
        currX=0;
        currY=left*0.1;
        gridX=0;
        gridY=left;
        rotation=0;
        mazefinished=false;
        document.getElementById("maze").innerHTML="Maze not done yet";
        var bufferId = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

        // Associate out shader variables with our data buffer

        var positionLoc = gl.getAttribLocation( program, "aPosition" );
        gl.vertexAttribPointer( positionLoc, 2, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray(positionLoc);
        render();
    }
    document.getElementById("Direction").onclick = function (event) {

        console.log("direction pressed");
        x=parseInt(document.getElementById("xval").value);
        y=parseInt(document.getElementById("yval").value);
        if (isNaN(x)){
          document.getElementById("sizeX").innerHTML="Need an x value";
        }  else {
          document.getElementById("sizeX").innerHTML=" ";
        }
        if (isNaN(y)){
          document.getElementById("sizeY").innerHTML="Need a y value";
        } else {
          document.getElementById("sizeY").innerHTML=" ";
        }
        left=Math.floor(Math.random()*y);
        right=Math.floor(Math.random()*y);
        currX=0;
        currY=left*0.1;
        gridX=0;
        gridY=left;
        rotation=0;
        mazefinished=false;
        document.getElementById("maze").innerHTML="Maze not done yet";
        console.log(typeof(x));
        console.log(x+" "+y);
        vertices.splice(0,vertices.length);
        walls.splice(0,walls.length);
        dfs();
        vertices.push(vec2(0.01, 0.02+left*0.1));
        vertices.push(vec2(0.01, 0.08+left*0.1));
        //vertices.push(vec2(0.01, 0.08));
        vertices.push(vec2(0.09, 0.05+left*0.1));
        var bufferId = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

        // Associate out shader variables with our data buffer

        var positionLoc = gl.getAttribLocation( program, "aPosition" );
        gl.vertexAttribPointer( positionLoc, 2, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray(positionLoc);
        render();
    };

    /*document.getElementById("Controls").onclick = function( event) {
        switch(event.target.index) {
          case 0:
            direction = !direction;
            break;

         case 1:
            speed /= 2.0;
            break;

         case 2:
            speed *= 2.0;
            break;
       }
    };*/

    window.onkeydown = function(event) {
        var key = String.fromCharCode(event.keyCode);
        switch( key ) {
          case '1':
            direction = !direction;
            break;

          case '2':
            speed /= 2.0;
            break;

          case '3':
            speed *= 2.0;
            break;
        }
    };


    render();
};

function dfs(){
  var stack=[];
  var visited=[];
  stack.push(0);
  console.log("dfs "+x+" "+y);
  for (let j=0; j<y; j++){
    for (let i=0; i<x; i++){
        walls.push(0);
        walls.push(0);
        walls.push(0);
        walls.push(0);
        vertices.push(vec2(0.1*i, 0.1*j+0.1));
        vertices.push(vec2(0.1*i, 0.1*j));
        vertices.push(vec2(0.1*i, 0.1*j));
        vertices.push(vec2(0.1*i+0.1, 0.1*j));
        vertices.push(vec2(0.1*i+0.1, 0.1*j));
        vertices.push(vec2(0.1*i+0.1, 0.1*j+0.1));
        vertices.push(vec2(0.1*i+0.1, 0.1*j+0.1));
        vertices.push(vec2(0.1*i, 0.1*j+0.1));
        visited.push(0);
    }
  }
  console.log(walls.length);
  console.log(vertices.length);
  for (let i=0; i<x; i++){
    walls[4*i+1]=-1;
    walls[4*((y-1)*x+i)+3]=-1;
  }
  for (let i=0; i<y; i++){
    walls[4*(i*x)]=-1;
    walls[4*(x*(i+1)-1)+2]=-1;
  }
  var count=0;
  var neighbors=[vec2(0, 1), vec2(1, 0), vec2 (0, -1), vec2 (-1, 0)];
  while (stack.length>0){
    var i=stack[stack.length-1];
    console.log("visited i "+i);
    visited[i]=1;
    var r=Math.floor(i/x);
    var c=i%x;
    var rand=Math.floor(Math.random()*4);
    var used=true;
    for (let j=0; j<4; j++){
      if (!(r+neighbors[j][1]<0 || c+neighbors[j][0]<0 || r+neighbors[j][1]>=y || c+neighbors[j][0]>=x)){
        var next=(r+neighbors[j][1])*x+(c+neighbors[j][0]);
        if (visited[next]==0) {
          used=false;
        }
      }
    }
    if (used) {
      var pop=stack.pop();
      continue;
    }
    var rand=Math.floor(Math.random()*4);
    var next=(r+neighbors[rand][1])*x+(c+neighbors[rand][0]);
    var track=0;
    while (r+neighbors[rand][1]<0 || c+neighbors[rand][0]<0 || r+neighbors[rand][1]>=y || c+neighbors[rand][0]>=x||visited[next]==1 ){
        rand=Math.floor(Math.random()*4);
        next=(r+neighbors[rand][1])*x+(c+neighbors[rand][0]);
    }

    if (rand==1){
        walls[4*i+2]=1;
        walls[4*(i+1)]=1;
        console.log((4*i+2)+" both cells 1 "+4*(i+1));
    } else if (rand==0){
        walls[4*i+3]=1;
        walls[4*(i+x)+1]=1;
        console.log((4*i+3)+" both cells 0 "+(4*(i+x)+1)+" x is "+x);
        console.log((i+x)+" "+i+" "+x);
        var ix=i+x;
        console.log(ix);
    } else if (rand==3){
        walls[4*i]=1;
        walls[4*(i-1)+2]=1;
        console.log((4*i)+" both cells 3 "+(4*(i-1)+2));
    } else if (rand==2){
        walls[4*i+1]=1;
        walls[4*(i-x)+3]=1;
        console.log((4*i+1)+" both cells 2 "+(4*(i-x)+3));
    }
    stack.push((r+neighbors[rand][1])*x+(c+neighbors[rand][0]));
  }

  walls[4*left*x]=1;
  walls[4*(right+1)*x-2]=1;

  for (let j=4*x*y-1; j>=0; j--){
    if (walls[j]==1){
      vertices.splice(2*j,2);
    }
  }
}
function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );

    //theta += (direction ? 0.1 : -0.1);
    //gl.uniform1f(thetaLoc, theta);

    gl.drawArrays(gl.LINES, 0, vertices.length-3);
    console.log(vertices[vertices.length-3]);
    console.log(vertices[vertices.length-2]);
    console.log(vertices[vertices.length-1]);
    gl.drawArrays(gl.TRIANGLE_STRIP, vertices.length-3, 3);

}
