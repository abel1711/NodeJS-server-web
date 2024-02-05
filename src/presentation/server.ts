import express, { Router } from 'express';
import path from 'path';
import compression from 'compression';

interface Options {
    port: number;
    public_path?: string;
    routes: Router;
}

export class Server {

    public readonly app = express();
    private readonly port: number;
    private serverListener ?: any;
    private readonly public_path: string;
    private readonly routes: Router;

    constructor(options: Options) {
        const { port, public_path = 'public', routes } = options;
        this.port = port;
        this.public_path = public_path;
        this.routes = routes;
    }
    async start() {

        //* Middlewares
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: true}));
        this.app.use( compression());

        //*Public folder
        this.app.use(express.static(this.public_path));

        //* Routes
        this.app.use( this.routes );
        
        //* SPA
        this.app.get('*', (req, res) => {
            const indexPath = path.join(__dirname + `../../../${this.public_path}/index.html`);
            res.sendFile(indexPath);
        });

        this.serverListener = this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    };

    public close () {
        this.serverListener?.close();
    }
};