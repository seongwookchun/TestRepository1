// RotatedTriangle_Matrix4.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute float trans_diff;\n' +
  //'a_Position[1] += trans_diff\n' +
  'uniform mat4 u_xformMatrix;\n' +

  'void main() {\n' +
  '  gl_Position = u_xformMatrix * a_Position;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
  '}\n';


// Set the rotation matrix
var ANGLE = 15.0; // The rotation angle
var trans_diff = 0.0;

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



// ========================================================================================
// ========================================================================================


















/*
  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
*/
  

  var tick = function() {
      // Create Matrix4 object for the rotation matrix
  var xformMatrix = new Matrix4();

  /*
  // Set the rotation matrix
  var ANGLE = 15.0; // The rotation angle
  */
  
  xformMatrix.setRotate(ANGLE, 0, 0, 1);
  u_shiftMatrix = new Float32Array([
    ])
  // Pass the rotation matrix to the vertex shader
  var u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');
  //var u_shiftMatrix = gl.getUniformLocation(gl.program, 'u_shiftMatrix'); // Vsh 상의 obj와 host 상의 obj 를 연결시켜주는 듯.
  if (!u_xformMatrix || !u_shiftMatrix) {
    console.log('Failed to get the storage location of u_xformMatrix');
    return;
  }
  gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix.elements);

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
  // Draw the rectangle
  gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
  requestAnimationFrame(tick, canvas);
}; tick();


}



function initVertexBuffers(gl) {
  var side = 0.05
  var vertices = new Float32Array([
    -side,  side + trans_diff, 
    -side, -side + trans_diff, 
     side, -side + trans_diff,
     side,  side + trans_diff
  ]);
  var n = 4; // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return false;
  }

 // Create a buffer object2
  var vertexBuffer2 = gl.createBuffer();
  if (!vertexBuffer2) {
    console.log('Failed to create the buffer object2');
    return false;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);


// Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer2);
  // Write date into the buffer object
  //gl.bufferData(gl.ARRAY_BUFFER, trans_diff, gl.STATIC_DRAW);



  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);


  var trans_diff = gl.getAttribLocation(gl.program, 'trans_diff');
  if (trans_diff < 0) {
    console.log('Failed to get the storage location of trans_diff');
    return -1;
  }
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(trans_diff, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(trans_diff);


  return n;
}

function up() {
  ANGLE_STEP += 10; 
}

function down() {
  ANGLE_STEP -= 10; 
}

function forward() {
  trans_diff += 10;
  console.log('foward', trans_diff)
}

function backward() {
  trans_diff -= 10;
  console.log('backward', trans_diff)
}

function turn_left() {
  ANGLE += 10;
  console.log(ANGLE);
}

function turn_right() {
  ANGLE -= 10;
  console.log(ANGLE);
}









// 참고용
// ========================================================================================
// ========================================================================================

var test_array = new Float32Array([
  1, 1, 1, 1,
  0, 0, 0, 0,
  0, 0, 0, 0,
  0, 0, 0, 0
  ])

var test_array2 = new Float32Array([
  1, 1, 1, 1,
  0, 0, 0, 0,
  0, 0, 0, 0,
  0, 0, 0, 0
  ])

var test_array3 = test_array.map(function (num, idx) {
  return num + test_array2[idx];
}); // [6,8,10,12]
console.log(test_array3)
console.log(test_array3[1])