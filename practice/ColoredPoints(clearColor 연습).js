// HelloPoint1.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = 
  'void main() {\n' +
  '  gl_Position = vec4(0.0, 0.0, 0.0, 1.0);\n' + // Set the vertex coordinates of the point
  '  gl_PointSize = 10.0;\n' +                    // Set the point size
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' + // Set the point color
  '}\n';

function main() {
  // Retrieve <canvas> element
  var canvas1 = document.getElementById('webgl');
  var canvas2 = document.getElementById('webgl2');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas1);
  var gl2 = getWebGLContext(canvas2);
  gl2.clear(gl2.COLOR_BUFFER_BIT);

  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Register the event handler to be called on key press
  document.onkeydown = function (ev) { keydown(ev, gl); };

  draw(gl, k1 = 0, k2 = 0, k3 = 0);

  draw(gl2, k1 = 0, k2 = 0, k3 = 0);
  //draw();

    var key_1 = 0., key_2 = 0., key_3 = 0.;
    var k_stride = 0.01, k_chgCvs = 1;
    k_listCvs = [gl, gl2];
    list_test = ['one', 'two'];
    console.log('listCvs', k_listCvs[-1], k_listCvs[0]);//, k_listCvs[1]);
    console.log('list_test', list_test[-1], list_test[0], list_test[1]);//, k_listCvs[1]);
    console.log('k_listCvs', k_listCvs);
    function keydown(ev, var_gl) {
        
        if (ev.keyCode == 65) { // The right arrow key was pressed
            key_1 += k_stride;
        } else
            if (ev.keyCode == 65 + 19 - 1) { // S
                key_2 += k_stride;
            } else
                if (ev.keyCode == 65 + 4 - 1) { // D
                    key_3 += k_stride;
                } else

                    if (ev.keyCode == 65 + 18 - 1) { // R
                        k_stride = k_stride * (-1);
                        
                    } else
                        if (ev.keyCode == 65 + 17 - 1) { // Q chane inter canvas
                            k_chgCvs = (k_chgCvs + 1) % 2;
                        } else { return; }
        var_gl = k_listCvs[k_chgCvs]
        draw(var_gl, k1 = key_1, k2 = key_2, k3 = key_3);
        console.log(k_stride);
        console.log('R,G,B', key_1, key_2, key_3);
    }
    function draw(var_gl, k1=0, k2=0, k3=0) {
      // Specify the color for clearing <canvas>
      //gl.clearColor(0.0, 0.0, 0.0, 1.0);
      var_gl.clearColor(0. + k1, 0. + k2, 0. + k3, 1);

      // Clear <canvas>
      var_gl.clear(var_gl.COLOR_BUFFER_BIT);
      console.log('gl.COLOR_BUFFER_BIT', var_gl.COLOR_BUFFER_BIT);
      // Draw a point
      var_gl.drawArrays(var_gl.POINTS, 0, 1);
    }
}



// key event를 추가하여 gl.clearColor를 연습했습니다.
// 또한, COLOR_BUFFER_BIT 는 gl.clearColor의 RGB가 달라져도 변하지 않고 그대로입니다.

