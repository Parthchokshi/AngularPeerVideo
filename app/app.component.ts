import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: 'app/app.component.html'
})

export class AppComponent implements OnInit, OnDestroy{

  peer:any;
  another_id:number;
  peer_id:number;
  @ViewChild('myvideo') video:any;

  constructor(){}

  ngOnInit(){
    this.peer = new Peer({key: 'wy2m54u3doenrk9'});
    setTimeout(()=>{this.peer_id = this.peer.id}, 3000);

    this.peer.on('connection', function(conn:any) {
      conn.on('data', function(data:any){
        // Will print 'hi!'
        console.log(data);
      });
    });

    var n = <any> navigator;
    n.getUserMedia = n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia;

    let video = this.video.nativeElement;

    this.peer.on('call', function(call) {
      n.getUserMedia({video: true, audio: true}, function(stream) {
        call.answer(stream); // Answer the call with an A/V stream.
        call.on('stream', function(remoteStream) {
          video.src = URL.createObjectURL(remoteStream);
          video.play();
        });
      }, function(err) {
        console.log('Failed to get local stream' ,err);
      });
    });
  }

  connect(){
    let conn:any = this.peer.connect(this.another_id);
    conn.on('open', function(){
      conn.send('hi!');
    });
  }

  connectVideo() {
    let video = this.video.nativeElement;
    let fname = this.another_id;
    let localpeer = this.peer;

    var n = <any> navigator;
    n.getUserMedia = ( n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia);
    n.getUserMedia({video: true, audio: true}, function(stream) {
      var call = localpeer.call(fname, stream);
      call.on('stream', function(remoteStream) {
        video.src = URL.createObjectURL(remoteStream);
        video.play();
      });
    }, function(err) {
      console.log('Failed to get local stream' ,err);
    });
  }

  ngOnDestroy(){

  }

}
