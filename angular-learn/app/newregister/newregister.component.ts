import { ValidatorchklistService } from 'src/app/validatorchklist.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CitizenAuthService } from '../citizen-portal/service-api/citizen-auth.service';
import { environment } from '../../environments/environment';
import { NgbModal, NgbTooltip, ModalDismissReasons, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { EncryptDecryptService } from 'src/app/encrypt-decrypt.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

// Added by Mrutunjay
import { ActivatedRoute,Router} from '@angular/router';
import { WebcommonservicesService } from 'src/app/webcommonservices.service';
// import { ValidatorchecklistService } from '../services/validatorchecklist.service';
// import { EncrypyDecrpyService } from 'src/app/services/encrypy-decrpy.service';

// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import { ChangeEvent } from '@ckeditor/ckeditor5-angular';
// import { AlertService } from 'src/app/services/alert.service';
// Added by Mrutunjay

@Component({
  selector: 'app-newregister',
  templateUrl: './newregister.component.html',
  styleUrls: ['./newregister.component.css']
})
export class NewregisterComponent implements OnInit {
  // Mrutunjay Added
  arrSelectedCheckbox:any[]=[];
  processId:any=0;
  dynamicCtrlDetails:any=[];
  dynamicCtrlDetKeys:any =[]; 
  ctrlarray:any;
  currSecTabKey:any=0;
  currSecId:any=0;
  onlineServiceId:any=0;
  formName:any='';
  arralldynVal:any[]=[];
  arrallCascadingDetails:any[]=[];
  prevdipStatus:any='d-none';
  // editor:any = ClassicEditor;
  // ckEdtorCls=environment.ckEdiorClass;
  editor:any = '';
  ckEdtorCls='';
  arrckEdtorVal:any[]=[];
  arrUploadedFiles:any[]=[];
  arrDeletedUploadedFiles:any=[];
  secDisable:any=true;
  arrCalcFields:any[]=[];
  arrAddmoreDetails:any[]=[];
  arrAddmoreFilledData:any[]=[];
  arrAddmoreElemntKeys:any[]=[];
  tempurl=environment.tempUrl;
  arrAddMoreEditData:any=[]; 
  editIndex:any='';
  storagePath:any=environment.serviceURL+'storage/app/uploads/';
  btnSaveNextDisableStatus=false; // if false then btn is enabled else disabled
  private _location: any;
  // Mrutunjay Added
  maxAadharLenght = 12;
  minAadharLength = 12;
  intAadharNo: any = '';
  applicantName = '';
  emailId = '';
  mobileNo = '';
  password = '';
  confirmPwd = '';
  maxLghNm = 100;
  minLghNm = 5;
  maxLghEmail = 50;
  minLghEmail = 10;
  maxLghMob = 10;
  minLghMob = 10;
  maxLghPwd = 15;
  minLghPwd = 8;
  loading = false;
  textOTP = '';
  sendOTP = '';
  enctext = '';
  timeLeft: number = 120;
  interval;
  public editable = false;
  fileUrl = environment.irmsHomeUrl;
  anguage: any = 'English';
  @ViewChild('someModal') someModalRef: ElementRef;

  constructor(
    private route: Router,
    private encDec: EncryptDecryptService,
    public vldChkLst: ValidatorchklistService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    public authService: CitizenAuthService,
    public translate: TranslateService,
    private router : ActivatedRoute,private WebCommonService : WebcommonservicesService 
  ) { translate.addLangs(['English', 'Odia']);
  if (localStorage.getItem('locale')) {
    const browserLang = localStorage.getItem('locale');
    translate.use(browserLang.match(/English|Odia/) ? browserLang : 'English');
    $('body').addClass(browserLang);
  } else {
    localStorage.setItem('locale', 'English');
    translate.setDefaultLang('English');
  }}

  ngOnInit(): void {
    this.secDisable   = false;
    let schemeArr:any = [];
    let encSchemeId = this.router.snapshot.paramMap.get('id');
    if(encSchemeId != ""){
      let schemeStr = this.encDec.decText(encSchemeId);
       schemeArr = schemeStr.split(':');
       this.processId         = schemeArr[0];
       this.onlineServiceId   = schemeArr[1];
       this.currSecId         = schemeArr[2];
    }    
    let dynSchmCtrlParms = {
      'intProcessId': 19,
      'intOnlineServiceId' :this.onlineServiceId,
      'sectionId'          :this.currSecId
    }
    this.loadDynamicCtrls(dynSchmCtrlParms);
  }

  /**
   * Function name: getOTP
   * description :  This method for validate the user registration and send otp to given mobile no
   * created by  : Bibhuti Bhusan Sahoo
   * created on  : 23Jun2022
   */
   addMoreValidation(addmoreData:any,addmoreConfiguredData:any)
   {
     let arrAddMoreValdiator:any[]=[];
     let addmreValidStaus = true;
     for(let addMoreConfiguredValidatorloop of addmoreConfiguredData)
       { 
         let addMoreerrorMsg:any = '';
         if(addMoreConfiguredValidatorloop.ctrlMandatory && addmoreData.length == 0)
           {
                 if(addMoreConfiguredValidatorloop.ctrlTypeId == 3 || addMoreConfiguredValidatorloop.ctrlTypeId == 5 || addMoreConfiguredValidatorloop.ctrlTypeId == 6)
                         {
                           addMoreerrorMsg = 'Select ' +  addMoreConfiguredValidatorloop.ctrlLabel;
                         }
                         else
                         {
                           addMoreerrorMsg =  addMoreConfiguredValidatorloop.ctrlLabel + ' can not be left blank';
                         }
                 Swal.fire({
                   icon: 'error',
                   text: addMoreerrorMsg
                 });
                 addmreValidStaus = false;
                 break;
           } 
          arrAddMoreValdiator[addMoreConfiguredValidatorloop.ctrlId] = {'ctrlTypeId': addMoreConfiguredValidatorloop.ctrlTypeId , 'ctrlMandatory':addMoreConfiguredValidatorloop.ctrlMandatory , 'ctrlMaxLength': addMoreConfiguredValidatorloop.ctrlMaxLength , 'ctrlMinLength':addMoreConfiguredValidatorloop.ctrlMinLength , 'ctrlAttributeType' : addMoreConfiguredValidatorloop.ctrlAttributeType , 'ctrlLabel' : addMoreConfiguredValidatorloop.ctrlLabel}
       }
       if(addmreValidStaus && addmoreData!=undefined)
           {
             for(let addMoreTrDataValidatorloop of addmoreData) //TR
               {
                 for(let addMoreTdDataValidatorloop of addMoreTrDataValidatorloop) //TD
                   {
                     if(addMoreTdDataValidatorloop['ctrlTypeId']  == 2) // Textbox Validation
                         {
                           if(arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlMandatory']) // For Mandatory
                           {
                             if(!this.vldChkLst.blankCheck(addMoreTdDataValidatorloop['ctrlValue'],arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlLabel']+' can not be left blank'))
                               {
                                  addmreValidStaus =  false;
                                   break;
                               }
                             }
                               if(arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlMaxLength']!='') // For Max length
                               {  
                                 if(!this.vldChkLst.maxLength(addMoreTdDataValidatorloop['ctrlValue'],arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlMaxLength'],arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlLabel']))
                                 {
                                   addmreValidStaus =  false;
                                   break;
                                 }
                               }
                         
                                 if(arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlMinLength']!='')// For Min length
                                 {  
                                   if(!this.vldChkLst.minLength(addMoreTdDataValidatorloop['ctrlValue'],arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlMinLength'],arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlLabel']))
                                   {
                                     addmreValidStaus =  false;
                                     break;
                                   }
                                 }
                   
                                 if(arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlAttributeType'] == 'email') // For Valid Email
                                   {
                                     if(!this.vldChkLst.validEmail(addMoreTdDataValidatorloop['ctrlValue']))
                                     {
                                       addmreValidStaus =  false;
                                       break;
                                     }
                                     
                                   }
                           
                                   else if(arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlAttributeType'] == 'telephone') // For Valid Mobile
                                   {
                                     if(!this.vldChkLst.validMob(addMoreTdDataValidatorloop['ctrlValue']))
                                     {
                                       addmreValidStaus =  false;
                                       break;
                                     }
                                   }
                             
                                   else if(arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlAttributeType'] == 'password') // For password Validation
                                   {
                                     if(!this.vldChkLst.validPassword(addMoreTdDataValidatorloop['ctrlValue']))
                                     {
                                       addmreValidStaus =  false;
                                       break;
                                     }
                                     
                                   }
                           }
                           else if(addMoreTdDataValidatorloop['ctrlTypeId'] == 3) // Dropdown Validation
                           {
                             if(arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlMandatory']) // For Mandatory
                             {
                               if(!this.vldChkLst.selectDropdown(addMoreTdDataValidatorloop['ctrlValue'],arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlLabel']))
                               {
                                 addmreValidStaus =  false;
                                 break;
                               }
                             }
                           }
                           else if(addMoreTdDataValidatorloop['ctrlTypeId'] == 4) // Text Area and ckeditor Validation
                           {
                             if(arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlMandatory']) // For Mandatory
                             {
                               if(!this.vldChkLst.blankCheck(addMoreTdDataValidatorloop['ctrlValue'],arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlLabel']+' can not be left blank'))
                               {
                                  addmreValidStaus =  false;
                                   break;
                               }
                             }

                             if(arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlMaxLength']!='') // For Max length
                               {  
                                 if(!this.vldChkLst.maxLength(addMoreTdDataValidatorloop['ctrlValue'],arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlMaxLength'],arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlLabel']))
                                 {
                                   addmreValidStaus =  false;
                                   break;
                                 }
                               }
                         
                                 if(arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlMinLength']!='')// For Min length
                                 {  
                                   if(!this.vldChkLst.minLength(addMoreTdDataValidatorloop['ctrlValue'],arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlMinLength'],arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlLabel']))
                                   {
                                     addmreValidStaus =  false;
                                     break;
                                   }
                                 }
                           }

                           else if(addMoreTdDataValidatorloop['ctrlTypeId'] == 5) // Checkbox Validation
                           {
                             if(arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlMandatory']) // For Mandatory
                             {
                             if(!this.vldChkLst.blankCheck(addMoreTdDataValidatorloop['ctrlValue'],arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlLabel']+' can not be left blank'))
                               {
                                  addmreValidStaus =  false;
                                   break;
                               }
                             }
                           }

                           else if(addMoreTdDataValidatorloop['ctrlTypeId'] == 6) // Radio Validation
                           {
                             if(arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlMandatory']) // For Mandatory
                             {
                             if(!this.vldChkLst.blankCheck(addMoreTdDataValidatorloop['ctrlValue'],arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlLabel']+' can not be left blank'))
                               {
                                  addmreValidStaus =  false;
                                   break;
                               }
                             }
                           }
                           else if(addMoreTdDataValidatorloop['ctrlTypeId'] == 7) // File Validation
                           {
                             if(arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlMandatory']) // For Mandatory
                             {
                             if(!this.vldChkLst.blankCheck(addMoreTdDataValidatorloop['uploadFile']['fileName'],arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlLabel']+' can not be left blank'))
                               {
                                   addmreValidStaus =  false;
                                   break;
                               }
                             }
                           }
                   }

               }
           }  
     return addmreValidStaus
   }
   loadDynDepend(ctrlId:any,typeId:any=0)
  { 
  
    let dynBindType:any;
    let dynBndVal:any;
    if(typeId == 5 || typeId == 6 )
    {
       dynBindType   =(document.getElementsByName(ctrlId));
       for(let dynrdobndtype of dynBindType)
       {
         if(dynrdobndtype.checked)
         {
          dynBndVal = dynrdobndtype.value;
          break;
         }
     
       } 

    }
    else
    {
       dynBindType  =(<HTMLInputElement>document.getElementById(ctrlId));
       dynBndVal = dynBindType.value
      
      
    }
  
      let dynbindvalclmn    = this.arrallCascadingDetails[ctrlId].ctrlCCDValueColumnName;
      let bnddpndfld:any    = document.querySelectorAll("[data-dynbinddependctlfldid="+ctrlId +"]");
      let bindconditions    = (dynbindvalclmn+'='+dynBndVal);
 
      for(let dynbndtype of bnddpndfld)
      {
        let dynCtrlId         = dynbndtype.getAttribute('data-id');
        let dynbindconditions = this.arrallCascadingDetails[dynCtrlId].ctrlCCDConditions;
        let dynfnlBind        =  '';
       
        if(dynbindconditions.length > 0 )
          {
            dynfnlBind   = dynbindconditions + ' and ';
            //dynfnlBind   = dynbindconditions + ' and ';
          }
          dynfnlBind+=bindconditions;
  
        if(dynbndtype.getAttribute('data-dynbinddependflag') == 'true')
        {  
        let parms             = {
          'tableName'          : this.arrallCascadingDetails[dynCtrlId].ctrlCCDTableName,
          'columnName'         : this.arrallCascadingDetails[dynCtrlId].ctrlCCDTextColumnName+','+ this.arrallCascadingDetails[dynCtrlId].ctrlCCDValueColumnName,
          'condition'          : dynfnlBind
        }
      
        this.dynmaicValApi(parms,dynCtrlId)
      }
    }
  
  }
  doSchemeApply()
  {    
    this.currSecTabKey='sec_0';
    let schemeWiseFormDetails =  this.dynamicCtrlDetails[this.currSecTabKey]['formDetails'];
    const formData = new FormData();
    let uploadFile:any;
    let validatonStatus  = true;
    let validateArray: any[]    =[];
    let arrJsnTxtDet:any = [];
    for(let schemeWiseFormCtr of schemeWiseFormDetails )
    {
      let arrAddMoreElement:any='';
      let ctrlTypeId      = schemeWiseFormCtr.ctrlTypeId;
      let elmVal          = '';
      let elmValText:any      = '';
      let elmId           = schemeWiseFormCtr.ctrlId;
      let elmName         = schemeWiseFormCtr.ctrlName;
      let lblName         =  schemeWiseFormCtr.ctrlLabel;
      let mandatoryDetails = schemeWiseFormCtr.ctrlMandatory;
      let attrType        = schemeWiseFormCtr.ctrlAttributeType;
      let ctrlMaxLength   = schemeWiseFormCtr.ctrlMaxLength;
      let ctrlMinLength   = schemeWiseFormCtr.ctrlMinLength;
      let elmClass        = schemeWiseFormCtr.ctrlClass;
      let addMoreElementData = '';
      if(ctrlTypeId == 2) // For Textbox 
      {  
        if(schemeWiseFormCtr['dependctrlDetails'][0]['ctrlChkDepend'])
        {
          let dependElemId        = schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependParent'];
          let dependElemdCondVal  = schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependValue'];
      
          if(validateArray[dependElemId].ctrlValue !=dependElemdCondVal)
          {
            continue;
          }
         
        }
        elmVal   = (<HTMLInputElement>document.getElementById(elmId)).value;        
        
        if(elmClass =="gst_number") // For Mandatory
        {
          if(!this.vldChkLst.validGstNo(elmVal))
            {
              validatonStatus =  false;
            break;
            }
        } 
   
        if(mandatoryDetails) // For Mandatory
        {

          if(!this.vldChkLst.blankCheck(elmVal,lblName+' can not be left blank'))
          {
            validatonStatus =  false;
          break;
          }

        }

        if(ctrlMaxLength!='') // For Max length
        {  
          if(!this.vldChkLst.maxLength(elmVal,ctrlMaxLength,lblName))
          {
            validatonStatus =  false;
            break;
          }
        }

        if(ctrlMinLength!='')// For Min length
        {  
          if(!this.vldChkLst.minLength(elmVal,ctrlMinLength,lblName))
          {
            validatonStatus =  false;
             break;
          }

        }

        if(attrType == 'email') // For Valid Email
          {
            if(!this.vldChkLst.validEmail(elmVal))
            {
              validatonStatus =  false;
               break;
            }
            
          }
        
          else if(attrType == 'telephone') // For Valid Mobile
          {
            if(!this.vldChkLst.validMob(elmVal))
            {
              validatonStatus =  false;
               break;
            }
            
          }
          
          else if(attrType == 'password') // For password Validation
          {
            if(!this.vldChkLst.validPassword(elmVal))
            {
              validatonStatus =  false;
              break;
            }
            
          }
       
      } 

      else if(ctrlTypeId == 3) // For DropDown
      {
        let elm:any      = (<HTMLInputElement>document.getElementById(elmId));
        elmVal           = elm.value;
        elmValText        = elm.options[elm.selectedIndex].text;
      
        if(schemeWiseFormCtr['dependctrlDetails'][0]['ctrlChkDepend'])
        {         
          let dependElemId        = schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependParent'];
          let dependElemdCondVal  = schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependValue'];
          let dependElemVal  
          if(validateArray[dependElemId]['ctrlTypeId'] == 6 || validateArray[dependElemId]['ctrlTypeId'] == 5)
          {
            let dependElem:any  = document.getElementsByName(dependElemId);
             for(let i of dependElem) 
             {
               if(i.checked)
               {
                dependElemVal = i.value;
                 break;
               }             
             }
          }
          else
          {
            dependElemVal       = (<HTMLInputElement>document.getElementById(dependElemId)).value;
          }
          if(dependElemVal !=dependElemdCondVal)
          {
            continue;
          }         
        }

        if(mandatoryDetails) // For Mandatory
        {
          if(!this.vldChkLst.selectDropdown(elmVal,lblName))
          {
            validatonStatus =  false;
            break;
          }
        }
      }

      else if(ctrlTypeId == 4) // For TextArea
      {
        if(elmClass ==  this.ckEdtorCls)
          {
            elmVal   =  this.arrckEdtorVal[elmId];
          }
        else
        {
          elmVal   = (<HTMLInputElement>document.getElementById(elmId)).value;
        }
        
        if(schemeWiseFormCtr['dependctrlDetails'][0]['ctrlChkDepend'])
        {
          let dependElemId        = schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependParent'];
          let dependElemdCondVal  = schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependValue'];
          let dependElemVal       = (<HTMLInputElement>document.getElementById(dependElemId)).value;
          if(dependElemVal !=dependElemdCondVal)
          {
            continue;
          }         
        }
        if(mandatoryDetails) // For Mandatory
        {
          if(!this.vldChkLst.blankCheck(elmVal,lblName+' can not be left blank'))
          {
            validatonStatus =  false;
             break;
          }
        }
        if(ctrlMaxLength!='') // For Max length
        {  
          if(!this.vldChkLst.maxLength(elmVal,ctrlMaxLength,lblName))
          {
            validatonStatus =  false;
             break;
          }     
        }

        if(ctrlMinLength!='')// For Min length
        {  
          if(!this.vldChkLst.minLength(elmVal,ctrlMinLength,lblName))
          {
            validatonStatus =  false;
             break;
          }
        }
      }

      else if(ctrlTypeId == 5) // For Checkbox
      {        
        let chkdVal :any  = '';
        let chkdTxt :any = '';
        var checkboxes :any = document.getElementsByName(elmId);
        for (var checkbox of checkboxes)
        {
           if (checkbox.checked) {
              if(chkdVal.length > 0)
                {
                  chkdVal+= ','+checkbox.value;
                  let el = document.querySelector(`label[for="${checkbox.id}"]`);              
                  chkdTxt+=','+el?.textContent;
                }
              else
                  {
                    chkdVal+= checkbox.value;
                    let el = document.querySelector(`label[for="${checkbox.id}"]`);
                    chkdTxt+=el?.textContent;
                  }                  
           }
        }
        elmVal      = chkdVal;
        elmValText  = chkdTxt;
        if(schemeWiseFormCtr['dependctrlDetails'][0]['ctrlChkDepend'])
        {
          let dependElemId        = schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependParent'];
          let dependElemdCondVal  = schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependValue'];
          if(validateArray[dependElemId]['ctrlTypeId'] == 5) // For Checkbox
                {
                  
                }
            else if(validateArray[dependElemId]['ctrlTypeId'] == 6) // For Radio
              {
                  if(dependElemdCondVal != validateArray[dependElemId]['ctrlValue'])
                    {
                      continue;
                    }
              }
              
              else 
              {
                let dependElemVal       = (<HTMLInputElement>document.getElementById(dependElemId)).value;
            
              if(dependElemVal !=dependElemdCondVal)
              {
                continue;
              }
              }
         
        }

        if(mandatoryDetails) // For Mandatory
        {
        if(!this.vldChkLst.blankCheckRdoDynamic(elmId,lblName))
          {
            validatonStatus =  false;
             break;
          }
        }
      }

     else if(ctrlTypeId == 6) // For Radio Btn
      {
        var radioBtnElmn=document.getElementsByName(elmId);

            for (var i = 0, length = radioBtnElmn.length; i < length; i++)
            {
              if ((<HTMLInputElement>radioBtnElmn[i]).checked)
              {
                elmVal   = (<HTMLInputElement>radioBtnElmn[i]).value;
                let rdId  = (<HTMLInputElement>radioBtnElmn[i]).id;
                let el = document.querySelector(`label[for="${rdId}"]`);
                elmValText = el?.textContent;
              }
            }
            if(schemeWiseFormCtr['dependctrlDetails'][0]['ctrlChkDepend'])
            {              
              let dependElemId        = schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependParent'];
              let dependElemdCondVal  = schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependValue'];
            if(validateArray[dependElemId]['ctrlTypeId'] == 5) // For Checkbox
                {
                  
                }
            else if(validateArray[dependElemId]['ctrlTypeId'] == 6) // For Radio
              {
                  if(dependElemdCondVal != validateArray[dependElemId]['ctrlValue'])
                    {
                      continue;
                    }
              }              
              else 
              {
                let dependElemVal       = (<HTMLInputElement>document.getElementById(dependElemId)).value;
                if(dependElemVal !=dependElemdCondVal)
                {
                  continue;
                }
              }
            }
            if(mandatoryDetails) // For Mandatory
            {
          if(!this.vldChkLst.blankCheckRdoDynamic(elmId,lblName))
          {
            validatonStatus =  false;
             break;
          }
          }
      }

      else if(ctrlTypeId == 7)
      {  
        uploadFile = this.arrUploadedFiles[elmId];
        if(mandatoryDetails) // For Mandatory
        {
        if(uploadFile['fileName'] =='' || uploadFile['fileName'] == undefined)
          {
            Swal.fire({
              icon: 'error',
              text: 'Please upload ' + lblName
            });
            validatonStatus =  false;
             break;
          }
        }
      }

      else if(ctrlTypeId == 10) //For AddMore
      { 
        if(schemeWiseFormCtr['dependctrlDetails'][0]['ctrlChkDepend']) // For Dependent Check
        {
         
          let dependElemId        = schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependParent'];
          let dependElemdCondVal  = schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependValue'];
          let dependElemVal  
          if(validateArray[dependElemId]['ctrlTypeId'] == 6 || validateArray[dependElemId]['ctrlTypeId'] == 5)
          {
            let dependElem:any  = document.getElementsByName(dependElemId);
             for(let i of dependElem) 
             {
               if(i.checked)
               {
                dependElemVal = i.value;
                 break;
               }
             
             }
          }
          else
          {
            dependElemVal       = (<HTMLInputElement>document.getElementById(dependElemId)).value;
          }
          if(dependElemVal !=dependElemdCondVal)
          {
            continue;
          }
         
        }

        let addmoreAllCtrlWiseData = this.arrAddmoreFilledData[elmId];
        if(addmoreAllCtrlWiseData == undefined)
          {
            addmoreAllCtrlWiseData = [];
          }
        if(!this.addMoreValidation(addmoreAllCtrlWiseData,schemeWiseFormCtr['addmoreDetails']))
          {
            validatonStatus =  false;
            break;
          }
        addMoreElementData = JSON.stringify(this.arrAddmoreFilledData[elmId]);
      }
      validateArray[elmId]  =  {
        'ctrlValue'  : elmVal,
        'ctrlTypeId' : ctrlTypeId
      };
      formData.append('ctrlTypeId['+elmId+']', ctrlTypeId);
      formData.append('ctrlId['+elmId+']', elmId);
      formData.append('ctrlName['+elmId+']', elmName);
      formData.append('lblName['+elmId+']', lblName);
      formData.append('ctrlValue['+elmId+']', elmVal);
      formData.append( 'ctrlValueText['+elmId+']', elmValText);
      formData.append('uploadedFiles['+elmId+']', JSON.stringify(uploadFile));
      formData.append('addMoreElementData['+elmId+']',addMoreElementData);
    }  
    
    // formData.append('processId', this.processId);
    formData.append('processId', '19');
    formData.append('secId', this.currSecId);
    formData.append('intOnlineServiceId', this.onlineServiceId);
    // formData.append('optionTxtDetails', JSON.stringify(arrJsnTxtDet));
    if(validatonStatus )
    {
      this.register(formData);
    }
  }
   storeCasDetials(cascadingDetails:any,id:any)
   {
      this.arrallCascadingDetails[id] = cascadingDetails;     
   }
   setCalcFieldValue(ctrlCalcFieldData:any , ctrlId:any)
   {
     this.arrCalcFields[ctrlId] = ctrlCalcFieldData;     
   }
   calculate(calcDetails:any,ctrlId:any) // This function is used for Calculation purpose 
   {
     let clc :any=0;
     let valuate:any='';
     for (let calcloop of calcDetails)
     {
       if(calcloop.ctrlCalcFieldtype == 'fieldValue')
         {
           let fldValue = (<HTMLInputElement>(document.getElementById(calcloop.ctrlCalcValue))).value
           clc= (fldValue.length > 0) ? fldValue : 0;
         }
        else
        {
         clc = calcloop.ctrlCalcValue;
        }
        valuate+=clc;
     }
     (<HTMLInputElement>(document.getElementById(ctrlId))).value = eval(valuate);
     return;
   }
   dynmaicValApi(params:any,dynbindCtrlId:any)
   {
     this.WebCommonService.loadDynamicBindDetails(params).subscribe(res => {
      
      if(res.status == 200)
        {
         this.arralldynVal[dynbindCtrlId] = res.result;
        }
  });
   }
   loadDependCtrls()
   {     
     let prntIds:any = document.querySelectorAll("[data-parentflag=true]"); 
     for(let prntDet of prntIds)
     {
       let dependntTypeID  = prntDet.getAttribute('data-typeid');
       if(dependntTypeID ==6 || dependntTypeID ==5) // For Radio and checkbox
         {
           let id  = prntDet.name;
           let chldDetls :any =  document.querySelectorAll("[data-dependctrlId="+id+"]");
           prntDet.addEventListener('click', ()=>{
             for (let loopChldDet of chldDetls)
             {
               let lopdependval = loopChldDet.getAttribute('data-dependentvalue');
               if(prntDet.value == lopdependval)
               {
                 loopChldDet.closest(".dynGridCls").classList.remove('d-none');
                 loopChldDet.closest(".dynGridCls").querySelector('.dynlabel').classList.remove('d-none');    
                 loopChldDet.classList.remove('d-none');
                 // loopChldDet.closest(".control-holder").querySelector('.form-group').classList.remove('d-none');
                   
                let lblEmnt = (<HTMLInputElement>document.getElementById(loopChldDet.id)).nextElementSibling;
                     lblEmnt?.classList.remove('d-none');                   
             
               }
               else
               {
                 loopChldDet.closest(".dynGridCls").classList.add('d-none');
                 loopChldDet.closest(".dynGridCls").querySelector('.dynlabel').classList.add('d-none');
                 loopChldDet.classList.remove('d-none');  
                 loopChldDet.classList.add('d-none');
                     let lblEmnt = (<HTMLInputElement>document.getElementById(loopChldDet.id)).nextElementSibling;
                     lblEmnt?.classList.add('d-none');
                 let tpId   = loopChldDet.getAttribute('data-typeid');
                 if(tpId == 2)
                 {
                   (<HTMLInputElement>document.getElementById(loopChldDet.id)).value='';
                 }
                 else if(tpId == 3)
                 {
                   (<HTMLInputElement>document.getElementById(loopChldDet.id)).value='0';
                 }
           
               }
             }
           });
          
         }
       
             else // For Dropdown
             {
             let chldDetls :any =  document.querySelectorAll("[data-dependctrlId="+prntDet.id+"]");
             prntDet.addEventListener('change', ()=>{
               for (let loopChldDet of chldDetls)
               {
                 let lopdependval = loopChldDet.getAttribute('data-dependentvalue');
                 if(prntDet.value == lopdependval)
                 {
                   loopChldDet.closest(".dynGridCls").classList.remove('d-none');
                   loopChldDet.closest(".dynGridCls").querySelector('.dynlabel').classList.remove('d-none');
                   // loopChldDet.closest(".control-holder").querySelector('.form-group').classList.remove('d-none');
                   loopChldDet.classList.remove('d-none');
 
                   if(loopChldDet.getAttribute('data-typeid') == 6 || loopChldDet.getAttribute('data-typeid') == 5)
                   {
                     let lblEmnt = (<HTMLInputElement>document.getElementById(loopChldDet.id)).nextElementSibling;
                     lblEmnt?.classList.remove('d-none');                   
                   } 
                 }
                 else
                 {
                   loopChldDet.closest(".dynGridCls").classList.add('d-none');
                   loopChldDet.closest(".dynGridCls").querySelector('.dynlabel').classList.add('d-none');
               
                   // loopChldDet.closest(".control-holder").querySelector('.form-group').classList.add('d-none');
                   loopChldDet.classList.add('d-none');
                   if(loopChldDet.getAttribute('data-typeid') == 6 || loopChldDet.getAttribute('data-typeid') == 5)
                   {
                     let lblEmnt = (<HTMLInputElement>document.getElementById(loopChldDet.id)).nextElementSibling;
                     lblEmnt?.classList.add('d-none');
                   }
 
                   let tpId   = loopChldDet.getAttribute('data-typeid');
                   if(tpId == 2)
                   {
                     (<HTMLInputElement>document.getElementById(loopChldDet.id)).value='';
                   }
                   else if(tpId == 3)
                   {
                     (<HTMLInputElement>document.getElementById(loopChldDet.id)).value='0';
                   } 
                 } 
               } 
             }); 
           } 
     } 
   }
   loadDynamicValue(){ 
    let dynBindType:any = document.querySelectorAll("[data-dynbindFlag=true]");
    console.log(dynBindType);
    for(let dynbndtype of dynBindType)
    {  
      let dynCtrlId         = dynbndtype.getAttribute('data-id');
      let dynbindconditions = this.arrallCascadingDetails[dynCtrlId].ctrlCCDConditions;
      let dynbindtbl        = this.arrallCascadingDetails[dynCtrlId].ctrlCCDTableName; 
      let dynbindtxtclmname = this.arrallCascadingDetails[dynCtrlId].ctrlCCDTextColumnName;
      let dynbinddependflag = dynbndtype.getAttribute('data-dynbinddependflag');
      let dynbindvalclmn    = this.arrallCascadingDetails[dynCtrlId].ctrlCCDValueColumnName;
      if(dynbinddependflag == 'false') // if not dependent on parent 
        {  
        let parms             = {
          'tableName'          : dynbindtbl,
          'columnName'         : dynbindtxtclmname+','+dynbindvalclmn,
          'condition'          : dynbindconditions
        }
        this.dynmaicValApi(parms,dynCtrlId);
      }
    } 

  }
  setCalcFields() 
  {
    let dynCalc:any =document.querySelectorAll("[data-calcflag='true']");
    for(let loopdynCalc of  dynCalc)
    {
      (<HTMLInputElement>document.getElementById(loopdynCalc.id)).readOnly=true ;
      for(let clcloop of this.arrCalcFields[loopdynCalc.id])
        { 
          if(clcloop.ctrlCalcFieldtype == 'fieldValue')
          {
            let clcElement =   (<HTMLInputElement>document.getElementById(clcloop.ctrlCalcValue));
            clcElement.addEventListener('keyup', ()=>{
              this.calculate(this.arrCalcFields[loopdynCalc.id],loopdynCalc.id);
              });
          }
           
        }

    }
    return;
  }
   loadDynamicCtrls(dynSchmCtrlParms:any)
   {
     this.WebCommonService.schemeDynCtrl(dynSchmCtrlParms).subscribe(res => {
        this.loading=true;
       if(res.status == 200)
         {
           this.dynamicCtrlDetails = res.result;
           this.formName           = res.formName;
           this.dynamicCtrlDetKeys = Object.keys(this.dynamicCtrlDetails).sort(); 
          setTimeout(() => {
           this.loadDynamicValue();
         }, 2000);
           setTimeout(() => {
             this.loadDependCtrls();
             this.setCalcFields();
 
             if(this.onlineServiceId>0)
             {
               let dynBindType:any = document.querySelectorAll("[data-dynbindflag=true]");
 
               for(let dynbndtype of dynBindType)
                 {  
                   let dynCtrlId         = dynbndtype.getAttribute('data-id');
                   let dynbindconditions = this.arrallCascadingDetails[dynCtrlId].ctrlCCDConditions;
                   let dynbindtbl        = this.arrallCascadingDetails[dynCtrlId].ctrlCCDTableName; 
                   let dynbindtxtclmname = this.arrallCascadingDetails[dynCtrlId].ctrlCCDTextColumnName;
                   let dynbinddependflag = dynbndtype.getAttribute('data-dynbinddependflag');
                   let dynbindvalclmn    = this.arrallCascadingDetails[dynCtrlId].ctrlCCDValueColumnName;
                   if(dynbinddependflag == 'true')
                     {  
                     let parms             = {
                       'tableName'          : dynbindtbl,
                       'columnName'         : dynbindtxtclmname+','+dynbindvalclmn,
                       'condition'          : dynbindconditions
                     }
                     this.dynmaicValApi(parms,dynCtrlId);
                   }
                 } 
                 
                 // For Edit Case of Dependend Fields
               let prntIds:any = document.querySelectorAll("[data-parentflag=true]");
             
               for(let prntDet of prntIds)        
               {
                 let dependntTypeID  = prntDet.getAttribute('data-typeid');
                 if(dependntTypeID == 5)
                 {
                   if(prntDet.checked==true)
                   {
                    // prntDet.innerHTML = true;  
                   //  prntDet.click();
                   }
                 }
                 else if(dependntTypeID == 6)
                 {
                 if(prntDet.checked==true)
                 {
                  prntDet.click();
                 }
                }
                else if(dependntTypeID == 3)
                {
                 var event = new Event('change');
                 prntDet.dispatchEvent(event);
                }
             }
             }
             this.loading=false;
           }, 3000);
        
     
           if(this.currSecTabKey == 0 && this.currSecId ==0)
           {
               this.currSecTabKey      = this.dynamicCtrlDetKeys[0]; 
            
               this.currSecId          = this.dynamicCtrlDetails[this.currSecTabKey]['sectionid'];
           }
         }
   }); 
   }
  getOTP() {
    let namePrfx = '';
    let intAadharNo = this.intAadharNo;
    let emailId = this.emailId;
    let mobileNo = this.mobileNo;
    let password = this.password;
    let applicantName = this.applicantName;
    let confirmPwd = this.confirmPwd;

    let vSts = true;
    //  if (!this.vldChkLst.blankCheck(aadhaarNumber, "Aadhaar Number")) {
    //   vSts = false;
    // }
    if (!this.vldChkLst.maxLength(intAadharNo, this.maxAadharLenght, "Aadhaar Number")) {
      vSts = false;
    }
    else if (!this.vldChkLst.minLength(intAadharNo, this.minAadharLength, "Aadhaar Number")) {
      vSts = false;
    }
    else if (!this.vldChkLst.validAadhar(intAadharNo)) {
      vSts = false;
    }
    else if (!this.vldChkLst.blankCheck(applicantName, "Applicant Name")) {
      vSts = false;
    }
    else if (!this.vldChkLst.blankCheck(mobileNo, "Mobile Number")) {
      vSts = false;
    }
    else if (!this.vldChkLst.validMob(mobileNo)) {
      vSts = false;
    }
    else if (!this.vldChkLst.maxLength(mobileNo, this.maxLghMob, "Mobile Number")) {
      vSts = false;
    }
    else if (!this.vldChkLst.minLength(mobileNo, this.minLghMob, "Mobile Number")) {
      vSts = false;
    }
    else if (!this.vldChkLst.validEmail(emailId)) {
      vSts = false;
    }
    else if (!this.vldChkLst.maxLength(emailId, this.maxLghNm, "Email Id")) {
      vSts = false;
    }
    else if (!this.vldChkLst.minLength(emailId, this.minLghNm, "Email Id")) {
      vSts = false;
    }   
    else {
      vSts = true;
    }
    if (!vSts) {
      return vSts;
    }
    else {
      this.timeLeft = 120;
      this.startTimer();
      this.open(this.someModalRef);
      let regParam = {

        "mobileNo": mobileNo,

      };

      this.authService.sendotp(regParam).subscribe(res => {
        if (res.status == 1) {
          let result = res.result;
          this.enctext = result['enctext'];
          let profileId = result['profileId'];
          let encProfId = this.encDec.encText((profileId).toString());
          this.loading = false;
          this.route.navigateByUrl('/citizen-portal/registration-confirmation/' + encProfId);
        }
        else {
          this.loading = false;
        }        
      });
    }
  }

  /**
   * Function name: verifyAadharFormat
   * description :  This method for verify Aadhar Format
   * created by  : Bibhuti Bhusan Sahoo
   * created on  : 23Jun2022
   */

  verifyAadharFormat() {
    if (this.vldChkLst.validAadhar(this.intAadharNo)) {
      Swal.fire({
        icon: 'success',
        text: 'Aadhar Format Verified'
      });
    }
  }

  /**
   * Function name: verifyOTP
   * description :  This method for verify OTP
   * created by  : Bibhuti Bhusan Sahoo
   * created on  : 23Jun2022
   */

  verifyOTP() {    
    let textOTP = this.textOTP;
    let vSts = true;
    let otpTime = this.timeLeft;
    let enctext = this.enctext;
    if (!this.vldChkLst.blankCheck(textOTP, "Otp")) {
      vSts = false;
      this.textOTP = null;
    }
    else if (otpTime === 0) {
      this.textOTP = null;
      Swal.fire({
        icon: 'error',
        text: 'OTP expired, Click resend to get OTP'
      });
      vSts = false;
    }
    else {
      vSts = true;
    }
    if (!vSts) {
      return vSts;
    }
    else {
      this.loading = true;
      let regParam = {

        "otp": textOTP,
        "enctext": enctext,
      };
      this.authService.verifyotp(regParam).subscribe(res => {
        if (res.status == 1) {
          this.loading = false;
          this.modalService.dismissAll();
          this.register('hdfd')
        }
        else {
          this.loading = false;
          this.textOTP = null;
          Swal.fire({
            icon: 'error',
            text: res.msg
          });
        }
      });

    }
  }

  /**
   * Function name: resendOtp
   * description :  This method for resend OTP
   * created by  : Bibhuti Bhusan Sahoo
   * created on  : 23Jun2022
   */

  resendOtp() {
    let textOTP = this.textOTP;
    this.timeLeft = 120;
    this.startTimer();
    let mobileNo = this.mobileNo;
    this.textOTP = null;
    let regParam = {
      "mobileNo": mobileNo,
    };
    this.authService.sendotp(regParam).subscribe(res => {
      if (res.status == 1) {
        let result = res.result;
        this.enctext = result['enctext'];

      }
      else {
        this.loading = false;

      }
    });
  }

  /**
   * Function name: register
   * description :  This method for register the non-farmer user
   * created by  : Bibhuti Bhusan Sahoo
   * created on  : 23Jun2022
   */

  register(formData) {
    let schemeWiseFormCtr = this.dynamicCtrlDetails['sec_0']['formDetails'];
    let organisationType         = schemeWiseFormCtr[0].ctrlId;
    let orgtype   = (<HTMLInputElement>document.getElementById(organisationType)).value;

    let nameOfOrganizationId     = schemeWiseFormCtr[2].ctrlId;
    let applicantName   = (<HTMLInputElement>document.getElementById(nameOfOrganizationId)).value;

    let emailOfOrganizationId    = schemeWiseFormCtr[3].ctrlId;
    let emailId   = (<HTMLInputElement>document.getElementById(emailOfOrganizationId)).value;

    let mobileOfOrganizationId   = schemeWiseFormCtr[4].ctrlId;
    let mobileNo   = (<HTMLInputElement>document.getElementById(mobileOfOrganizationId)).value;
    
    let gstinNo     = schemeWiseFormCtr[5].ctrlId;
    let gstin       = (<HTMLInputElement>document.getElementById(gstinNo)).value;

    let regParam = {
      "namePrfx": '',
      "fullName": applicantName,
      "aadhaarnumber": '',
      "mobileNo": mobileNo,
      "emailId": emailId,
      "orgtype": orgtype,
      "password": '',
      "cPassword": '',
      "sourceType": 1,
      "gstin": gstin
    };
    this.loading = true;
    this.authService.register(regParam).subscribe(res => {
      if (res.status == 1) {
        let result = res.result;
        let profileId = result['profileId'];
        let encProfId = this.encDec.encText((profileId).toString());
        this.loading = false;
        let userInfo = {
          "userName": result['applicantName'],
          "userId": result['profileId'],
          "aadharNo": result['aadhaarNumber'],
          "mobileNo": result['mobileNo']
        }
        localStorage.setItem("userInfo", JSON.stringify(userInfo));

        let userSesnArr = {};
        userSesnArr["USER_SESSION"] = "access_token";
        userSesnArr["USER_ID"] = result['profileId'];
        userSesnArr["USER_FULL_NAME"] = result['applicantName'];
        userSesnArr["MOBILE_REQUEST"] = false;
        userSesnArr["USER_MOBILE"] = result['mobileNo'];
        userSesnArr["USER_SOURCE"] = result['intApplicantSource'];
        userSesnArr["USER_AADHAR"] = result['aadhaarNumber'];
        userSesnArr["USER_PROF_PIC"] = result['vchProfileImage'];
        //sessionStorage.setItem('FFS_SESSION', JSON.stringify(userSesnArr));
        Swal.fire({
          icon: 'success',
          html: 'Congratulations !<br>You have been successfully registerd on <strong>OIMS</strong>.'
        })
        .then(()=> {
          formData.append('intProfileId', profileId);
          this.WebCommonService.schemeApply(formData).subscribe((res:any)=>{
            let validationMsg = (res.result.validationMsg!='') ? res.result.validationMsg : 'error' ;
            if(res.status == 200){
              this.onlineServiceId = res.result.intOnlineServiceId;
              if(this.dynamicCtrlDetKeys.length > this.dynamicCtrlDetKeys.indexOf(this.currSecTabKey ) + 1)
                {
                  let latestDynCtlkeyIndex = Number(this.dynamicCtrlDetKeys.indexOf(this.currSecTabKey ))+1
                  this.currSecTabKey = this.dynamicCtrlDetKeys[latestDynCtlkeyIndex]; 
                  this.currSecId     = this.dynamicCtrlDetails[this.currSecTabKey]['sectionid'];
                  this.prevdipStatus = '';
                  this.secDisable   = false;
                  (<HTMLElement>document.getElementById("sec-tab-"+this.dynamicCtrlDetKeys[latestDynCtlkeyIndex])).click();
                 // this.secDisable   = true;
                }
                else
                {
                  let formParms  = this.processId+':'+this.onlineServiceId+':'+1;
                  let encSchemeStr = this.encDec.encText(formParms.toString());                 
                  this.route.navigate(['/citizen-portal/login']);                  
                }
            }           
            else{
              Swal.fire({
                icon: 'error',
                text: validationMsg
              });
            }
            });          
        });
      }
      else {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          text: res.msg
        });

      }
    });
  }

  /**
   * Function name: startTimer
   * description :  This method for start the otp timer
   * created by  : Bibhuti Bhusan Sahoo
   * created on  : 23Jun2022
   */

  startTimer() {
    if(this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.editable = false;
      } else {
        this.timeLeft = 0;
        this.editable = true;
      }
    }, 1000)
  }

  /**
   * Function name: open
   * description :  This method for open modal
   * created by  : Bibhuti Bhusan Sahoo
   * created on  : 23Jun2022
   */

  open(content: any) {
    this.modalService.open(content, { size: 'md', backdrop: 'static', keyboard: false, ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      }, (reason) => {     
    });
  }
  changeLang(language: string) {
    // localStorage.setItem('locale', language);
    localStorage.setItem('locale', 'English');
    this.translate.use(language);
    window.location.reload();
  }

}
// var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
// var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
//   return new bootstrap.Tooltip(tooltipTriggerEl)
// })