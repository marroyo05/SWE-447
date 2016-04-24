/////////////////////////////////////////////////////////////////////////////
//
//  Solar.js
//
/////////////////////////////////////////////////////////////////////////////

"use strict";

//---------------------------------------------------------------------------
//
//  Declare our "global" variables, including the array of planets (each of
//    which is a sphere)
//

var canvas = undefined;
var gl = undefined;

// The list of planets to render.  Uncomment any planets that you are 
// including in the scene For each planet in this list, make sure to 
// set its distance from the sun, as well its size and colors 
var Planets = {
  Sun : new Sphere(),
  // Mercury : new Sphere(),
  // Venus : new Sphere(),
  Earth : new Sphere(),
  Moon : new Sphere(),
  Mars : new Sphere(),
  // Jupiter : new Sphere(),
  // Saturn : new Sphere(),
  // Uranus : new Sphere(),
  // Neptune : new Sphere(),
  // Pluto : new Sphere()
};

// Viewing transformation parameters
var V = undefined;  // matrix storing the viewing transformation

// Projection transformation parameters
var P = undefined;  // matrix storing the projection transformation
var near = 10;      // near clipping plane's distance
var far = 50;      // far clipping plane's distance

// Animation variables
var time = 0.0;      // time, our global time constant, which is 
                     // incremented every frame
var timeDelta = 0.5; // the amount that time is updated each fraime

// An angular velocity that could be applied to 
var angularVelocity = Math.PI / 10;

//---------------------------------------------------------------------------
//
//  init() - scene initialization function
//

function init() {
  canvas = document.getElementById("webgl-canvas");

  // Configure our WebGL environment
  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) { alert("WebGL initialization failed"); }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  // Initialize the planets in the Planets list, including specifying
  // necesasry shaders, shader uniform variables, and other initialization
  // parameters.  This loops adds additinoal properties to each object
  // in the Planets object;
  for (var name in Planets ) {
    
    var p = Planets[name];

    p.vertexShader = "Planet-vertex-shader";
    p.fragmentShader = "Planet-fragment-shader";

    p.init(18,8); 

    p.uniforms = { 
      color : gl.getUniformLocation(p.program, "color"),
      MV : gl.getUniformLocation(p.program, "MV"),
      P : gl.getUniformLocation(p.program, "P"),
    };
  }

  resize();

  window.requestAnimationFrame(render);  
}

//---------------------------------------------------------------------------
//
//  render() - render the scene
//

function render() {
  time += timeDelta;

  var ms = new MatrixStack();

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Specify the viewing transformation, and use it to initialize the 
  // matrix stack
  V = translate(0.0, 0.0, -0.5*(near + far));
  ms.load(V);  

  // Note: You may want to find a way to use this value in your
  //  application
  var angle = time * angularVelocity;

  //
  // Render the Sun.  Here we create a temporary variable to make it
  //  simpler to work with the various properties.
  //

  var Sun = Planets.Sun;
  var radius = SolarSystem.Sun.radius;
  var color = SolarSystem.Sun.color;

  ms.push();
  ms.scale(radius);
  gl.useProgram(Sun.program);
  gl.uniformMatrix4fv(Sun.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(Sun.uniforms.P, false, flatten(P));
  gl.uniform4fv(Sun.uniforms.color, flatten(color));
  Sun.draw();
  ms.pop();
 
  
  //
  // Render the Earth in a similar manner to how we rendered the Sun
  //
  
  var Earth = Planets.Earth;
  var earth_distance = SolarSystem.Earth.distance;
  var earth_radius = SolarSystem.Earth.radius;
  var earth_color = SolarSystem.Earth.color;
  
  ms.push();
  ms.rotate(angle, [0,1,0])
  ms.translate(radius*2,0,0);
  ms.scale(earth_radius);
  gl.useProgram(Earth.program);
  gl.uniformMatrix4fv(Earth.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(Earth.uniforms.P, false, flatten(P));
  gl.uniform4fv(Earth.uniforms.color, flatten(earth_color));
  Earth.draw();
  ms.pop();

  //
  // Create temperary variables for the moon.
  //
  
  var Moon = Planets.Moon;
  var moon_distance = SolarSystem.Moon.distance;
  var moon_radius = SolarSystem.Moon.radius;
  var moon_color = SolarSystem.Moon.color;
  
  ms.push();
  ms.rotate(angle, [0,1,0]);
  ms.translate(2*radius,0,0);
  ms.rotate(angle, [0,1,0]);
  ms.translate(2*earth_radius,0,0)
  ms.scale(moon_radius);
  gl.useProgram(Moon.program);
  gl.uniformMatrix4fv(Moon.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(Moon.uniforms.P, false, flatten(P));
  gl.uniform4fv(Moon.uniforms.color, flatten(moon_color));
  Moon.draw();
  ms.pop();
  
  //
  // Render Mars in a similar manner to how we rendered the earth
  //
  
  var Mars = Planets.Mars;
  var mars_distance = SolarSystem.Mars.distance;
  var mars_radius = SolarSystem.Mars.radius;
  var mars_color = SolarSystem.Mars.color;
  
  ms.push();
  ms.rotate(angle, [0,1,0])
  ms.translate(1.5*radius,0,0);
  ms.scale(mars_radius);
  gl.useProgram(Mars.program);
  gl.uniformMatrix4fv(Mars.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(Mars.uniforms.P, false, flatten(P));
  gl.uniform4fv(Mars.uniforms.color, flatten(mars_color));
  Mars.draw();
  ms.pop();


  window.requestAnimationFrame(render);
}

//---------------------------------------------------------------------------
//
//  resize() - handle resize events
//

function resize() {
  var w = canvas.clientWidth;
  var h = canvas.clientHeight;
   
  gl.viewport(0, 0, w, h);

  var fovy = 120.0; // degrees
  var aspect = w / h;

  P = perspective(fovy, aspect, near, far);
  
}

//---------------------------------------------------------------------------
//
//  Window callbacks for processing various events
//

window.onload = init;
window.onresize = resize;