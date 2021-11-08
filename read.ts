// const { time } = require('console');
const fs = require('fs');
const readline = require('readline');

type Matrix = [
    number[], number[], Float32Array[]
];


// from https://stackoverflow.com/questions/6156501/read-a-file-one-line-at-a-time-in-node-js
export const parseFile =  async function(filepath: string, delimiter: string = "\t", skipHeader: number = 0) {
    const fileStream = fs.createReadStream(filepath);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.
    var data: Float32Array[] = [];
    var times: number[] = [];
    var wavelengths: number[] = [];

    let i: number = 0;
    for await  (const line of rl) {
        // skip header lines
        if (i < skipHeader)
            continue;
        
        let split = line.split(delimiter);

        if (i === skipHeader){
            for (let j = 1; j < split.length; j++) {
                times.push(parseFloat(split[j]));
            }
        } else {
            wavelengths.push(parseFloat(split[0]));

            var arr: Float32Array = new Float32Array(times.length);
            // assert(times.length === split.length - 1);

            for (let j = 1; j < split.length; j++) {
                arr[j] = parseFloat(split[j]);
            }
            data.push(arr);
            // console.log(arr);
        }
        i++;
    }

    return [times, wavelengths, data] as Matrix;
}

function triangulate(times: number[], wavelengths: number[], index = 0): void {
    const t_min = times[0];
    const t_max = times[times.length - 1];
    
    const w_min = wavelengths[0];
    const w_max = wavelengths[wavelengths.length - 1];

    const t_diff = t_max - t_min;
    const w_diff = w_max - w_min;

    var t_transf = 1 - 2 * (0 - t_min) / t_diff;  // scale from 1 to -1
    var w_transf = 2 * (0 - w_min) / w_diff - 1;  // scale from -1 to 1

    console.log(t_transf, w_transf);
}


async function main(): Promise<void> {
    var filepath = `C:/Users/Dominik/Documents/MUNI/Organic Photochemistry/RealTimeSync/Projects/2020-Bilirubin - 2nd half/ELI/FSRS + TA, 405 nm ex/PP_2Z_dechirped_EXP.txt`;
    // var filepath = `C:/Users/Dominik/Documents/MUNI/Organic Photochemistry/RealTimeSync/Projects/2020-Bilirubin - 2nd half/HPLC/new HPLC/2E isomer.sirslt/UV_2E isomer.csv`;

    var [times, wavelengths, data] = await parseFile(filepath, '\t');
    
    console.log(times[times.length - 1]);
    console.log(wavelengths[wavelengths.length - 1]);

    triangulate(times, wavelengths, 0);

}

main();