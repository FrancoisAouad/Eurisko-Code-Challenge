import nodemailer from 'nodemailer';

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'francoisproject1@gmail.com',
        pass: 'xfjptfgdcfpjehmm',
    },
});

let sendMail = (mailOptions) => {
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error.message);
        }
    });
};

export default sendMail;
