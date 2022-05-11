const express = require("express")
const session = require('express-session')
const swaggerUi = require('swagger-ui-express')
const path = require('path')
const YAML = require('yamljs')
const UserGameRouterApi = require("./routes/api/UserGameRouter")
const UserGameBiodataRouterApi = require("./routes/api/UserGameBiodataRouter")
const UserGameHistoryRouterApi = require("./routes/api/UserGameHistoryRouter")
const AuthRouterApi = require("./routes/api/AuthRouter")
const UserGameRouter = require("./routes/UserGameRouter")
const UserGameBiodataRouter = require("./routes/UserGameBiodataRouter")
const UserGameHistoryRouter = require("./routes/UserGameHistoryRouter")
const AuthRouter = require("./routes/AuthRouter")

const app = express()
const port = process.env.PORT || 3000
const apiVersion = '/api/v1'
const swaggerDocument = YAML.load('collection.yaml')

app.set('view engine', 'ejs')

app.use(session({
    secret: 'wow-ini-rahasia',
    resave: false,
    saveUninitialized: true
}))
app.use(express.json())
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use('/static', express.static(path.join(__dirname, 'public')))

app.use(apiVersion, UserGameRouterApi)
app.use(apiVersion, UserGameBiodataRouterApi)
app.use(apiVersion, UserGameHistoryRouterApi)
app.use(apiVersion, AuthRouterApi)

app.use(UserGameRouter)
app.use(UserGameBiodataRouter)
app.use(UserGameHistoryRouter)
app.use(AuthRouter)

app.listen(port, () => {
    console.log(`Running at port ${port}`)
})