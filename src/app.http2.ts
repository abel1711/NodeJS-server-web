import fs from 'fs';
import http2 from 'http2';

const server = http2.createSecureServer({
key: fs.readFileSync('./keys/server.key'),
cert: fs.readFileSync('./keys/server.crt'),
}, (req, res)=>{
    res.write('Hola mundo')
    res.end()
});

server.listen( 8080, ()=>{
    console.log('server running on port 8080')
})

