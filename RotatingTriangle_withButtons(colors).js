// RotatingTranslatedTriangle.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'attribute vec4 a_Color;\n' +
  'varying vec4 v_Color;\n' + // varying variable

  'void main() {\n' +
  '  gl_Position = u_ModelMatrix * a_Position;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =

  '//ifdef GL_ES\n' +
  'precision mediump float;\n' + // Precision qualifier (See Chapter 6)
  '//endif GL_ES\n' +
  'varying vec4 v_Color;\n' +    // Receive the data from the vertex shader
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
  '}\n';

// Rotation angle (degrees/second)
var ANGLE_STEP = 0;//45.0;

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

  // Current rotation angle
  var currentAngle = 0.0;
  // Model matrix
  var modelMatrix = new Matrix4();

  // Start drawing
  var tick = function() {
    currentAngle = animate(currentAngle);  // Update the rotation angle
    draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix);   // Draw the triangle
    requestAnimationFrame(tick, canvas);   // Request that the browser ?calls tick
  };
  tick();
}

function initVertexBuffers(gl) {
  var side1 = 0.1, length1 = 0.75;
  var side2 = 0.55, length2 = 0.5;
  var verticesColors = new Float32Array ([
    -side1/2, -length1/2, 1.5, 0.0, 0.0,
     side1/2, -length1/2, 0.0, 1.0, 0.0,
     side1/2,  length1/2, 0.0, 0.0, 1.0,
    -side1/2,  length1/2, 0.5, 0.5, 0.5,

    -side2/2, -length2/2, 0.25, 0.0, 0.0,
     side2/2, -length2/2, 0.25, 0.0, 0.0,
     side2/2,  length2/2, 0.25, 0.0, 0.0,
  ]);
  var n = 7;   // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  var FSIZE = vertexBuffer.BYTES_PER_ELEMENT;
  console.log('FSIZE', FSIZE);
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  // Assign the buffer object to a_Position variable
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  
  
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 4*5, 0);
  gl.enableVertexAttribArray(a_Position);   // Enable the assignment to a_Position variable


  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, true, 4*5, 4 * 2);
  gl.enableVertexAttribArray(a_Color);  // Enable the assignment of the buffer object

  if(a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  

  return n;
}

function draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix) {
  // Set the rotation matrix
  modelMatrix.setRotate(currentAngle, 0, 0, 1); 
  // Pass the rotation matrix to the vertex shader
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw the rectangle
  gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
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
