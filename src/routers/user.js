const express = require ('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const User = require('../models/user')
const multer = require('multer')
const sharp = require('sharp')

const { sendWel,sendCancel } = require('../emails/account')

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save();
        sendWel(user.email, user.name)

        const token = await user.generateAuthToken(); 

        res.status(201).send({user, token});
    } catch(e){
        res.status(400).send(e);
    }
    
    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch((e) => {
    //     res.status(400).send(e);
        
    // })

})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user , token});

    } catch (e) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
}) 


router.post('/users/logoutAll', auth, async(req, res) => {
    try {
        req.user.tokens = []

        await req.user.save()
        res.send()

    } catch (e) {
        res.status(500).send()
    }
})


// router.get('/users', auth, async (req, res) => {

//     try {
//         const users = await User.find({})
//         res.send(users);
//     }catch (e) {
//         res.status(500).send(e)
//     }

//     // User.find({ }).then((users) => {
//     //  res.send(users);  
//     // }).catch((e) => {
//     //     res.status(500).send(e);
//     // })
// })


router.get('/users/me', auth, async (req, res) => {

    res.send(req.user)

})

// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id;

//     try{
//         const user = await User.findById(_id);

//         if(!user) {
//             return res.status(404).send()
//         }
//             res.send(user)
//     } catch (e) {
//         res.status(500).send(e)
//     }

    // User.findById(_id).then((user) => {
    //     if(!user){
    //         return res.status(404).send();
    //     }

    //     res.send(user);

    // }).catch((e)=>{
    //     res.status(500).send();
    // })
// })


router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body) //to convert object into array of its properties
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValid = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if (!isValid) {
        return res.status(400).send({error : 'Invalid updates'})
    }

    try {

        //adjustment for middleware :
        
        // const user = await User.findById(req.params.id)

        updates.forEach((update) => req.user[update] = req.body[update])

        await req.user.save()
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})


        res.send(req.user)
    }catch (e) {
        res.status(400).send(e)
    }
})


router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id)

        // if (!user) {
        //     return res.status(404).send()
        // }

        await req.user.remove()
        res.send(req.user)

    } catch (e) {
        res.status(500).send(e)
    }
})


const upload = multer( {
    // dest: 'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error ('Please upload an image'));
        }

        cb(undefined, true)
        
    }
})

//auth and upload.single are middleware

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    
    req.user.buffer = buffer
    // req.user.avatar = req.file.buffer
    await req.user.save()
    res.send()
}, (error, req, res, next ) => {
    res.status(400).send({error: error.message})
})


router.delete('/users/me/avatar', auth, async(req, res) => {
    req.user.avatar = undefined
    sendCancel( user.email, user.name)
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set ('Content-type', 'image/png') //header response
        res.send(user.avatar)
    }
    catch (e) {
        res.status(404).send()
    }
})

module.exports = router;