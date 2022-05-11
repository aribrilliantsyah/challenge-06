const { UserGame, UserGameBiodata, UserGameHistory } = require("../../models")
const { v4: uuidv4 } = require('uuid')

class UserGameController {
  
  getAll(req, res) {
    UserGame.findAll({
      include: [
        {
          model: UserGameBiodata,
          as: 'biodata'
        },
        {
          model: UserGameHistory,
          as: 'histories'
        }
      ]
    }).then((usergame) => {
      return res.status(200).json({
        'message': 'Success',
        'data': usergame
      })
    }).catch((err) => {
      console.log('woy ',err)
      return res.status(400).json({
        'message': 'Failed'
      })
    })
  }

  findByID(req, res) {
    UserGame.findOne({
      include: [
        {
          model: UserGameBiodata,
          as: 'biodata'
        },
        {
          model: UserGameHistory,
          as: 'histories'
        }
      ],
      where: {id: req.params.id }
    }).then((usergame) => {
      return res.status(200).json({
        'message': 'Success',
        'data': usergame
      })
    }).catch((err) => {
      console.log(err)
      return res.status(400).json({
        'message': 'Failed'
      })
    })
  }

  create(req, res) {
    let { username, password } = req.body
    let uid = uuidv4()
    UserGame.create({
      uid: uid,
      username: username,
      password: password
    }).then((usergame) => {
      return res.status(201).json({
        'message': 'Success',
        'data': usergame
      })
    }).catch((err) => {
      return res.status(400).json({
        'message': 'Failed'
      })
    })
  }

  update(req, res) {
    let id = req.params.id   
    let usergame_data = {
      username: req.body?.username,
      password: req.body?.password
    }
    let query = {
      where: {
        id: id
      }
    }

    const checkBefore = (id, success, failed) => {
      UserGame.findOne({
        include: [
          {
            model: UserGameBiodata,
            as: 'biodata'
          },
          {
            model: UserGameHistory,
            as: 'histories'
          }
        ],
        where: {id: id }
      }).then((usergame) => {
        return success(usergame)
      }).catch((err) => {
        return failed(err)
      })
    } 
    
    checkBefore(id, (data) => {
      if(!data){
        return res.status(200).json({
          'message': 'Data not found',
        })
      }

      UserGame.update(usergame_data, query).then((usergame) => {
        return res.status(200).json({
          'message': 'Success',
          'data': usergame_data
        })
      }).catch((err) => {
        console.log(err)
        return res.status(400).json({
          'message': 'Failed'
        })
      })
    }, (err) => {
      console.log(err)
      return res.status(400).json({
        'message': 'Failed'
      })
    })
  }

  delete(req, res) {
    let id = req.params.id
    const checkBefore = (id, success, failed) => {
      UserGame.findOne({where: {id: id }}).then((usergame) => {
        return success(usergame)
      }).catch((err) => {
        return failed(err)
      })
    } 
    
    checkBefore(id, async (data) => {
      if(!data){
        return res.status(200).json({
          'message': 'Data not found',
        })
      }

      await UserGameBiodata.destroy({
        where: {user_game_id: id}
      })
      await UserGameHistory.destroy({
        where: {user_game_id: id}
      })

      UserGame.destroy({
        where: {id: id }
      }).then((usergame) => {
        return res.status(200).json({
          'message': `Success delete data with id ${id}`,
        })
      }).catch((err) => {
        return res.status(400).json({
          'message': 'Failed'
        })
      })
    }, (err) => {
      console.log(err)
      return res.status(400).json({
        'message': 'Failed'
      })
    })
  }

}

module.exports = UserGameController