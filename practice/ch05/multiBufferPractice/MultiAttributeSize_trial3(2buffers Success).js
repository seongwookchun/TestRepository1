// MultiAttributeSize.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute float a_PointSize;\n' +
  'attribute vec4 a_Color;\n' +
  'varying vec4 v_Color;\n' + // varying variable
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = a_PointSize;\n' +
  '  v_Color = a_Color;\n' +  // Pass the data to the fragment shader
  '}\n';

// Fragment shader program
// Fragment shader program
var FSHADER_SOURCE =
  '//ifdef GL_ES\n' +
  'precision mediump float;\n' + // Precision qualifier (See Chapter 6)
  '//endif GL_ES\n' +
  'varying vec4 v_Color;\n' +    // Receive the data from the vertex shader
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
  '}\n';

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

  // Set the vertex information
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw three points
  gl.drawArrays(gl.POINTS, 0, n);
}

function initVertexBuffers(gl) {
  /*var dataArray1 = new Float32Array([
    0.05, 0.025, 5.0, 1.0,  0.0,  0.0,
   -0.05, -0.05, 10.0, 1.0,  0.5,  0.0, 
    0.05, -0.05, 15.0, 0.0,  0.0,  1.0,// vertex Positions, Point sizes, color
  ]);*/
  var dataArray1 = new Float32Array([
    0.,  0.5,  1.0,  0.0,  0.0,
   -0.5, 0.,   0.0,  1.0,  0.0, 
    0.5, 0.,   0.0,  0.0,  1.0,// vertex Positions, color
  ]);
  var dataArray2 = new Float32Array([
    15.0, 10.0, 15.0,// Point sizes
  ]);

  var n = 3;


  // Create a buffer object
  var dataBuffer1 = gl.createBuffer();
  var dataBuffer2 = gl.createBuffer();  
  var FSIZE = dataArray1
  .BYTES_PER_ELEMENT;

  if (!dataBuffer1) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Write vertex coordinates to the buffer object and enable it
  // bindBuffer1
  gl.bindBuffer(gl.ARRAY_BUFFER, dataBuffer1);
  gl.bufferData(gl.ARRAY_BUFFER, dataArray1, gl.STATIC_DRAW);
  console.log('hi');

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, true, FSIZE * 5, 0);
  gl.enableVertexAttribArray(a_Position);

  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, true, FSIZE * 5, FSIZE * 2);
  gl.enableVertexAttribArray(a_Color);  // Enable the assignment of the buffer object

  // 현재 위치와 color를 동시에 참조하고있다.

  // bindBuffer2
  gl.bindBuffer(gl.ARRAY_BUFFER, dataBuffer2);
  gl.bufferData(gl.ARRAY_BUFFER, dataArray2, gl.STATIC_DRAW);

  var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
  gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_PointSize);
  


  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  
  
  if(a_Position < 0 || a_PointSize < 0 || a_Color < 0) {
  console.log('Failed to get the storage location of a_Position');
  return -1;
  }

  return n;
}
