const { UserGame, UserGameBiodata, UserGameHistory } = require("../../models")
const jwt = require('jsonwebtoken')
const moment = require('moment')
const privateKey = 'Ari-Ganteng-Banget'
const { v4: uuidv4 } = require('uuid')

class AuthController {
  
  async login(req, res) {
    let {username, password} = req.body
    let user_game = await UserGame.findOne({where: {username: username }})
    if(!user_game?.username){
      return res.status(200).json({
        'message': 'Username not found'
      })
    }

    if(password != user_game?.password){
      return res.status(200).json({
        'message': 'Invalid password'
      })
    }

    let token = jwt.sign({
      id: user_game?.id,
      username: username,
      password: password
    }, privateKey, {
      expiresIn: '1d'
    });

    await UserGame.update({
      token: token
    }, {
      where: {
        id: user_game.id
      }
    })

    req.session.token = token

    return res.status(200).json({
      'message': 'Username & Password Match',
      'data': {
        'token': token,
        'expired_at': moment().add(1, 'days').format('YYYY-MM-DD HH:mm:ss')
      }
    })
  }

  async register(req, res) {
    let { username, password } = req.body
    let uid = uuidv4()
    UserGame.create({
      uid: uid,
      username: username,
      password: password
    }).then((usergame) => {
      return res.status(201).json({
        'message': 'Register success, please sign in',
        'data': usergame
      })
    }).catch((err) => {
      return res.status(400).json({
        'message': 'Failed'
      })
    })
  }
}

module.exports = AuthController