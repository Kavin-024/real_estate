const nodemailer = require("nodemailer");

const sendNewPropertyEmail = async ({ sellerName, sellerEmail, sellerPhone, propertyTitle, propertyLocation, propertyPrice, propertyType, propertyId }) => {

  // Create transporter INSIDE the function
  // By the time this function is called, dotenv.config() has already run in server.js
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Real Estate Platform" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `🏠 New Property Listed: ${propertyTitle}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
        
        <div style="background: #2b6cb0; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 22px;">New Property Listed</h1>
        </div>

        <div style="padding: 24px; background: #f7fafc;">
          <p style="color: #4a5568; font-size: 15px;">A new property has been posted on your platform. Here are the details:</p>

          <div style="background: #fff; border-radius: 8px; padding: 20px; margin: 16px 0; border: 1px solid #e2e8f0;">
            <h2 style="color: #2d3748; margin: 0 0 16px; font-size: 18px;">🏡 Property Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #718096; font-size: 14px; width: 40%;">Title</td>
                <td style="padding: 8px 0; color: #2d3748; font-weight: 600; font-size: 14px;">${propertyTitle}</td>
              </tr>
              <tr style="background: #f7fafc;">
                <td style="padding: 8px 0; color: #718096; font-size: 14px;">Type</td>
                <td style="padding: 8px 0; color: #2d3748; font-weight: 600; font-size: 14px; text-transform: capitalize;">${propertyType}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #718096; font-size: 14px;">Location</td>
                <td style="padding: 8px 0; color: #2d3748; font-weight: 600; font-size: 14px;">${propertyLocation}</td>
              </tr>
              <tr style="background: #f7fafc;">
                <td style="padding: 8px 0; color: #718096; font-size: 14px;">Price</td>
                <td style="padding: 8px 0; color: #2b6cb0; font-weight: 700; font-size: 16px;">₹${Number(propertyPrice).toLocaleString("en-IN")}</td>
              </tr>
            </table>
          </div>

          <div style="background: #fff; border-radius: 8px; padding: 20px; margin: 16px 0; border: 1px solid #e2e8f0;">
            <h2 style="color: #2d3748; margin: 0 0 16px; font-size: 18px;">👤 Seller Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #718096; font-size: 14px; width: 40%;">Name</td>
                <td style="padding: 8px 0; color: #2d3748; font-weight: 600; font-size: 14px;">${sellerName}</td>
              </tr>
              <tr style="background: #f7fafc;">
                <td style="padding: 8px 0; color: #718096; font-size: 14px;">Email</td>
                <td style="padding: 8px 0; color: #2d3748; font-weight: 600; font-size: 14px;">${sellerEmail}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #718096; font-size: 14px;">Phone</td>
                <td style="padding: 8px 0; color: #2d3748; font-weight: 600; font-size: 14px;">${sellerPhone}</td>
              </tr>
            </table>
          </div>

          <div style="text-align: center; margin-top: 24px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin" 
               style="background: #2b6cb0; color: #fff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">
              View in Admin Panel
            </a>
          </div>
        </div>

        <div style="text-align: center; padding: 16px; color: #a0aec0; font-size: 12px;">
          This is an automated notification from your Real Estate Platform.
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendNewPropertyEmail };