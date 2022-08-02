import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-live-streaming',
  templateUrl: './live-streaming.component.html',
  styleUrls: ['./live-streaming.component.scss']
})
export class LiveStreamingComponent implements OnInit {
  activeStreamKey

  constructor(
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
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

}
