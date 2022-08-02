import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LiveStreamService } from 'src/app/portal/services/live-stream.service';

@Component({
  selector: 'app-live-streaming',
  templateUrl: './live-streaming.component.html',
  styleUrls: ['./live-streaming.component.scss']
})
export class LiveStreamingComponent implements OnInit {
  activeStreamKey
    myForm: FormGroup;
    loading = false;
    encoderVerticalIcon = false;

  constructor(
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private liveStreamService: LiveStreamService,
  ) { }

  ngOnInit(): void {
    this._initialForm();
  }

  copyToClipboard(el: HTMLSpanElement) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(el.innerText).then(() => {
        this.toastr.success('Server link copied to clipboard', 'success')
      },(error) => {
        console.log(error)
      })
    } else (
      this.toastr.error('rowser do not support Clipboard API', 'Error')
    )
  }

  updateStreamKey() {}
  getActiveStreamingKey() {}
  
    private _initialForm() {
        this.myForm = this.formBuilder.group({
            stream_key: ['']
        })
    }

    onUpdateKey() {
        this.loading = true;
        const streamKeyValue = {
            stream_key: this.myForm.controls['stream_key'].value
        };
        this.liveStreamService.createUpdateStreamKey(streamKeyValue).subscribe(res => {
            this.getActiveStreamingKey();
          this.toastr.success('Stream key updated successfully', 'success')
        },
        (error) => {
      this.toastr.error('Error occurred, please try again later', 'Error')
        })
    }

}
