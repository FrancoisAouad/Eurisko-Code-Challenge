import atob from 'atob';
//reusable function to get logged in user
export function getUser(authHeader) {
    //decoded token and parse it using atob
    const payload = JSON.parse(atob(authHeader.split('.')[1]));
    //check payload for userID
    const id = payload.aud;
    return id;
}
