// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  url: '',

  siteURL: 'https://ims.odisha.gov.in/IMS/',
  serviceURL: 'https://ims.odisha.gov.in/admin/',
  websiteserviceURL: 'https://ims.odisha.gov.in/CMSadmin/api/',
  fileUrl: 'https://ims.odisha.gov.in/admin/storage/uploads/images/',
  domainUrl:'https://ims.odisha.gov.in/admin/',
  cmsdomainUrl:'https://ims.odisha.gov.in/CMSadmin/',  
  irmsHomeUrl: 'https://ims.odisha.gov.in/IMS/assets/images/',
  tempUrl:'https://ims.odisha.gov.in/admin/'+'storage/temp/',
  serviceAdminURL: 'https://ims.odisha.gov.in/admin/',
  apiUrl: 'https://ims.odisha.gov.in/admin/',
  installURL:'https://ims.odisha.gov.in/',
  staticFileUrl:'https://ims.odisha.gov.in/IMS/assets/files/SampleForm.pdf',
  staticUserManualFileUrl:'https://ims.odisha.gov.in/IMS/assets/files/OIMS-UserManual.pdf',
  
  CODEOFCONDUCT:false,
  devMode:false,
  krushakOdishaUrl:'',
  registrationProcessId: 21,

  encryptKey: 'AA74CDCC2BBRT935136',
  encryptIV: '26102021@qwI',
  my_bearer_auth: 'Bearer ' + sessionStorage.getItem('loggedtoken'),
  my_auth: 'Basic ' + btoa('admin' + ':' + 'admin'),
  errorMsg: 'Some Error Occured',
  constScheme: 1,
  constService: 2,

  constDrftSts: 1,
  constDocSts: 2,
  constPrevwSts: 3,

  constQrySts: 6,
  constRsmSts: 3,
  constMatchValue:0.7,
  sujogPortal:36,
  agricultureDirectory:6,
  directoryListicons:{'1':'fish.png','2':'animal-care.png','3':'apicol.png','4':'horticulture.png','5':'shovel.png','6':'planting.png','7':'paresram.jpg','8':'odisha-govt-ogo.png','9':'sujog.jpg','10':'mosarkar.png','11':'ospcb-logo.png'},
  APICOL_Directorate:3,
  soc_yt_link:'https://www.youtube.com/watch?v=zXGXD8uCpN0',
  how_to_use_yt_link:'https://www.youtube.com/embed/zXGXD8uCpN0',
  how_to_use_manual_link:'storage/uploads/files/safal_user_manual_Beneficiary_en.pdf',
  how_to_use_manual_link_odia:'storage/uploads/files/safal_user_manual_Beneficiary_od.pdf',
  redirectMsg:'This will be redirected to external URL for filling up rest of the information',
  apiHashingKey: '252e80b4e5d9cfc8b369ad98dcc87b5f',
  seedDBT:50,
  ckEdiorClass:'editor'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
