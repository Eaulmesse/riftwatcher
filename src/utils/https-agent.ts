import https from 'https';

const riotHttpsAgent = new https.Agent({
    rejectUnauthorized: false,
});

export { riotHttpsAgent };