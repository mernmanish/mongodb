/**
 * Component Name: signupdetails.component
 * Description: Fetch All sign up details
 * Created By: Bindurekha Nayak
 * Created On: 17-04-2024
 * */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebsiteApiService } from '../website/website-api.service';
import { CitizenMasterService } from '../citizen-portal/service-api/citizen-master.service';
import { CitizenSchemeService } from '../citizen-portal/service-api/citizen-scheme.service';
@Component({
  selector: 'app-signupdetails',
  templateUrl: './signupdetails.component.html',
  styleUrls: ['./signupdetails.component.css']
})
export class SignupdetailsComponent implements OnInit {
  public loading = false;
  language: any;
  signUpResult: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  searchQuery: string = '';
  totalItems: number = 0;
  originalSignUpResult: any;
  itemsPerPageOptions: number[] = [10, 25, 50, 100]; // Add this line to store the available options
  

  constructor(
    private router: Router,
    private servicesList: WebsiteApiService,
    private objSchm: CitizenSchemeService,
    public masterService: CitizenMasterService,
  ) { }

  ngOnInit(): void {
    this.language = localStorage.getItem('locale');
    this.getSignupDetails();
    setInterval(function(){
      // window.location.reload();
      window.location.href= this.location.href;
      //window.location.href= 'http://192.168.65.151:4201/Signupdetails';
  }, 150000); 
  }

  getSignupDetails() {
    this.loading = true;
    this.servicesList.getSignupDetails('').subscribe(res => {
      if (res['status'] == 200) {
        this.originalSignUpResult = res.result; // Store the original data
        this.signUpResult = this.originalSignUpResult; // Assign the data to signUpResult
        this.totalItems = this.signUpResult.length;
        this.loading = false;
      } else {
        this.loading = false;
      }
    });
  }
  

  // Filter items based on search query
  filterItems(): void {
    this.currentPage = 1; // Reset current page when applying a new search query or clearing the search box
    if (!this.searchQuery) {
      // If search query is empty, display all items
      this.signUpResult = this.originalSignUpResult; // Reset to the original data
      this.totalItems = this.signUpResult.length;
    } else {
      // Filter items based on search query
      this.signUpResult = this.originalSignUpResult.filter(item =>
        item.orgTypeName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        item.orgName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        item.orgEmail.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        item.orgMob.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        item.regdOn.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
      this.totalItems = this.signUpResult.length;
    }
  }

  // Get the displayed items for the current page
  get displayedItems(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.signUpResult.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Get the last page number for pagination
  getLastPageNumber(): number {
    if (this.totalItems === 0) {
      return 0;
    }
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }
  getFirstEntryIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
}

getLastEntryIndex(): number {
  const lastEntryIndex = this.currentPage * this.itemsPerPage;
  return Math.min(lastEntryIndex, this.totalItems); 
}
onItemsPerPageChange(): void {
  this.currentPage = 1; 
}
}
