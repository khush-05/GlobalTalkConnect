export class WebRTCService {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;

  constructor() {
    this.initialize();
  }

  private initialize() {
    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    });
  }

  async getUserMedia(constraints: MediaStreamConstraints = { video: true, audio: true }) {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      return this.localStream;
    } catch (error) {
      console.error("Error accessing media devices:", error);
      throw error;
    }
  }

  addLocalStream(stream: MediaStream) {
    if (!this.peerConnection) return;
    
    stream.getTracks().forEach(track => {
      this.peerConnection!.addTrack(track, stream);
    });
  }

  async createOffer() {
    if (!this.peerConnection) return null;
    
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    return offer;
  }

  async createAnswer(offer: RTCSessionDescriptionInit) {
    if (!this.peerConnection) return null;
    
    await this.peerConnection.setRemoteDescription(offer);
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
    return answer;
  }

  async setRemoteAnswer(answer: RTCSessionDescriptionInit) {
    if (!this.peerConnection) return;
    
    await this.peerConnection.setRemoteDescription(answer);
  }

  async addIceCandidate(candidate: RTCIceCandidateInit) {
    if (!this.peerConnection) return;
    
    await this.peerConnection.addIceCandidate(candidate);
  }

  onRemoteStream(callback: (stream: MediaStream) => void) {
    if (!this.peerConnection) return;
    
    this.peerConnection.ontrack = (event) => {
      const [remoteStream] = event.streams;
      this.remoteStream = remoteStream;
      callback(remoteStream);
    };
  }

  onIceCandidate(callback: (candidate: RTCIceCandidate) => void) {
    if (!this.peerConnection) return;
    
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        callback(event.candidate);
      }
    };
  }

  toggleAudio() {
    if (!this.localStream) return false;
    
    const audioTrack = this.localStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      return audioTrack.enabled;
    }
    return false;
  }

  toggleVideo() {
    if (!this.localStream) return false;
    
    const videoTrack = this.localStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      return videoTrack.enabled;
    }
    return false;
  }

  close() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }
    if (this.peerConnection) {
      this.peerConnection.close();
    }
  }
}
