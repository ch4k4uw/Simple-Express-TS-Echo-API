import * as Express from "express";
import * as Cors from "cors";
import * as BodyParser from "body-parser";

const port = process.env.PORT || 10003;
const app: Express.Express = Express();

async function performDelay(ms: number): Promise<void>;
async function performDelay(req: Express.Request): Promise<void>;
async function performDelay(req: Express.Request | number): Promise<void> {
    if (typeof req === 'number') {
        const ms = req as number;
        return new Promise<void>((resolve, _reject) => {
            setTimeout(function () {
                resolve();
            }, ms);
        });
    } else {
        const nreq = req as any;
        const delay = <number>(<any>(nreq.query || {}).delay || <any>(nreq.body || {}).delay);
        if (delay) {
            return await performDelay(+delay);
        } else {
            return await performDelay(0);
        }
    }
}
function handle(
    action: (req: Express.Request, res: Express.Response, next?: Express.NextFunction) => Promise<void>): (p1: Express.Request, p2: Express.Response, p3?: Express.NextFunction) => Promise<void> {
    return async function (req: Express.Request, res: Express.Response, next: Express.NextFunction): Promise<void> {
        try {
            await action(req, res, next);
        } catch (e) {
            next(e);
        }
    }
}

const router = Express.Router();
app.use(Cors());
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
app.use(router);

router.use(async (req, _res, next) => {
    console.log(`${req.method}: ${req.path}\t${new Date()}`);
    try {
        console.log('\x1b[90m\n%s', JSON.stringify(req.headers));
        console.log('\n\n\x1b[32m%s', JSON.stringify(req.query));
        console.log('\n\n\x1b[34m%s', JSON.stringify(req.body));
        console.log('\n\n\x1b[0m');
        await performDelay(req);
        next();
    } catch (e) {
        next(e);
    }
});

router.get('/api/echo/get/:param?', handle(async (req, res) => {
    res.type('json');
    const result: any = {
        request: {
            headers: req.headers,
            query: req.query,
            params: req.params
        },
        response: {
            headers: res.getHeaders()
        }
    };
    res.status(200).send(result);
}));

router.post('/api/echo/post/:param?', handle(async (req, res) => {
    res.type('json');
    const result: any = {
        request: {
            headers: req.headers,
            query: req.query,
            body: req.body,
            params: req.params
        },
        response: {
            headers: res.getHeaders()
        }
    };
    res.status(201).send(result);
}));

router.put('/api/echo/put/:param?', handle(async (req, res) => {
    res.type('json');
    const result: any = {
        request: {
            headers: req.headers,
            query: req.query,
            body: req.body,
            params: req.params
        },
        response: {
            headers: res.getHeaders()
        }
    };
    res.status(200).send(result);
}));

router.delete('/api/echo/delete/:param?', handle(async (req, res) => {
    res.type('json');
    const result: any = {
        request: {
            headers: req.headers,
            query: req.query,
            body: req.body,
            params: req.params
        },
        response: {
            headers: res.getHeaders()
        }
    };
    res.status(200).send(result);
}));

app.use(async (err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

router.use(async (_req, res, _next) => {
    res.status(404).send({ error: 'Not Found' });
});

app.listen(port, () => {
    console.log(`Listening on ${port} port`);
});