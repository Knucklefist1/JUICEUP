const nodemailer = require("nodemailer");

// Konfigurer nodemailer med dine SMTP-indstillinger
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Erstat med din SMTP-server (f.eks. "smtp.gmail.com" for Gmail)
  port: 587, // Typisk port for TLS
  secure: false, // Brug false, medmindre du bruger SSL
  auth: {
    user: "juiceupxjoe@gmail.com", // Din e-mailadresse
    pass: "paov stey xhoa qxxx" // Din e-mailadgangskode (brug en app-adgangskode for Gmail)
  }
});

// Funktion til at sende en e-mail
const sendConfirmationEmail = (to, subject, text) => {
  const mailOptions = {
    from: "juiceupxjoe@gmail.com", // Afsenderens e-mail
    to: to, // Modtagerens e-mail
    subject: subject, // Emne
    text: text // Beskedens tekst
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Fejl ved afsendelse af e-mail:", error);
    } else {
      console.log("E-mail sendt:", info.response);
    }
  });
};

module.exports = sendConfirmationEmail;
