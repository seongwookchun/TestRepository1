// RotatingTranslatedTriangle.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Position2;\n' +     // a_Position2 이거 추가 해보자.
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_ModelMatrix2;\n' +     // u_ModelMatrix 이것도 하나 더 추가해본다.
                                         // 이름을 다르게 하면 !initShaders에 걸리지 않는다.

  'void main() {\n' +
  '  gl_Position = u_ModelMatrix * a_Position;\n' +
 //'  gl_Position2 = u_ModelMatrix * a_Position;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(.5, 0.0, 0.0, 1.0);\n' +
  '}\n';

// Rotation angle (degrees/second)
var ANGLE_STEP = 45.0;
var TRANS_NS = 0.0;
var TRANS_ANGLE_HEAD = 0.0;

function main() {
  // Retrieve <canvas> element

  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  //gl.clearColor(0, 0, 0, 1);
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders Try again^^*.');
    return;
  }

  // Write the positions of vertices to a vertex shader
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');

  
    return;
  }

//===================================================================
//===================================================================











  // Get storage location of u_ModelMatrix
  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  var u_ModelMatrix2 = gl.getUniformLocation(gl.program, 'u_ModelMatrix2'); // server 상의 obj 와 정확히 연결하는 작업인 듯 하다.

  if (!u_ModelMatrix || !u_ModelMatrix ) { 
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  // Current rotation angle
  var currentAngle = 0.0;
  var current_NS = 0.0;
  var current_ANGLE_HEAD = 0.0;

  // Model matrix
  var modelMatrix = new Matrix4();
  var modelMatrix2 = new Matrix4();

  // Start drawing
  var tick = function() {
    gl.clearColor(55/255, 0, 11/255, 1);
    currentAngle = animate(currentAngle);  // Update the rotation angle
    //draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix);   // Draw the triangle
    //draw1(gl, n, currentAngle       , modelMatrix , u_ModelMatrix);
    
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    draw2(gl, n, currentAngle + 45.0, modelMatrix2, u_ModelMatrix);
    requestAnimationFrame(tick, canvas);   // Request that the browser ?calls tick
  };
  tick();
}
var propWide = 0.15
var propWidth = 0.025
function initVertexBuffers(gl) {
  
  var vertices = new Float32Array ([
    -propWide, -propWidth, //prop 1
     propWide, -propWidth,
     propWide,  propWidth, 
    -propWide,  propWidth,

    -propWidth, -propWide, //prop 2
     propWidth, -propWide,
     propWidth,  propWide, 
    -propWidth,  propWide  
  ]);


  var vertices2 = new Float32Array ([
    -propWidth, -propWide, //prop 2
     propWidth, -propWide,
     propWidth,  propWide, 
    -propWidth,  propWide  
  ]);

  var n = 8;   // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  var vertexBuffer2 = gl.createBuffer();
  if (!vertexBuffer || !vertexBuffer2) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer2); // 이렇게 하나의 vtxBff 바로 옆에다 바로 선언할 수 있을까?
                                                 // 되네 ?!
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  gl.bufferData(gl.ARRAY_BUFFER, vertices2, gl.STATIC_DRAW);   // bufferData()도 추가해본다.
                                                               // 일단 여기도 pass 됐다.


  // Assign the buffer object to a_Position variable
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  //var a_Position2 = gl.getAttribLocation(gl.program, 'a_Position2');
  //if(a_Position < 0 || a_Position2 < 0) {
  if(a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }

  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  //gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 4*8);
  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  return n;
}
           

                                                // modelMatrix2 도 넣어본다.
                                                // >>> canvas 바탕만 랜더링 되고, 원래 잘 되던 직사각 1이 사라진다...
function draw2(gl, n, currentAngle, modelMatrix, u_ModelMatrix, u_ModelMatrix2,
               modelMatrix2, current_NS, current_ANGLE_HEAD) {
                                                // 추가적 변수를 기존 변수들 뒤에다 넣으니까 일단 line pass 되었다.
  // Set the rotation matrix
  modelMatrix.setRotate(currentAngle, 0, 0, 1);
  //modelMatrix2.setRotate(currentAngle, 0, 0, 1);

  //modelMatrix.translate(0.35, 0, 0);
 
  // Pass the rotation matrix to the vertex shader
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  //gl.uniformMatrix4fv(u_ModelMatrix2, false, modelMatrix2.elements);  // 제발 여기 추가한다면, 두 직사각 obj 랜더링 되기를 !@!!
                                                                     // 일단 line pass는 됐는데, 랜더링은 안되고 있다.

  //gl.uniformMatrix4fv(u_ModelMatrix2, false, modelMatrix.elements);

  // Draw the rectangle
  gl.drawArrays(gl.LINE_LOOP, 0, n/2);
  gl.drawArrays(gl.LINE_LOOP, 0, n/2);
}
/*
function draw2(gl, n, currentAngle, modelMatrix, u_ModelMatrix) {
  // Set the rotation matrix
  modelMatrix.setRotate(currentAngle, 0, 0, 1);
  //modelMatrix.translate(0.35, 0, 0);
 
  // Pass the rotation matrix to the vertex shader
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  //gl.uniformMatrix4fv(u_ModelMatrix2, false, modelMatrix.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw the rectangle
  gl.drawArrays(gl.LINES, 0, n/2);
}
*/

// Last time that this function was called
var g_last = Date.now();
function animate(angle) {
  // Calculate the elapsed time
  var now = Date.now();
  var elapsed = now - g_last;
  g_last = now;
  // Update the current rotation angle (adjusted by the elapsed time)
  var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;

  return newAngle %= 360;
}

function up() {
  ANGLE_STEP += 10; 
}

function down() {
  ANGLE_STEP -= 10; 
}

function forward() {
  current_NS += 10;
}

function backward() {
  current_NS -= 10;
}

function turn_left() {
  TRANS_ANGLE_HEAD -= 10; 
}

function turn_right() {
  TRANS_ANGLE_HEAD += 10; 
}
