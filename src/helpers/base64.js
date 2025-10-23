class base64
{
    encode = str => {
        return Buffer.from(str).toString('base64');
    }

    decode = str => {
        return Buffer.from(str, 'base64').toString('utf-8');
    }
}

module.exports = new base64();