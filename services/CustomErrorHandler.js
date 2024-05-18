class CustomErrorHandler extends Error {
   constructor(status, msg) {
      super(); // Call the super constructor with the error message
      this.message = msg;
      this.status = status;
   }

   static alreadyExist(message) {
      return new CustomErrorHandler(409, message);
   }

   static wrongCredentials(message = "Mobile no or password is invalid !") {
      return new CustomErrorHandler(401,message);
   }

   static dataNotExist(message) {
      return new CustomErrorHandler(404,message);
   }

   static unAuthorized(message = 'unAuthorized') {
      return new CustomErrorHandler(401,message);
   }
}

module.exports = CustomErrorHandler;
