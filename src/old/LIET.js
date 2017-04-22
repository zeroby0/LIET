const SerialPort = require('serialport');
const sha1 = require('sha1');
const EventEmitter = require('events');
const config = require('config');

const DB = require('./database');
const Parser = require('./parser');
const Util = require('./util');

class LIET extends EventEmitter{
    constructor(deviceId, baudRate, todo) {
        super();
        this.port = new SerialPort(deviceId, {
            baudRate,
        });

        // this.parser = new Parser();
        // function to call once module is ready
        this.todo = todo;

        this.port.on('error', err =>
            console.log('Error occured : ', err.message)
        );

        this.port.open((err) => {
            if (err) {
                console.log('Error opening port: ', err.message);
            }
            
        });

        this.port.on('open', () => {
            console.log('Port opened');
            this.todo(this);
        });

        this.port.on('data', (data, liet = this) => liet.recievedData(data));

        this.instructionMeta = {
            cycleCount: null,
            data: '',
        };

        this.outstructionMeta = {
            cycleCount: null,
            data: '',
        };
    }

    recievedData(data) {
        console.log('buffer data size: ', Buffer.byteLength(data));
        const instruction = new Buffer(data, 'base64').toString('ascii');
        console.log('instruction size: ', Buffer.byteLength(instruction));
        console.log();
        console.log('\n[Data inflow ', this.instructionMeta.cycleCount, '] --------', instruction);
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
            if (this.instructionMeta.cycleCount > 0) {
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

    /*
     * send Instruction cycle count and wait for acknowledgement
     * then send instruction data on acknowledgement
     * this is done in case 'recieved_cycle_count'
     * of recievedData(data) function
     */
    sendInstruction(instruction) {
        const stringifiedInstruction = JSON.stringify(instruction);
        const instructionHash = Util.calcHash(stringifiedInstruction, 6);
        const dataToBeSent = stringifiedInstruction + instructionHash;
        console.log('{send instruction}');
        this.port.flush(() => {

            const lengthOfDataRecieved = config.get('other.data_recieve_length');

            const lengthOfDataToBeSent = Buffer.byteLength(dataToBeSent);
            const numberOfCycles = ((lengthOfDataToBeSent / lengthOfDataRecieved) - 1);
            const cycleCountInt = Math.ceil(numberOfCycles);

            const cycleCount = (cycleCountInt).toString();

            this.outstructionMeta = {
                cycleCount,
                data: dataToBeSent,
            };
            this.sendCycleCount();
        });
    }

    static makeHash(data) {
        const hash = sha1(data);
        return hash.substring(0, 6);
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

    resetOutstructionMeta() {
        this.outstructionMeta = {
            cycleCount: null,
            data: '',
        };
    }

    sendInstructionToParser() {
        Parser.parse(this.instructionMeta.data);
        this.resetOutstructionMeta();
        this.resetInstructionMeta();
    }

    // cycleCount : string
    saveInstructionCycleCount(cycleCount) {
        console.log('   [saving cycle count ] - ', cycleCount);
        this.instructionMeta.cycleCount = parseInt(cycleCount, 10);
    }

    decrementInstructionCycleCount() {
        this.instructionMeta.cycleCount -= 1;
    }

    sendAcknowledgement() {
        this.port.write('recieved_cycle_count', () => {
            console.log('   {sent cyclecount acknowledgement}');
        });
    }

    sendCycleCount() {
        this.port.write(this.outstructionMeta.cycleCount);
        console.log('   {sent cyclecount}');
    }

    sendInstructionData() {
        console.log('   {sending instruction data}\n\n');
        this.port.write(String(this.outstructionMeta.data));
        this.resetOutstructionMeta();
    }
}
module.exports = LIET;
