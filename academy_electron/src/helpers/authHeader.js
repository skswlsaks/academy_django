export const authHeader = getState => {
    const token = getState().auth.token;
    if (token) {
        return {headers : {'Authorization' : `Token ${token}`}};
    }else{
        return null;
    }
}