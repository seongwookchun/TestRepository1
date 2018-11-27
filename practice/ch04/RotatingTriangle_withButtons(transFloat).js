// RotatingTranslatedTriangle.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_ModelMatrix;\n' +

//  'uniform mat4 u_TransMatrix;\n' +
  //'uniform vec4 u_TransVector;\n' +
  'uniform float u_TransFloat;\n' +

  //'varying mat4 trans;\n' +
  'void main() {\n' +
/*  '  u_TransVector[0] = u_TransMatrix[0, 0];\n' +
  '  u_TransVector[1] = u_TransMatrix[1, 1];\n' +
  '  u_TransVector[2] = u_TransMatrix[2, 2];\n' +
  '  u_TransVector[3] = u_TransMatrix[3, 3];\n' + */
//  '  gl_Position = (u_ModelMatrix + u_TransMatrix) * a_Position;\n'+// u_TransMatrix;\n' +
//  '  gl_Position = u_ModelMatrix * a_Position +u_TransVector;\n'+// u_TransMatrix;\n' +
  '  gl_Position = u_ModelMatrix * a_Position + vec4(0.25, u_TransFloat, 0, 0);\n' +
  //'  trans = u_TransMatrix; \n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
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

  // Write the positions of vertices to a vertex shader
  var n = initVertexBuffers(gl);      // 함수의 내용을 동시에 실행시키는 동시에, n의 필요한 값을 할당했다. 좋은 테크닉이다.
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // test draw a point before main thing
  gl.drawArrays(gl.POINTS, 0, 1);
  var testBuffer = gl.createBuffer();

  // Get storage location of u_ModelMatrix
  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  //var u_TransMatrix = gl.getUniformLocation(gl.program, 'u_TransMatrix');
  var u_TransFloat = gl.getUniformLocation(gl.program, 'u_TransFloat');

  if (!u_ModelMatrix) { 
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }
  /*if (!u_TransMatrix) { 
    console.log('Failed to get the storage location of u_TransMatrix');
    return;
  }
  if (!u_TransFloat) { 
    console.log('Failed to get the storage location of u_TransFloat');
    return;
  }*/


  // predefine buffers
  var transFloatBuffer = gl.createBuffer();
  

  
  // Current rotation angle
  var currentAngle = 0.0;
  // Model matrix
  var modelMatrix = new Matrix4();
  var transMatrix = new Matrix4();
  var transFloat = 1.25;
  //console.log(transMatrix);
  
  
  // Start drawing
  
  
  var tick = function() {
    gl.bindBuffer(gl.ARRAY_BUFFER, transFloatBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, transFloat, gl.STATIC_DRAW);
    
    currentAngle = animate(currentAngle);  // Update the rotation angle
    // Set the rotation matrix
    modelMatrix.setRotate(currentAngle, 0, 0, 1);  
    
    draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix, transMatrix,);// u_TransMatrix);   // Draw the triangle
    requestAnimationFrame(tick, canvas);   // Request that the browser ?calls tick
  };
  tick();

  // Register the event handler to be called on key press
  document.onkeydown = function(ev){keydown(ev, transMatrix); };

  var transFloat = - 0.0;

  function keydown(ev, transFloat, transMatrix, modelMatrix) {
    if(ev.keyCode == 37) { // The left arrow key was pressed
      console.log('hi console');

    } else 
    if(ev.keyCode == 39) { // The right arrow key was pressed
      console.log('hi console');
    } else 
    if(ev.keyCode == 38) { // The up arrow key was pressed
      /*transMatrix.translate(0.05, 0, 0);
      transMatrix = modelMatrix * transMatrix;*/
      transFloat = transFloat + 0.05;
      console.log(transFloat);
      //console.log(transMatrix);
      console.log('hi console, up');
    } else 
    if (ev.keyCode == 40) { // The down arrow key was pressed
      //transMatrix.translate(-0.05, 0, 0);
      //transMatrix = modelMatrix * transMatrix;
      //transFloat = transFloat - 0.05;
      transFloat += - 0.05;
      console.log(transFloat);
      //console.log(transMatrix);
      console.log('hi console, down');
    } else { return; }

}
}




function initVertexBuffers(gl, transFloat) {
  var side = 0.25, length = 0.75;
  var vertices = new Float32Array ([
     side/2,  length/2,-side/2,  length/2,
    -side/2, -length/2, side/2, -length/2, 0.0
  ]);
  var n = 4;   // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object, which buffer try to find');
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





function draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix, transFloat, u_TransFloat, transMatrix, u_TransMatrix) {
  //modelMatrix.translate(0.35, 0, 0);
 
  // Pass the rotation matrix to the vertex shader
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  //gl.uniformMatrix4fv(u_TransMatrix, false, transMatrix.elements);
  //gl.uniform(u_TransFloat, false, transFloat);
  
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw the rectangle
  gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
}



// Rotation angle (degrees/second)
var ANGLE_STEP = 45.0;

// Last time that this function was called
var g_last = Date.now();
function animate(angle) {
  // Calculate the elapsed time
  var now = Date.now();
  var elapsed = now - g_last;
  g_last = now;
  // Update the current rotation angle (adjusted by the elapsed time)
  var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
  

  //console.log('elapsed', elapsed);
  //if (elapsed%1000 == 0) {
    //console.log('transFloat', transFloat);
  //}
  return newAngle %= 360;
}





function up() {
  ANGLE_STEP += 10; 
}

function down() {
  ANGLE_STEP -= 10; 
}
