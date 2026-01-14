import multer from 'multer'


const storage = multer.diskStorage({
  destination: function (req, file, cb) { //* cb = callback
    cb(null, './public/temp')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

// destination: You've set this to './public/temp'. This means any file uploaded through this middleware will be temporarily stored in that specific folder on your server's hard drive.
// filename: You are generating a uniqueSuffix using the current timestamp and a random number. This is a "best practice" to prevent file name collisions (e.g., if two users upload a file named profile.jpg at the same moment).
// cb(null, ...): The cb (callback) is how Multer proceeds. The first argument is null (meaning no error), and the second is the result.

const upload = multer(
    { 
        storage: storage 
    }
)

export default upload