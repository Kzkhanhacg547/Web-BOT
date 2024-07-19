const express = require('express');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files (index.html, etc.)
app.use(express.static(path.join(__dirname)));
app.use('/cache', express.static(path.join(__dirname, 'cache')));
app.use('/cmd/cache', express.static(path.join(__dirname, 'cmd', 'cache')));

// Load all command modules
const commands = {};
const commandFiles = fs.readdirSync(path.join(__dirname, 'cmd')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./cmd/${file}`);
    if (command.config && command.config.name && command.run) {
        commands[command.config.name] = command;
    } else {
        console.warn(`Skipping invalid command module: ${file}`);
    }
}

// Clear cache function
const clearCache = async () => {
    const cacheDir = path.join(__dirname, 'cache');
    await fs.emptyDir(cacheDir);
    const cacheDir2 = path.join(__dirname, 'cmd', 'cache');
    await fs.emptyDir(cacheDir2);
};

// Handle incoming messages
app.post('/message', async (req, res) => {
    const { message } = req.body;
    const [commandName, ...args] = message.split(' ');

    await clearCache(); // Clear cache before executing the command

    if (commands[commandName]) {
        try {
            const response = await commands[commandName].run({ args });
            res.json({ reply: response });
        } catch (error) {
            console.error(error);
            res.json({ reply: 'An error occurred while processing your request.' });
        }
    } else {
        res.json({ reply: 'Command not found.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
