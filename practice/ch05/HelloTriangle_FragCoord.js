// HelloTriangle_FragCoord.js (c) 2012 matsuda
// Vertex shader program


// @@@ GLSL openGL Shading Language 의 약자였다.

var VSHADER_SOURCE =
  // attribute 와 uniform 의 차이가 뭔가???
  'attribute vec4 a_Position;\n' +
  'attribute float u_floatPointSize;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = 10.0;\n' + //u_floatPointSize;\n' + //10.0;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  // uniform 대신에 varying으로 바꾸면 어떻게 될까?
  // >>> 오류.
  'uniform float u_Width;\n' +
  'uniform float u_Height;\n' +
  'uniform float u_SizePt;\n' +
  'void main() {\n' +
  '  gl_FragColor = vec4(0.5/u_Width *u_Width, 0.5 / u_Height * u_Height, 0.1, 1.0);\n' + //gl_FragCoord.x/u_Width, 0.0, gl_FragCoord.y/u_Height, 1.0);\n' +
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
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw the rectangle
  gl.drawArrays(gl.POINTS, 0, n);
}

function initVertexBuffers(gl) {
  var vertices = new Float32Array([
    0, 0.5,   -0.5, -0.5,   0.5, -0.5,
    0, -1.5
    // vtx 하나 늘리면 어떻게 될까? 삼각형이었는데... color가 지정되는 code line이 어디인지 모르겠다
    // n = 2 로 줄이면? 
    //      >>>  아예안나온다. drawArrays TRIANGLES로 되어있기 때문이다. line으로 바꾸면?
    //          >>>  잘 나온다.
    // n = 1 로 줄이면?
    //      >>> 아예 안나온다. drawArrays POINTS 로 해야할 듯.
    //          >>> 그래도 안나온다.
    //          >>> POINT 는 a_PointSize 를 shader 에서 정의해야 나온다.
    // point size 를 host 에서 정의해서 shader에 넘겨보자.
  ]);
  var n = 2; // The number of vertices

  // define point size 이걸 써먹어야하는데... ARRAY_BUFFER에 잘 붙여넣어야하는데...
  var pointSize = 10.0;

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }


  // Bind the buffer object to target
  //                          target이 정확히 뭔가?
  // ARRAY_BUFFER 와 u_variable, a_variable
  // 
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  // Pass the position of a point to a_Position variable
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // 이렇게 해서 될까????
  var u_Width = gl.getUniformLocation(gl.program, 'u_Width');
  console.log(u_Width);
  
  console.log(gl.drawingBufferWidth);

  var u_floatPointSize = gl.getAttribLocation(gl.program, 'u_floatPointSize');
  if (u_floatPointSize < 0) {
    console.log('Failed to get the storage location of u_floatPointSize');
    return -1;
  }
  console.log(u_floatPointSize);
  console.log(typeof(u_Width));


  

  if (!u_Width) {
    console.log('Failed to get the storage location of u_Width');
    return;
  }

  var u_Height = gl.getUniformLocation(gl.program, 'u_Height');
  if (!u_Height) {
    console.log('Failed to get the storage location of u_Height');
    return;
  }

  // Pass the width and hight of the <canvas>  
  gl.uniform1f(u_Width, 400);//gl.drawingBufferWidth);
  gl.uniform1f(u_Height, gl.drawingBufferHeight);

  gl.uniform1f(u_floatPointSize, pointSize);
  // @@@ 이상하다 enable 위에는 vertexAttribPointer 이게 있기 마련인데...
  // >>> 위의 code line 에서 이미 정의 되었다.
  // Enable the generic vertex attribute array
  gl.enableVertexAttribArray(a_Position);

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return n;
}
