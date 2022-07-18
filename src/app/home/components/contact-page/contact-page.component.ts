import { Component, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.scss']
})
export class ContactPageComponent implements OnInit {
  contactForm: FormGroup = new FormGroup({});
  
  isBusy: boolean = false;
  reasonOfContact: string[] = ["Enquiries", "Complaint", "Book a demo"]
  modeOfContact: string[] = ["email", "phone"];
  meansOfContact = "";

  constructor(
    private formBuilder: FormBuilder,
    private contactService: HomeService,
    private toastr: ToastrService
  ) {
    this.contactForm = this.formBuilder.group({
      church_address: ['', Validators.required],
      church_name: ['', Validators.required],
      message: ['', Validators.required],
      subject: ['', Validators.required],
      name: ['', Validators.required],
      position: ['', Validators.required],
      email: ['',],
      phone: [''],
    })
  }

  ngOnInit(): void {
  }

  onChangeMode(evt) {
      this.meansOfContact = evt.value
    if (this.meansOfContact == 'email') {
      this.contactForm.get('phone').clearValidators();
      this.contactForm.get('email').setValidators([Validators.required, Validators.email])
    } 
    if (this.meansOfContact == 'phone') {
      this.contactForm.get('email').clearValidators();
      this.contactForm.get('phone').setValidators([Validators.required])
    }
  }

  onSubmit() {

    if (this.meansOfContact == '') return
    
    if (this.contactForm.invalid) return;

    const payload = this.contactForm.value;
    if (this.meansOfContact == 'email') {
      delete payload.phone
    } 
    if (this.meansOfContact == 'phone') {
      delete  payload.email
    }
    this.isBusy = true;
    this.contactService.postContact(this.contactForm.value).subscribe(
      
        (res) => {
          // const { message } = res;
          this.isBusy = false
          this.toastr.success('Message sent successfully', 'Message');
          this.contactForm.reset();
        },
        (error) => {
          this.isBusy = false;
          this.toastr.error(error, 'Message')
        }
    )
  }

}
