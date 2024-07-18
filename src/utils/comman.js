const responseMessage = {
  SUCCESS: 'Success!',
  FAIL: 'Fail!',
  SIGNUP_SUCCESS: 'You Have Successfully Registered!',
  LOGIN_SUCCESS: 'You Have Successfully LoggedIn!',
  LOGOUT_SUCCESS: 'You Have Successfully Logout!',
  OTP_VERIFY_SUCCESS: 'OTP Verified Successfully!',
  OTP_SEND_SUCCESS: 'OTP Send Successfully!',
  INVALID_CREDENTIAL:'Invalid credential',
  PASSWORD_UPDATE:"Password updated successfully!",
  EMAIL_NOT_FOUD:"Email not found",

};



function generateOtp() {
  const min = 1000; // Minimum value (inclusive)
  const max = 9999; // Maximum value (inclusive)
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function formatDateTime(inputTime) {
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
  const date = new Date(inputTime);

  return (
    date.toLocaleDateString('en-US', options).replace(/,/g, '') +
    ` ${date.toLocaleTimeString('en-US').replace(/:[0-9]{2}\s/, ' ')}`
  );
}

function formatDateTime2(dateTime) {
  const inputDate = new Date(dateTime);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const day = inputDate.getDate();
  const month = months[inputDate.getMonth()];
  const year = inputDate.getFullYear();

  const formattedDate = `${day} ${month} ${year}`;

  return formattedDate;
}

function timeDifferenceInSeconds(currentTime, timeToBeCalculated) {
  const calculatedDateTime = new Date(timeToBeCalculated);
  const timeDifferenceInSeconds = (currentTime - calculatedDateTime) / 1000;
  return timeDifferenceInSeconds;
}

module.exports = { responseMessage, generateOtp, formatDateTime, timeDifferenceInSeconds, formatDateTime2 };
