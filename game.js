"use strict";

let gl; // WebGL "context"
let x_f,y_f;
let tromino_created = false;
function map_point(P, Q, R, X, Y) {
  let mix_val = (R - P) / (Q - P);
  return X + (Y - X) * mix_val;
}

// create a set to store points filled

let info = {
  drawn_count :0,
  filled : [],


}
let vertices,colors;
let vertex_buffer, color_buffer;
function get_grid_square(n, i, j) {
  
  let points = [];
  let x1 = map_point(0, n, i, -1, 1);
  let y1 = map_point(0, n, n - j, -1, 1);

  let x2 = map_point(0, n, i + 1, -1, 1);
  let y2 = map_point(0, n, n - j - 1, -1, 1);
  points.push(vec2(x1, y1));
  points.push(vec2(x2, y2));
  points.push(vec2(x1, y2));
  points.push(vec2(x2, y1));
  points.push(vec2(x1, y1));
  points.push(vec2(x2, y2));
  return points;
}

function get_line(n,i,j,i_1,j_1,straight) {
  let offset = map_point(0,info["canvas_height"],3,0,2);
  let points = [];
  let x1 = map_point(0, n, i, -1, 1);
  let y1 = map_point(0, n, n - j, -1, 1);

  let x2 = map_point(0, n, i_1, -1, 1);
  let y2 = map_point(0, n, n - j_1, -1, 1);
  if (straight ==1) {
    points.push(vec2(x1-offset,y1-offset));
    points.push(vec2(x2-offset,y2+offset));
    points.push(vec2(x2+offset,y2+offset));
    points.push(vec2(x2+offset,y2+offset));
    points.push(vec2(x1+offset,y1-offset));
    points.push(vec2(x1-offset,y1-offset));
    // points.push(vec2(x1,y1));
    // points.push(vec2(x1,y1));
    // points.push(vec2(x1,y1));
    // points.push(vec2(x1,y1));
    // points.push(vec2(x1,y1));
    // points.push(vec2(x1,y1));
  }
  else {
    // points.push(vec2(x,y))
    // points.push(vec2(x,y))
    // points.push(vec2(x,y))
    // points.push(vec2(x,y))
    // points.push(vec2(x,y))
    // points.push(vec2(x,y))
    points.push(vec2(x1-offset,y1+offset));
    points.push(vec2(x2+offset,y1+offset));
    points.push(vec2(x2+offset,y1-offset));
    points.push(vec2(x2+offset,y1-offset));
    points.push(vec2(x1-offset,y1-offset));
    points.push(vec2(x1-offset,y1+offset));
  }
  // points.push(vec2(x2+offset, y2+offset));
  // points.push(vec2(x2+offset, y1+offset));
  // points.push(vec2(x1-offset, y1-offset));
  
  return points;
}

function add_grid_lines(vertices,colors,n) {

  for (let i = 1; i < n; i++) {
    let x = map_point(0,n,i,-1,1);
    vertices.push(vec2(x, -1));
    vertices.push(vec2(x, 1));
    colors.push(vec4(1,0,0,1));
    colors.push(vec4(1,0,0,1));
  }
  for (let i = 1; i < n; i++) {
    let y = map_point(0,n,i,-1,1);
    vertices.push(vec2(-1, y));
    vertices.push(vec2(1, y));
    colors.push(vec4(1,0,0,1));
    colors.push(vec4(1,0,0,1));
  }

}

function get_grid_square_color(i, j) {
  let color = vec4(1,1,1, 1);
  let colors = [];
  // if ((i + j) % 2 == 1) {
  //   color = vec4(0, 0, 0, 1);
  // }
  for (let k = 0; k < 6; k++) {
    colors.push(color);
  }
  return colors;
}

function add_gold_square(vertices, colors, n) {
  let random_x = Math.floor(Math.random() * n);
  let random_y = Math.floor(Math.random() * n);
  info.filled.push(random_x + "," + random_y);
  let gold = vec4(1, 223 / 255, 0, 1);

  vertices.push(...get_grid_square(n, random_x, random_y));
  for (let i = 0; i < 6; i++) {
    colors.push(gold);
  }
}

