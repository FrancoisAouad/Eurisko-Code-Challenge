import jwt from 'jsonwebtoken';
//reusable function to get logged in user
export function getUser(authHeader) {
    //split auth header to get bearer token
    const token = authHeader.split(' ')[1];
    //verify the token and decoded it using
    const decoded = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN);
    //get the id field from the decoded token
    const id = decoded.aud;
    //return the id value
    return id;
}
