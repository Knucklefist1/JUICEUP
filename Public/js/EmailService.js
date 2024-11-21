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

// Funktion til at sende en konkurrencemail
const sendCompetitionConfirmationEmail = (to, username, juiceName) => {
  const subject = "Your Juice has entered the competition!";
  const text = `Hello ${username},\n\nYour juice named \"${juiceName}\" has been successfully entered into our JuiceUp competition! We'll contact you if your juice is selected as a winner.\n\nThank you for participating in the JuiceUp App!`;
  const html = `<h1>Thank you for participating, ${username}!</h1><p>Your juice named <strong>${juiceName}</strong> has been successfully entered into our JuiceUp competition! We'll contact you if your juice is selected as a winner.</p><p>Thank you for using the JuiceUp App!</p>`;

  const mailOptions = {
    from: "juiceupxjoe@gmail.com",
    to,
    subject,
    text,
    html
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending competition confirmation email:", error);
    } else {
      console.log("Competition confirmation email sent:", info.response);
    }
  });
};

module.exports = { sendConfirmationEmail, sendCompetitionConfirmationEmail };
