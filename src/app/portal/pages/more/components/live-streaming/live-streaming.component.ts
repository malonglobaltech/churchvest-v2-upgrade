import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-live-streaming',
  templateUrl: './live-streaming.component.html',
  styleUrls: ['./live-streaming.component.scss']
})
export class LiveStreamingComponent implements OnInit {
  activeStreamKey

  constructor() { }

  ngOnInit(): void {
  }

  copyToClipboard(evt) {}

  updateStreamKey() {}

}
