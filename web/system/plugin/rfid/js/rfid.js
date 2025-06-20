let port;
let reader;
let inputDone;
let outputDone;
let inputStream;
let outputStream;

var tempValue ="";

async function RFIDConnect(callback){
    port = await navigator.serial.requestPort().
        then({
            
        })
        .catch((e) =>{
            callback("false*_*" + e);
            return;
        })

    await port.open({baudRate: 115200})
        .then(()=>{
            let decoder = new TextDecoderStream();
            inputDone = port.readable.pipeTo(decoder.writable);
            inputStream = decoder.readable;

            reader = inputStream.getReader();
            ReadLoop();

            const encoder = new TextEncoderStream();
            outputDone = encoder.readable.pipeTo(port.writable);
            outputStream = encoder.writable;
            callback("true*_*");
        })
        .catch((e) =>{
            callback("false*_*" + e);
            return;
        });   
}

async function ReadLoop(){
    while (true) {
        const {value, done} = await reader.read();
        if(value) {
            if(value == '+'){
                tempValue = "";
            }else if(value == '-'){
                RFIDResponse(tempValue);
                tempValue = "";
            }else{
                tempValue += value;
            }
        }
        if (done) {
          console.log('[readLoop] DONE', done);
          reader.releaseLock();
          break;
        }
    }
}

async function RFIDWrite(command){
    const writer = outputStream.getWriter();
    writer.write(command);
    /*var toSend = command;
    for(var i=0; i<toSend.length; i++){
        var char = toSend.charAt(i);
        writer.write(char);
    }*/
    writer.releaseLock();
}