const SerialPort = require('serialport');
const Parser = require('./parser');

class LIET {
    constructor(deviceId, baudRate, todo) {
        this.port = new SerialPort(deviceId, {
            baudRate,
        });

        this.parser = new Parser();
        // function to call once module is ready
        this.todo = todo;

        this.port.on('error', err =>
            console.log('Error occured : ', err.message)
        );



        this.port.open((err, liet=this) => {
            if (err) {
                console.log('Error opening port: ', err.message);
            }
            liet.todo(liet);
        });

        this.port.on('open', () => {
            console.log('Port opened');
        });

        this.port.on('data', (data, liet=this) => liet.recievedData(data));

        this.instructionMeta = {
            cycleCount: null,
            data: '',
        };

        this.outstructionMeta = {
            cycleCount: null,
            data: '',
        };

    }

    makeHash(data) {
        return require('crypto').createHash('md5').update(data).digest("hex");
    }

    recievedData(data) {
        console.log('buffer data size: ',Buffer.byteLength(data));
        const instruction = new Buffer(data, 'base64').toString('ascii');
        console.log('instruction size: ',Buffer.byteLength(instruction));
        console.log();
        console.log('\n[Data inflow ' + this.instructionMeta.cycleCount  + '] --------', instruction);
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
            data: '',
        };
    }

    sendInstructionToParser() {
        this.parser.parse(this.instructionMeta.data);
        this.resetOutstructionMeta();
        this.resetInstructionMeta();

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
            console.log('   {sent cyclecount acknowledgement}');
        });
    }

    collectInstruction(instruction) {
        // console.log('data: ', instruction, ' count: ', this.instructionMeta.cycleCount);
        switch (this.instructionMeta.cycleCount) {
        case 0:
            console.log('       [last bit of instruction] - ', instruction);
            this.appendToInstructionData(instruction);
            this.sendInstructionToParser();
            this.resetInstructionMeta();
            break;
        case null:
            console.log('       [instruction count recieved] - ', instruction);
            this.saveInstructionCycleCount(instruction);
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
                console.log('-             ', 'data recieved: ', instruction);
            }

        }
    }

    resetOutstructionMeta(){
        this.outstructionMeta = {
            cycleCount: null,
            data: '',
        };
    }

    sendCycleCount() {
        this.port.write(this.outstructionMeta.cycleCount);
        console.log('   {sent cyclecount}');
    }

    sendInstructionData() {
        console.log('   {sending instruction data}');
        this.port.write(String(this.outstructionMeta.data));
        this.resetOutstructionMeta();
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

            const LENGTH_OF_DATA_RECIEVED = 32.0;
            const LENGTH_OF_DATA_TO_BE_SENT = Buffer.byteLength(instruction);
            const CYCLE_COUNT = ( LENGTH_OF_DATA_TO_BE_SENT/LENGTH_OF_DATA_RECIEVED  - 1 );
            const INT_CYCLE_COUNT = Math.ceil( CYCLE_COUNT );

            const cycleCount = ( INT_CYCLE_COUNT ).toString();

            this.outstructionMeta = {
                cycleCount,
                data: instruction,
            };
            this.sendCycleCount();

        });
    }
}
module.exports = LIET;
