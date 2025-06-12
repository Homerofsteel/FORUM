const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./forum.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    }
});

const Auth = {
    async findUserInDatabase(username, password) {
        return new Promise((resolve, reject) => {
            const query = `SELECT id, username, email, password FROM users WHERE username = ? OR email = ?`;
            
            db.get(query, [username, username], async (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                if (!row) {
                    resolve(null);
                    return;
                }

                try {
                    const passwordMatch = await bcrypt.compare(password, row.password);
                    if (passwordMatch) {
                        resolve({
                            id: row.id,
                            username: row.username,
                            email: row.email
                        });
                    } else {
                        resolve(null);
                    }
                } catch (error) {s
                    reject(error);
                }
            });
        });
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
                return {
                    status: 200,
                    data: { 
                        message: 'Login successful',
                        user: {
                            id: user.id,
                            username: user.username
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
    }
};

module.exports = Auth;