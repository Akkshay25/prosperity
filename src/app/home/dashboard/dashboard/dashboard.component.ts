import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtService } from '../../../core';
import { Client } from '../../../core/models/client.model';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  countInRed: any;
  countInAmber: any;
  countInGreen: any;
  clientRed: any[];
  clientAmber: any[];
  clientGreen: any[];
  Clients: Client[];
  remarkList: any[];
  remarkForm: FormGroup;
  cid: any;
  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private jwtService: JwtService,
    private router: Router
  ) {

    this.remarkForm = this.fb.group({
      'remark': ['', Validators.required],
      'remarkDate':[''],
      'cid':[''],
      'id':['']
    });
  }

  ngOnInit() {
    const d = Date.now() - 15 * 24 * 60 * 60 * 1000;
    console.log(new Date(d));

    this.userService.getClient().subscribe(
      (data:Client[])=>{
        this.clientRed = data.filter( c => new Date(c.followUpDate) < new Date(d));
        this.Clients = this.clientRed;
        console.log(this.clientRed);
        this.clientAmber = data.filter( c => new Date(c.followUpDate) >= new Date(d) && new Date(c.followUpDate) < new Date());
        console.log(this.clientAmber);
        this.clientGreen = data.filter( c => new Date(c.followUpDate) >= new Date());
        console.log(this.clientGreen);
        this.countInRed = this.clientRed.length;
        this.countInAmber = this.clientAmber.length;
        this.countInGreen = this.clientGreen.length;
      },
      err => {
        this.router.navigate(['/login']);
      }
      );
  }

  onSave(event: MouseEvent, catagory: any) {
    const evtMsg = event ? ' Event target is ' + (event.target as HTMLElement).textContent : '';
    // alert('Saved.' + evtMsg);
    //if (event) { event.stopPropagation(); }
    switch (catagory) {
      case 'red':
        this.Clients = this.clientRed;
        this.remarkList = null;
        break;
      case 'amber':
        this.Clients = this.clientAmber;
        this.remarkList = null;
        break;
      case 'green':
        this.Clients = this.clientGreen;
        this.remarkList = null;
        break;
    }

  }

  onSelect(client: any): void {
    this.remarkList = client.remarks;
    this.cid = client.cid;
  }

  submitForm() {
    this.remarkForm.controls['cid'].setValue(this.cid);
    this.remarkForm.controls['id'].setValue(this.jwtService.getId());
    this.remarkForm.controls['remarkDate'].setValue(formatDate(new Date(), 'yyyy-MM-dd', 'en'));
    const remark = this.remarkForm.value;
    this.userService
    .postRemark(remark)
    .subscribe(
      data => {
       this.Clients.find(c => c.cid === this.cid).remarks.push(data);
       var updatedClient = this.Clients.find(c => c.cid === this.cid);
       const fd = Date.now() + 90 * 24 * 60 * 60 * 1000;
       updatedClient.followUpDate = new Date(fd);
       this.userService.putClient(updatedClient).subscribe(c =>{
        this.remarkList = null;
        this.ngOnInit();
        console.log(this.Clients);
       });
      });
      this.remarkForm.controls['remark'].reset();
  }

  addRemark(cRemark: String) {
    this.remarkForm.controls['cid'].setValue(this.cid);
    this.remarkForm.controls['id'].setValue(this.jwtService.getId());
    this.remarkForm.controls['remarkDate'].setValue(formatDate(new Date(), 'yyyy-MM-dd', 'en'));
    this.remarkForm.controls['remark'].setValue(cRemark);
    const remark = this.remarkForm.value;
    this.userService
    .postRemark(remark)
    .subscribe(
      data => {
       this.Clients.find(c => c.cid === this.cid).remarks.push(data);
       var updatedClient = this.Clients.find(c => c.cid === this.cid);
       const fd = Date.now() + 90 * 24 * 60 * 60 * 1000;
       updatedClient.followUpDate = new Date(fd);
       this.userService.putClient(updatedClient).subscribe(cl =>{
        this.remarkList = null;
        this.ngOnInit();
        console.log(this.Clients);
       });
      });
      this.remarkForm.controls['remark'].reset();
  }

}
