/**
 * Simple email sending utility
 * In a production environment, you would integrate with an email service like Nodemailer, SendGrid, etc.
 */

const sendEmail = async (options) => {
  // In a real application, you would use an email service here
  // For now, we'll just log the email details to the console
  console.log('Email would be sent:');
  console.log('To:', options.email);
  console.log('Subject:', options.subject);
  console.log('Message:', options.message);
  
  // Simulate email sending delay
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Email sent successfully (simulated)');
      resolve({ success: true });
    }, 100);
  });
};

module.exports = sendEmail;