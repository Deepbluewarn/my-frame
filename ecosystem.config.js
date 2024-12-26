module.exports = {
    apps: [
        {
            name: 'my-frame',
            script: 'npm',
            args: 'start',
            env: {
                NODE_ENV: 'production',
            }
        }
    ]
};
