const db = require('../config/db');
const bcrypt = require('bcrypt');
class User{
    static async create({username, email, password}){
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query("INSERT INTO users (name, login, pass) VALUES (?,?,?)", [username, email, hashedPassword]);
        return result.insertId;
    }
    static async findByLogin(login){
        const [users] = await db.query("SELECT * FROM users WHERE login = ? ", [login]);
        return users[0];
    }
}

module.exports = User;