export const countOnlineUsers = (online_users, isTeacher) => {
    let arr = Object.keys(online_users);
    if(arr.length <= 0){
        return 0
    }else{
        let res = arr.filter(username => {
            return online_users[username].isTeacher == isTeacher;
        })
        return res.length
    }
}