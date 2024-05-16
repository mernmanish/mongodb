class CustomErrorHandler extends Error {
   constructor(status, msg) {
      super(); // Call the super constructor with the error message
      this.message = msg;
      this.status = status;
   }

   static alreadyExist(message) {
      return new CustomErrorHandler(409, message);
   }
}

module.exports = CustomErrorHandler;
