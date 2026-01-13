// !Using Higher-Order Functions.

// *Method 2 You can use any one>>
const asyncHandler = (requestHandler) =>{
    return (req, res, next) => {
        Promise.resolve(requestHandler(req,res,next)).
        catch((err) => next(err))
    }
}

export default asyncHandler




// *Method 1 to create handler...
// const asyncHandler = (fn) => {
//     async (req, res, next) => {
//         try {
//             await fn(req, res, next)
//         } catch (error) {
//             res.status(err.code || 500).json({
//                 success:false,
//                 message:err.message
//             })
//         }
//     }
// }

//* We might be using middleware So , we are passing the next parameter