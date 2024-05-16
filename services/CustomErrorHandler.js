class CustomErrorHandler extends Error {
   constructor(status, msg) {
      super(msg); // Call the super constructor with the error message
      this.status = status;
   }

   static alreadyExist(message) {
      return new CustomErrorHandler(409, message);
   }
}

module.exports = CustomErrorHandler; // Corrected export statement
