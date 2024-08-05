import { Component, OnInit } from '@angular/core';
import { EncryptDecryptService } from 'src/app/encrypt-decrypt.service';
import { WebcommonservicesService } from 'src/app/webcommonservices.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IrmsDetailsService } from '../service-api/irms-details-service';

import Swal from 'sweetalert2';
@Component({
	selector: 'app-preview-form',
	templateUrl: './preview-form.component.html',
	styleUrls: ['./preview-form.component.scss']
})
export class PreviewFormComponent implements OnInit {
	processId: any = 0;
	onlineServiceId: any = 0;
	dynamicpreviewDetails: any;
	formName: any;
	dynamicCtrlPreviewKeys: any;
	sectionwise = true;
	gridtype: any;
	btnShow: any = 0;
	intProfileId: any = 0;
	intProductId: number = 0;
	addMoreTabularData: any[] = [];
	loading:boolean = false;
	applicantInfo: any;
	intOrganisationTypeId: number = 0;
	constructor(private router: ActivatedRoute,
		private WebCommonService: WebcommonservicesService,
		public encDec: EncryptDecryptService,
		private route: Router,
		private IrmsDetailsService: IrmsDetailsService
	) { }

	ngOnInit(): void {
		this.applicantInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
		this.intOrganisationTypeId = (this.applicantInfo.USER_ORG_TYPE) ? this.applicantInfo.USER_ORG_TYPE : 0;
		let encSchemeId = this.router.snapshot.paramMap.get('id');
		let schemeArr: any = [];
		if (encSchemeId != "") {
			let schemeStr = this.encDec.decText(encSchemeId);
			schemeArr = schemeStr.split(':');
		}
		this.processId = schemeArr[0];
		this.onlineServiceId = schemeArr[1];
		this.btnShow = (schemeArr[2] == "viewincentive")?true:false;
		this.intProductId = schemeArr[3];
		let ctrlParms = {
			'intProcessId': this.processId,
			'intOnlineServiceId': this.onlineServiceId,
			'intProfileId': this.intProfileId
		}

		this.previewDynamicForm(ctrlParms);

	}
	
	previewDynamicForm(params: any) {
		this.loading=true;
		this.WebCommonService.previewDynamicForm(params).subscribe(res => {
			if (res.status == 200) {
				var serviceResult: any = res.result
				this.gridtype = serviceResult.tinGridType;
				this.dynamicpreviewDetails = serviceResult.arrSecFormDetails;
				this.formName = serviceResult.formName;
				this.dynamicCtrlPreviewKeys = Object.keys(serviceResult.arrSecFormDetails).sort();
				if (this.dynamicCtrlPreviewKeys[0] == 'sec_0') {
					this.sectionwise = false;
				}
			}
			this.loading=false;
		});
	}

	applyForProcess() {
		let params: any =
		{
			'intProcessId': this.processId,
			'intOnlineServiceId': this.onlineServiceId,
			'intProfileId': this.intProfileId
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
	isDate(value: any): boolean {
		return value instanceof Date && !isNaN(value.getTime());
	}
	shortTabularWiseData(addMoreTabularDetails: any, keys: any) {
		if (this.addMoreTabularData[keys] == undefined) {
			this.addMoreTabularData[keys] = Object.keys(addMoreTabularDetails).sort();
		}
	}

	editIncentive() {
		let formParms = this.processId + ':' + this.onlineServiceId + ':0:' + this.intProductId + ':' + 1;
		let encSchemeStr = this.encDec.encText(formParms.toString());
		if(this.intOrganisationTypeId == 1){
			this.route.navigate(['/citizen-portal/apply-form', encSchemeStr]);
		  }else if(this.intOrganisationTypeId == 2){
			this.route.navigate(['/citizen-portal/apply-bpo-form', encSchemeStr]);
		  }else if(this.intOrganisationTypeId == 3){
			this.route.navigate(['/citizen-portal/apply-datacenter-form', encSchemeStr]);
		  }else if(this.intOrganisationTypeId == 4){
			this.route.navigate(['/citizen-portal/apply-electronics-form', encSchemeStr]);
		  }
	}

	applyIncentive() {
		let sessionInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
		Swal.fire({
			title: 'Are you sure you want to submit?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes'
	    }).then((result) => {
			if (result.isConfirmed) {
			const objData = { "intProcessId": this.processId, "intProfileId": sessionInfo.USER_ID, "intOnlineServiceId": this.onlineServiceId }
			this.loading = true;
			this.IrmsDetailsService.createApprovalProcess(objData).subscribe((resData: any) => {
				if(resData.status == 1){
					let formParms = this.processId + ':' + this.onlineServiceId + ':' + 1;
					let encSchemeStr = this.encDec.encText(formParms.toString());
					this.loading = false;
					Swal.fire({
						title: 'You have Successfully Applied Incentives ',
						html: `Your Incentive Number is <strong>${resData.result.incregdNo}</strong>`,
						icon: 'success',
						showCancelButton: false,
					}).then((result) => {
						if (result.isConfirmed) {

						this.route.navigate(['/citizen-portal/dashboard']);
						}
					})
				}else{
					Swal.fire({
						icon: 'error',
						text: 'Some error happened! Please try again.'
					});
				}
			//this.route.navigate(['/citizen-portal/trackstatus']);
			});
		}
	})
	}

	backIncentive() {
		this.route.navigate(['/citizen-portal/dashboard']);
	}
}
