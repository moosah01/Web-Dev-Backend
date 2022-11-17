const bcryptjs = require('bcryptjs');

const userService = require("../services/users.services");


// FOLLOWING API IS EXEMPTED FROM AUTHENTICAT TOKEN
exports.register = (req, res, next) => {
    
// you put curly bracket around variable so that it directly fetches
// the value from the parameter into that variable
// i.e; param named password will be stored here
    const {password} = req.body;
    const salt = bcryptjs.genSaltSync(10);

    //hashing => salt helps us create unique pwd even if two users choose same password
    req.body.password = bcryptjs.hashSync(password, salt);

    userService.register(req.body, (error, result) =>{
        if (error) {
            //send to errorHandler
            return next(error, result); //next means send to next middle ware i.e; errorHandler
        }
        return res.status(200).send({
            message: "Success => Registration succesful",
            //return whatever data you get from your mongoDB
            data:  {
              message: result
            },    
        });
    });
};

// FOLLOWING API IS EXEMPTED FROM AUTHENTICAT TOKEN
exports.login = (req, res, next) => {
    // you put curly bracket around variable so that it directly fetches
    // the value from the parameter into that variable
    const{userName, password} = req.body;

    if (!userName || !password)
    {
        return res.status(400).json(
            {
                Status: "Failure",
                data: {
                    message: "Email and password required"
                },
            });
    }
    
    userService.login({userName, password}, (error, result) => 
    {
        if (error) {
            //send to errorHandler
            return next(error);
        }
        return res.status(200).send({
            Status: "Successful Login",
            //return whatever data you get from your mongoDB
            data: {
                message: result   
            }
        });
    });
};

//this API needs authentication
exports.updatePassword = (req, res, next) => 
{
    const salt = bcryptjs.genSaltSync(10);
    const {newPassword} = req.body;
    //hashing => salt helps us create unique pwd even if two users choose same password
    req.body.newPassword = bcryptjs.hashSync(newPassword, salt);

    userService.updatePassword(req.body, (error, result) => {
        if(error)
        {
            return next(error,result);
        }
        return res.status(200).send({
            Status: "Password succesffuly updated",
            data: {
              message: result  
            },
        });
    });
}

//this API needs authentication
exports.updateProfilePicture = (req, res, next) =>
{
    userService.updateProfilePicture(req.body, (error,result) => {
        if(error)
        {
            return next(error,result);
        }
        return res.status(200).send({
            Status : "Profile Picture succesfully updated",
            data: {
                message: result
            }
        });
    });
}

//this API needs authentication
exports.updatePrivateStatus = (req,res,next) =>
{
    userService.updatePrivateStatus(req.body, (error,result) => {
        if(error)
        {
            return next(error, result);
        }
        return res.status(200).send({
            Status : "Profile Private Status Toggled Succesfully",
            data: {
                message: result
            }
        });
    })
    
}

//this API needs authentication
exports.updateProfileBio = (req,res,next) =>
{
    userService.updateProfileBio(req.body, (error,result) => {
        if(error)
        {
            return next(error, result);
        }
        return res.status(200).send({
            Status: "Profile Bio Update Succesffuly",
            data: {
                message: result
            }
        })
    });
}

//this API needs authentication
exports.userProfile = (req, res, next) => 
{
    return res.status(200).json({message: "Authorised User!"});
}

exports.sendFollowRequest = (req,res, next) =>
{
    //const{userName, sendRequestTo} = req.body;

    userService.sendFollowRequest(req.body, (error,result) => {
        if(error)
        {
            return next(error,result);
        }
        return res.status(200).send({
            Status: "Follow Request Sent",
            data: {
                message: result
            }
        });
    });
}

exports.deleteFollowRequest = (req,res,next) =>
{
    userService.deleteFollowRequest(req.body, (error,result) => {
        if (error)
        {
            return next(error,result);
        }
        return res.status(200).send({
            Status: "Follow Request Deleted",
            data: {
                message: result
            }
        });
    });
}


exports.acceptFollowRequest = (req,res,next) =>
{
    userService.acceptFollowRequest(req.body, (error,result) => {
        if(error)
        {
            return next(error,result);
        }
        return res.status(200).send({
            Status: "Follow Request Accepted",
            data: {
                message: result
            }
        });
    });
}

exports.uploadPost = (req,res,next) =>
{
    userService.uploadPost(req.body, (error,result) => {
        if(error)
        {
            return next(error, result);
        }
        return res.status(200).send({
            Status: "Post uploaded succesfully",
            data: {
                message: result
            }
        })
    });
}

exports.togglePostPrivacy = (req,res,next) =>
{
    userService.togglePostPrivacy(req.body, (error, result) => {
        if(error)
        {
            return next(error, result);
        }
        return res.status(200).send({
            Status: "Status toggle of Post succesful",
            data: {
                message: result
            }
        })
    })
}

exports.deletePost = (req,res,next) =>
{
    userService.deletePost(req.body, (error,result) => {
        if(error)
        {
            return next(error, result);
        }
        return res.status(200).send({
            Status: "Post succesfully deleted",
            data: {
                message: result
            }
        })
    })
}

exports.likePost = (req,res,next) => 
{
    userService.likePost(req.body, (error, result) => {
        if(error)
        {
            return next(error,result)
        }
        return res.status(200).send({
            Status: "Post Liked",
            data: {
                message: result
            }
        })
    })
}

exports.unLikePost = (req,res,next) => 
{
    userService.unLikePost(req.body, (error,result) => {
        if(error)
        {
            return next(error,result)
        }
        return res.status(200).send({
            Status: "Post Unliked",
            data: {
                message:result
            }
        })
    })
}
