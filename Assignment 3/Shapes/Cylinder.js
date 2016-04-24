//http://www.webgl.no/WebGL/Tutorial/Cylinder/js/Cylinder.js

var modelViewMatrix = null;
var projectionMatrix = null;
var modelMatrix = null;
var viewMatrix = null;


var Cylinder = {
  count : 32,
  positions : {
    bot : {
      values : new Array(),
    },
    tops : {
      values : new Array(),
    },
    sides : {
      values : new Array(),
    },
  },
  AddPoint : function(){
    a=0, b=0, y=0;                              //Origin
    r = 1.0, g =1.0, b = 1.0, a = 1.0;           //RGBA color values
    rbt = 1.0, gbt = 0.0, bbt= 0.0;
    theta = (Math.PI/180) * ( 360 / this.count);  // Degrees = radians * (180 / pi)

    for (i = 0; i <= this.count; i++){
      x = Math.cos(theta*i);
      z = Math.sin(theta*i);

      this.positions.bot.values.push(x, y, z);
      this.positions.bot.values.push(rbt, gbt, bbt, a);

      this.positions.sides.values.push(x, y, z);
      this.positions.sides.values.push(r, g, b, a);
      this.positions.sides.values.push(x, y + 2, z);
      this.positions.sides.values.push(r, g, b, a);

      this.positions.tops.values.push(x, y + 2, z);
      this.positions.tops.values.push(rbt, gbt, bbt, a);
    }
  },
  init : function(){
    this.program = initShaders(gl, "Cylinder-vertex-shader", "Cylinder-fragment-shader");

    this.AddPoint();

    botFloat32 = new Float32Array(this.positions.bot.values);
    sidesFloat32 = new Float32Array(this.positions.sides.values);
    topFloat32 = new Float32Array(this.positions.tops.values);

    // Create Buffers for top, side, bot
    this.positions.bot.buffer = gl.createBuffer();
    this.positions.sides.buffer = gl.createBuffer();
    this.positions.tops.buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, this.positions.tops.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, topFloat32, gl.STATIC_DRAW);
    this.positions.tops.buffer.nmbrOfVertices = topFloat32.length/7;
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.positions.bot.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, botFloat32, gl.STATIC_DRAW);
    //this.positions.bot.buffer.nmbrOfVertices = botFloat32.length/7;
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.positions.sides.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, sidesFloat32, gl.STATIC_DRAW);
    this.positions.sides.buffers.nmbrOfVertices = sidesFloat32.length/7;
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  },
  drawBot : function(){
    var stride = (3 + 4)*4; //4 bytes per vertex
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positions.bot.buffer);
    this.positions.bot.attribute = gl.getAttribLocation(this.program, "vPosition");
    gl.vertexAttribPointer(this.positions.bot.attribute, 3, gl.FLOAT, false, stride, 0);
    gl.enableVertexAttribArray(this.positions.bot.attribute);

    var colorOffset = 3 * 4;
    vColor = gl.getAttribLocation(this.program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, stride, colorOffset);
    gl.enableVertexAttribArray(vColor);

    //modelviewMatrix.set(viewMatrix).multiply(modelMatrix);
    //gl.uniformMatrix4fv(modelViewMatrix, false, modelviewMatrix.elements);
    //gl.uniformMatrix4fv(projectionMatrix, false, projectionMatrix.elements);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, this.positions.bot.buffer.nmbrOfVertices);
  },
  drawSides : function(){
    var stride = (3 + 4)*4;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positions.sides.buffer);
    this.positions.sides.attribute = gl.getAttribLocation(this.program, 'vPosition');
    gl.vertexAttribPointer(this.positions.sides.attribute, 3, gl.FLOAT, false, stride, 0);
    gl.enableVertexAttribArray(this.positions.sides.attribute);

    var colorOffset = 3 * 4;
    vColor = gl.getAttribLocation(this.program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, stride, colorOffset);
    gl.enableVertexAttribArray(vColor);

    //modelviewMatrix.set(viewMatrix).multiply(modelMatrix);
    //gl.uniformMatrix4fv(modelViewMatrix, false, modelviewMatrix.elements);
    //gl.uniformMatrix4fv(projectionMatrix, false, projectionMatrix.elements);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.positions.sides.buffers.nmbrOfVertices);
  },
  drawTop : function(){
    var stride = (3 + 4)*4; //4 bytes per vertex
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positions.tops.buffer);
    this.positions.tops.attribute = gl.getAttribLocation(this.program, "vPosition");
    gl.vertexAttribPointer(this.positions.tops.attribute, 3, gl.FLOAT, false, stride, 0);
    gl.enableVertexAttribArray(this.positions.tops.attribute);

    var colorOffset = 3 * 4;
    vColor = gl.getAttribLocation(this.program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, stride, colorOffset);
    gl.enableVertexAttribArray(vColor);

    //modelviewMatrix.set(viewMatrix).multiply(modelMatrix);
    //gl.uniformMatrix4fv(modelViewMatrix, false, modelviewMatrix.elements);
    //gl.uniformMatrix4fv(projectionMatrix, false, projectionMatrix.elements);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, this.positions.tops.buffer.nmbrOfVertices);
  },
  draw : function(){
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);

    //modelMatrix.setIdentity();

    this.drawTop();
    this.drawBot();
    this.drawSides();
  },
}