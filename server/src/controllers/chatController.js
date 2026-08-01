import chatData from "../data/chatData.js";



export const processChat = (req,res) =>{
    const {message} = req.body;

    for(let item of chatData){
        if (
        item.keywords.some(keyword =>
            message.toLowerCase().includes(keyword)
        )
    ) {
        return res.json({
            success: true,
            answer: item.answer
        });
    }
    }
    
    return res.json({
         success : false
    })
}