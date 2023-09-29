const express =require('express');
const multer = require('multer');

 const cors =require('cors')

const app =express();

app.use(cors())


const ds=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads/")
    },
    filename:(req,file,cb)=>{

        cb(null,Date.now()+file.originalname)

    }
});

const filter = (req,file,cb)=>{


    const allowedTypes =[
        "image/jpg","image/jpeg","image/png"
    ]
    if(allowedTypes.includes(file.mimetype)){
        cb(null,true)
    }
    else{
        cb(new Error("Invalid file type"))
    }

}


const upload =multer({
    storage:ds,
    fileFilter:filter,
    limits:{
        fileSize:2*1024*1024,
        files :2
    }

}).array('file')




app.listen(3000,()=>{
    console.log('server running at port no 3000')
})

app.post('/upload',
    (req,res)=>{

        upload(req,res,(err)=>{
            if(err){

                if(err instanceof multer.MulterError){
                    if(err.code=='LIMIT_FILE_SIZE')

                    res.status(400).send({
                        code:'large',
                        message:"File is large ,only upload files less than 1MB"
                    })
                    else{
                        res.status(400).send({
                            code:"unknown",
                            message:"Error while uploading"
                        })

                    }
                }
                else{
                    res.status(400).send({
                        code:"invalid type",
                        message:"Invalid file type only allowed jpeg,jpg"
                    })
                    
                }

            }
            else{
                res.send({
                    code:"success",
                    message:"uploaded successfully"
                })
            }

        })

    }
)
