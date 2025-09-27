const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Database setup
const db = new sqlite3.Database('./database.sqlite');

// Initialize database tables
db.serialize(() => {
  // Admin users table
  db.run(`CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Secret posts table (with individual passwords)
  db.run(`CREATE TABLE IF NOT EXISTS secret_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Posts table (timeline moments) - public only
  db.run(`CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    image_url TEXT,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Site settings table
  db.run(`CREATE TABLE IF NOT EXISTS site_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Chat messages table
  db.run(`CREATE TABLE IF NOT EXISTS chat_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Create default admin user if not exists
  db.get("SELECT COUNT(*) as count FROM admin_users", (err, row) => {
    if (err) {
      console.error('Error checking admin users:', err);
    } else if (row.count === 0) {
      const defaultPassword = 'admin123'; // Change this in production!
      const hashedPassword = bcrypt.hashSync(defaultPassword, 10);
      db.run("INSERT INTO admin_users (username, password_hash) VALUES (?, ?)", 
        ['admin', hashedPassword], (err) => {
          if (err) {
            console.error('Error creating default admin:', err);
          } else {
            console.log('Default admin created: username=admin, password=admin123');
          }
        });
    }
  });

  // Insert default data
  insertDefaultData();
});

function insertDefaultData() {
  // Insert default site settings
  const defaultSettings = [
    { key: 'site_title', value: 'С 4 месяца нас, любимая ❤️' },
    { key: 'site_subtitle', value: 'Подарок только для тебя))' }
  ];

  db.get("SELECT COUNT(*) as count FROM site_settings", (err, row) => {
    if (err) {
      console.error('Error checking site settings:', err);
    } else if (row.count === 0) {
      const stmt = db.prepare("INSERT INTO site_settings (key, value) VALUES (?, ?)");
      defaultSettings.forEach(setting => {
        stmt.run(setting.key, setting.value);
      });
      stmt.finalize();
    }
  });

  // Insert default chat messages
  const defaultMessages = [
    "Привет, любовь моя ❤️",
    "Знаешь, я хотел бы начать этот сайт с чего-то простого, но настоящего",
    "Ты — причина, по которой я улыбаюсь без причины 🥺",
    "Спасибо за эти чудесные 3 месяца 🌸",
    "А теперь... погнали дальше 😉",
    "Ты — моя вселенная в человеческом виде ✨",
    "Каждая минута с тобой — как отдельная глава сказки 📖",
    "Иногда я просто сижу и думаю, как же мне повезло с тобой 🥹",
    "Если бы я мог, я бы закрыл тебя в объятиях навсегда 🤍",
    "У нас ещё столько впереди... и всё это — вместе 🤝",
    "Даже в плохие дни ты — моё самое светлое 🌙",
    "Люблю тебя так, что слова не справляются 💬❤️",
    "Этот сайт — не просто сюрприз, а отражение моей любви к тебе 💌"
  ];

  db.get("SELECT COUNT(*) as count FROM chat_messages", (err, row) => {
    if (err) {
      console.error('Error checking chat messages:', err);
    } else if (row.count === 0) {
      const stmt = db.prepare("INSERT INTO chat_messages (message, order_index) VALUES (?, ?)");
      defaultMessages.forEach((message, index) => {
        stmt.run(message, index);
      });
      stmt.finalize();
    }
  });
}

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// Routes

// Admin login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    db.get("SELECT * FROM admin_users WHERE username = ?", [username], (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!user || !bcrypt.compareSync(password, user.password_hash)) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({ token, username: user.username });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get site settings (public)
app.get('/api/settings', (req, res) => {
  db.all("SELECT key, value FROM site_settings", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    const settings = {};
    rows.forEach(row => {
      settings[row.key] = row.value;
    });
    res.json(settings);
  });
});

// Check secret post password
app.post('/api/secret-posts/check-password', (req, res) => {
  const { password } = req.body;
  
  if (!password) {
    return res.status(400).json({ error: 'Password required' });
  }

  db.get("SELECT id, title FROM secret_posts WHERE password = ?", [password], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!row) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    
    res.json({ valid: true, postId: row.id, title: row.title });
  });
});

// Get secret post content (only with correct password)
app.post('/api/secret-posts/content', (req, res) => {
  const { password } = req.body;
  
  if (!password) {
    return res.status(400).json({ error: 'Password required' });
  }

  db.get("SELECT * FROM secret_posts WHERE password = ?", [password], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!row) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    
    res.json({
      id: row.id,
      title: row.title,
      content: row.content,
      created_at: row.created_at
    });
  });
});

// Get posts (public timeline)
app.get('/api/posts', (req, res) => {
  db.all("SELECT * FROM posts ORDER BY date DESC", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// Get chat messages (public)
app.get('/api/chat-messages', (req, res) => {
  db.all("SELECT * FROM chat_messages ORDER BY order_index ASC", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// Admin routes (protected)

// Create secret post
app.post('/api/admin/secret-posts', authenticateToken, (req, res) => {
  const { title, content, password } = req.body;

  if (!title || !content || !password) {
    return res.status(400).json({ error: 'Title, content and password required' });
  }

  db.run(
    "INSERT INTO secret_posts (title, content, password) VALUES (?, ?, ?)",
    [title, content, password],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ id: this.lastID, title, content, password });
    }
  );
});

// Update secret post
app.put('/api/admin/secret-posts/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { title, content, password } = req.body;

  if (!title || !content || !password) {
    return res.status(400).json({ error: 'Title, content and password required' });
  }

  db.run(
    "UPDATE secret_posts SET title = ?, content = ?, password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    [title, content, password, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Secret post not found' });
      }
      res.json({ id, title, content, password });
    }
  );
});

// Delete secret post
app.delete('/api/admin/secret-posts/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM secret_posts WHERE id = ?", [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Secret post not found' });
    }
    res.json({ message: 'Secret post deleted successfully' });
  });
});

// Get all secret posts (admin only)
app.get('/api/admin/secret-posts', authenticateToken, (req, res) => {
  db.all("SELECT id, title, password, created_at, updated_at FROM secret_posts ORDER BY created_at DESC", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// Create post
app.post('/api/admin/posts', authenticateToken, (req, res) => {
  const { date, image_url, content } = req.body;

  if (!date || !content) {
    return res.status(400).json({ error: 'Date and content required' });
  }

  db.run(
    "INSERT INTO posts (date, image_url, content) VALUES (?, ?, ?)",
    [date, image_url || '', content],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ 
        id: this.lastID, 
        date, 
        image_url: image_url || '', 
        content
      });
    }
  );
});

// Update post
app.put('/api/admin/posts/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { date, image_url, content } = req.body;

  if (!date || !content) {
    return res.status(400).json({ error: 'Date and content required' });
  }

  db.run(
    "UPDATE posts SET date = ?, image_url = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    [date, image_url || '', content, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Post not found' });
      }
      res.json({ id, date, image_url: image_url || '', content });
    }
  );
});

// Delete post
app.delete('/api/admin/posts/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM posts WHERE id = ?", [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json({ message: 'Post deleted successfully' });
  });
});

// Update chat messages
app.put('/api/admin/chat-messages', authenticateToken, (req, res) => {
  const { messages } = req.body;

  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array required' });
  }

  db.run("DELETE FROM chat_messages", (err) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    const stmt = db.prepare("INSERT INTO chat_messages (message, order_index) VALUES (?, ?)");
    messages.forEach((message, index) => {
      if (message && message.trim()) {
        stmt.run(message.trim(), index);
      }
    });
    stmt.finalize((err) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Chat messages updated successfully' });
    });
  });
});

// Update site settings
app.put('/api/admin/settings', authenticateToken, (req, res) => {
  const { site_title, site_subtitle } = req.body;

  if (!site_title || !site_subtitle) {
    return res.status(400).json({ error: 'Site title and subtitle required' });
  }

  const stmt = db.prepare("INSERT OR REPLACE INTO site_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)");
  
  stmt.run('site_title', site_title, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
  });
  
  stmt.run('site_subtitle', site_subtitle, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
  });
  
  stmt.finalize((err) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: 'Site settings updated successfully' });
  });
});

// Serve admin panel
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin`);
  console.log(`API: http://localhost:${PORT}/api/`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});
