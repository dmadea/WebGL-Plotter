
// import parseFile from './read.js';
const { parseFile } = require('./read')

let canvas
let gl

function csvToArray(str, delimiter = ",") {
    // slice from start of text to the first \n index
    // use split to create an array from string by delimiter
    const headers = str.slice(0, str.indexOf("\n")).split(delimiter);
  
    // slice from \n index + 1 to the end of the text
    // use split to create an array of each csv value row
    const rows = str.slice(str.indexOf("\n") + 1).split("\n");
  }

function parseShaders(shadersText){

    var vertexShader = "";
    var fragmentShader = "";

    var writeToVertex = false;

    const lines = shadersText.split("\n");
    for (var i = 0; i < lines.length; i++) {
        if (lines[i].includes("// # SHADER VERTEX")){
            writeToVertex = true;
        } else if (lines[i].includes("// # SHADER FRAGMENT")){
            writeToVertex = false;
        }
        if (writeToVertex)
            vertexShader += `${lines[i]}\n`;
        else
            fragmentShader += `${lines[i]}\n`;
    }

    return  [vertexShader, fragmentShader];
}

async function loadShaderProgram(shaderFile) {
    
    // Fetch shader source code from given URLs

    let res;

    res = await fetch(shaderFile);
    const shaderSource = await res.text();

    var [vertexSource, fragmentSource] = parseShaders(shaderSource);

    // Util for loading individual shaders

    function loadShader(type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            if (type === gl.VERTEX_SHADER) {
                throw new Error(`(WebGL vertex shader) ${gl.getShaderInfoLog(shader)}`);
            } else if (type === gl.FRAGMENT_SHADER) {
                throw new Error(`(WebGL fragment shader) ${gl.getShaderInfoLog(shader)}`);
            }
        }

        return shader;
    }

    const vertexShader = loadShader(gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fragmentSource);
    
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(`(WebGL shader program) ${gl.getProgramInfoLog(vertexShader)}`)
    }

    return program;
}

// const FourCorners = new Float32Array([
//     // Z=0
//     // 1 --> 2
//     // | \   |
//     // |   \ |
//     // 0 <-- 3
    
//     -1,  -1,  0,
//     -1,   1,  0,
//      1,  -1,  0,
//      1,   1,  0,
// ]);

// const myVertices = FourCorners;

// function pointCloudSphere(radius, n) {
//     points = [];
    
//     for (let i = 0; i < n; i++) {
//         let a = (Math.random() * 2) - 1;
//         let b = (Math.random() * 2) - 1;
//         let c = (Math.random() * 2) - 1;
//         let axis = [a, b, c];
//         vec3.normalize(axis, axis);
        
//         let point = vec3.scale(vec3.create(), axis, radius);
        
//         point.forEach(element => {
//            points.push(element);
//         });
//     }

//     return new Float32Array(points);
// }

// const myVertices = pointCloudSphere(0.75, 1e5);

// const myIndices = new Int8Array([
//     0, 1, 3, 2
// ]);

class App {
    constructor() {

        this.filepath = `C:/Users/Dominik/Documents/MUNI/Organic Photochemistry/RealTimeSync/Projects/2020-Bilirubin - 2nd half/ELI/FSRS + TA, 405 nm ex/PP_2Z_dechirped_EXP.txt`;



        // this.modelMatrix = mat4.create();
        // this.viewMatrix = mat4.create();
        // this.projectionMatrix = mat4.create();

        // this.camera = {};
        // this.camera.translation = [0, 0, 0];
        // this.camera.rotation = quat.create();
    }
    
    async main() {
        canvas = document.querySelector(`canvas`);
        // canvas.width = window.innerWidth;
        // canvas.height = window.innerHeight;
        canvas.width = 800;
        canvas.height = 600;
        console.log(canvas);

        gl = canvas.getContext(`webgl`);
    
        if (!gl) {
            throw new Error(`This browser does not support WebGL`);
        }
        
        const program = await loadShaderProgram(`shaders.glsl`);
        gl.useProgram(program);
    
        const attributes = {
            position: gl.getAttribLocation(program, `vertex_position`)
        };
    
        // this.uniforms = {
        //     model_matrix: gl.getUniformLocation(program, `model_matrix`),
        //     view_matrix: gl.getUniformLocation(program, `view_matrix`),
        //     projection_matrix: gl.getUniformLocation(program, `projection_matrix`),
        // }
    
        const buffers = {
            vertex: gl.createBuffer(),
            // index: gl.createBuffer(),
        }

        // mat4.perspective(this.projectionMatrix, Math.PI/2, 16/9, 1e-4, 1e4);
        // mat4.ortho(this.projectionMatrix, -1, 1, -1, 1, -1, 0.1, 1);

        // window.onkeypress = e => {
        //     if (e.key == 'w') {
        //         this.camera.translation[2] += 0.25;
        //     } else if (e.key == 's') {
        //         this.camera.translation[2] -= 0.25;
        //     } else if (e.key == 'a') {
        //         this.camera.translation[0] -= 0.25;
        //     } else if (e.key == 'd') {
        //         this.camera.translation[0] += 0.25;
        //     }
            
        // }

        // canvas.onmousemove = e => {
        //     const r = quat.create();
            
        //     const radiansX = (2 * (e.pageX - canvas.offsetLeft) / canvas.width) - 1;
        //     quat.rotateY(r, r, radiansX);

        //     const radiansY = (2 * (e.pageY - canvas.offsetTop) / canvas.height) - 1;
        //     quat.rotateX(r, r, radiansY);

        //     mat4.fromQuat(this.modelMatrix, r);
        // }

        // document.querySelector('h1').onmousemove = canvas.onmousemove;

        var myVertices = new Float32Array([
            -1.0, 0,
            0, 1,
            1, 0,

            -1.0, 0,
            1, 0,
            0, -1
        ])
        
        // bind buffers and load data to GPU
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertex);
        gl.bufferData(gl.ARRAY_BUFFER, myVertices, gl.STATIC_DRAW);
    
        // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.index);
        // gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, myIndices, gl.STATIC_DRAW);

        // descripe data layout of the `position` attribute
        gl.vertexAttribPointer(
            attributes.position, 
            2, /* size */
            gl.FLOAT, /* type */
            false, /* normalized? */
            0, /* stride */
            0, /* offset */
        );

        gl.enableVertexAttribArray(attributes.position);

        // gl.enable(gl.DEPTH_TEST);

        gl.drawArrays(gl.TRIANGLES, 0, myVertices.length/2);
        
        // this.render();    

        var [times, wavelengths, data] = await parseFile(this.filepath, '\t');

        console.log(times);
        console.log(wavelengths);

       


    }



    // update() {
    //     mat4.rotateY(this.modelMatrix, this.modelMatrix, Math.PI/300);

    //     const center = vec3.add(vec3.create(), this.camera.translation, [0, 0, 1]);
        
    //     mat4.lookAt(this.viewMatrix, this.camera.translation, center, [0, 1, 0]);

    //     // set uniforms
    //     gl.uniformMatrix4fv(this.uniforms.model_matrix, false, this.modelMatrix);
    //     gl.uniformMatrix4fv(this.uniforms.view_matrix, false, this.viewMatrix);
    //     gl.uniformMatrix4fv(this.uniforms.projection_matrix, false, this.projectionMatrix);
    // }

    // render() {
    //     this.update();

    //     // gl.clearColor(1, 1, 1, 1);
    //     // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
    //     gl.drawArrays(gl.POINTS, 0, myVertices.length/3);
    //     requestAnimationFrame(this.render.bind(this));
    // }
}

const cls = new App();
cls.main();