function add_tromino(vertices, colors, n, type, x, y,border) {
  let color = vec4(1, 0, 0, 1);
  // create a set of points to be filled
  let points = new Set();
  let f_x = Math.round(x);
  let f_y = Math.round(y);
  if (type == 1) {
    //   57, 47, 90
    color = vec4(54 / 255, 47 / 255, 90 / 255, 1);
    if (border) {
      vertices.push(...get_line(n,f_x,f_y,f_x,f_y-1,1));
      vertices.push(...get_line(n,f_x,f_y-1,f_x+1,f_y-1,0));
      vertices.push(...get_line(n,f_x+1,f_y+1,f_x+1,f_y-1,1));
      vertices.push(...get_line(n,f_x+1,f_y+1,f_x-1,f_y+1,0));
      vertices.push(...get_line(n,f_x-1,f_y+1,f_x-1,f_y,1));
      vertices.push(...get_line(n,f_x-1,f_y,f_x,f_y,0));
    }
    // vertices.push(...get_line(n,x,y,x,y+1));
    // vertices.push(...get_line(n,x,y,x,y+1));
    // vertices.push(...get_line(n,x,y+1,x+1,y+1));
    // vertices.push(...get_line(n,x+1,y+1,x+1,y-1));
    // vertices.push(...get_line(n,x+1,y-1,x-1,y-1));
    // vertices.push(...get_line(n,x-1,y-1,x-1,y));
    vertices.push(...get_grid_square(n, x, y));
    vertices.push(...get_grid_square(n, x, y - 1));
    // vertices.push(...get_grid_square(n, x, y - 1));
    vertices.push(...get_grid_square(n, x - 1, y));
    points.add(x + "," + y);
    points.add(x + "," + (y - 1));
    points.add((x - 1) + "," + y);
  } else if (type == 3) {
    color = vec4(0 / 255, 168 / 255, 107 / 255, 1);
    if (border) {

      vertices.push(...get_line(n,f_x,f_y+1,f_x,f_y,1));
      vertices.push(...get_line(n,f_x,f_y+1,f_x+1,f_y+1,0));
      vertices.push(...get_line(n,f_x+1,f_y+1,f_x+1,f_y-1,1));
      vertices.push(...get_line(n,f_x-1,f_y-1,f_x+1,f_y-1,0));
      vertices.push(...get_line(n,f_x-1,f_y,f_x-1,f_y-1,1));
      vertices.push(...get_line(n,f_x-1,f_y,f_x,f_y,0));
    }
    vertices.push(...get_grid_square(n, x, y));
    vertices.push(...get_grid_square(n, x - 1, y-1));
    vertices.push(...get_grid_square(n, x, y - 1));
    points.add(x + "," + y);
    points.add((x - 1) + "," + (y - 1));
    points.add(x + "," + (y - 1));
  } else if (type == 2) {
    
    // 255, 103, 0
    color = vec4(255 / 255, 103 / 255, 0 / 255, 1);
    if (border) {

      vertices.push(...get_line(n,f_x,f_y,f_x+1,f_y,0));
      vertices.push(...get_line(n,f_x+1,f_y+1,f_x+1,f_y,1));
      vertices.push(...get_line(n,f_x+1,f_y+1,f_x-1,f_y+1,0));
      vertices.push(...get_line(n,f_x-1,f_y+1,f_x-1,f_y-1,1));
      vertices.push(...get_line(n,f_x-1,f_y-1,f_x,f_y-1,0));
      vertices.push(...get_line(n,f_x,f_y-1,f_x,f_y,1));
    }


    vertices.push(...get_grid_square(n, x, y));
    vertices.push(...get_grid_square(n, x-1, y ));
    vertices.push(...get_grid_square(n, x-1, y-1));
    points.add(x + "," + y);
    points.add((x - 1) + "," + y);
    points.add((x - 1) + "," + (y - 1));
  } else {
    // 6, 71, 137
    color = vec4(6 / 255, 71 / 255, 137 / 255, 1);
    if (border) {

      vertices.push(...get_line(n,f_x,f_y,f_x+1,f_y,0));
      vertices.push(...get_line(n,f_x+1,f_y,f_x+1,f_y-1,1));
      vertices.push(...get_line(n,f_x-1,f_y-1,f_x+1,f_y-1,0));
      vertices.push(...get_line(n,f_x-1,f_y-1,f_x-1,f_y+1,1));
      vertices.push(...get_line(n,f_x-1,f_y+1,f_x,f_y+1,0));
      vertices.push(...get_line(n,f_x,f_y+1,f_x,f_y,1));
    }


    vertices.push(...get_grid_square(n, x, y-1));
    vertices.push(...get_grid_square(n, x-1, y - 1));
    vertices.push(...get_grid_square(n, x - 1, y));
    points.add(x + "," + (y - 1));
    points.add((x - 1) + "," + (y - 1));
    points.add((x - 1) + "," + y);
  }
  for (let i = 0; i < 18; i++) {
    colors.push(color);
  }
  if (border) {
    for (let i = 0; i<36;i++) {
      colors.push(color);
    }
  }
  return points

  // if (type != 1) {
  //     // add the tromino
  //     vertices.push(...get_grid_square(n,x,y));
  //     for (let i = 0; i < 6; i++) {
  //         colors.push(color);
  //     }
  // }
  // if (type != 2) {
  //     // add the tromino
  //     vertices.push(...get_grid_square(n,x,y+1));
  //     for (let i = 0; i < 6; i++) {
  //         colors.push(color);
  //     }
  // }

  // if (type != 3) {
  //     // add the tromino
  //     vertices.push(...get_grid_square(n,x+1,y));
  //     for (let i = 0; i < 6; i++) {
  //         colors.push(color);
  //     }
  // }
  // if (type != 4) {
  //     // add the tromino
  //     vertices.push(...get_grid_square(n,x+1,y+1));
  //     for (let i = 0; i < 6; i++) {
  //         colors.push(color);
  //     }
  // }
}


