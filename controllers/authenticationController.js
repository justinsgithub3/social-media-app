import path from 'path';
import { fileURLToPath } from 'url'; 
import { pool } from '../database/pool.js';
import bcrypt from 'bcrypt';
import { getUserData } from '../database/authenticationQueries.js';
// Get the current filename and directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// bcrypt middleware
// sessions
// cookies !

export const logout = async (req, res, next) => {   
    // clear cookie data
    try {
        res
            .clearCookie("session")
            .redirect('/');
    }
    catch (e) {
        // server error
        console.log("Error: ", e)
        res
            .status(500)
            .json({ error : e.message || 'Internal server error' });
    }

};

// if user is trying to login
export const login = async (req, res, next) => {  

    const username = req.body.username;
    const password = req.body.password;
    try {
        // check password
        const userData = await getUserData(username);
        // check if the username even exists
        const rowCount = userData.length; 
        
        if (rowCount != 1) { // if row count is not 1 ie. no user or multiple users
            res.status(401).json({ error: "No account" });
        }
    
        // get hashed password
        const hash = userData[0].password_hash;
        const userId = userData[0].id;
        const name = userData[0].full_name;

        // compare hash to provided password
        const passwordMatch = bcrypt.compareSync(password, hash); // true or false

        // if password is not valid
        if (!passwordMatch) {
            res.status(401).json({ error: "Invalid password" });
        }
    
        // if password is valid
        req.session.userId = userId;
        
        res
            .json({ "status": "success",
                    "username": username,
                    "name": name            });

    }
    catch (e) {
        // re render the login page
        res.status(500).json({"status": "no success"});
    }
};


export const createAccount = async (req, res, next) => {   

    // create something to verify these are all valid
    const username = req.body.username;
    const password = req.body.password;
    const rePassword = req.body.re_password;
    const email = req.body.email;
    const fullName = req.body.full_name;

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(rePassword, salt);
     
    try {
        const result = await pool.query( "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)", 
                                        [username, email, hash]);



        
        const userData = await getUserData(username);
        // check if the username even exists
        const rowCount = userData.length; 
        
        if (rowCount == 1) { // if row count is not 1 ie. no user or multiple users
            // if an account under this username was created then create a session
            const userId = userData[0].id;
            req.session.userId = userId;
        }

        res
            .json({ "status": "success",
                    "username": username,
                    "name": fullName        });
    }
    catch (e) {
        // server error
        console.log("Error: ", e)
        res.status(500).json({"status": "no success"});
    }
};