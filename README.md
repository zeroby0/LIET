# LIET - Light aided Information Encoding and Transmission

IIIT Bangalore IMTech 2015 batch Electronic Devices and Circuit Theory project,

## Light based communication protocol server.

Config file: `./config/default.json`. Change protocol and server settings from here.

Clone and run `yarn` or `npm install` to get started.  
`node index.js` starts the server and sends a packet. Start another process at the other end and send commands back and forth.

Todo:
- [ ] Server: Handle rejected packets
- [ ] Packet: Unused bits on first and second byte due to ASCII limitation.
- [ ] Database: Implement packet pools
