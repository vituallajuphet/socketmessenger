var NodeSession  = require('node-session');
let session      = new NodeSession(
    {
        secret: 'Q3UBzdH9GEfiRCTKbi5MTPyChpzXLsTD', 
        lifetime: 9999999, 
        expireOnClose:true  
    }
);

module.exports   = session;