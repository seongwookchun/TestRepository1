// RotatingTranslatedTriangle.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_TransMatrix;\n'+
  //'uniform mat4 u_ModelMatrix2 = u_ModelMatrix;\n' + // 이런 선언이 안되는구만.
  //'u_ModelMatrix2 = u_ModelMatrix;\n' +              // 이런 선언이 안되는구만.

  'void main() {\n' +
  '  gl_Position = u_ModelMatrix * a_Position;\n' +
  //'  gl_Position = u_ModelMatrix2 * a_Position;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
  '}\n';

// Rotation angle (degrees/second)
var ANGLE_STEP = 0.0;
var coord_NS = 0.0;
var side_Tri = 0.05;
function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Write the positions of vertices to a vertex shader
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // Get storage location of u_ModelMatrix
  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) { 
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }
/*
  var u_TransMatrix = gl.getUniformLocation(gl.program, 'u_TransMatrix');
                        // storage location 못잡네
  if (!u_TransMatrix) { 
    console.log('Failed to get the storage location of u_TransMatrix');
    return;
  }
*/
  // Current rotation angle
  var currentAngle = 0.0;
  // Model matrix
  var modelMatrix = new Matrix4();
  var transMatrix = new Matrix4();

  // Start drawing
  var tick = function() {
    currentAngle = animate(currentAngle);  // Update the rotation angle 
    draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix, transMatrix)//, u_TransMatrix);   // Draw the triangle
                                                              // 뒤에 u_TransMatrix 끼니까 line pass 안된다.
    requestAnimationFrame(tick, canvas);   // Request that the browser ?calls tick

    vertices = new Float32Array([
     0,         side_Tri + coord_NS,   
    -side_Tri, -side_Tri + coord_NS,  
     side_Tri, -side_Tri + coord_NS
    ]);
    //console.log('vertices', vertices);
  };
  tick();
}





// vertices 밖에서 전역변수로 선언해보기. 
// >>> 일단 line pass.
/*var vertices = new Float32Array ([
    0, 0.5,   -0.5, -0.5,   0.5, -0.5
  ]);
*/
var vertices = new Float32Array([
     0,         side_Tri + coord_NS,   
    -side_Tri, -side_Tri + coord_NS,  
     side_Tri, -side_Tri + coord_NS
    ]);
function initVertexBuffers(gl) {
  /*var vertices = new Float32Array ([
    0, 0.5,   -0.5, -0.5,   0.5, -0.5
  ]); */
  var n = 3;   // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  // Assign the buffer object to a_Position variable
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if(a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  return n;
}






















function draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix, transMatrix, u_TransMatrix) {
  // Set the rotation matrix
  
  modelMatrix.setRotate(0, 0, 0, 1);
  
  modelMatrix.setRotate(currentAngle, 0, 0, 1);
  modelMatrix.translate(0, coord_NS, 0);
  console.log('modelMatrix', modelMatrix);
  // Pass the rotation matrix to the vertex shader
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.uniformMatrix4fv(u_TransMatrix, false, transMatrix.elements);
  //u_TransMatrix
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw the rectangle
  gl.drawArrays(gl.LINE_LOOP, 0, n);
}

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

function prop_stop() {
  ANGLE_STEP = 0; 
}

var coord_NS_STEP = 0.01
function forward() {
  coord_NS += coord_NS_STEP; 
  console.log('coord_NS += 10', coord_NS)
}

function backward() {
  coord_NS -= coord_NS_STEP; 
  console.log('coord_NS -= 10', coord_NS)
}