function get_grid_points(n) {
  let points = [];
  let colors = [];
  for (let i = -1; i <= n+1; i++) {
    for (let j = -1; j <= n+1; j++) {

      points.push(...get_grid_square(n, i, j));
      colors.push(...get_grid_square_color(i, j));

    }
  }
  console.log(points);
  return [points, colors];
}

function get_xy(n, a, b) {
  let x = map_point(-1, 1, a, 0, n);
  let y = map_point(-1, 1, b, 0, n);
  return [x,y];
  x = Math.floor(x);
  y = Math.floor(y);
  return [x, y];
}



window.onload = function init() {
  let canvas = document.getElementById("gl-canvas");
  // get canvas height
  info["canvas_height"] = canvas.clientHeight;
  gl = canvas.getContext("webgl2");
  if (!gl) alert("WebGL 2.0 isn't available");

  //  Configure WebGL
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  // get input with id "number"
  // let input = document.getElementById("number");
  let tilesfilled = document.getElementById("tiles_filled");
  let mistake = document.getElementById("mistake")
  let by2 = document.getElementById("2by2")
  let by4 = document.getElementById("4by4")
  let by8 = document.getElementById("8by8")
  let by16 = document.getElementById("16by16")
  let reset = document.getElementById("reset");
  reset.addEventListener("click",function(event) {
    [vertices, colors] = get_grid_points(n);
    info["initial_v"] = vertices.length;  
    info.filled = [];
  
    add_grid_lines(vertices, colors,n);
    info["grid"] = vertices.length- info["initial_v"];  
    tromino_created = false;
    info.drawn_count = 0;
  
    add_gold_square(vertices, colors,n);
    
  tilesfilled.innerHTML = `${info.filled.length} out of ${n*n} tiles filled`
  mistake.innerHTML = ""; 
    
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
  render();
  })
  
  by2.addEventListener("click",function(event) {
    n = 2;
    [vertices, colors] = get_grid_points(n);
    info["initial_v"] = vertices.length;  
    info.filled = [];
  
    add_grid_lines(vertices, colors,n);
    info["grid"] = vertices.length- info["initial_v"];  
    tromino_created = false;
  
    add_gold_square(vertices, colors,n);
        tromino_created = false;
    info.drawn_count = 0;
    tromino_created = false;
    info.drawn_count = 0;
    
  tilesfilled.innerHTML = `${info.filled.length} out of ${n*n} tiles filled`
  mistake.innerHTML = ""; 
    
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
  render();
  })
  by4.addEventListener("click",function(event) {
    n = 4;
    [vertices, colors] = get_grid_points(n);
    info["initial_v"] = vertices.length;  
    info.filled = [];
  
    add_grid_lines(vertices, colors,n);
    info["grid"] = vertices.length- info["initial_v"];  
    tromino_created = false;
    info.drawn_count = 0;
  
    add_gold_square(vertices, colors,n);
    
  tilesfilled.innerHTML = `${info.filled.length} out of ${n*n} tiles filled`
  mistake.innerHTML = ""; 
    
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
  render();
  })
  by8.addEventListener("click",function(event) {
    n = 8;
    [vertices, colors] = get_grid_points(n);
    info["initial_v"] = vertices.length;  
    info.filled = [];
  
    add_grid_lines(vertices, colors,n);
    info["grid"] = vertices.length- info["initial_v"];  
  
    add_gold_square(vertices, colors,n);
    tromino_created = false;
    info.drawn_count = 0;
    
  tilesfilled.innerHTML = `${info.filled.length} out of ${n*n} tiles filled`
  mistake.innerHTML = ""; 
    
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
  render();
  })
  by16.addEventListener("click",function(event) {
    n = 16;
    [vertices, colors] = get_grid_points(n);
    info["initial_v"] = vertices.length;  
    info.filled = [];
  
    add_grid_lines(vertices, colors,n);
    info["grid"] = vertices.length- info["initial_v"];  
  
    add_gold_square(vertices, colors,n);
    tromino_created = false;
    info.drawn_count = 0;
    
  tilesfilled.innerHTML = `${info.filled.length} out of ${n*n} tiles filled`
  mistake.innerHTML = ""; 
    
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
  render();
  })

  //  Load shaders and initialize attribute buffers
  let program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  // Compute data.
  let n = 2;
  [vertices, colors] = get_grid_points(n);
  info["initial_v"] = vertices.length;  

  add_grid_lines(vertices, colors,n);
  info["grid"] = vertices.length- info["initial_v"];  

  add_gold_square(vertices, colors,n);
  tilesfilled.innerHTML = `${info.filled.length} out of ${n*n} tiles filled`

  // // Choose a random int between 0 and 7
  // let random_x = Math.floor(Math.random() * 8);
  // let random_y = Math.floor(Math.random() * 8);
  // let gold = vec4(1,223/255,0,1);

  // vertices.push(...get_grid_square(8,random_x,random_y));
  // for (let i = 0; i < 6; i++) {
  //     colors.push(gold);
  // }

  // add_gold_square(vertices, colors, n);
  // add_random_tromino(vertices,colors,8);
  //   add_tromino(vertices, colors, n, 4, 2, 3);

  // add_tromino(vertices,colors,n,3,3.5,0.5);
  // add_tromino(vertices,colors,n,2,0.5,3.5);
  // add_tromino(vertices,colors,n,4,3.5,3.5);
  // add_tromino(vertices,colors,n,1,n+0.5,0);
  // add_tromino(vertices,colors,n,2,n+0.5,0);
  // console.log(colors);

  // Load the data into the GPU and bind to shader variables.
  vertex_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

  // Associate out shader variables with our data buffer
  let vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  color_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

  let vColor = gl.getAttribLocation(program, "vColor");
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);
  // add mouse movement listener
  let mode = 1;

  //   keyboard event listener to see if r is pressed
  document.addEventListener("keydown", function (event) {
    if (event.keyCode == 82) {
      mode += 1;
      if (mode > 4) {
        mode = 1;
      }
    } 
    if (event.keyCode == 49) {
      mode =1
    }
    else if (event.keyCode == 50) {
      mode =2
    }
    else if (event.keyCode == 51) {
      mode =3
    }
    else if (event.keyCode == 52) {
      mode =4
    }
    // if u pressed
    if (event.keyCode == 85 && info.drawn_count >0) {
      vertices.splice(vertices.length - 18, 18);
      colors.splice(colors.length - 18, 18);
      info.drawn_count-=1;
      info.filled.splice(info.filled.length-3,3);
      console.log(info.filled)
      
    }

      add_tromino(vertices, colors, n, mode, x_f, y_f,1);

      gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
      gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.DYNAMIC_DRAW);

      gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
      gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.DYNAMIC_DRAW);
      // console.log("added")
      render();
      // remove last 18 elements from vertices
      vertices.splice(vertices.length - 18-36, 18+36);
      colors.splice(colors.length - 18-36, 18+36);

      tilesfilled.innerHTML = `${info.filled.length} out of ${n*n} tiles filled`
    }
  );
  // // add mouse click listener

  canvas.addEventListener("click", function (event) {
    let x = event.clientX;
    let y = event.clientY;
    let rect = event.target.getBoundingClientRect();
    x = x - rect.left - canvas.width / 2;
    y = y - rect.top - canvas.height / 2;
    x /= canvas.width / 2;
    y /= canvas.height / 2;
    x_f = Math.min(Math.max(x, -1), 1);
    y_f = Math.min(Math.max(y, -1), 1);
    [x_f, y_f] = get_xy(n, x_f, y_f);
    let a = Math.round(x_f);
    let b = Math.round(y_f);
    console.log("uwu")
    if (a>0 && a<n && b>0 && b<n) {
      console.log(a,b);
    let p = add_tromino(vertices, colors, n, mode, Math.round(x_f), Math.round(y_f),0);
    // see if any element in p is in info.filled
    let flag = 0;
    // go over each element in set p


    for (let item of p) {
      if (info.filled.indexOf(item)!==-1) {
        flag = 1;
        console.log(item)
        break;
      }
    }
    if (flag == 0) {
      // add all elements of p in info.filled
      for (let item of p) {
        console.log(item);
        info.filled.push(item);
      }

    // console.log(p);
    // console.log(info.filled);
    tromino_created = false;
    info.drawn_count+=1
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.DYNAMIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.DYNAMIC_DRAW);
    // console.log("added")
    mistake.innerHTML = ""

    render();
    }
    else {
      mistake.innerHTML = "Can't place tile: A square is already covered."
      vertices.splice(vertices.length - 18, 18);
      colors.splice(colors.length - 18, 18);

    }
    }
    else {
      mistake.innerHTML = "Can't place tile: Tile goes outside the grid."
    }
    
  tilesfilled.innerHTML = `${info.filled.length} out of ${n*n} tiles filled`
    // console.log(event.target.getBoundingClientRect());
    // console.log(event.clientX,event.clientY);
  });

  // // add mouse click listener

  canvas.addEventListener("mousemove", function (event) {
    let x = event.clientX;
    let y = event.clientY;
    let rect = event.target.getBoundingClientRect();
    x = x - rect.left - canvas.width / 2;
    y = y - rect.top - canvas.height / 2;
    x /= canvas.width / 2;
    y /= canvas.height / 2;
    x_f = Math.min(Math.max(x, -1), 1);
    y_f = Math.min(Math.max(y, -1), 1);
    [x_f, y_f] = get_xy(n, x_f, y_f);
    
    add_tromino(vertices, colors, n, mode, x_f, y_f,1);
    tromino_created = true;

    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.DYNAMIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.DYNAMIC_DRAW);
    // console.log("added")
    render();
    // remove last 18 elements from vertices
    
    vertices.splice(vertices.length - 18-36, 18+36);
    colors.splice(colors.length - 18-36, 18+36);
    // console.log(event.target.getBoundingClientRect());
    // console.log(event.clientX,event.clientY);
  });

  // event listener mouseleave
canvas.addEventListener("mouseleave", function (event) {

  if (tromino_created) {
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.DYNAMIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.DYNAMIC_DRAW);
  }
  tromino_created=false;
  render();
  console.log("mouse left");
});
  render();
};


function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  // console.log(vertices.length);
  gl.drawArrays(gl.TRIANGLES, 0, info["initial_v"]);
  gl.drawArrays(gl.LINES, info["initial_v"], info["grid"]);
  gl.drawArrays(gl.TRIANGLES, info["initial_v"]+info["grid"],6);
  gl.drawArrays(gl.TRIANGLES,info["initial_v"]+info["grid"]+6,info.drawn_count*18)
  if (tromino_created) {
    gl.drawArrays(gl.TRIANGLES, vertices.length-18-36, 36);
    gl.drawArrays(gl.TRIANGLES, vertices.length-18, 18);

  }
  // console.log("render");
}
