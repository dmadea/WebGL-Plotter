// # SHADER VERTEX

precision highp float;

attribute vec4 vertex_position;

// transformations in world-space, like translating an object
// Without the model matrix, all objects would remain at the origin (0,0,0)
// uniform mat4 model_matrix;

// transformations in camera-space, like rotating the camera
// The view matrix determines what region of the world will be on-screen.
// uniform mat4 view_matrix;

// transformation in screen-space, like applying perspective.
// Without the projection matrix, the world would be viewed orthographically
// uniform mat4 projection_matrix;

varying vec2 fragment_position;

void main() {
    fragment_position = vertex_position.xy;

    // mat4 mvp = projection_matrix * view_matrix * model_matrix;
    // gl_Position = mvp * vec4(vertex_position, 1);

    // gl_Position = vec4(vertex_position.xy, 0.0, 1.0);
    gl_Position = vertex_position;


    // gl_PointSize = 1.0;
}


// # SHADER FRAGMENT

precision highp float;

varying vec2 fragment_position;

void main() {
    // gl_FragColor = vec4(0.0, 0.2, 0.2, 1.0);

    vec2 color_pos = fragment_position / 2.0 + 0.5;

    gl_FragColor = vec4(color_pos.x, 1, 0.5, color_pos.y);


    // gl_FragColor = vec4(
    //     (fragment_position.x+1.0)*0.5,
    //     (fragment_position.y+1.0)*0.5, 
    //     1, 
    //     1);
}

