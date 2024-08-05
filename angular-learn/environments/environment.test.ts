export const environment = {
  production: true,
 
  url: '',
  siteURL: 'http://192.168.10.75/IRMS_testI/IRMS/',
  serviceURL: 'http://192.168.10.75/IRMS_testI/admin/',
  websiteserviceURL: 'http://192.168.10.75/IRMS_testI/CMSadmin/api/',
  fileUrl: 'http://192.168.10.75/IRMS_testI/admin/storage/uploads/images/',
  domainUrl:'http://192.168.10.75/IRMS_testI/admin/',
  cmsdomainUrl:'http://192.168.10.75/IRMS_testI/CMSadmin/',
  irmsHomeUrl: 'http://192.168.10.75/IRMS_testI/IRMS/assets/images/',
  tempUrl:'http://192.168.10.75/IRMS_testI/admin/'+'storage/temp/',
  serviceAdminURL: 'http://192.168.10.75/IRMS_testI/admin/',
  apiUrl: 'http://192.168.10.75/IRMS_testI/admin/',
  installURL:'http://192.168.10.75/IRMS_testI/',
  staticFileUrl:'http://192.168.10.75/IRMS_testI/assets/files/SampleForm.pdf',
  staticUserManualFileUrl:'http://192.168.10.75/IRMS_testI/assets/files/OIMS-UserManual.pdf',

  registrationProcessId: 21,
  devMode:false,
  CODEOFCONDUCT:false,
  krushakOdishaUrl:'',
	
	defaultDate:'1000-01-01',//Added on 31-10-23 by rohit kumar for column wise add more 
	
  projectPrefix:"E & IT Department",
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
  sujogPortal:'',
  agricultureDirectory:6,
  directoryListicons:{'1':'fish.png','2':'animal-care.png','3':'apicol.png','4':'horticulture.png','5':'shovel.png','6':'planting.png','7':'paresram.jpg','8':'odisha-govt-ogo.png','9':'sujog.jpg','10':'mosarkar.png','11':'ospcb-logo.png'},
  APICOL_Directorate:3,
  soc_yt_link:'https://www.youtube.com/watch?v=zXGXD8uCpN0',
  how_to_use_yt_link:'https://www.youtube.com/embed/zXGXD8uCpN0',
  how_to_use_manual_link:'storage/uploads/files/IRMS_user_manual_Beneficiary_en.pdf',
  how_to_use_manual_link_odia:'storage/uploads/files/IRMS_user_manual_Beneficiary_od.pdf',
  redirectMsg:'This will be redirected to external URL for filling up rest of the information',
  apiHashingKey: '252e80b4e5d9cfc8b369ad98dcc87b5f',
  seedDBT:50,
  ckEdiorClass:'editor'

};
