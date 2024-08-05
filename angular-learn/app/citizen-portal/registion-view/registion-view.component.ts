import { Component, OnInit } from '@angular/core';
import { WebcommonservicesService } from 'src/app/webcommonservices.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptDecryptService } from 'src/app/encrypt-decrypt.service';
import { CitizenAuthService } from '../service-api/citizen-auth.service';
import Swal from 'sweetalert2';
import { IrmsDetailsService } from '../service-api/irms-details-service';
@Component({
	selector: 'app-registion-view',
	templateUrl: './registion-view.component.html',
	styleUrls: ['./registion-view.component.css', './registion-view.component.scss']
})
export class RegistionViewComponent implements OnInit {

	processId: any = 0;
	onlineServiceId: any = 0;
	dynamicpreviewDetails: any;
	formName: any;
	dynamicCtrlPreviewKeys: any;
	sectionwise = true;
	gridtype: any;
	btnShow: any = 0;
	loading = false;
	approvalStatus:number = 0;
	approvalCount:number = 0;
	addMoreTabularData: any[] = [];
	isCheckboxChecked = false;
	constructor(public authService: CitizenAuthService,
		private router: ActivatedRoute,
		private WebCommonService: WebcommonservicesService,
		public encDec: EncryptDecryptService,
		private route: Router,
		private IrmsDetailsService: IrmsDetailsService,


	) { }

	ngOnInit(): void {
		let encSchemeId = this.router.snapshot.paramMap.get('id');
		let schemeArr: any = [];
		if (encSchemeId != "" && encSchemeId != null) {
			let schemeStr = this.encDec.decText(encSchemeId);
			schemeArr = schemeStr.split(':');
		}
		this.processId = schemeArr[0];
		this.onlineServiceId = schemeArr[1];
		this.btnShow = schemeArr[2];

		const sessionInfo = JSON.parse(sessionStorage.getItem("FFS_SESSION"));
		let regParam = {
			"userid": sessionInfo.USER_ID,
			"onlineServiceId": this.onlineServiceId
		};
		this.processId = 21;
		this.loading = true;
		this.authService.getServiceId(regParam).subscribe(res => {
			if (res.status == 1) {
				this.loading = false;
				this.onlineServiceId = res.serviceid;
				this.approvalStatus  = res.approvalStatus;
				this.approvalCount   = res.approvalCount;
				let ctrlParms = {
					'intProcessId': this.processId,
					'intOnlineServiceId': this.onlineServiceId
				}
				this.previewDynamicForm(ctrlParms);
			}
			else {
				this.loading = false;
			}
		});
	}

	previewDynamicForm(params: any) {
		this.WebCommonService.previewDynamicForm(params).subscribe(res => {

			if (res.status == 200) {
				var serviceResult: any = res.result
				this.gridtype = serviceResult.tinGridType;
				this.dynamicpreviewDetails = serviceResult.arrSecFormDetails;
				this.formName = serviceResult.formName;
				const sessionInfo = JSON.parse(sessionStorage.getItem("FFS_SESSION"));
				let orgType = sessionInfo.USER_ORG_TYPE;
				setTimeout(() => {
				if (orgType !== 2){
					let ismApprovedCls = document.getElementsByClassName('cls_total_approved');
					if (ismApprovedCls[0]) {
						$(ismApprovedCls[0]).closest(".dynGridCls").hide();
					}
				  } 
				  if (orgType !== 5){
					let ismApprovedCls = document.getElementsByClassName('cls_imsapproved');
					if (ismApprovedCls[0]) {
						$(ismApprovedCls[0]).closest(".dynGridCls").hide();
					}
				  } }, 2000);
				this.dynamicCtrlPreviewKeys = Object.keys(serviceResult.arrSecFormDetails).sort();
				   if (orgType !== 1) {
						var index = this.dynamicCtrlPreviewKeys.indexOf('sec_6_426');
						this.dynamicCtrlPreviewKeys.splice(index, 1);
					}
				if (this.dynamicCtrlPreviewKeys[0] == 'sec_0') {
					this.sectionwise = false;
				}
			}
		});
	}

	applyForProcess() {
		let params: any =
		{
			'intProcessId': this.processId,
			'intOnlineServiceId': this.onlineServiceId,
		}
		this.WebCommonService.applyForProcess(params).subscribe(res => {

			if (res.status == 200) {
				Swal.fire({
					icon: 'success',
					text: 'Success',
					confirmButtonColor: '#3085d6',
					confirmButtonText: 'Ok'
				}).then((result) => {
					this.route.navigate(['/website/servicelisting']);
				});
			}
		});
	}

	gotToPrev() {

		let formParms = this.processId + ':' + this.onlineServiceId + ':' + 0;
		let encSchemeStr = this.encDec.encText(formParms.toString());
		this.route.navigate(['/website/formapply', encSchemeStr]);
	}

	shortTabularWiseData(addMoreTabularDetails: any, keys: any) {
		if (this.addMoreTabularData[keys] == undefined) {
			this.addMoreTabularData[keys] = Object.keys(addMoreTabularDetails).sort();
		}
	}

	editApplication() {
		let formParms = this.processId + ':' + this.onlineServiceId + ':' + 0;
		let encSchemeStr = this.encDec.encText(formParms.toString());
		this.route.navigate(['/citizen-portal/registration', encSchemeStr]);
	}

	finalSubmit() {
		if (!this.isCheckboxChecked) {
			Swal.fire({
				text: 'Please select the declaration'
			})
			return false;
		}
		const sessionInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
		Swal.fire({
			title: 'Are you sure submit?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes'
		}).then((result) => {
			if (result.isConfirmed) {
				this.loading = true;
				const objData = { "intProcessId": this.processId, "intProfileId": sessionInfo.USER_ID, "intOnlineServiceId": this.onlineServiceId }
				this.IrmsDetailsService.createApprovalProcess(objData).subscribe((resData: any) => {
					this.loading = false;
					Swal.fire({
						title: 'You have Successfully Registered ',
						html: `Your Registration Number is <strong>${resData.result.regdNo}</strong>`,
						icon: 'success',
						showCancelButton: false,
					}).then((result) => {
						if (result.isConfirmed) {
							this.route.navigate(['/citizen-portal/dashboard']);
						}
					})
				});
			}
		})


	}

	goToBack() {
		this.route.navigate(['/citizen-portal/dashboard']);
	}

	onChange(isChecked: boolean) {
		this.isCheckboxChecked = isChecked;
	}

	
	isValid(d:any) {
		let date = Date.parse(d)	
		console.log(d)	
		console.log(date)	
		// if ( Object.prototype.toString.call(date) === "[object Date]") {
		// if ( !isNaN(date.getTime()) ) {
		// 	return true;
		// } else {
		// 	return false;
		// }
		// } else {
		// 	return false;
		// }
	}
}
