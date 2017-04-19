const SerialPort = require('serialport');

class LIET {
    constructor(deviceId, baudRate) {
        this.port = new SerialPort(deviceId, {
            baudRate,
        });
        this.port.on('error', err =>
            console.log('Error occured : ', err)
        );

        this.port.open((err, liet=this) => {
            if (err) {
                console.log('Error opening port: ', err.message);
            }
            liet.sendInstruction('HelloWorldi\n');
            console.log('Sent instruction');
        });

        this.port.on('open', () => {
            console.log('Port opened');
        });

        this.port.on('data', (data, liet=this) => liet.recievedData(data));

        this.instructionMeta = {
            cycleCount: null,
            data: null,
        };

        this.outstructionMeta = {
            cycleCount: null,
            data: null,
        };
    }

    recievedData(data) {
        
        const instruction = new Buffer(data, 'base64').toString('ascii');
        console.log('[Data inflow] --------', instruction);
        switch (instruction) {
        case 'recieved_cycle_count':
            console.log('   [count_cycle_acknowledgement]');
            this.sendInstructionData();
            break;
        default:
            console.log('   [instruction data]');
            this.collectInstruction(instruction);
            break;

        }
    }

    appendToInstructionData(partialInstruction) {
        this.instructionMeta.data += partialInstruction;
    }

    resetInstructionMeta() {
        this.instructionMeta = {
            cycleCount: null,
            data: null,
        };
    }

    sendInstructionToParser() {
        this.parser(this.instructionMeta.data);
    }

    // cycleCount : string
    saveInstructionCycleCount(cycleCount) {
        console.log('   [saving cycle count ] - ', cycleCount);
        this.instructionMeta.cycleCount = parseInt(cycleCount, 10);
    }

    decrementInstructionCycleCount(){
        this.instructionMeta.cycleCount -= 1;
    }

    sendAcknowledgement(){
        this.port.write('recieved_cycle_count', ()=> {
            console.log('   ')
        });
    }

    collectInstruction(instruction) {
        console.log('data: ', instruction, ' count: ', this.instructionMeta.cycleCount);
        switch (this.instructionMeta.cycleCount) {
        case 0:
            console.log('       [last bit of instruction] - ', instruction);
            this.appendToInstructionData(instruction);
            this.sendInstructionToParser();
            this.resetInstructionMeta();
            break;
        case null:
            console.log('       [instruction count recieved] - ', instruction);
            this.saveInstructionCycleCount(Instruction);
            this.sendAcknowledgement();
            break;
        default:
            if(this.instructionMeta.cycleCount > 0){
                console.log('       [instruction partial recvs] - ', instruction);
                this.appendToInstructionData(instruction);
                this.decrementInstructionCycleCount();
            } else {
                console.log('Error occured: InstructionCycleCount < 0');
                console.log('-             ', this.instructionMeta.cycleCount);
                console.log('-             ', 'data recieved: ', Instruction);
            }

        }
    }

    sendCycleCount() {
        this.port.write(this.instructionMeta.cycleCount);
    }

    sendInstructionData() {
        this.port.write(this.instructionMeta.data);
        this.resetInstructionMeta();
    }

    /*
     * send Instruction cycle count and wait for acknowledgement
     * then send instruction data on acknowledgement
     * this is done in case 'recieved_cycle_count'
     * of recievedData(data) function
     */
    sendInstruction(instruction) {
        console.log('{send instruction}');
        this.port.flush(() => {
            const cycleCount = Math.ceil(Buffer.byteLength(instruction / 32.0)).toString();
            this.instructionMeta = {
                cycleCount,
                data: instruction,
            };
            this.sendCycleCount();
        });
    }

    parser(data) {
        console.log('parser: ',data);
    }
}
module.exports = LIET;
