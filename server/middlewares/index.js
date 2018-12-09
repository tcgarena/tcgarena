const { User } = require('../db/models')

const requireLogin = (req, res, next) => {  
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).json({
      message: 'must be logged in to continue',
    });
  }
}


const requirePerms = minimum => async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      const user = await User.findById(req.user.id)
      
      user.getPerms() >= minimum
        ? next()
        : res.status(403).json({
          message: `requires at least level ${minimum} permissions`
        })

    } else {
      res.status(403).json({
        message: 'must be logged in to continue',
      });
    }
  } catch (e) { next(e) }
}
const requireJudge1 = requirePerms(1)
const requireJudge2 = requirePerms(2)
const requireJudge3 = requirePerms(3)
const requireModerator = requirePerms(5)
const requireTC = requirePerms(7)
const requireAdmin = requirePerms(10)

module.exports = { 
  requireLogin,
  requireJudge1,
  requireJudge2,
  requireJudge3,
  requireModerator,
  requireTC,
  requireAdmin
}