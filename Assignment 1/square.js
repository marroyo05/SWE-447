  
var Square = {
    count : 4,   //number of vertices
    VertexPositions : { 
        values : new Float32Array([
        0.0, 0.0, // Vertex 0
        1.0, 0.0, // Vertex 1
        0.0, 1.0, // Vertex 2
        1.0, 1.0 // Vertex 3
        ]),
        numComponents: 2
    },
        
    colors : { 
        values : new Float32Array([ 
            1.0, 0.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            1.0, 1.0, 0.0, 1.0]),      //(R,G,B,A)
        numComponents : 4
     },
    
    indices : { 
        values : new Uint16Array([ 0, 1, 3, 2 ])
        },
    
    initBuffers : function(){
        var program = initShaders(gl, "vertex-shader", "fragment-shader");
        gl.useProgram(program);
        
        Square.VertexPositions.buffer = gl.createBuffer();        //Create positions buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, Square.VertexPositions.buffer);        // bind Buffer
        gl.bufferData(gl.ARRAY_BUFFER, Square.VertexPositions.values, gl.STATIC_DRAW);    // initialize buffer        
        var vPosition = gl.getAttribLocation(program, "vPosition");
        gl.vertexAttribPointer(vPosition, Square.VertexPositions.numComponents, gl.FLOAT, 0, 0, 0);
        gl.enableVertexAttribArray(vPosition);
        
        Square.colors.buffer = gl.createBuffer();        //Create color buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, Square.colors.buffer);        // bind Buffer
        gl.bufferData(gl.ARRAY_BUFFER, Square.colors.values, gl.STATIC_DRAW);    // initialize buffer
        var fColor = gl.getAttribLocation(program, "fColor");
        gl.vertexAttribPointer(fColor, Square.colors.numComponents, gl.FLOAT, 0, 0, 0);
        gl.enableVertexAttribArray(fColor);
    },
      
    initCanvas : function() {
        var canvas = document.getElementById("webgl-canvas");
        gl = WebGLUtils.setupWebGL(canvas);       
        if ( !gl ) { return; }       
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        Square.initBuffers();
        Square.render();
     },
     
    render : function() {
        var start = 0;
        var count = Square.count;
        gl.drawArrays(gl.TRIANGLE_STRIP, start, count);

    }
};




window.onload = Square.initCanvas;
