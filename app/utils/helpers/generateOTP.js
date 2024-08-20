// Function to generate numeric OTP with dynamic limit
function generateOTP(limit) {
  let otp = '';
  for (let i = 0; i < limit; i++) {
    // Generate random digit between 0 to 9 and append to OTP
    otp += Math.floor(Math.random() * 10);
  }
  // Convert the OTP string to a number
  return parseInt(otp, 10);
}


module.exports = generateOTP;