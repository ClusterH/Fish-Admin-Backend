/**
 *
 * @param mail_content {{header, title, content, link, button_text, extra}}
 * @returns {string}
 */
module.exports = (mail_content) => {
    return `
<style>
    @import url('https://fonts.googleapis.com/css?family=Poppins:400,600,700,800');

    .mail-container {
        margin: 0 auto;
        padding-top: 50px;
        width: 100%;
        max-width: 720px;
        text-align: center;
    }
    .logo-bar {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 30px;
        background-color: #4473c5;
    }
    .mail-header {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 40px;
        font-size: 36px;
        font-weight: 600;
        color: #a5a5a5
    }
    .mail-content {
        padding-bottom: 20px;
        font-size: 20px;
    }
    .link-button {
        background-color: #4473c5;
        border-radius: 8px;
        width: 50%;
        padding: 10px 0;
        color: #f1f1f1
    }
    .link {
        display: flex;
        justify-content: center;
    }
    a {
        text-decoration: none;
    }
    .mail-footer {
        background-color: #c5c5c5;
        padding: 10px;
        margin-top: 40px;
        color: #555555;
        text-align: left;
    }
    .mail-value {
        font-size: 40px;
        color: #009EC0;
    }

</style>
<body style="font-family: Poppins, sans-serif; background-color: #e8e5ea;">
<div class="mail-container">
    <div class="logo-bar">
<!--        <img src="https://centralitacontrol-api.eternity.online/public/files/header-logo.png" alt="site logo" style="width: 360px;"/>-->
        <img src="http://localhost:5000/public/files/logo-1.svg" alt="site logo"/>
    </div>
    <div>
        <div class="mail-header">${mail_content.header}</div>
        <div class="mail-content">${mail_content.content}</div>
        <div class="mail-value">${mail_content.value}</div>
    </div>
</div>
</body>
	`;
};
