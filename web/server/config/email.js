export const emailConfig = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth:
    {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
}