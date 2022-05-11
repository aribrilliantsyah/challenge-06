const { UserGame, UserGameBiodata } = require("../../models")

class UserGameBiodataController {
  
  getAll(req, res) {
    let user_game_id = req.query?.user_game_id
    if(user_game_id){
      UserGameBiodata.findAll({
        where: {user_game_id: user_game_id},
        include: [
          {
            model: UserGame,
            as: 'user'
          }
        ]
      }).then((userbiodata) => {
        return res.status(200).json({
          'message': 'Success',
          'data': userbiodata
        })
      }).catch((err) => {
        console.log('woy ',err)
        return res.status(400).json({
          'message': 'Failed'
        })
      })
    }else{
      UserGameBiodata.findAll({
        include: [
          {
            model: UserGame,
            as: 'user'
          }
        ]
      }).then((userbiodata) => {
        return res.status(200).json({
          'message': 'Success',
          'data': userbiodata
        })
      }).catch((err) => {
        console.log('woy ',err)
        return res.status(400).json({
          'message': 'Failed'
        })
      })
    }
  }

  findByID(req, res) {
    UserGameBiodata.findOne({
      include: [
        {
          model: UserGame,
          as: 'user' 
        }
      ],
      where: {id: req.params.id }
    }).then((userbiodata) => {
      return res.status(200).json({
        'message': 'Success',
        'data': userbiodata
      })
    }).catch((err) => {
      console.log('woy ',err)
      return res.status(400).json({
        'message': 'Failed'
      })
    })
  }

  create(req, res) {
    let { user_game_id, name, gender, date_of_birth, place_of_birth, address} = req.body

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

      UserGameBiodata.create({
        user_game_id: user_game_id,
        name: name,
        gender: gender,
        date_of_birth: date_of_birth,
        place_of_birth: place_of_birth,
        address: address,
      }).then((userbiodata) => {
        return res.status(201).json({
          'message': 'Success',
          'data': userbiodata
        })
      }).catch((err) => {
        return res.status(400).json({
          'message': 'Failed'
        })
      })
    }, (error) => {
      console.log(error)
      return res.status(400).json({
        'message': 'Failed'
      })
    })
  }

  update(req, res) {
    let id = req.params.id   
    let userbiodata_data = {
      user_game_id: req.body?.user_game_id,
      name: req.body?.name,
      gender: req.body?.gender,
      date_of_birth: req.body?.date_of_birth,
      place_of_birth: req.body?.place_of_birth,
      address: req.body?.address,
    }
    let query = {
      where: {
        id: id
      }
    }
    
    const checkUserGame = (user_game_id, success, failed) => {
      UserGame.findOne({ where: { id: user_game_id } }).then((usergame) => {
        return success(usergame)
      }).catch((err) => {
        return failed(err)
      })
    }

    const checkBefore = (id, success, failed) => {
      UserGameBiodata.findOne({where: {id: id }}).then((userbiodata) => {
        return success(userbiodata)
      }).catch((err) => {
        return failed(err)
      })
    } 
    
    checkUserGame(userbiodata_data.user_game_id, (data) => {
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

        UserGameBiodata.update(userbiodata_data, query).then((userbiodata) => {
          return res.status(200).json({
            'message': 'Success',
            'data': userbiodata_data
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
      UserGameBiodata.findOne({where: {id: id }}).then((userbiodata) => {
        return success(userbiodata)
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

      UserGameBiodata.destroy({
        where: {id: id }
      }).then((userbiodata) => {
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

module.exports = UserGameBiodataController