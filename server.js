var express = require('express'),
    app = express(),
    port = 4000,
    staticFileHandler = express.static('./public');

app.use(staticFileHandler);

app.listen(port);
console.log('Express app started on port ' + port);
exports = module.exports = app;