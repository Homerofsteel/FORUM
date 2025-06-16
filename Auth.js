const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
function getConnection() {
    return new sqlite3.Database('./forum.db', (err) => {
        if (err) console.error('Database connection error:', err);
    });
}

const SECRET_KEY = 'your-secret-key'; // même clé secrète utilisée pour signer les tokens JWT

const Auth = {
    async findUserInDatabase(username, password) {
        const db = getConnection();
        try {
            return new Promise((resolve, reject) => {
                const query = `SELECT * FROM users WHERE Username = ? OR Email = ?`;
                
                db.get(query, [username, username], async (err, row) => {
                    if (err) {
                        console.error('Database error:', err);
                        reject(err);
                        return;
                    }
                    
                    if (!row) {
                        resolve(null);
                        return;
                    }

                    try {
                        if (!password || !row.Password) {
                            resolve(null);
                            return;
                        }

                        const match = await bcrypt.compare(password, row.Password);
                        if (match) {
                            resolve({
                                id: row.Id,
                                username: row.Username,
                                email: row.Email
                            });
                        } else {
                            resolve(null);
                        }
                    } catch (error) {
                        console.error('Password comparison error:', error);
                        reject(error);
                    }
                });
            });
        } finally {
            db.close();
        }
    },

    async handleLogin(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('error-message');
        const loginButton = document.querySelector('button[type="submit"]');

        try {
            errorDiv.style.display = 'none';
            loginButton.disabled = true;

            if (!username || !password) {
                errorDiv.textContent = 'Username and password are required';
                errorDiv.style.display = 'block';
                return;
            }

            const user = await this.findUserInDatabase(username, password);
            
            if (user) {
                // generation de token
                const token = jwt.sign(
                    { userId: user.Id, username: user.Username },
                    SECRET_KEY,
                    { expiresIn: '24h' }
                );

                // Localstorage Token
                localStorage.setItem('authToken', token);

                return {
                    status: 200,
                    data: { 
                        message: 'Login successful',
                        token: token,
                        user: {
                            id: user.Id,
                            username: user.Username
                        }
                    }
                };
            } else {
                errorDiv.textContent = 'Invalid credentials';
                errorDiv.style.display = 'block';
                return {
                    status: 401,
                    data: { message: 'Invalid credentials' }
                };
            }
        } catch (error) {
            console.error('Login error:', error);
            errorDiv.textContent = 'An error occurred during login';
            errorDiv.style.display = 'block';
            return {
                status: 500,
                data: { message: 'Internal server error' }
            };
        } finally {
            loginButton.disabled = false;
        }
    },

    // Mdware
    verifyToken(req, res, next) {
        const token = req.headers.authorization?.split(' ')[1] || req.cookies.authToken;

        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Authentification requise' 
            });
        }

        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            if (decoded.exp < Date.now() / 1000) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Token expiré' 
                });
            }
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({ 
                success: false, 
                message: 'Token non valide' 
            });
        }
    }
};

module.exports = Auth;