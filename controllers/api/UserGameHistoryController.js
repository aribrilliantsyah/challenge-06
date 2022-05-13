const { UserGame, UserGameHistory } = require("../../models")
const getInterval = require('../../utils/time')

class UserGameHistoryController {
  
  getAll(req, res) {
    let user_game_id = req.query?.user_game_id
    if(user_game_id){
      UserGameHistory.findAll({
        where: {user_game_id: user_game_id},
        include: [
          {
            model: UserGame,
            as: 'user'
          }
        ]
      }).then((userhistory) => {
        return res.status(200).json({
          'message': 'Success',
          'data': userhistory
        })
      }).catch((err) => {
        //console.log('woy ',err)
        return res.status(400).json({
          'message': 'Failed'
        })
      })
    }else{
      UserGameHistory.findAll({
        include: [
          {
            model: UserGame,
            as: 'user'
          }
        ]
      }).then((userhistory) => {
        return res.status(200).json({
          'message': 'Success',
          'data': userhistory
        })
      }).catch((err) => {
        //console.log('woy ',err)
        return res.status(400).json({
          'message': 'Failed'
        })
      })
    }
  }

  findByID(req, res) {
    UserGameHistory.findOne({
      include: [
        {
          model: UserGame,
          as: 'user' 
        }
      ],
      where: {id: req.params.id }
    }).then((userhistory) => {
      return res.status(200).json({
        'message': 'Success',
        'data': userhistory
      })
    }).catch((err) => {
      //console.log('woy ',err)
      return res.status(400).json({
        'message': 'Failed'
      })
    })
  }

  create(req, res) {
    let { user_game_id, score, start_at, end_at } = req.body

    if(!user_game_id && !score && !start_at && !end_at){
      return res.status(400).json({
        'message': 'Failed'
      })
    }

    const checkUserGame = (user_game_id, success, failed) => {
      UserGame.findOne({where: { id: user_game_id }}).then((usergame) => {
        return success(usergame)
      }).catch((err) => {
        return failed(err)
      })
    }

    checkUserGame(user_game_id, (data) => {
      if(!data){
        return res.status(200).json({
          'message': 'User game id not found',
        })
      }

      let playtime = getInterval(end_at, start_at)

      UserGameHistory.create({
        user_game_id: user_game_id,
        score: score,
        start_at: start_at,
        end_at: end_at,
        playtime: playtime        
      }).then((userhistory) => {
        return res.status(201).json({
          'message': 'Success',
          'data': userhistory
        })
      }).catch((err) => {
        //console.log(err)
        return res.status(400).json({
          'message': 'Failed'
        })
      })
    }, (error) => {
      //console.log(error)
      return res.status(400).json({
        'message': 'Failed'
      })
    })
  }

  update(req, res) {
    let id = req.params.id   
    let playtime = getInterval(req.body?.end_at, req.body?.start_at)
    let userhistory_data = {
      user_game_id: req.body?.user_game_id,
      score: req.body?.score,
      start_at: req.body?.start_at,
      end_at: req.body?.end_at,
      playtime: playtime    
    }
    let query = {
      where: {
        id: id
      }
    }

    if(!userhistory_data.user_game_id && !userhistory_data.score && !userhistory_data.start_at && !userhistory_data.end_at){
      return res.status(400).json({
        'message': 'Failed'
      })
    }
    
    const checkUserGame = (user_game_id, success, failed) => {
      UserGame.findOne({ where: { id: user_game_id } }).then((usergame) => {
        return success(usergame)
      }).catch((err) => {
        return failed(err)
      })
    }

    const checkBefore = (id, success, failed) => {
      UserGameHistory.findOne({where: {id: id }}).then((userhistory) => {
        return success(userhistory)
      }).catch((err) => {
        return failed(err)
      })
    } 
    
    checkUserGame(userhistory_data.user_game_id, (data) => {
      if(!data){
        return res.status(200).json({
          'message': 'User game id not found',
        })
      }

      checkBefore(id, (data) => {
        if(!data){
          return res.status(200).json({
            'message': 'Data not found',
          })
        }

        UserGameHistory.update(userhistory_data, query).then((userhistory) => {
          return res.status(200).json({
            'message': 'Success',
            'data': userhistory_data
          })
        }).catch((err) => {
          //console.log(err)
          return res.status(400).json({
            'message': 'Failed'
          })
        })
      }, (err) => {
        //console.log(err)
        return res.status(400).json({
          'message': 'Failed'
        })
      })
    }, (err) => {
      //console.log(err)
      return res.status(400).json({
        'message': 'Failed'
      })
    })
  }

  delete(req, res) {
    let id = req.params.id
    const checkBefore = (id, success, failed) => {
      UserGameHistory.findOne({where: {id: id }}).then((userhistory) => {
        return success(userhistory)
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

      UserGameHistory.destroy({
        where: {id: id }
      }).then((userhistory) => {
        return res.status(200).json({
          'message': `Success delete data with id ${id}`,
        })
      }).catch((err) => {
        return res.status(400).json({
          'message': 'Failed'
        })
      })
    }, (err) => {
      //console.log(err)
      return res.status(400).json({
        'message': 'Failed'
      })
    })
  }

}

module.exports = UserGameHistoryController