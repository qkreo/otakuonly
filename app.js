const express = require('express');
const app = express();
const Http = require('http');
const http = Http.createServer(app);
const port = 5000;

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');

const indexRouter = require('./routes/index'); // 인덱스 라우터 경로
const errorHandlerMiddleware = require('./middlewares/error-handler-middleware');

app.use(express.json()); // 모든코드에서 body parser 를 등록해서 전역에 사용한다

app.use('/', indexRouter); // 인덱스 라우터 사용
app.use('/' ,errorHandlerMiddleware); // 에러 핸들러

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile)); // docs 대신 swagger로 수정한다.

http.listen(port, () => {
    console.log(port, '포트로 서버가 열렸어요!');
});
