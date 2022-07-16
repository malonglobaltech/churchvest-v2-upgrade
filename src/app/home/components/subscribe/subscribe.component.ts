import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss']
})
export class SubscribeComponent implements OnInit {

  subscribeForm: FormGroup;

  constructor(
    private subscribeService: HomeService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.subscribeForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.subscribeForm.invalid) return;

    this.subscribeService
      .subscribeMail(this.subscribeForm.value)
      .subscribe(
        (res) => {
          const { message } = res;
          this.toastr.success(message, 'Message')
        },
        (error) => {
          this.toastr.error(error, 'Message')
        }
      );
  }

  getform() {
    return this.subscribeForm.controls
  }

}
