import { Injectable } from '@angular/core';
import { max } from 'moment';
import Swal from 'sweetalert2';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class ValidatorchklistService {
  constructor(private comConfigServ:CommonService) { }


  // sizeImgCheck(elmVal:any, msg:any)
  // {
  //   //console.log("hello<br>"+elmVal);
  //     let selectedImage = (<HTMLInputElement>elmVal.target).files; 
  //     if(selectedImage[0].size > 100000)
  //     {
  //       Swal.fire({
  //         icon: 'error',
  //         text: 'Selected file must be in between 100kb'
  //       });
  //       return false;
  //     }
  //     return true;
  // }



  isNumeric(val:any, msg:any){
    if (!/^[0-9]+$/.test(val)){
      Swal.fire({
        icon: 'error',
        text: 'Enter '+msg
      });
      return false;
    }else{
      return true;
    }
  }


 

  price_in_words(price1) {
    let price = price1.replace(/([,€])+/g, '');
    let priceArr = price.split('.');
    price = priceArr[0];
    let afterPointPrice = priceArr[1];
    var sglDigit = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"],
        dblDigit = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"],
        tensPlace = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"],
        handle_tens = function (dgt, prevDgt) {
            return 0 == dgt ? "" : " " + (1 == dgt ? dblDigit[prevDgt] : tensPlace[dgt])
        },
        handle_utlc = function (dgt, nxtDgt, denom) {
            return (0 != dgt && 1 != nxtDgt ? " " + sglDigit[dgt] : "") + (0 != nxtDgt || dgt > 0 ? " " + denom : "")
        };
    var str = "",
        digitIdx = 0,
        digit = 0,
        nxtDigit = 0,
        words = [];
    if (price += "", isNaN(parseInt(price))) str = "";
    else if (parseInt(price) > 0 && price.length <= 10) {
        for (digitIdx = price.length - 1; digitIdx >= 0; digitIdx--) switch (digit = price[digitIdx] - 0, nxtDigit = digitIdx > 0 ? price[digitIdx - 1] - 0 : 0, price.length - digitIdx - 1) {
            case 0:
                words.push(handle_utlc(digit, nxtDigit, ""));
                break;
            case 1:
                words.push(handle_tens(digit, price[digitIdx + 1]));
                break;
            case 2:
                words.push(0 != digit ? "" + sglDigit[digit] + " Hundred" + (0 != price[digitIdx + 1] && 0 != price[digitIdx + 2] ? " and" : "") : "");
                break;
            case 3:
                words.push(handle_utlc(digit, nxtDigit, "Thousand"));
                break;
            case 4:
                words.push(handle_tens(digit, price[digitIdx + 1]));
                break;
            case 5:
                words.push(handle_utlc(digit, nxtDigit, "Lakh"));
                break;
            case 6:
                words.push(handle_tens(digit, price[digitIdx + 1]));
                break;
            case 7:
                words.push(handle_utlc(digit, nxtDigit, "Crore"));
                break;
            case 8:
                words.push(handle_tens(digit, price[digitIdx + 1]));
                break;
            case 9:
                words.push(0 != digit ? "" + sglDigit[digit] + " Hundred" + (0 != price[digitIdx + 1] || 0 != price[digitIdx + 2] ? " and" : " Crore") : "")
        }
        str = words.reverse().join(" ")
    }
    /* code for after point price */
    var str1 = "",
        digitIdx1 = 0,
        digit1 = 0,
        nxtDigit1 = 0,
        words1 = [];
    if (afterPointPrice += "", isNaN(parseInt(afterPointPrice))) str1 = "";
    else if (parseInt(afterPointPrice) > 0 && afterPointPrice.length <= 10) {
        for (digitIdx1 = afterPointPrice.length - 1; digitIdx1 >= 0; digitIdx1--) switch (digit1 = afterPointPrice[digitIdx1] - 0, nxtDigit1 = digitIdx1 > 0 ? afterPointPrice[digitIdx1 - 1] - 0 : 0, afterPointPrice.length - digitIdx1 - 1) {
            case 0:
                words1.push(handle_utlc(digit1, nxtDigit1, ""));
                break;
            case 1:
                words1.push(handle_tens(digit1, afterPointPrice[digitIdx1 + 1]));
                break;
            case 2:
                words1.push(0 != digit1 ? "" + sglDigit[digit1] + " Hundred" + (0 != afterPointPrice[digitIdx1 + 1] && 0 != afterPointPrice[digitIdx1 + 2] ? " and" : "") : "");
                break;
            case 3:
                words1.push(handle_utlc(digit1, nxtDigit1, "Thousand"));
                break;
            case 4:
                words1.push(handle_tens(digit1, afterPointPrice[digitIdx1 + 1]));
                break;
            case 5:
                words1.push(handle_utlc(digit1, nxtDigit1, "Lakh"));
                break;
            case 6:
                words1.push(handle_tens(digit1, afterPointPrice[digitIdx1 + 1]));
                break;
            case 7:
                words1.push(handle_utlc(digit1, nxtDigit1, "Crore"));
                break;
            case 8:
                words1.push(handle_tens(digit1, afterPointPrice[digitIdx1 + 1]));
                break;
            case 9:
                words1.push(0 != digit1 ? "" + sglDigit[digit1] + " Hundred" + (0 != afterPointPrice[digitIdx1 + 1] || 0 != afterPointPrice[digitIdx1 + 2] ? " and" : " Crore") : "")
        }
        str1 = words1.reverse().join(" ")
    }
    if(str1 != ''){
      str = str + 'and' + str1 + 'paisa ';
    }
    /* code for after point price */
    if(str!=''){
      return str+"Only";
    }   
    return str;

  }
  maxMinAmountLength(elmVal:any,maxAmount:any, minAmount:any, msg:any)
  { 
    if(minAmount!='' && parseInt(minAmount)>0 && parseInt(elmVal) < parseInt(minAmount)){
      Swal.fire({
        icon: 'error',
        text: msg+' should not less than '+ minAmount
      });
      return false;
    }
    else if( maxAmount!='' && parseInt(maxAmount)>0 && parseInt(elmVal) > parseInt(maxAmount) ){
      Swal.fire({
        icon: 'error',
        text: msg+ ' should not more  than ' +maxAmount
      });
      return false;
    }
    else{
      return true;
    }
  }
  profileStatusCheck(elmVal:any)
  {
    if (elmVal > 0){
      return true;
    }else{
      Swal.fire({
        icon: 'error',
        text: 'Please update your profile before applying any application !'
      })
      return false;
    }
    
  }

// onPaste(event:any){
//     let val = event.target.value;
//     let numbers = val.replace(/[^0-9/-]/g, '');
//     return numbers;
//   }
blankCheck(elmVal: any, msg: any, elmId: any = "") {
  elmVal = typeof elmVal === 'string' ? elmVal.trim() : elmVal;
  if (elmVal == '' || typeof (elmVal) == undefined || elmVal == null) {
    Swal.fire({
      icon: 'error',
      text: msg
    }).then(function () {
      if (elmId != "") {
        setTimeout(() => {
          const element = <HTMLInputElement>document.getElementById(elmId);
          element.focus();
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 500);
      }
    });
    return false;
  }
  return true;
}
  
  blankImgCheck(elmVal:any, msg:any)
  {
      if(elmVal == '' || typeof (elmVal) == undefined || elmVal == null)
      {
        Swal.fire({
          icon: 'error',
          text: 'Please '+msg
        });
        return false;
      }
      return true;
  }

  blankCheckRdo(elmNm:any, msg:any)
  {
      let ele = document.getElementsByName(elmNm);
      let checkedCtr:number = 0;
      for(let i = 0; i < ele.length; i++) {

         if((ele[i] as HTMLInputElement).checked)
         {
          checkedCtr++;
         }

      }
      if(checkedCtr==0)
      {
        Swal.fire({
          icon: 'error',
          text: 'Select '+msg
        });
          
        return false;
      }
      return true;
  }

  
  // blankCheckRdoDynamic(clsName:any, msg:any)
  // {
  //     let className =  'cls_'+clsName;
  //     let ele = document.getElementsByClassName(className);
  //     let checkedCtr:number = 0;
  //     for(let i = 0; i < ele.length; i++) {

  //        if((ele[i] as HTMLInputElement).checked)
  //        {
  //         checkedCtr++;
  //        }

  //     }
  //     if(checkedCtr==0)
  //     {
  //       Swal.fire({
  //         icon: 'error',
  //         text: 'Select '+msg
  //       });
          
  //       return false;
  //     }
  //     return true;
  // }

  blankCheckRdoDynamic(clsName:any, msg:any,elmId:any="")
  
 {

  let className =  'cls_'+clsName;
  let ele = document.getElementsByClassName(className);
  let checkedCtr:number = 0;
  for(let i = 0; i < ele.length; i++) {
     if((ele[i] as HTMLInputElement).checked)

     {
      checkedCtr++;
     }

  }
  if(checkedCtr==0)
  {
    Swal.fire({
      icon: 'error',
      text: ('Select')+' '+msg
    }).then(function(){
      if(ele[0]!=undefined )
      {
        setTimeout(() => {
          (<HTMLInputElement>document.getElementById(ele[0].id)?.closest('div')).focus();
          (<HTMLInputElement>document.getElementById(ele[0].id)).scrollIntoView();
        }, 500);

      }
    });

    return false;
  }
  return true;
}
  blankCheckChkboxDynamic(clsName:any, msg:any)
  {
      let className =  'cls_'+clsName;
      let ele = document.getElementsByClassName(className);
      let checkedCtr:number = 0;
      for(let i = 0; i < ele.length; i++) {

         if((ele[i] as HTMLInputElement).checked)
         {
          checkedCtr++;
         }

      }
      if(checkedCtr==0)
      {
        Swal.fire({
          icon: 'error',
          text: 'Select '+msg
        });
          
        return false;
      }
      return true;
  }
  
  // selectDropdown(elmVal:any, msg:any)
  // {
  //     if(elmVal == 0 || elmVal == '' || typeof (elmVal) == undefined || elmVal == null)
  //     {
  //       Swal.fire({
  //         icon: 'error',
  //         text: 'Select '+msg
  //       });
  //       return false;
  //     }
  //     return true;
  // }

  selectDropdown(elmVal:any, msg:any,elmId:any="")
  {
      if(elmVal == 0 || elmVal == '' || typeof (elmVal) == undefined || elmVal == null)
      {
        Swal.fire({
          icon: 'error',
          text: ('Select')+' '+msg
        }).then(function(){

          if(elmId!="")
          {
            setTimeout(() => {
              const element = <HTMLInputElement>document.getElementById(elmId);
              element.focus();
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
          }

        });
        return false;
      }
      return true;
  }
  maxLength(elmVal:any,fldLngth:any, msg:any,elmId:any="",attrType:any='string')
  {
      let charText = '';
      if(attrType == 'number'){
        charText = fldLngth > 1 ? "number's" : 'number';
      }else{
        charText = fldLngth > 1 ? "character's" : 'character';
      }
      if(elmVal.length>0 && elmVal.length>fldLngth)
      {
        Swal.fire({
          icon: 'error',
          text:'The '+ msg+' '+'should not be more than'+' ' + fldLngth + ' '+(charText)
        }).then(function(){
          if(elmId!="")
          {

            setTimeout(() => {
              const element = <HTMLInputElement>document.getElementById(elmId);
              element.focus();
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);

          }
        });
        return false;
      }
      return true;
  }

  minLength(elmVal:any,fldLngth:any, msg:any,elmId:any="",attrType:any='string')
  {
      let charText = '';
      if(attrType == 'number'){
        charText = fldLngth > 1 ? "number's" : 'number';
      }else{
        charText = fldLngth > 1 ? "character's" : 'character';
      }
      if(elmVal.length>0 && elmVal.length<fldLngth)
      {
        Swal.fire({
          icon: 'error',
          text: 'The '+msg+' '+('should not be less than')+' ' + fldLngth + ' '+(charText)
        }).then(function(){
          if(elmId!="")
          {
            setTimeout(() => {
              const element = <HTMLInputElement>document.getElementById(elmId);
              element.focus();
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
          }
        });
        return false;
      }
      return true;
  }


  validEmail(elmVal:any,elmId:any="",msg:any="")
  {
      let pattern = new RegExp(/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/);
      if (elmVal != '')
      {
          if (pattern.test(elmVal) == true)
            return true;
          else
          {
            Swal.fire({
              icon: 'error',
              text: 'Please enter a valid email id'
            }).then(function(){
              if(elmId!="")
      
              {
                setTimeout(() => {
                  const element = <HTMLInputElement>document.getElementById(elmId);
                  
                  element.focus();
                  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 500);
        
              }
        
            });
            return false;
          }
      }
      return true;
  }
  validMob(elmVal:any,elmId:any="",msg:any="")
  {
      let pattern = new RegExp(/^[6-9][0-9]{9}$/);
      if (elmVal != '')
      {
          if (pattern.test(elmVal) == true)
            return true;
          else
          {
            Swal.fire({
              icon: 'error',
              text: 'Please enter a valid mobile no'
            }).then(function () {
              if (elmId != "") {
                  setTimeout(() => {
                      const element = <HTMLInputElement>document.getElementById(elmId);
                      element.focus();
                      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }, 500);
              }
          });
            return false;
          }
      }
      return true;
  }
  validTel(elmVal:any,elmId:any="",msg:any="") {
    let pattern = /^(\(0\)[-.\s]?|0[-.\s]?)?([0-9]{3})[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
    if (elmVal != '') {
        if (pattern.test(elmVal)) {
            return true;
        } else {
            Swal.fire({
                icon: 'error',
                text: msg || 'Please enter a valid telephone no' 
            }).then(function () {
                if (elmId != "") {
                    setTimeout(() => {
                        const element = document.getElementById(elmId); 
                        if (element) {
                            element.focus(); 
                            element.scrollIntoView({ behavior: 'smooth', block: 'center' }); 
                        }
                    }, 500); 
                }
            });
            return false;
        }
    }
   return true;
}

  validPassword(elmVal:any,elmId:any="")
  {
      let pattern = new RegExp(/^.*(?=.{8,15})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&!%()*?]).*$/);
      if (elmVal != '')
      {
          if (pattern.test(elmVal) == true)
            return true;
          else
          {
            Swal.fire({
              icon: 'error',
              text: 'Please enter a valid password'
            }).then(function(){

              if(elmId!="")
    
              {
    
                setTimeout(() => {
    
                  (<HTMLInputElement>document.getElementById(elmId)).focus();
    
                   (<HTMLInputElement>document.getElementById(elmId)).scrollTo(
                {top: (<HTMLInputElement>document.getElementById(elmId)).getBoundingClientRect().top -
                  document.body.getBoundingClientRect().top -50}
                );
    
                }, 500);
    
              }
    
            })
            return false;
          }
      }
      return true;
  }

// validates Aadhar number received as string
  validAadhar(elmVal:any) {
    if (elmVal != '')
      {
          // multiplication table
          const d = [
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            [1, 2, 3, 4, 0, 6, 7, 8, 9, 5], 
            [2, 3, 4, 0, 1, 7, 8, 9, 5, 6], 
            [3, 4, 0, 1, 2, 8, 9, 5, 6, 7], 
            [4, 0, 1, 2, 3, 9, 5, 6, 7, 8], 
            [5, 9, 8, 7, 6, 0, 4, 3, 2, 1], 
            [6, 5, 9, 8, 7, 1, 0, 4, 3, 2], 
            [7, 6, 5, 9, 8, 2, 1, 0, 4, 3], 
            [8, 7, 6, 5, 9, 3, 2, 1, 0, 4], 
            [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
          ]

          // permutation table
          const p = [
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 
            [1, 5, 7, 6, 2, 8, 3, 0, 9, 4], 
            [5, 8, 0, 3, 7, 9, 6, 1, 4, 2], 
            [8, 9, 1, 6, 0, 4, 3, 5, 2, 7], 
            [9, 4, 5, 3, 1, 2, 6, 8, 7, 0], 
            [4, 2, 8, 6, 5, 7, 3, 9, 0, 1], 
            [2, 7, 9, 3, 8, 0, 6, 4, 1, 5], 
            [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
          ]
          let c = 0
          let invertedArray = elmVal.split('').map(Number).reverse()

          invertedArray.forEach((val:any, i:any) => {
            c = d[c][p[(i % 8)][val]]
          }) 
          if (c === 0)
            return true;
          else
          {
            Swal.fire({
              icon: 'error',
              text: 'Please enter a valid aadhaar no'
            });
            return false;
          }
      }
      return true;
  }

  isCharKey(event:any){
    var charCode2 = (event.which) ? event.which : event.keyCode
    if (charCode2 > 32 && (charCode2 < 65 || charCode2 > 90) &&
            (charCode2 < 97 || charCode2 > 122) ) {
        //alert("Enter letters only.");
        return false;
    }
    return true;
  }
  isCharKeyMob(val: any) {
    return val.replace(/[^a-zA-z ]/g, '');
  }


  isNumberKey(event:any)
  {
    //for restriction during paste ::added by siba 
    if (event.type === 'paste') {
      // const clipboardData = event.clipboardData || window.Clipboard;
      const clipboardData = window.ClipboardEvent ? event.clipboardData : window.Clipboard;
      const pastedText = clipboardData.getData('text');
      console.log(pastedText);
      if (isNaN(Number(pastedText))) {
        event.preventDefault();
        return false;
      }
    } else if (event.type === 'input') {//for restriction during mouse cursor input ::added by siba 
      const inputValue = event.target.value;
      const newValue = inputValue.replace(/[^0-9]/g, '');
      if (isNaN(Number(inputValue))) {
        event.preventDefault();
        event.target.value = newValue;
        console.log('prevented');
        return false;
      }
    } else {
      let charCode = (event.which) ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        event.preventDefault();
        return false;
      }
    }
    return true;
  }
  //Start of validating only positive numbers are taken By:sibananda
   /*
  * Function: validatePositiveNum
  * Description: To Validate Positive numbers
  * Created By: Sibananda Sahu
  * Date: 04 March 2024
  */
  validatePositiveNum(event: any) {
    const value = event.target.value;
    const isValid = this.validateInput(value);
    if (!isValid) {
      event.target.value = this.getValidInput(value); // Resetting the input value to positive number
    }
  }
  validateInput(value: string): boolean {
    return value === '' || !value.startsWith('-');
  }

  getValidInput(value: string): string {
    if (value.startsWith('-')) {
      return value.substring(1);
    }
    return '';
  }
  //End of validating only positive numbers are taken 


  isNumberKeyMob(val: any) {
    return val.replace(/[^0-9]/g, '');
  }


  isAlphaNumeric(event:any){
    var numPattern = new RegExp(/^[0-9a-zA-Z @.-/-]*$/);
    var txtVal = event.target.value;
    let space = txtVal.charAt(0);
    var charCode2 = (event.which) ? event.which : event.keyCode
    if (event.target.selectionStart === 0 && charCode2 === 32){
      event.preventDefault();
    }
    if (txtVal != '')
    {
        if (numPattern.test(txtVal) == true)
            return true;
        else
            return false;
    }
    else
        return true;
  }

  
  isAlphaNumericMob(val:any){
    var numPattern = new RegExp(/^[a-zA-Z0-9-.@ /]*$/);
    if (numPattern.test(val))
      return true;
    return false;
  }

  isDecimal(event:any){
    let charCode = (event.which) ? event.which : event.keyCode;
    var txtVal = event.target.value;
    if ((charCode > 47 && charCode < 58) || charCode == 46 || charCode == 8)
    {
        if (txtVal.indexOf(".") > 0 && charCode == 46)
            return false;
        else
            return true;
    }
    return false;
  }

  isDecimalMob(val: any) {
    return val.replace(/[^\d+(\.\d{1,2}]/g, '');
  }
  
  
  dynCtrlVal(ctrlValParam:any,elemObj:any)
  {
    let dynData       = ctrlValParam['dynDataObj'];
    let elmVal        = ctrlValParam['ctrlVal'];
    let drftSts       = ctrlValParam['drftSts'];
    let dispNnSts     = ctrlValParam['dispNnSts'];
    let sectnCtrlType = ctrlValParam['ctrlType'];
    let ctrlNm      = '';
    let lblName     = '';
    let ctrlType    = 0;
    let mndSts      = 0;
    let fldLngth    = 0;
    if(sectnCtrlType==8)
    {
      ctrlNm      = '';
      lblName     = dynData['columnName'];
      ctrlType    = dynData['columnType'];
      mndSts      = (dispNnSts===false)?dynData['columnMnd']:0;
      fldLngth    = dynData['fieldLen'];
    }
    else{
      ctrlNm      = dynData['jsnControlArray'][0]['ctrlName'];
      lblName     = dynData['vchLabelName'];
      ctrlType    = dynData['tinControlType'];
      mndSts      = (dispNnSts===false)?dynData['tinMandatorySts']:0;
      fldLngth    = dynData['intFieldLength'];
    }
    
    let valSts = true;
    
    // for select tag
    if (mndSts==1 && ctrlType==2) {
      if(drftSts==false)
      {
        if(!this.selectDropdown(elmVal,lblName))
        {
          valSts = false;
        }
      }      
    } 
    // for radio button
    else if (mndSts==1 && (ctrlType==5 || ctrlType==1)) {
      if(drftSts==false)
      {
        if(!this.blankCheckRdoDynamic(ctrlNm,lblName))
        {
          valSts = false;
        } 
      }
    }     
    // for text box
    else if (mndSts==1 && ctrlType==6) {;
      if(drftSts==false)
      {
        if(!this.blankCheck(elmVal,lblName))
        {
          valSts = false;
          //dynData.focus();
        }
      }
      if(!this.maxLength(elmVal,fldLngth,lblName))
      {
        valSts = false;
        //dynData.focus();
      }
    }
    // for text area
    else if (mndSts==1 && ctrlType==7) {
      if(drftSts==false)
      {
        if(!this.blankCheck(elmVal,lblName))
        {
          valSts = false;
          //dynData.focus();
        }
      }
      if(!this.maxLength(elmVal,fldLngth,lblName))
      {
        valSts = false;
        //dynData.focus();
      }
    }  
    
    // for date box
    else if (mndSts==1 && ctrlType==9) {
      if(drftSts==false)
      {
        if(!this.blankCheck(elmVal,lblName))
        {
          valSts = false;
        }
      }
    }

    // for time box
    else if (mndSts==1 && ctrlType==10) {
      if(drftSts==false)
      {
        if(!this.blankCheck(elmVal,lblName))
        {
          valSts = false;
        }
      }
    }

    // for date time box
    else if (mndSts==1 && ctrlType==11) {
      if(drftSts==false)
      {
        if(!this.blankCheck(elmVal,lblName))
        {
          valSts = false;
        }
      }
    }

    else{
      valSts = true;
    }
    return valSts;
  }

  isDashSlashNumeric(event:any){
    let charCode = (event.which) ? event.which : event.keyCode
    // console.log(charCode);
    if (charCode > 31 && (charCode < 45 || charCode > 57 || charCode==46))
        return false;
    return true;
  }
  isDashSlashNumericMob(val: any) {
    return val.replace(/[^0-9/-]/g, '');
  }
  is_url(str:any)
  {
    let regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
          if (regexp.test(str))
          {
            return true;
          }
          else
          {
            Swal.fire({
              icon: 'error',
              text: 'Enter valid URL'
            });
            return false;
          }
  }
  chkPassword(str:any)
  {
    let regexp =  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
          if (regexp.test(str))
          {
            return true;
          }
          else
          {
           
            return false;
          }
  }
  chkblankspace(str:any)
  {
    var regexp = /^\S*$/
          if (regexp.test(str))
          {
            return true;
          }
          else
          {
            Swal.fire({
              icon: 'error',
              text: 'Space not allowed'
            });
            return false;
          }
  }
  validateFile(fileUploadType: string ,actualFileType:any) {
    var ext = fileUploadType.substring(fileUploadType.lastIndexOf('/') + 1);
    const fileTypes :any= 
    {"pdf"  :['pdf'],
    "image" :['jpeg', 'jpe','jif','jfif', 'png', 'gif'],
    "excel" :['csv', 'dbf', 'dif', 'htm','html','mht', 'mhtml', 'ods','pdf', 'prn', 'slk', 'txt', 'xla', 'xlam', 'xls', 'xlsb', 'xlsm', 'xlsx','xlt', 'xltm', 'xls', 'xlsb', 'xlsm', 'xlsx','xlt','xlw', 'xps','vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    "doc"   :['doc', 'docm', 'docx', 'dot','dotm', 'dotx','htm', 'html', 'mht', 'mhtml', 'odt', 'pdf', 'rtf', 'txt', 'wps', 'xml','xps']
  };
    if (fileTypes[actualFileType].includes(ext)) {
        return true;
    }
    else {
        return false;
    }
}
    validateFileSize(uploadedFileSize:any,actualFileSize:any,actualFileSizeType:any)
    {
      if (actualFileSizeType.toLowerCase() == 'kb')
      {
        actualFileSize = 1024*actualFileSize;
      }
      else
      {
        actualFileSize = 1024*1024*actualFileSize;
      }

      let fileValidStatus = true;
        if(uploadedFileSize > actualFileSize)
          {
            fileValidStatus = false;
          }
      return fileValidStatus;
    }
    // added by Gopinath Jena 
    validGstNo(elmVal:any)
    {
        //let pattern = new RegExp(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9]{1}[0-9A-Z]{2}$/);
        let pattern = new RegExp(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/);
        if (elmVal != '')
        {
            if (pattern.test(elmVal) == true)
              return true;
            else
            {
              Swal.fire({
                icon: 'error',
                text: 'Please enter a valid GSTIN'
              });
              return false;
            }
        }
        return true;
    }


     // added by Sibananda sahu 
     validIfscCode(elmVal:any)
     {
         let pattern = new RegExp(/^[A-Z]{4}0[A-Z0-9]{6}$/);
         if (elmVal != '')
         {
             if (pattern.test(elmVal) == true)
               return true;
             else
             {
               Swal.fire({
                 icon: 'error',
                 text: 'Please enter a valid IFSC code'
               });
               return false;
             }
         }
         return true;
     }

    // added by Sibananda sahu || for validating only numeric and char combination
    validVarChar(elmVal:any)
    {
      let pattern = new RegExp(/^(?=.*[a-zA-Z])[a-zA-Z0-9 ]+$/);
        if (elmVal != '')
        {
            if (pattern.test(elmVal) == true)
              return true;
            else
            {
              Swal.fire({
                icon: 'error',
                text: 'Please enter names with alphabet and numeric combinations only'
              });
              return false;
            }
        }
        return true;
    }
    // added by Gopinath Jena 
    getMaxDate() {
    const dtToday = new Date();
        let month:any = '';
        let day:any = '';
        let year:any = '';
        month = dtToday.getMonth() + 1;
        day = dtToday.getDate();
        year = dtToday.getFullYear();
        if(month < 10)
            month = '0' + month.toString();
        if(day < 10)
            day = '0' + day.toString();
        const maxDate = year + '-' + month + '-' + day;
        return maxDate;
    }  
    
    validPanNo(elmVal:any)
    {
        let pattern = new RegExp(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/);
        if (elmVal != '')
        {
            if (pattern.test(elmVal) == true)
              return true;
            else
            {
              Swal.fire({
                icon: 'error',
                text: 'Please enter a valid PAN No'
              });
              return false;
            }
        }
        return true;
    }
    // Added by Rohit for column wise add more on 31-10-23
    blockspecialchar_first(evt:any,blockStatus:boolean)
    {
      let validStatus = true;
     

      let txtValue:string = evt.target.value;
      // console.log(txtValue);
      // if(txtValue.length == 0)
      //   {
      //     Swal.fire({
      //       icon: 'error',
      //       text: ('White Space not allowed in 1st Place')+"!!!"
      //     });
      //     (<HTMLInputElement>document.getElementById(evt.target.id)).value='';
      //     return false;
      //   }
      switch (txtValue.charCodeAt(0)) {
        case 44:
        {
          Swal.fire({
            icon: 'error',
            text: ', '+('Not allowed in 1st Place')+'!!!'
          });
           // viewAlert(", Not allowed in 1st Place!!!");

            validStatus =  false;
            break;
        }

        case 47:
        {
          Swal.fire({
            icon: 'error',
            text: '/ '+('Not allowed in 1st Place')+'!!!'
          });
            validStatus =  false;
            break;
        }

        case 58:
        {
          Swal.fire({
            icon: 'error',
            text: ': '+('Not allowed in 1st Place')+'!!!'
          });
            validStatus =  false;
            break;
        }

        case 46:
        {
          Swal.fire({
            icon: 'error',
            text: '. '+('Not allowed in 1st Place')+'!!!'
          });
          validStatus =  false;
          break;
        }

        case 39:
        {
          Swal.fire({
            icon: 'error',
            text: ('Single Quote not allowed in 1st Place')+'!!!'
          });
          validStatus =  false;
          break;
        }

        case 32:
        {
            Swal.fire({
              icon: 'error',
              text: ('White Space not allowed in 1st Place')+'!!!'
            });
            validStatus =  false;
            break;
           // return false;
        }

        case 40:
        {
          Swal.fire({
            icon: 'error',
            text: ('Not allowed in 1st Place')+'!!!'
          });
          validStatus =  false;
         break;
        }

        case 41:
        {
          Swal.fire({
            icon: 'error',
            text: ') '+('Not allowed in 1st Place')+'!!!'
          });

          validStatus =  false;
          break;
        }

        case 45:
        {
            Swal.fire({
              icon: 'error',
              text: '- '+('Not allowed in 1st Place')+'!!!'
            });
            validStatus =  false;
              break;
        }

        case 95:
        {
          Swal.fire({
            icon: 'error',
            text: '"_ '+('Not allowed in 1st Place')+'!!!'
          });
          validStatus =  false;
          break;
        }

        case 59:
        {
          Swal.fire({
            icon: 'error',
            text: '"; '+('Not allowed in 1st Place')+'!!!'
          });
          validStatus =  false;
          break;
        }

        case 124:
        {

          Swal.fire({
            icon: 'error',
            text: '"| '+('Not allowed in 1st Place')+'!!!'
          });
          validStatus =  false;
          break;
        }

        case 63:
        {
          Swal.fire({
            icon: 'error',
            text: '"? '+('Not allowed in 1st Place')+'!!!'
          });
          validStatus =  false;
          break;
        }


        case 34:
        {
          Swal.fire({
            icon: 'error',
            text: '" '+('Not allowed in 1st Place')+'!!!'
          });
          validStatus =  false;
          break;
        }

        case 35:
        {
          Swal.fire({
            icon: 'error',
            text: '# '+('Not allowed in 1st Place')+'!!!'
          });
          validStatus =  false;
          break;

        }

        case 36:
        {
          Swal.fire({
            icon: 'error',
            text: '$ '+('Not allowed in 1st Place')+'!!!'
          });
          validStatus =  false;
          break;
        }

        case 38:
        {
          Swal.fire({
            icon: 'error',
            text: '& '+('Not allowed in 1st Place')+'!!!'
          });
          validStatus =  false;
          break;
        }

        case 126:
        {
          Swal.fire({
            icon: 'error',
            text: '~ '+('Not allowed in 1st Place')+'!!!'
          });
          validStatus =  false;
          break;
        }

        case 96:
        {
          Swal.fire({
            icon: 'error',
            text: '` '+('Not allowed in 1st Place')+'!!!'
          });
          validStatus =  false;
          break;
        }

        case 33:
        {
          Swal.fire({
            icon: 'error',
            text: '! '+('Not allowed in 1st Place')+'!!!'
          });
          validStatus =  false;
          break;
        }

        case 37:
        {
          Swal.fire({
            icon: 'error',
            text: '% '+('Not allowed in 1st Place')+'!!!'
          });
          validStatus =  false;
          break;
        }

        case 94:
        {
          Swal.fire({
            icon: 'error',
            text: '^ '+('Not allowed in 1st Place')+'!!!'
          });
          validStatus =  false;
          break;
        }

        case 42:
        {
          Swal.fire({
            icon: 'error',
            text: '* '+('Not allowed in 1st Place')+'!!!'
          });
          validStatus =  false;
          break;
        }
        case 92:
        {
          Swal.fire({
            icon: 'error',
            text: '\\ '+('Not allowed in 1st Place')+'!!!'
          });
          validStatus =  false;
          break;
        }

        case 43:
        {
          Swal.fire({
            icon: 'error',
            text: '+ '+('Not allowed in 1st Place')+'!!!'
          });
          validStatus =  false;
          break;
        }
        case 61:
        {
          Swal.fire({
            icon: 'error',
            text: '= '+('Not allowed in 1st Place')+'!!!'
          });
          validStatus =  false;
          break;
        }
        case 123:
        {
          Swal.fire({
            icon: 'error',
            text: '{ '+('Not allowed in 1st Place')+'!!!'
          });
          validStatus =  false;
          break;
        }

        case 125:
        {
          Swal.fire({
            icon: 'error',
            text: '} '+('Not allowed in 1st Place')+'!!!'
          });
          validStatus =  false;
          break;
        }

        case 91:
        {
          Swal.fire({
            icon: 'error',
            text: '[ '+('Not allowed in 1st Place')+'!!!'
          });
          validStatus =  false;
          break;
        }

        case 93:
        {
          Swal.fire({
            icon: 'error',
            text: '] '+('Not allowed in 1st Place')+'!!!'
          });
          validStatus =  false;
          break;
        }

        case 60:
        {
          Swal.fire({
            icon: 'error',
            text: '< '+('Not allowed in 1st Place')+'!!!'
          });
          validStatus =  false;
          break;
        }

        case 62:
        {
          Swal.fire({
            icon: 'error',
            text: '> '+('Not allowed in 1st Place')+'!!!'
          });
          validStatus =  false;
          break;
        }
        case 64:
        {
          Swal.fire({
            icon: 'error',
            text: '@ '+('Not allowed in 1st Place')+'!!!'
          });
          validStatus =  false;
          break;
        }
        default :
        validStatus =  true;
        break;
    }
    if(validStatus == false)
      {
        // (<HTMLInputElement>document.getElementById(evt.target.id)).value='';
        evt.target.value='';
      }
      return validStatus;
    }
    // End of column wise add more on 31-10-23
}
